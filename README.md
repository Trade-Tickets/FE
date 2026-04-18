# 🎫 FairTicket
**Predict the Future. Trade the Outcome.**

FairTicket is a decentralized event ticketing and prediction market platform. It allows users to trade purely on their beliefs about future events—from crypto prices to event attendance and real-world outcomes.

This repository contains the Frontend application, designed with a "Neo Brutalism" aesthetic to be fun, engaging, and easy to use.

## ⚡ Tech Stack
We use modern, performance-focused tools to build a snappy and type-safe experience:

* **Framework:** React + Vite
* **Language:** TypeScript
* **Styling:** TailwindCSS
* **State Management:** Zustand
* **Icons:** Lucide React
* **Animations:** Motion (Framer Motion)
* **Package Manager:** npm

## 🚀 Getting Started
Follow these steps to get the project running on your local machine.

### 1. Prerequisites
Ensure you have Node.js 18+ installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` to see the app live.

## 📂 Project Structure
We follow a generalized modular architecture. This keeps the codebase scalable by separating concepts.

### 🗺️ High-Level Map
| Folder | Purpose |
|---|---|
| `src/pages/` | Top-level views (e.g., `LandingPage.tsx`, `Marketplace.tsx`, `Dashboard.tsx`). Keep root routing logic here. |
| `src/components/` | All UI components. Includes domain-specific folders (`trade/`, `navbar/`) and shared pieces (`common/`). |
| `src/api/` | Mock API service (`mockApi.ts`) that simulates backend REST calls using async/await patterns. |
| `src/types/` | Centralized TypeScript definitions and interfaces (`index.ts`). |
| `src/store.ts` | Global state management using Zustand. |

## 🧭 Where do I put my code?
Use this guide to decide where to create new files:

### 1. "I'm building a specific section of the app..."
👉 Go to `src/components/` and create or find the appropriate subfolder.
* Example: Trade-related components (Order Book, Trade Form) live in `src/components/trade/`.
* Example: Navbar components live in `src/components/navbar/`.

### 2. "I need a generic, reusable component..."
👉 Go to `src/components/common/`. These should be reusable everywhere (e.g., `DiscussionSection.tsx`, `ToastContainer.tsx`).

### 3. "I need to fetch data..."
👉 Go to `src/api/mockApi.ts`. Add your endpoint simulation there. When the real backend is ready, we will swap the body of these functions with actual `fetch` calls.

### 4. "I need to define a new data type..."
👉 Go to `src/types/index.ts`. All interfaces like `Event`, `Ticket`, and `Comment` live here to ensure a single source of truth.

## 🎨 Design Guide
**Style:** Neo Brutalism.

* **Borders:** Thick, black borders (`border-[3px] border-black` or `border-[4px] border-black`).
* **Shadows:** Hard, solid color offsets (`shadow-[4px_4px_0px_#000]`).
* **Colors:** High-contrast mix (Brand Yellow `#f8bb46`, Brand Blue `#356ee7`, Brand Green `#3bda6c`, Brand Pink `#fc5d4c`, Brand Purple `#8854ff`).
* **Typography:** Bold, uppercase, tracking-tight or tracking-widest for headers. `font-mono` for numbers and data.
* **Interactions:** Use active translations (`active:translate-y-1 active:translate-x-1`) and shadow removals (`active:shadow-none`) for tactile feedback.

## 🛠️ Workflow & Contributing
We follow strict professional standards for version control to keep our history clean and readable.

### 🌳 Branch Naming
Always branch off `main`. Use the format `type/description-slug`.

| Type | Use Case | Example |
|---|---|---|
| `feat` | New features | `feat/user-profile-page` |
| `fix` | Bug fixes | `fix/login-error-handling` |
| `chore` | Maintenance, config, cleanup | `chore/update-dependencies` |
| `refactor` | Code restructuring (no behavior change) | `refactor/market-card-component` |
| `docs` | Documentation changes | `docs/update-readme` |

### 💬 Commit Messages
We follow Conventional Commits. Format: `type(scope): description`

* `feat: feat(auth): add google login support`
* `fix: fix(market): resolve overflow issue on mobile cards`
* `design: design(landing): update hero text colors`
* `chore: chore: upgrade vite`

**Rules:**
* Use lowercase.
* No period at the end.
* Keep it imperative ("add" not "added").

### 🚀 Pull Request Process
1. Create a branch: `git checkout -b feat/amazing-feature`
2. Commit your changes.
3. Push to origin: `git push origin feat/amazing-feature`
4. Open a PR and request review.
