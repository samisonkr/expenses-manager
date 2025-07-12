
"use client";

import { AlertCircle } from "lucide-react";
import { useAuth } from "../auth/auth-provider";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useToast } from "@/hooks/use-toast";

export function SyncToFirebase() {
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async () => {
    try {
        await signInWithGoogle();
        toast({
            title: "Sync Successful!",
            description: "Your data has been saved to your Google account."
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Sign in failed",
            description: "Could not sign in with Google. Please try again."
        })
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Save Your Data</CardTitle>
        <CardDescription>
          You are currently using the app as a guest. Your data is stored only in this browser and will be lost if you clear your browser data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
            Sign in with your Google account to securely save your data and access it from any device.
        </p>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            Signing in will migrate all your current guest data to your account.
          </AlertDescription>
        </Alert>
        <Button onClick={handleSignIn}>
          Sign in with Google to Save
        </Button>
      </CardContent>
    </Card>
  );
}
