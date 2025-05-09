import { ProcessStoreProvider } from '@/providers/process-store-provider';
import { SignInButton, SignedIn, SignedOut, UserButton, useSignIn } from '@clerk/nextjs';
import { AudioFilesForm } from './components/AudioFilesForm';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  return (
    <>
      <Toaster />
      <ProcessStoreProvider>
        <div className="container mx-auto px-4 max-w-2xl">
          <header className="flex justify-between items-center h-18 mb-8">
            <h1 className="text-3xl font-semibold">t-scribe</h1>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>

          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <AudioFilesForm />
          </SignedIn>
        </div>
      </ProcessStoreProvider>
    </>
  );
}
