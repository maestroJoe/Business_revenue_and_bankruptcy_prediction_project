
import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faFileArrowUp,
  faInfoCircle,
  faFileExcel,
  faTrash,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { getBankruptcyRisk } from "../services/bankruptcyApi";

/* ============================= */
/* BANKRUPTCY RISK PAGE */
/* ============================= */

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const FINANCIAL_FIELDS = [
  ["totalAssets", "Total Assets"],
  ["totalLiabilities", "Total Liabilities"],
  ["currentAssets", "Current Assets"],
  ["currentLiabilities", "Current Liabilities"],
  ["revenue", "Revenue"],
  ["netIncome", "Net Income"],
];

const INITIAL_FINANCIALS = {
  totalAssets: "",
  totalLiabilities: "",
  currentAssets: "",
  currentLiabilities: "",
  revenue: "",
  netIncome: "",
};

/* ============================= */
/* NORMALIZE COLUMN HEADERS */
/* ============================= */

function normalizeHeader(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/* ============================= */
/* PARSE NUMERIC VALUES */
/* ============================= */

function parseNumber(value) {
  if (typeof value === "number") return value;

  return Number(
    String(value)
      .replace(/,/g, "")
      .replace(/%/g, "")
      .trim()
  );
}

/* ============================= */
/* BANKRUPTCY RISK PAGE */
/* ============================= */

export default function BankruptcyRisk() {
  const [companyName, setCompanyName] = useState("");
  const [financials, setFinancials] = useState(INITIAL_FINANCIALS);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewHeaders, setPreviewHeaders] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);
  const [isReadingFile, setIsReadingFile] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  /* ============================= */
  /* HANDLE INPUT CHANGES */
  /* ============================= */

  function handleChange(event) {
    const { name, value } = event.target;

    setFinancials((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
    setResult(null);
  }

  /* ============================= */
  /* READ AND IMPORT FINANCIAL FILE */
  /* ============================= */

  async function handleFileChange(event) {
    const file = event.target.files?.[0];

    setSelectedFile(null);
    setPreviewHeaders([]);
    setPreviewRows([]);
    setError("");
    setSuccess("");
    setResult(null);

    if (!file) return;

    const extension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    if (![".csv", ".xlsx", ".xls"].includes(extension)) {
      setError("Select a valid CSV or Excel file.");
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
      const XLSX = await import("xlsx");

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });

      if (!workbook.SheetNames.length) {
        throw new Error("No worksheet was found in the file.");
      }

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        blankrows: false,
      });

      if (rows.length < 2) {
        throw new Error(
          "The file needs a header row and at least one data row."
        );
      }

      const originalHeaders = rows[0].map((value) =>
        String(value).trim()
      );
      const headers = originalHeaders.map(normalizeHeader);

      if (
        headers.some((header) => !header) ||
        new Set(headers).size !== headers.length
      ) {
        throw new Error(
          "Column headers must be non-empty and unique."
        );
      }

      const dataRows = rows
        .slice(1)
        .filter((row) =>
          row.some((cell) => String(cell).trim() !== "")
        )
        .map((row) =>
          originalHeaders.map((_, index) => row[index] ?? "")
        );

      if (!dataRows.length) {
        throw new Error("No financial data rows were found.");
      }

      const findColumn = (...names) =>
        headers.findIndex((header) => names.includes(header));

      const companyIndex = findColumn(
        "companyname",
        "company",
        "companytitle"
      );

      const yearIndex = findColumn("year", "financialyear");

      const columnIndexes = {
        totalAssets: findColumn("totalassets", "assets"),
        totalLiabilities: findColumn(
          "totalliabilities",
          "liabilities"
        ),
        currentAssets: findColumn("currentassets"),
        currentLiabilities: findColumn("currentliabilities"),
        revenue: findColumn(
          "revenue",
          "latestrevenue",
          "historicalrevenue"
        ),
        netIncome: findColumn("netincome", "netprofit"),
      };

      const missingColumns = [];

      if (companyIndex === -1) {
        missingColumns.push("CompanyName");
      }

      for (const [field, label] of FINANCIAL_FIELDS) {
        if (columnIndexes[field] === -1) {
          missingColumns.push(label);
        }
      }

      if (missingColumns.length) {
        throw new Error(
          `Missing required columns: ${missingColumns.join(", ")}.`
        );
      }

      // Select the latest year when a Year column is available.
      const sortedRows = [...dataRows];

      if (yearIndex !== -1) {
        sortedRows.sort((a, b) => {
          const yearA = parseNumber(a[yearIndex]);
          const yearB = parseNumber(b[yearIndex]);

          if (!Number.isFinite(yearA)) return 1;
          if (!Number.isFinite(yearB)) return -1;

          return yearB - yearA;
        });
      }

      const row = sortedRows[0];
      const importedCompany = String(
        row[companyIndex] ?? ""
      ).trim();

      if (!importedCompany) {
        throw new Error(
          "The selected financial row has no company name."
        );
      }

      const importedFinancials = {};

      for (const [field, label] of FINANCIAL_FIELDS) {
        const rawValue = row[columnIndexes[field]];
        const number = parseNumber(rawValue);

        if (
          String(rawValue).trim() === "" ||
          !Number.isFinite(number)
        ) {
          throw new Error(
            `${label} must contain a valid numeric value.`
          );
        }

        importedFinancials[field] = String(number);
      }

      if (
        Object.entries(importedFinancials).some(
          ([field, value]) =>
            field !== "netIncome" && Number(value) < 0
        )
      ) {
        throw new Error(
          "Assets, liabilities, and revenue cannot be negative."
        );
      }

      // Fill the existing form.
      setCompanyName(importedCompany);
      setFinancials(importedFinancials);
      setSelectedFile(file);
      setPreviewHeaders(originalHeaders);
      setPreviewRows(
        dataRows.slice(0, 5).map((row) =>
          originalHeaders.map((_, index) => row[index] ?? "")
        )
      );

      setSuccess(
        `Imported financial details for ${importedCompany}. Review the values before submitting.`
      );
    } catch (fileError) {
      setError(
        fileError.message ||
          "Unable to read the file. Check its format and financial data."
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
    setResult(null);

    const fileInput = document.getElementById("bankruptcyFile");

    if (fileInput) fileInput.value = "";
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
  /* HANDLE FORM SUBMISSION */
  /* ============================= */

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setResult(null);

    if (!companyName.trim()) {
      setError("Please enter the company name.");
      return;
    }

    if (
      Object.values(financials).some(
        (value) => String(value).trim() === ""
      )
    ) {
      setError("Please complete all financial fields.");
      return;
    }

    const numericFinancials = {};

    for (const [field, label] of FINANCIAL_FIELDS) {
      const value = Number(financials[field]);

      if (!Number.isFinite(value)) {
        setError(`Enter a valid number for ${label}.`);
        return;
      }

      numericFinancials[field] = value;
    }

    if (
      Object.entries(numericFinancials).some(
        ([field, value]) =>
          field !== "netIncome" && value < 0
      )
    ) {
      setError(
        "Assets, liabilities, and revenue cannot be negative."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await getBankruptcyRisk({
        companyName: companyName.trim(),
        ...numericFinancials,
      });

      setResult({
        ...response,
        companyName: companyName.trim(),
      });

      setSuccess("Demo assessment received successfully.");
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to retrieve the assessment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl">

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

      <div className="mb-8">
        
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-soft text-amber">
          <FontAwesomeIcon icon={faShieldHalved} className="text-xl" />
        </div>

        <p className="text-sm font-semibold tracking-wide text-primary">
          CLASSIFICATION WORKSPACE
        </p>

        <h1 className="mt-2 text-3xl font-bold text-ink">
          Bankruptcy Risk Assessment
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Enter company financial information manually or upload a
          financial dataset to populate the form automatically.
        </p>
      </div>

      {/* ============================= */}
      {/* FILE UPLOAD */}
      {/* ============================= */}

      <div className="mb-6 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <FontAwesomeIcon icon={faFileArrowUp} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-ink">
              Financial Dataset Upload
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              Upload a CSV or Excel file containing the company name
              and six financial fields. If a Year column exists, the
              latest year will be selected.
            </p>

            <label
              htmlFor="bankruptcyFile"
              className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-canvas hover:text-ink"
            >
              <FontAwesomeIcon icon={faFileArrowUp} />
              {isReadingFile
                ? "Reading file..."
                : "Select financial CSV or Excel file"}
            </label>

            <input
              id="bankruptcyFile"
              type="file"
              accept=".csv,.xlsx,.xls"
              disabled={isReadingFile || isSubmitting}
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
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            )}

            {previewHeaders.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-ink">
                  Data Preview
                </h3>

                <p className="mt-1 text-xs text-muted">
                  Showing up to five rows from the first worksheet.
                </p>

                <div className="mt-3 overflow-x-auto rounded-xl border border-border">
                  <table className="min-w-full text-left text-xs">
                    <thead className="bg-canvas text-ink">
                      <tr>
                        {previewHeaders.map((header, index) => (
                          <th
                            key={`${header}-${index}`}
                            className="whitespace-nowrap px-3 py-3 font-semibold"
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
              CSV and Excel files only. Maximum size: 10 MB. Files are
              read locally in your browser and are not uploaded to a server.
            </p>
          </div>
        </div>
      </div>

      {/* ============================= */}
      {/* INPUT FORM AND RESULTS */}
      {/* ============================= */}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7"
        >
          <h2 className="text-lg font-semibold text-ink">
            Company Financials
          </h2>

          <p className="mt-1 text-sm text-muted">
            Review imported values or enter them manually. Use consistent
            currency and units.
          </p>

          <div className="mt-6">
            <label
              htmlFor="companyName"
              className="mb-2 block text-sm font-medium text-ink"
            >
              Company Name
            </label>

            <input
              id="companyName"
              value={companyName}
              onChange={(event) => {
                setCompanyName(event.target.value);
                setError("");
                setSuccess("");
                setResult(null);
              }}
              placeholder="e.g. Example Industries Ltd."
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {FINANCIAL_FIELDS.map(([name, label]) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className="mb-2 block text-sm font-medium text-ink"
                >
                  {label}
                </label>

                <input
                  id={name}
                  name={name}
                  type="number"
                  step="any"
                  value={financials[name]}
                  onChange={handleChange}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
            ))}
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-teal/20 bg-teal-soft p-4 text-sm text-teal"
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isReadingFile}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FontAwesomeIcon icon={faShieldHalved} />
            {isSubmitting ? "Assessing..." : "Assess Bankruptcy Risk"}
          </button>
        </form>

        {/* ============================= */}
        {/* RESULT PANEL */}
        {/* ============================= */}

        <aside className="h-fit rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">
              Assessment Results
            </h2>

            {result && (
              <span className="rounded-full border border-amber/20 bg-amber-soft px-3 py-1 text-xs font-semibold text-amber">
                DEMO DATA
              </span>
            )}
          </div>

          {result ? (
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-muted">Company</p>
                <p className="mt-1 font-medium text-ink">
                  {result.companyName}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-canvas p-4">
                <p className="text-sm text-muted">Sample risk level</p>
                <p className="mt-2 text-2xl font-bold text-amber">
                  {result.riskLevel}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-canvas p-4">
                <p className="text-sm text-muted">
                  Sample risk probability
                </p>
                <p className="mt-2 text-2xl font-bold text-ink">
                  {(result.riskProbability * 100).toFixed(1)}%
                </p>
              </div>

              <p className="rounded-xl border border-amber/20 bg-amber-soft p-4 text-sm leading-6 text-amber">
                These are fixed mock values. They are not calculated from
                your financial inputs and are not a real bankruptcy prediction.
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-border p-5">
              <p className="text-sm font-medium text-ink">
                No assessment available
              </p>

              <p className="mt-2 text-sm leading-6 text-muted">
                Complete the financial fields and submit to test the mock API.
              </p>
            </div>
          )}

          <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-muted">
            <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5" />
            <span>
              This student project is not a substitute for professional
              financial analysis.
            </span>
          </p>
        </aside>
      </div>
    </section>
  );
}
