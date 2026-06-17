import AuthForm from './AuthForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ checkEmail?: string; error?: string }>;
}) {
  const { checkEmail, error } = await searchParams;
  const notice = checkEmail
    ? 'Account created! Check your email to confirm, then sign in.'
    : error === 'confirm'
      ? undefined
      : undefined;

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <AuthForm mode="login" notice={notice} />
    </main>
  );
}
