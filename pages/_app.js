import '../styles/globals.css'
import { SemesterProvider } from "../context/SemesterContext";
import Navbar from "../components/navbar";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn
} from '@clerk/nextjs';

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <SignedIn>
        <SemesterProvider>
          <Navbar />
          <Component {...pageProps} />
        </SemesterProvider>
      </SignedIn>
      <SignedOut>
        <div className='w-full h-screen flex justify-center items-center'>
          <SignIn routing='virtual' />
        </div>
      </SignedOut>
    </ClerkProvider>
  );
}

export default MyApp;
