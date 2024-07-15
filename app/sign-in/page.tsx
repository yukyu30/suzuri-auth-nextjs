import { SignIn } from '@/components/SignIn';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <h2 className="text-3xl font-bold">サインイン</h2>
      <p className="text-sm my-8">
        グッズの作成などを行うため、SUZURIアカウントでの連携が必要です。
      </p>
      <SignIn />
    </div>
  );
}
