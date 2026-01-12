import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'STool',
  description: 'SUZURI非公式のツール群',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="p-4">
          <Header />
        </div>
        <div className="mx-4 mt-14">{children}</div>
      </body>
    </html>
  );
}
