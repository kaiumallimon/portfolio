import { Suspense } from "react";
import ResetPasswordForm from "./reset-form";

export const dynamic = "force-dynamic";

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
