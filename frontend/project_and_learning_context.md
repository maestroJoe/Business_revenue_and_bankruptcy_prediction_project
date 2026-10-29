# Project and Learning Context

> A working context document for continuing the user's projects and learning plans. Update this file as decisions or project status change.

## 1. FoCT Mobile App

### Overview
- **Project:** FoCT Mobile App
- **Institution/context:** Assam Down Town University — Faculty of Computing and Technology (FoCT)
- **Goal:** A mobile app for students and faculty to receive university updates, event information, news, and notifications.
- **Distribution:** The current plan is to distribute the app through WhatsApp rather than the Play Store.
- **Backend:** Supabase is expected to be used. The user currently does not have direct visibility or access to the Supabase structure; backend teammates are expected to handle backend configuration and data persistence.
- **User's role:** Mainly mobile-app development. Other teammates are handling React.js and backend work.
- **Code preference:** React Native with **JSX**, not TSX/TypeScript.

### Planned app/project lineup
1. FoCT Mobile App
2. Attendance System + Timetable Management
3. Ticketing and Support System

### App requirements
- Display different types of events.
- Display major news and updates.
- Send notifications to students and faculty.
- Show the signed-up user's first name in the Home greeting.
- Show the user's full name on the Profile screen.
- Include a Profile screen and profile-editing UI.
- Keep the department information within the FoCT context; backend teammates will handle the data structure/persistence.

### Recent UI work and decisions
- Notification cards should display a priority tag and a priority label.
- Supported priority labels and intended colors:
  - `URGENT` — orange
  - `IMPORTANT` — blue
  - `NORMAL` — green
- The priority tag should have visible spacing from adjacent content.
- A previous issue showed `NOTIFICATION PRIORITY: undefined`; the user later reported that this was fixed.
- The signup name should appear automatically in the Home greeting as `Hello, {firstname}` and the full name should appear on Profile. The user reported that this was updated successfully.
- Profile work involving `profileRow.js` was reported as completed.

### Project paths and setup history
- **Current remembered project path:** `C:\TEST-foct\FoCT-Mobile`
- Earlier experiment: `C:\Project\FoCT-Mobile`
- The earlier project used Expo SDK 57 and `expo-router/entry`.
- The user also attempted an Expo SDK 54 setup under `C:\TEST-foct`.
- The user works in Windows PowerShell.
- Previously reported environment versions: Node.js `v25.6.1`, npm `11.12.1`, Expo CLI `57.0.13`.
- Android physical-device testing is preferred over using an emulator.
- Android platform-tools were installed at `C:\Users\soura\Downloads\platform-tools\platform-tools\adb.exe`.

### Earlier setup/code notes
- The app structure included folders such as:
  - `src/api`
  - `src/app`
  - `src/components`
  - `src/constants`
  - `src/context`
  - `src/hooks`
  - `src/services`
  - `src/utils`
- Supabase-related files were explored under `src/lib/supabase` and `src/services/namesService.js`.
- A duplicate `supabase` declaration error occurred in `namesService.js`.
- The user prefers placeholders for Supabase URL/key until the backend details are available.
- The user wants practical, step-by-step directions that say exactly which file to edit and where to put code.

### Suggested next checks
- Confirm the current project folder and Expo SDK before proposing commands.
- Ask for the relevant current file(s) or error output before suggesting code edits.
- Avoid assuming the Supabase schema or claiming that backend persistence works without evidence.
- Keep examples in JSX unless the user explicitly requests TypeScript.
- Preserve working behavior when the user requests styling-only changes.

---

## 2. PingU React Native Project

### Overview
- **Project:** PingU
- **Path:** `C:\Users\soura\OneDrive\Desktop\Project Uni\PingU`
- **Collaborator repository:** `thehasancodes/PingU`
- The user has worked as a GitHub collaborator.

### Project structure previously shared
- `src/api/authapi.js`
- `src/components/AppButton.js`
- `src/components/AppInput.js`
- `src/components/BrandHeader.js`
- `src/components/common.js`
- `src/components/navigation.js`
- `src/components/NoticeCard.js`
- `src/constants/color.js`
- `src/constants/mockData.js`
- `src/library/supabase.js`
- `src/navigation/AppNavigator.js`
- `src/navigation/AuthNavigator.js`
- `src/screens/auth.js`
- `src/screens/HomeScreen.js`
- `src/screens/NotificationDetail.js`
- `src/screens/profile.js`
- `src/screens/SavedScreen.js`
- `src/utils/func.js`

### Recent issues and decisions
- The user wanted a login screen styled to match a reference design, without a purple footer bar.
- `expo-linear-gradient` was used/planned and a missing-package error occurred; install it using the Expo-compatible install command if it is still missing.
- `App.js` had rendered `<AuthScreen />` alongside a `NavigationContainer` and `AppNavigator`; verify the current navigation setup before changing it.
- Past errors included:
  - Duplicate `PROFILE` screen registration.
  - Duplicate `NotificationDetail` registration.
  - Text rendered outside a React Native `<Text>` component.
  - Missing `constants/profileData`.
  - Realtime subscription status messages.
- The user chose to keep `common.js` rather than refactor it away.
- A Git pull issue occurred when local changes in `src/navigation/AppNavigator.js` conflicted with a branch that was one commit behind `origin/main`. The user had run `git reset`, leaving that file modified.
- Before Git operations, check `git status` and preserve any local changes.

---

## 3. Learning Goals

### React Native
- The user wants to rebuild React Native knowledge from the basics.
- They have learned React Native before but feel they have forgotten much of it.
- Prefer beginner-friendly explanations, JSX examples, and practical implementation.
- Give step-by-step instructions, including exact file paths and commands.

### DSA with C++
- The user wants to restart DSA as a beginner while learning C++ at the same time.
- They prefer learning topic by topic, starting with **arrays**.
- Explain concepts simply, then show examples and practice problems in a gradual progression.

### Machine Learning
- The user is learning ML using Jupyter notebooks.
- They want practical coding fundamentals before going deeper into theory.
- Their learning sequence has included regression, classification, and clustering.
- A notebook folder named `LinearRegression` was mentioned.
- They have practiced clustering movie data and wanted to work on linear regression with `load_diabetes`.
- They asked for step-by-step explanations of:
  - Selecting features and target, e.g. `X = df[["Hours_Studied"]]` and `y = df["Exam_Marks"]`
  - Why double brackets are used for a one-column feature DataFrame
  - `train_test_split`, including `test_size` and `random_state`
  - Model evaluation with MSE and R² score

### UML study sources
The user previously asked to use these sources for UML topics:
- Visual Paradigm
- GeeksforGeeks
- TutorialsPoint

Topics include State Machine, Use Case, Activity, Sequence, and Class diagrams.

---

## 4. Exam and Assignment Answer Preferences

- Use simple, direct, exam-ready language.
- Match the requested mark allocation (for example, 2, 3, 4, 5, or 10 marks).
- Avoid unnecessary jargon.
- Include definitions, examples, diagrams/flowcharts, comparison tables, and advantages/disadvantages when they genuinely improve the answer.
- For assignment answers, aim for high-scoring structure without making answers unnecessarily long.
- When multiple questions are requested, answer all of them in the same response and do not repeatedly ask whether to continue.
- The user's preferred electronics answer structure is:
  1. Definition and Explanation
  2. Example
  3. How It Works
  4. Diagram
  5. Differentiate (when applicable)
  6. Advantages and Disadvantages

---

## 5. General Programming and Environment Notes

- **Operating system:** Windows, primarily using PowerShell and VS Code.
- **WSL:** Ubuntu 24.04 was installed/configured previously; the user wanted WSL 2 for Docker and asked for the minimum required setup.
- **C/C++:** MSYS2 at `C:\msys64`; VS Code debugger path was `C:\msys64\mingw64\bin\gdb.exe`.
- **Android:** The user prefers testing on a physical Android device.
- **Flutter:** Flutter Doctor had been working previously, but the current primary focus is React Native.
- **Java:** Java 25 was installed previously; the user planned to remove it for a React Native/Gradle-compatible setup. Verify the current Java version before giving setup instructions.

---

## 6. How to Help Effectively

1. **Be practical and specific.** Tell the user which file to open, what code to replace/add, and where it belongs.
2. **Use JSX by default** for React Native code.
3. **Avoid unnecessary refactoring.** If the user requests styling-only changes, preserve functionality.
4. **Do not assume backend details.** The user may not have access to Supabase configuration; use placeholders where appropriate and clearly identify what cannot be verified from the mobile code alone.
5. **Debug from evidence.** Ask for the current code, terminal error, or screenshot when needed instead of assuming the old issue is still present.
6. **Teach as you build.** Explain important changes in beginner-friendly terms, but keep the answer focused.
7. **Keep project contexts separate.** Do not mix FoCT Mobile App files and requirements with PingU.
8. **Be concise but complete.** Avoid repeatedly asking whether the user wants the next step.

---

## 7. Status and Confidence Notes

This document is based on previously shared context and is not a live inspection of either repository. Paths, versions, file structures, and issue statuses may have changed. The user has reported that the FoCT notification-priority issue, signup-name display, and profile work were completed; do not treat them as open bugs unless new evidence indicates otherwise.
