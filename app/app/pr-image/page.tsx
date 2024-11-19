'use client';

import dynamic from 'next/dynamic';

// Konvaコンポーネントを動的インポート
const PrImageEditor = dynamic(
  () => import('./components/PrImageEditor').then((mod) => mod.PrImageEditor),
  {
    ssr: false, // サーバーサイドレンダリングを無効化
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    ),
  }
);

export default function PrImagePage() {
  return <PrImageEditor />;
}
