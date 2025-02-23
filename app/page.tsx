import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { AudioFilesForm } from './components/AudioFilesForm';

export default function Home() {
  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <header className="flex justify-between items-center h-18 mb-8">
        <h1 className="text-3xl font-semibold">t-scribe</h1>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <SignedOut>
        <SignInButton />
      </SignedOut>

      <SignedIn>
        <AudioFilesForm />
      </SignedIn>
    </div>
  );
}
