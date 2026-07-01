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

  return <AuthForm mode="login" notice={notice} />;
}
