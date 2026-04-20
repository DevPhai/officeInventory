# Office Inventory System

A modern, full-stack office equipment and inventory management system built with Next.js, Prisma, and SQLite. This application helps organizations track their assets, manage stock levels, and handle equipment borrowing efficiently.

## 🚀 Features

-   **Dashboard Overview**: Real-time statistics on total items, active borrows, categories, and recent activities.
-   **Inventory Management**: Full CRUD operations for equipment, including SKU tracking and category assignment.
-   **Stock Control**: Automated low-stock alerts and transaction history (In/Out) for every item.
-   **Borrowing System**: Track who borrowed what, due dates, and return status.
-   **Responsive Design**: Clean, professional UI built with custom CSS and Lucide icons.
-   **Type Safety**: Robust validation using Zod and full TypeScript support.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/)
-   **Database**: [SQLite](https://sqlite.org/) with [Prisma ORM](https://www.prisma.io/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Validation**: [Zod](https://zod.dev/)
-   **Testing**: [Playwright](https://playwright.dev/) for End-to-End testing
-   **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📦 Getting Started

### Prerequisites

-   Node.js (Latest LTS recommended)
-   npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd office-inventory
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory and add your database URL:
    ```env
    DATABASE_URL="file:./dev.db"
    ```

4.  **Database Setup**:
    Initialize the SQLite database and generate the Prisma client:
    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```

5.  **Seed Data (Optional)**:
    ```bash
    node prisma/seed.js
    ```

6.  **Run the application**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

The project uses Playwright for comprehensive E2E testing.

```bash
# Run all tests
npm test
```

## 📁 Project Structure

-   `src/app/`: Next.js pages and API routes.
-   `src/components/`: Reusable UI components and feature-specific forms.
-   `src/lib/`: Shared utilities (e.g., Prisma client).
-   `prisma/`: Database schema and migration files.
-   `tests/`: Playwright E2E test suites.

## 📝 License

This project is licensed under the MIT License.
