import { auth } from '@/auth';
import ImageCompositeForm from '@/components/ImageCompositeForm';
import { SignIn } from '@/components/SignIn';

export default async function Home() {
  const session = await auth();
  return (
    <main className="mx-auto min-h-screen p-24">
      {/* <SignIn /> */}
      <ImageCompositeForm />
    </main>
  );
}
