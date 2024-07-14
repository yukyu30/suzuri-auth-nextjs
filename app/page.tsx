import { auth } from '@/auth';
import { SignIn } from '@/components/SignIn';

export default async function Home() {
  const session = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignIn />
      {session?.user?.name}
    </main>
  );
}
