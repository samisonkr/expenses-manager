
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PiggyBank } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';

export default function LoginPage() {
  const router = useRouter();
  const { loading, signInWithGoogle, continueAsGuest } = useAuth();

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <PiggyBank className="h-12 w-12 animate-bounce" />
                <p>Loading your financial dashboard...</p>
            </div>
        </div>
    );
  }

  const handleGuestLogin = () => {
    continueAsGuest();
    router.push('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <PiggyBank className="h-8 w-8" />
          </div>
          <CardTitle className="font-headline text-2xl">Welcome to Expenses Manager</CardTitle>
          <CardDescription>Sign in or continue as a guest to manage your finances.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={signInWithGoogle} className="w-full">
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 62.3l-66.5 64.6C305.5 99.6 277.8 88 248 88c-77.4 0-140.3 62.9-140.3 140.3s62.9 140.3 140.3 140.3c84.3 0 116.6-63.2 120.3-95.7H248V256h239.8c.6 9.5 1.2 19.1 1.2 29.8z"></path></svg>
            Sign in with Google
          </Button>
          <Button onClick={handleGuestLogin} variant="secondary" className="w-full">
            Continue as Guest
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
