import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MCQ GRID Client Portal',
  description: 'MCQ Ventures GRID assessment and checkout experience',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
