import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

  const { texture } = await request.json();
  if (!texture) {
    return NextResponse.json({ error: 'Texture is required' }, { status: 400 });
  }
  console.log(texture);
  const session = await auth()
  const token = session?.accessToken
  //sessionがなかったら401
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = await fetch('https://suzuri.jp/api/v1/materials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      "texture": texture,
      "title": "スマホストラップ",
      "price": 0,
      "description": "",
      "secret": true,
      "products": [
        {
          "itemId": 195,
          "exemplaryItemVariantId": 3047,
          "published": true,
          "resizeMode": "contain",
          "secret": true
        }
      ]
    })
  });
  const data = await response.json();
  const url = data.products[0].sampleUrl;
  return NextResponse.json({ url });
}

