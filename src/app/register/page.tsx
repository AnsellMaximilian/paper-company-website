import { redirect } from "next/navigation";
import { AuthPage } from "@/components/auth-page";
import { getCurrentUser } from "@/lib/session";

export const metadata = { title: "Create account" };

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/shop");
  return <AuthPage mode="register" />;
}
