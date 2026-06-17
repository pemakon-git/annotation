import AuthForm from '../login/AuthForm';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <AuthForm mode="signup" />
    </main>
  );
}
