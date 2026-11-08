import { redirect } from "next/navigation";
import { AuthPage } from "@/components/auth-page";
import { getCurrentUser } from "@/lib/session";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/shop");
  return <AuthPage mode="login" />;
}
