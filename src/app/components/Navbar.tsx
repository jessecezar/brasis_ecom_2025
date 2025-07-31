import Link from "next/link";
import { SignIn, SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

function Navbar() {
  return (
    <nav className="fixed top-0 w-full flex items-center py-2 px-8 justify-between z-50 bg-slate-800 text-gray-300">
      <Link
        href="/"
        className="uppercase text-md font-bold h-12 flex items-center"
      >
        Brasis
      </Link>
      <div className="flex items-center gap-8">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-teal-600 text-white px-4 py-2 rounded">
              Fazer Login
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}

export default Navbar;