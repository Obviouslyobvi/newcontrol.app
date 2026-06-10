import { Suspense } from "react";
import type { Metadata } from "next";
import AuthForm from "../components/AuthForm";

export const metadata: Metadata = { title: "Start free trial — NewControl" };

export default function SignUpPage() {
  return (
    <Suspense>
      <AuthForm mode="sign-up" />
    </Suspense>
  );
}
