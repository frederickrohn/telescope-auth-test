"use client";

import { useEffect, useState } from "react";
import { signInPath } from "@/lib/auth-paths";

// A native form POST (no fetch, no server action): the browser follows Auth.js's 302 to github.com itself.
export function SignInButton() {
  const [csrfToken, setCsrfToken] = useState<string>();
  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((r) => r.json())
      .then((d) => setCsrfToken(d.csrfToken));
  }, []);
  return (
    <form method="post" action={signInPath}>
      <input type="hidden" name="csrfToken" value={csrfToken ?? ""} />
      <input type="hidden" name="callbackUrl" value="/dashboard" />
      <button type="submit" className="btn" disabled={!csrfToken}>
        Sign in with GitHub
      </button>
    </form>
  );
}
