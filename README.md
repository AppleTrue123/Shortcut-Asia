# 📝 Anonymous Peer Feedback Platform

A **single-page application (SPA)** built for small teams or academic groups to collect and view anonymous, constructive **peer feedback** with zero dependencies. It supports peer management, anonymous submission, and aggregated review.

## 1. Planning and Approach

The core goal was to maximize **candor** by enforcing **anonymity at the logic level**. The application was developed to handle three key user flows:

* **Peer Management:** Add/remove participants.
* **Feedback Submission:** Anonymous comment collection.
* **Feedback Review:** Aggregated summary viewing.

Development focused on establishing the **UI structure** first, followed by **persistence logic** (`loadData`, `saveData`), and finally, wiring up the interaction handlers for submission and review.

---

## 2. Technical Decisions and Reasoning

### Tech Stack Used

| Category | Technology | Reasoning |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) | Chosen for **speed, simplicity, and zero dependencies**. Suitable for an SPA with minimal state. |
| **Styling** | Custom CSS (`style.css`) | No heavy framework required; focus on **performance** and clean, professional aesthetic. |
| **Persistence** | Browser `localStorage` | Used as a simple, **zero-config data store** to retain data across refreshes without requiring a full backend database. |

### Main Technical Decisions

* **Data Persistence:** All core data (`STUDENTS`, `feedbackData`) is loaded and saved immediately after any **write operation** (e.g., adding a peer or submitting feedback). Helper functions encapsulate `JSON.stringify/parse`.
* **Dynamic UI Updates:** A single function (`populateDropdowns`) manages the entire peer list UI, ensuring the **"Give Feedback" and "View Summary" dropdowns are always synchronized** and alphabetically sorted.
* **Anonymity Enforcement:** The application logic **prevents storing the submitter's identity**. The `feedbackData` object only records the target peer and the comment, ensuring inherent anonymity during review.

---

## 3. Architecture Overview

The application follows a simple **Model-View-Controller (MVC) pattern**:

| Component | Files/Functions | Role |
| :--- | :--- | :--- |
| **Model (Data)** | `STUDENTS`, `feedbackData`, `loadData()`, `saveData()` | Manages application state and persistence layer (`localStorage`). |
| **View (UI)** | `index.html`, `style.css` | Defines structure, presentation, and contains the dual panels. |
| **Controller (Logic)** | Event listeners, `populateDropdowns()`, `renderSummary()` | Handles user input, updates the Model, and dynamically modifies the View. |


---

## 4. Key Feature Flows

### Flow 1: Feedback Submission

1.  **User Action:** User selects a peer and submits the `feedbackForm`.
2.  **Controller:** The submission listener extracts target and comment.
3.  **Model Update:** A new anonymous entry `{target, comment}` is added to `feedbackData`.
4.  **Persistence:** `saveData('feedback', feedbackData)` updates `localStorage`.
5.  **View Update:** Form resets, confirmation message is displayed.

### Flow 2: Feedback Review

1.  **User Action:** User selects a peer from the `summarySelect` dropdown.
2.  **Controller:** The change event listener calls `renderSummary(targetPeer)`.
3.  **Data Filtering:** `renderSummary` filters `feedbackData` to find all entries matching `item.target === targetPeer`.
4.  **View Construction:** Dynamic `feedback-card` elements are created for the filtered data.
5.  **View Update:** The cards are injected into the `feedbackSummaryList` container.
