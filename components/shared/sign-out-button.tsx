"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  async function handleSignOut() {
    // redirect handled by next-auth; you can pass callbackUrl, e.g. { callbackUrl: '/' }
    await signOut({ callbackUrl: "/" });
  }

  return (
    <Button onClick={handleSignOut} className="w-full py-4 px-2 h-4 justify-start" variant="ghost">
      Sign Out
    </Button>
  );
}