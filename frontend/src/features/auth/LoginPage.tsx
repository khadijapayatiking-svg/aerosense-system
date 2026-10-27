import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/features/auth/AuthProvider";

const loginSchema = z.object({
  username: z.string().min(1, "Enter your username."),
  password: z.string().min(1, "Enter your password."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface RedirectLocation {
  pathname: string;
  search?: string;
  hash?: string;
}

function getLoginErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      { detail?: unknown; non_field_errors?: unknown } | undefined;

    if (typeof data?.detail === "string" && data.detail.trim()) {
      return data.detail;
    }

    if (
      Array.isArray(data?.non_field_errors) &&
      typeof data.non_field_errors[0] === "string"
    ) {
      return data.non_field_errors[0];
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Unable to sign in. Check your credentials and try again.";
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const from = (location.state as { from?: RedirectLocation } | null)?.from;
  const redirectTo = from
    ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
    : "/";

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      await login(values);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(getLoginErrorMessage(error));
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4 py-12">
      <main className="w-full max-w-sm">
        <Card className="p-6">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-surface-inverse">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-earth-600">
            Use your AeroSense account to continue.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-surface-inverse"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                aria-invalid={errors.username ? true : undefined}
                aria-describedby={
                  errors.username ? "username-error" : undefined
                }
                className="mt-1 block w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-surface-inverse shadow-sm transition-colors focus:border-canopy-500 focus:ring-2 focus:ring-canopy-500 focus:outline-none"
                {...register("username")}
              />
              {errors.username && (
                <p id="username-error" className="mt-1 text-sm text-red-700">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-surface-inverse"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className="mt-1 block w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-surface-inverse shadow-sm transition-colors focus:border-canopy-500 focus:ring-2 focus:ring-canopy-500 focus:outline-none"
                {...register("password")}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-700">
                  {errors.password.message}
                </p>
              )}
            </div>

            {formError && (
              <p
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              >
                {formError}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
