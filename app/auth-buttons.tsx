"use client";

import { SignInButton, SignOutButton } from "@clerk/nextjs";

// Two Clerk sign-in paths to compare: the in-page modal, and the hosted Account Portal on *.accounts.dev.
export function SignInButtons() {
  return (
    <div className="flex flex-col gap-3">
      <SignInButton mode="modal" forceRedirectUrl="/dashboard">
        <button type="button" className="btn">Sign in (Clerk modal)</button>
      </SignInButton>
      <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
        <button type="button" className="btn btn-secondary">Sign in (Account Portal)</button>
      </SignInButton>
    </div>
  );
}

export function SignOut() {
  return (
    <SignOutButton redirectUrl="/">
      <button type="button" className="btn btn-secondary w-auto">Sign out</button>
    </SignOutButton>
  );
}
