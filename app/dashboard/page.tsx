//dashboard/page.tsx
import { getOrCreateUser } from "@/lib/user";
import { redirect } from "next/navigation";
import DashboardContent from "./DashboardContent";

export default async function DashboardPage() {
  const user = await getOrCreateUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  const isProfileComplete = 
    user.fullName &&
    user.experience &&
    user.roles.length > 0 &&
    user.skills.length > 0;

  if (!isProfileComplete) {
    redirect("/onboarding");
  }

  return <DashboardContent user={user} />;
}