# 🏨 Smart Hotel Reservation System 

A specialized Room Allocation System built with **Next.js 14**, utilizing a **Constraint Satisfaction Algorithm** to optimize guest placement based on travel time minimization.

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)
[![Status](https://img.shields.io/badge/Status-Production_Ready-green)](https://hotel-booking-system-thehimanshubansals-projects.vercel.app/)

## 🚀 Live Demo
**[CLICK HERE TO VIEW LIVE APP](https://hotel-booking-system-thehimanshubansals-projects.vercel.app/)**  

## 🧠 Algorithmic Approach
This system avoids brute-force solutions ($O(N!)$) in favor of a hybrid heuristic approach effectively running in **$O(1)$ constant time** relative to the fixed hotel size.

### 1. Priority 1: Single Floor Optimization (Sliding Window)
*   **Logic:** Scans each floor using a variable-width sliding window ($k$ = required rooms).
*   **Metric:** Calculates the horizontal spread (`Index_Last - Index_First`).
*   **Result:** Mathematically guarantees the tightest cluster of rooms on a single floor.

### 2. Priority 2: Multi-Floor Optimization (Constrained Range Search)
*   **Logic:** If single-floor allocation fails, the system iterates through valid **Floor Ranges** (e.g., F1-F2, F2-F4).
*   **Heuristic:** Within the candidate floors, it strictly prioritizes rooms with the **lowest indices** (closest to the lift).
*   **Cost Function:** 
    $$ Cost = \max(Idx_{Bottom}) + \max(Idx_{Top}) + (2 \times |Floor_{Top} - Floor_{Bottom}|) $$

## 🛠 Tech Stack & Architecture
*   **Framework:** Next.js 14 (App Router) - chosen for Full-Stack capabilities within a Monorepo.
*   **Language:** TypeScript - for strict type safety and data modeling.
*   **Styling:** Tailwind CSS - for rapid, responsive grid visualization.
*   **State:** In-Memory Singleton Store (Simulating a high-throughput DB layer).

## ⚡️ Getting Started Locally

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/hotel-reservation-assessment.git
    cd hotel-reservation-assessment
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🧪 Future Roadmap & Known Limitations
*   **Persistence:** Currently uses in-memory storage. Production build requires migration to PostgreSQL (See Issue #1).
*   **Concurrency:** High-traffic race conditions require Optimistic Locking implementation (See Issue #2).
*   **Testing:** Unit test suite for the `findOptimalRooms` algorithm (See Issue #3).



## 🤝 Contribution
Thank you for considering contributing to this project! Please star this repo.

Please run the linter before pushing changes:

```bash
npm run lint
```

### 💡 Ways to Contribute
- **Reporting Bugs:** Use the "Bug Report" issue template.
- **Suggesting Features:** Use the "Feature Request" issue template.
- **Fixing Issues:** Look for issues labeled `good first issue`.

### 🚀 How to Submit a Contribution
1. **Fork** the repository.
2. **Create a branch**: `git checkout -b feature/your-feature`
3. **Setup**: Run `npm install` (or equivalent) to install dependencies.
4. **Make changes**: Fix the issue, add tests.
5. **Commit**: Write a clear commit message.
6. **Push**: `git push origin feature/your-feature`
7. **Create a Pull Request**.

### 🛡️ Pull Request Requirements
- [ ] Code passes all tests.
- [ ] Added tests for new functionality.
- [ ] Updated documentation.
- [ ] Follows project code style.

### 💬 Communication
- Please keep discussions public in the issue/PR comments.
