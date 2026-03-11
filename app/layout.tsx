import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 't-scribe',
  description: 'tazzas scribe',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
