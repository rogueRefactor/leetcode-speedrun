# 🏃‍♂️ LeetCode Speedrun Tracker

> A client-side, offline-first web app to systematically master LeetCode playlists — fast, private, and resilient.

---

## 📌 Project Overview & Core Philosophy

The **LeetCode Speedrun Tracker** helps users practice and master lists of LeetCode problems.

✨ **100% local operation:**
- No backend server
- Works offline after initial load
- All data (playlists, question metadata, attempt history) stored in browser **Local Storage**

This design keeps it:
- **Private** (your data stays local)
- **Fast**
- **Stable** (unaffected by changes to LeetCode’s site or API)

---

## 🛠️ Technology Stack

- **Framework:** Next.js (Pages Router)
- **UI Library:** React.js
- **CSV Parsing:** [PapaParse](https://www.papaparse.com/)
- **Styling:** Inline CSS-in-JS + `globals.css` (dark theme, no external CSS frameworks)

---

## 🏗 High-Level Architecture

Single-Page Application (**SPA**) built around a single JSON data object stored in Local Storage:

```plaintext
leetcodeSpeedrunTrackerData
```

**Data Flow:**
- **On Load:** Reads full data into `appData` state
- **During Use:** User actions update `appData` in memory
- **On Change:** Serializes & saves back to Local Storage

✅ Only external dependency: **PapaParse**  
🚫 No scraping or LeetCode API calls → avoids CORS & breaks from site changes

---

## 🧩 Data Model Schema

```json
{
  "playlists": {
    "NeetCode 150": {
      "urls": [
        "https://leetcode.com/problems/two-sum/",
        "https://leetcode.com/problems/valid-anagram/"
      ],
      "speedrunHistory": [
        {
          "date": "2025-07-28T10:00:00Z",
          "totalTime": 1850
        }
      ]
    }
  },
  "questions": {
    "https://leetcode.com/problems/two-sum/": {
      "url": "https://leetcode.com/problems/two-sum/",
      "title": "Two Sum",
      "difficulty": "Easy",
      "topics": ["Array", "Hash Table"],
      "totalAttempts": 2,
      "unaidedAttempts": 1,
      "completionStatus": "In Progress",
      "history": [
        {
          "date": "2025-07-25T14:00:00Z",
          "timeThink": 350,
          "timeCode": 450,
          "sawSolution": true,
          "totalTime": 800,
          "remarks": "Struggled with hash maps initially."
        },
        {
          "date": "2025-07-26T10:30:00Z",
          "timeThink": 120,
          "timeCode": 180,
          "sawSolution": false,
          "totalTime": 300,
          "remarks": "Much faster this time, remembered the pattern."
        }
      ]
    }
  }
}
```

---

## 📂 Folder & File Structure

```plaintext
/src
├── /components
│   ├── AddPlaylistModal.js     # Modal for CSV/manual playlist import
│   ├── AddRemarksModal.js      # Modal to add remarks after attempt
│   ├── PlaylistDropdown.js     # Playlist selection & delete
│   ├── Timer.js                # 3-phase timer component
│   └── TrashIcon.js            # Reusable SVG icon
│
├── /pages
│   ├── /solve
│   │   └── [playlist].js       # Solving page
│   ├── /speedrun
│   │   └── [playlist].js       # Speedrun mode
│   ├── _app.js                 # Global App (loads globals.css)
│   ├── dashboard.js            # Progress dashboard
│   └── index.js                # Home page
│
├── /styles
│   └── globals.css             # Global styles & theme variables
│
└── /utils
    └── storage.js              # Local Storage helpers
```

---

## ⚙️ Core Features & Functional Breakdown

### ➕ Adding Playlists
- **CSV Import:** Upload `.csv` with at least `url` column; parsed with PapaParse.
- **Manual Entry:** Paste LeetCode URLs (one per line).

### 🗑 Deleting Playlists
- Trash icon in playlist dropdown.
- Prompts confirmation before deleting (keeps question data for other playlists).

---

### ▶ Starting a Session
- Click "Start" → see playlists.
- **Incomplete playlist** → `/solve/[playlistName]`.
- **Completed playlist** → `/speedrun/[playlistName]`.

---

### 📊 Smart Question Prioritization (`getNextQuestion`)

1. **Discovery Pass:** Serve questions never attempted.
2. **Mastery Pass:** Sort remaining by:
    - Needed solution last time
    - Fewest unaided solves
    - Highest average time

---

### ⏱ Timer (`Timer.js`)

- Starts when user clicks "Open on LeetCode (Starts Timer)".
- 3 phases (10 min each): Thinking → Coding → (Optional) Review.
- After attempt:
    - User adds remarks.
    - Saves history & updates counters.

---

### ✅ Completion Rules

- **Question "Completed":**
    - 3 unaided attempts if never saw solution
    - 4 if saw solution before
- **Playlist "Completed":** All questions completed.

---

### ⚡ Speedrun Mode

- For completed playlists.
- Single timer for whole list.
- Solve → click "Next Question".
- At end → "Finish Speedrun" saves total time.

---

### 📈 Dashboard

- Table of all questions:
    - Title, Difficulty, Total Attempts, Unaided Attempts, Status, Average Time.

---

## ✨ Why it’s unique

✅ Fully offline & private  
⚡ No backend or scraping  
📊 Focused on data-driven mastery & speedrun practice

---