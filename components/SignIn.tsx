import { signIn } from '@/auth';

export function SignIn() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('suzuri');
      }}
    >
      <button type="submit">Signin with SUZURI</button>
    </form>
  );
}
