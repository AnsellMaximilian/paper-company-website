import { FileText, ShieldCheck, Truck } from "lucide-react";
import { AuthForm } from "@/components/auth-form";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const registering = mode === "register";
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <span className="eyebrow">Customer account</span>
        <h1>{registering ? "Let's put your name on the route." : "Welcome back to Scranton."}</h1>
        <p>
          {registering
            ? "Save your cart, see previous orders, and make the next supply run much faster."
            : "Sign in to continue your order, check your cart, or revisit past paper victories."}
        </p>
        <AuthForm mode={mode} />
      </div>
      <aside className="auth-aside">
        <div className="auth-aside-sign">
          <small>Michael Scott</small>
          <strong>Paper Company</strong>
        </div>
        <div className="auth-benefits">
          <span><Truck /><b>Free delivery over $50</b></span>
          <span><FileText /><b>Order history in one place</b></span>
          <span><ShieldCheck /><b>Secure, private account</b></span>
        </div>
        <blockquote>“The people person’s paper people.”</blockquote>
      </aside>
    </div>
  );
}
