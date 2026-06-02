# Contributing to Canvora 🎨✨

First off, thank you for showing interest in contributing to **Canvora**! This project is participating in **GirlScript Summer of Code (GSSoC)**, and we are excited to have you join our developer community.

Please read through these guidelines before you start contributing. Following these rules ensures a smooth workflow, fair point distribution, and a clean codebase for everyone.

---

## 🏆 GSSoC Contribution Rules

### 1. Issue Assignment
* **Do NOT start working on an issue without being assigned.** PRs submitted for unassigned issues will be closed without review.
* To request an issue, comment on the issue thread expressing your interest (e.g., `"Please assign this to me under GSSoC 2026."`).
* Project Admins/Mentors will assign issues on a first-come, first-served basis (or based on relevant experience for advanced issues).
* **Limit:** You can only be assigned **one issue at a time**. Once your PR for the current issue is merged or closed, you may request another.
* **Deadline:** You have **3 days** from the time of assignment to submit a draft PR or show progress. If no progress is made, the issue will be unassigned and passed to the next contributor.

### 2. PR Labeling & Points
Points are tracked automatically by the GSSoC leaderboard. For your contributions to count, they must be merged and properly labeled.
* **Mandatory Label:** Every valid PR must have the `gssoc:approved` (or `gssoc`) label added by an admin.
* **Difficulty Levels:**
  * 🟢 **Level 1 (Beginner - 10 pts):** Documentation updates, minor UI changes, simple bug fixes.
  * 🟡 **Level 2 (Intermediate - 25 pts):** Creating reusable components, simple Express API routes, form validations.
  * 🔴 **Level 3 (Advanced - 45 pts):** Integration of complex state management, database schema changes, authentication, payment gateway setup, or major feature building.

---

## 🛠️ Local Setup and Installation

Canvora is a full-stack application built using the MERN stack (MongoDB, Express, React via Vite, Node.js). Follow these steps to get the project running locally on your system.

### Prerequisites
Make sure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v16 or higher recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) (either running locally or a MongoDB Atlas URI)
* [Git](https://git-scm.com/)

---

### Step 1: Fork and Clone the Repository

1. **Fork** this repository by clicking the "Fork" button at the top right of this page.
2. Clone your forked repository locally:
   ```bash
   git clone https://github.com/<your-username>/Canvora1.git
   cd Canvora1
   ```
3. Set the upstream remote to stay updated with the main project:
   ```bash
   git remote add upstream https://github.com/Abii06/Canvora1.git
   ```

---

### Step 2: Backend Setup

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `backend` directory and configure the environment variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/canvora
   JWT_SECRET=your_secret_key_here
   ```
   *(Note: You can replace the local MONGO_URI with your MongoDB Atlas connection string if you prefer a cloud database).*
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   Your backend should now be running, typically at `http://localhost:5000`.

---

### Step 3: Frontend Setup

1. Open a new terminal window/tab and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will start, and you can access it at `http://localhost:5173`.

---

## 🌿 Git & Branching Workflow

Always keep your work isolated in feature branches. Never make changes directly on your local `main` branch.

1. **Keep your main branch up-to-date:**
   ```bash
   git checkout main
   git pull upstream main
   ```
2. **Create a new feature branch** for the issue you are working on:
   ```bash
   git checkout -b feature/issue-<issue-number>-<brief-description>
   # Example: git checkout -b feature/issue-12-login-page
   ```
3. **Commit your changes** with a meaningful commit message:
   ```bash
   git commit -m "feat: add secure password input to login page"
   ```
4. **Push your branch** to your forked repository:
   ```bash
   git push origin feature/issue-<issue-number>-<brief-description>
   ```

---

## 📬 Submitting a Pull Request (PR)

1. Navigate to the original [Abii06/Canvora1](https://github.com/Abii06/Canvora1) repository. You will see a banner prompting you to compare and create a Pull Request.
2. Click **Create Pull Request**.
3. **Fill out the PR Template / Description:**
   * Describe the changes you have introduced.
   * State which issue this PR resolves (e.g., `Closes #12` or `Fixes #34`). This is **mandatory** so GitHub links the two.
   * Add screenshots or screen recordings for frontend/UI changes.
4. Make sure your PR description is clear, and submit it!
5. Wait for the review. Be ready to make modifications if suggested by mentors/admins.

---

## 🎨 Code Style and Guidelines

* **Code Quality:** Write clean, legible, and commented code.
* **Component-Driven UI:** Keep React components modular and reusable in the `frontend/src/components` directory.
* **Styling:** Use Tailwind CSS utility classes and ensure responsiveness across mobile, tablet, and desktop screens.
* **No Lint Errors:** Check for lint errors or warnings before pushing your code.
* **Environment Variables:** Never commit sensitive files (like `.env` configuration) to GitHub. Keep them in `.gitignore`.

---

## 🤝 Need Help?

If you get stuck or have questions:
* Comment on your assigned issue.
* Reach out to the Project Admins or Mentors in the official **GSSoC Discord Server** under the dedicated channel for **Canvora**.

Happy coding! Let's build something amazing together! 🚀
