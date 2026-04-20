import type { Metadata } from "next";
import "@/styles/globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Office Inventory",
  description: "Office Equipment Inventory System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav>
          <div className="container">
            <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
              OfficeInv
            </Link>
            <div className="nav-links">
              <Link href="/" className="nav-link">Dashboard</Link>
              <Link href="/inventory" className="nav-link">Inventory</Link>
              <Link href="/borrows" className="nav-link">Borrows</Link>
              <Link href="/transactions" className="nav-link">Transactions</Link>
            </div>
          </div>
        </nav>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
