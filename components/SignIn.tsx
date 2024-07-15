import { signIn } from '@/auth';
import { Button } from './ui/button';

export function SignIn({ redirect }: { redirect?: string }) {
  return (
    <div>
      <form
        action={async () => {
          'use server';
          await signIn('suzuri');
        }}
      >
        <Button type="submit">Signin with SUZURI</Button>
      </form>
    </div>
  );
}
