import { Metadata } from "next";
import { auth } from "@/auth";
import ProfilePageClient from "./profile-client";

export const metadata: Metadata = {
  title: "Customer Profile",
};

const Profile = async () => {
  const session = await auth();

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="h2-bold">Profile</h2>
      <ProfilePageClient session={session} />
    </div>
  );
};

export default Profile;
