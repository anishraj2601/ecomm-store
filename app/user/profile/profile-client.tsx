"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import ProfileForm from "./profile-form";

type Props = {
  session: Session | null;
};

export default function ProfilePageClient({ session }: Props) {
  return (
    <SessionProvider session={session}>
      <ProfileForm />
    </SessionProvider>
  );
}
