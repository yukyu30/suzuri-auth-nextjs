import { auth } from '@/auth';
import ImageCompositeForm from '@/components/ImageCompositeForm';
import { SignIn } from '@/components/SignIn';

export default async function Home() {
  const session = await auth();
  if (!session) {
    return (
      <main className="mx-auto min-h-screen p-24">
        <SignIn />
      </main>
    );
  }
  return (
    <main className="mx-auto min-h-screen p-24">
      <ImageCompositeForm />
    </main>
  );
}
