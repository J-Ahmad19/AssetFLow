# AssetFlow: Enterprise Asset & Resource Management System

AssetFlow is a centralized ERP platform designed to simplify and digitize how organizations track, allocate, and maintain their physical assets and shared resources[cite: 1]. It aims to reduce manual tracking inefficiencies by enabling structured asset lifecycles, centralized resource booking, and real-time visibility into who holds what, where it is, and its condition[cite: 1].

## Core Features

*   **Role-Based Access Control:** Secure workflows restricted to realistic roles (Admin, Asset Manager, Department Head, Employee) with strict authentication rules preventing self-elevation[cite: 1].
*   **Asset Lifecycle Management:** Centralized tracking of assets across distinct states (Available, Allocated, Reserved, Under Maintenance, Lost, Retired, Disposed)[cite: 1].
*   **Allocation & Transfer Engine:** Strict conflict rules that prevent double-allocation and automatically prompt structured transfer requests when items are already held[cite: 1].
*   **Resource Booking Validation:** Time-slot booking of shared workspaces or equipment that actively validates and prevents calendar overlaps[cite: 1].
*   **Structured Maintenance & Auditing:** Route repair requests through formal approval before work starts, and conduct scheduled audit cycles to flag missing or damaged items[cite: 1].
*   **Operational Dashboard:** Real-time KPI summaries highlighting available assets, active bookings, and auto-flagging overdue returns[cite: 1].

## Tech Stack (Frontend)

*   **Framework:** React + TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Linting & Compilation:** Oxlint / SWC or Oxc

*(Note: The AssetFlow backend architecture utilizes Node.js, Express, MySQL, JWT, and bcrypt for secure API delivery and relational data management).*

---

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your local machine.

### Installation & Setup

**1. Clone the repository:**
```bash
git clone <repository-url>
cd AssetFLow
```

**2. Install dependencies:**
```bash
npm install
```

**3. Set up the MySQL database:**

- Ensure **MySQL** is running on your local machine.
- Create a new database named `assetflow`.

```sql
CREATE DATABASE assetflow;
```

**4. Configure environment variables:**

To run this project, you will need to add the following environment variables to your `.env` file in the `backend/` directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=assetflow
```

**5. Start the development server:**
```bash
npm run dev
```
```

---

## Vite & Linter Configuration

This template provides a minimal, high-performance setup to get React working in Vite with Hot Module Replacement (HMR) and Oxlint rules. 

Currently, two official plugins are available depending on your compilation preference:
*   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
*   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

### React Compiler

The React Compiler is not enabled on this template out-of-the-box due to its impact on dev and build performances. To add it, see the [official React documentation](https://react.dev/learn/react-compiler/installation).

### Expanding the Oxlint Configuration

Because AssetFlow is an enterprise-grade production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing your `.oxlintrc.json` file:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules, categories, and overrides.