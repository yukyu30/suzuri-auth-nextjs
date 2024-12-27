import { auth } from '@/auth';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();

  const app = [
    {
      name: 'プロフィール スマホストラップジェネレーター',
      description:
        'QRコード、アイコンがデザインされたスマホストラップを作ります',
      slug: 'profile-smart-phone-strap',
    },
    {
      name: 'PR画像作成',
      description: '新春セールのPR画像を作成します',
      slug: 'pr-image',
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {app.map((item) => (
          <Card key={item.slug}>
            <Link href={`/app/${item.slug}`}>
              <CardHeader className="tracking-wide">
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>

              <CardFooter>
                <p>@yukyu30</p>
              </CardFooter>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
