import type { Metadata } from "next";
import "@/styles/globals.css";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { Layers } from "lucide-react";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  if (!theme && supportDarkMode) theme = 'dark';
                  if (theme === 'dark') document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <nav>
          <div className="container">
            <Link href="/" className="logo">
              <Layers size={20} />
              OfficeInv
            </Link>
            <div className="nav-links">
              <Link href="/" className="nav-link">Dashboard</Link>
              <Link href="/inventory" className="nav-link">Inventory</Link>
              <Link href="/borrows" className="nav-link">Borrows</Link>
              <Link href="/transactions" className="nav-link">Transactions</Link>
              <div style={{ marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border)' }}>
                <ThemeToggle />
              </div>
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
