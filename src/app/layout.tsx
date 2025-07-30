import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Automari.ai Demo',
  description: 'AI Agent Platform - Try our agents in real-time',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}