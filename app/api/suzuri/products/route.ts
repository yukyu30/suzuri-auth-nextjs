import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const session = await auth();
  const token = session?.accessToken;
  const userName = session?.user?.name;

  if (!token || !userName) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // URLからクエリパラメータを取得
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '30';
  const offset = searchParams.get('offset') || '0';

  try {
    const response = await fetch(
      `https://suzuri.jp/api/v1/products?userName=${userName}&limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
} 
