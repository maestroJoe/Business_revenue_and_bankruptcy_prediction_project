import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faFileArrowUp,
  faInfoCircle,
  faFileExcel,
  faTrash,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getRevenueForecast } from "../services/revenueApi";

/* ============================= */
/* REVENUE FORECAST PAGE */
/* ============================= */

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_PREVIEW_ROWS = 5;

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15";

const labelClass = "mb-2 block text-sm font-medium text-ink";

export default function RevenueForecast() {
  const [companyName, setCompanyName] = useState("");
  const [revenue, setRevenue] = useState("");
  const [growthRate, setGrowthRate] = useState("");
  const [forecastYears, setForecastYears] = useState("1");

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewHeaders, setPreviewHeaders] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forecastResult, setForecastResult] = useState(null);

  /* ============================= */
  /* READ AND VALIDATE FILE */
  /* ============================= */

  async function handleFileChange(event) {
    const file = event.target.files?.[0];

    setSelectedFile(null);
    setPreviewHeaders([]);
    setPreviewRows([]);
    setError("");
    setSuccess("");
    setForecastResult(null);

    if (!file) return;

    const extension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    if (![".csv", ".xlsx", ".xls"].includes(extension)) {
      setError("Unsupported file type. Select a CSV or Excel file.");
      event.target.value = "";
      return;
    }

    if (file.size === 0) {
      setError("The selected file is empty.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must not exceed 10 MB.");
      event.target.value = "";
      return;
    }

    setIsReadingFile(true);

    try {
      // Load the spreadsheet library only when a file is selected.
      const XLSX = await import("xlsx");

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });

      if (!workbook.SheetNames.length) {
        throw new Error("The file does not contain a worksheet.");
      }

      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = XLSX.utils.sheet_to_json(firstSheet, {
        header: 1,
        defval: "",
        blankrows: false,
      });

      if (rows.length < 2) {
        throw new Error(
          "The file must contain headers and at least one data row."
        );
      }

      const headers = rows[0].map((header) => String(header).trim());

      const normalizedHeaders = headers.map((header) =>
        header.toLowerCase().replace(/[^a-z0-9]/g, "")
      );

      if (
        headers.some((header) => !header) ||
        new Set(normalizedHeaders).size !== headers.length
      ) {
        throw new Error("Column headers must be non-empty and unique.");
      }

      const dataRows = rows
        .slice(1)
        .filter((row) =>
          row.some((cell) => String(cell).trim() !== "")
        )
        .map((row) => headers.map((_, index) => row[index] ?? ""));

      if (!dataRows.length) {
        throw new Error("No financial data rows were found.");
      }

      // Find columns using flexible header names.
      const findColumn = (...names) =>
        normalizedHeaders.findIndex((header) => names.includes(header));

      const companyIndex = findColumn(
        "companyname",
        "company",
        "companytitle"
      );

      const revenueIndex = findColumn(
        "revenue",
        "latestrevenue",
        "historicalrevenue"
      );

      const growthIndex = findColumn(
        "growthrate",
        "annualgrowthrate",
        "estimatedgrowthrate"
      );

      const forecastIndex = findColumn(
        "forecastyears",
        "forecasthorizon",
        "forecastperiod"
      );

      const yearIndex = findColumn("year", "financialyear");

      // Sort by year so the latest revenue is used when available.
      const sortedRows = [...dataRows];

      if (yearIndex !== -1) {
        sortedRows.sort(
          (a, b) => Number(b[yearIndex]) - Number(a[yearIndex])
        );
      }

      const latestRow = sortedRows[0];

      // Parse numeric values, including comma-separated numbers.
      const parseNumber = (value) => {
        if (typeof value === "number") return value;

        return Number(
          String(value)
            .replace(/,/g, "")
            .replace(/%/g, "")
            .trim()
        );
      };

      const companyValue =
        companyIndex === -1
          ? ""
          : String(latestRow[companyIndex]).trim();

      const revenueValue =
        revenueIndex === -1
          ? NaN
          : parseNumber(latestRow[revenueIndex]);

      const growthValue =
        growthIndex === -1
          ? NaN
          : parseNumber(latestRow[growthIndex]);

      const forecastValue =
        forecastIndex === -1
          ? 1
          : parseNumber(latestRow[forecastIndex]);

      // Keep the preview available even if auto-fill fails.
      setSelectedFile(file);
      setPreviewHeaders(headers);
      setPreviewRows(dataRows.slice(0, MAX_PREVIEW_ROWS));

      const missingFields = [];

      if (companyIndex === -1 || !companyValue) {
        missingFields.push("CompanyName");
      }

      if (
        revenueIndex === -1 ||
        !Number.isFinite(revenueValue) ||
        revenueValue <= 0
      ) {
        missingFields.push("Revenue");
      }

      if (
        growthIndex === -1 ||
        !Number.isFinite(growthValue) ||
        growthValue < -100 ||
        growthValue > 1000
      ) {
        missingFields.push("GrowthRate");
      }

      if (
        !Number.isFinite(forecastValue) ||
        ![1, 2, 3].includes(forecastValue)
      ) {
        missingFields.push("ForecastYears (1, 2, or 3)");
      }

      if (missingFields.length > 0) {
        setError(
          `File preview loaded, but some fields could not be filled. Check: ${missingFields.join(", ")}.`
        );
        return;
      }

      // Automatically fill the existing forecast form.
      setCompanyName(companyValue);
      setRevenue(String(revenueValue));
      setGrowthRate(String(growthValue));
      setForecastYears(String(forecastValue));

      setSuccess(
        `File imported successfully! ${companyValue}'s financial details have been filled in.`
      );
    } catch (fileError) {
      setError(
        fileError.message ||
          "Unable to read this file. Check that it is a valid CSV or Excel file."
      );
      event.target.value = "";
    } finally {
      setIsReadingFile(false);
    }
  }

  /* ============================= */
  /* REMOVE SELECTED FILE */
  /* ============================= */

  function handleRemoveFile() {
    setSelectedFile(null);
    setPreviewHeaders([]);
    setPreviewRows([]);
    setError("");
    setSuccess("");
    setForecastResult(null);

    const fileInput = document.getElementById("financialFile");
    if (fileInput) fileInput.value = "";
  }

  /* ============================= */
  /* VALIDATE AND REQUEST FORECAST */
  /* ============================= */

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setForecastResult(null);

    if (!companyName.trim()) {
      setError("Please enter a company name.");
      return;
    }

    const revenueValue = Number(revenue);
    const growthValue = Number(growthRate);

    if (
      revenue.trim() === "" ||
      !Number.isFinite(revenueValue) ||
      revenueValue <= 0
    ) {
      setError("Enter a valid positive historical revenue.");
      return;
    }

    if (growthRate.trim() === "" || !Number.isFinite(growthValue)) {
      setError("Enter a valid estimated growth rate.");
      return;
    }

    if (growthValue < -100 || growthValue > 1000) {
      setError("Growth rate must be between -100% and 1000%.");
      return;
    }

    if (!["1", "2", "3"].includes(forecastYears)) {
      setError("Select a valid forecast horizon.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await getRevenueForecast({
        companyName: companyName.trim(),
        revenue: revenueValue,
        growthRate: growthValue,
        forecastYears: Number(forecastYears),
      });

      setForecastResult(result);
      setSuccess("Demo forecast received successfully.");
    } catch (requestError) {
      setError(requestError.message || "Unable to generate the forecast.");
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ============================= */
  /* FORMAT FILE SIZE */
  /* ============================= */

  function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  /* ============================= */
  /* FORMAT REVENUE */
  /* ============================= */

  function formatRevenue(value) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: forecastResult?.currency || "INR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">

{/* ============================= */}
{/* BACK BUTTON */}
{/* ============================= */}

<Link
  to="/"
  className="mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-primary-soft hover:text-primary"
>
  <FontAwesomeIcon icon={faArrowLeft} />
  Back
</Link>

      {/* ============================= */}
      {/* PAGE HEADER */}
      {/* ============================= */}

      <section>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-soft text-teal">
          <FontAwesomeIcon icon={faChartLine} size="lg" />
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink">
          Revenue Forecasting
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Prepare your company financial inputs to estimate future revenue
          using a machine learning regression model.
        </p>
      </section>

      {/* ============================= */}
      {/* INPUT FORM AND RESULTS */}
      {/* ============================= */}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-ink">
              Company financial details
            </h2>
            <p className="mt-2 text-sm text-muted">
              Enter the values and units used by your dataset.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="companyName" className={labelClass}>
                Company name
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(event) => {
                  setCompanyName(event.target.value);
                  setError("");
                  setSuccess("");
                  setForecastResult(null);
                }}
                placeholder="e.g. Example Industries"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="revenue" className={labelClass}>
                Latest historical revenue (₹)
              </label>
              <input
                id="revenue"
                type="number"
                min="0"
                step="any"
                value={revenue}
                onChange={(event) => {
                  setRevenue(event.target.value);
                  setError("");
                  setSuccess("");
                  setForecastResult(null);
                }}
                placeholder="e.g. 50000000"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="growthRate" className={labelClass}>
                Estimated annual growth rate (%)
              </label>
              <input
                id="growthRate"
                type="number"
                step="any"
                value={growthRate}
                onChange={(event) => {
                  setGrowthRate(event.target.value);
                  setError("");
                  setSuccess("");
                  setForecastResult(null);
                }}
                placeholder="e.g. 8.5"
                className={inputClass}
              />
              <p className="mt-2 text-xs leading-5 text-muted">
                The backend team must confirm whether the trained model uses
                this feature.
              </p>
            </div>

            <div>
              <label htmlFor="forecastYears" className={labelClass}>
                Forecast horizon
              </label>
              <select
                id="forecastYears"
                value={forecastYears}
                onChange={(event) => {
                  setForecastYears(event.target.value);
                  setError("");
                  setSuccess("");
                  setForecastResult(null);
                }}
                className={inputClass}
              >
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
              </select>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="rounded-xl border border-teal/20 bg-teal-soft p-3 text-sm text-teal"
              >
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isReadingFile}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FontAwesomeIcon icon={faChartLine} />
              {isSubmitting ? "Generating demo..." : "Generate forecast"}
            </button>
          </form>
        </section>

        {/* ============================= */}
        {/* RESULT PANEL */}
        {/* ============================= */}

        <section className="h-fit rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">
              Forecast results
            </h2>

            {forecastResult && (
              <span className="rounded-full border border-amber/20 bg-amber-soft px-3 py-1 text-xs font-medium text-amber">
                DEMO DATA
              </span>
            )}
          </div>

          {forecastResult ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-muted">
                Company:{" "}
                <span className="font-medium text-ink">
                  {forecastResult.companyName}
                </span>
              </p>

              <div className="rounded-xl border border-amber/20 bg-amber-soft p-4">
                <p className="text-sm leading-6 text-amber">
                  These are illustrative projections calculated from your
                  inputs, not predictions from a trained machine learning model.
                </p>
              </div>

              {Array.isArray(forecastResult.forecast) &&
                forecastResult.forecast.map((item) => (
                  <div
                    key={item.year}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border bg-canvas p-4"
                  >
                    <span className="text-sm text-muted">{item.year}</span>
                    <span className="text-sm font-semibold text-teal">
                      {formatRevenue(item.revenue)}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-soft text-teal">
                <FontAwesomeIcon icon={faChartLine} size="xl" />
              </div>

              <h3 className="mt-5 font-semibold text-ink">
                No forecast available
              </h3>

              <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
                Submit valid inputs to test the mock API response.
              </p>
            </div>
          )}

          <div className="mt-5 flex items-start gap-3 rounded-xl bg-primary-soft p-4">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="mt-1 text-primary"
            />
            <p className="text-xs leading-5 text-muted">
              Forecasts are estimates, not guarantees of future company
              performance. Real predictions require the trained model API.
            </p>
          </div>

          {/* ============================= */}
          {/* FINANCIAL FILE UPLOAD */}
          {/* ============================= */}

          <div className="mt-6">
            <label
              htmlFor="financialFile"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-ink transition hover:bg-canvas"
            >
              <FontAwesomeIcon icon={faFileArrowUp} />
              {isReadingFile
                ? "Reading file..."
                : "Select financial CSV or Excel file"}
            </label>

            <input
              id="financialFile"
              type="file"
              accept=".csv,.xlsx,.xls"
              disabled={isReadingFile}
              className="sr-only"
              onChange={handleFileChange}
            />

            {selectedFile && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-canvas p-4">
                <FontAwesomeIcon
                  icon={faFileExcel}
                  className="text-xl text-teal"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {selectedFile.name}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  aria-label="Remove selected file"
                  className="rounded-lg p-2 text-muted transition hover:bg-surface hover:text-red-600"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            )}

            {previewHeaders.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-ink">
                  Data preview
                </h3>
                <p className="mt-1 text-xs text-muted">
                  Showing up to {MAX_PREVIEW_ROWS} rows from the first worksheet.
                </p>

                <div className="mt-3 overflow-x-auto rounded-xl border border-border">
                  <table className="min-w-full text-left text-xs">
                    <thead className="bg-canvas text-ink">
                      <tr>
                        {previewHeaders.map((header, index) => (
                          <th
                            key={`${header}-${index}`}
                            className="whitespace-nowrap px-3 py-3 font-medium"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {previewRows.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className="border-t border-border"
                        >
                          {row.map((value, columnIndex) => (
                            <td
                              key={columnIndex}
                              className="whitespace-nowrap px-3 py-3 text-muted"
                            >
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <p className="mt-3 text-xs leading-5 text-muted">
              CSV and Excel files only. Maximum size: 10 MB. Files are read
              locally in your browser and are not uploaded to a server.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}