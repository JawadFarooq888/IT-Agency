"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { loginAction } from "@/app/admin/actions/auth";
import { buttonClasses } from "@/components/ui/button-styles";
import { inputClass, labelClass } from "@/components/ui/form-styles";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, {});
  return (
    <form action={action} className="mt-6 space-y-5">
      <input type="hidden" name="next" value={next} />
      {state.error && (
        <p role="alert" className="flex gap-2 rounded-btn border border-red-200 bg-red-50 p-3 text-[15px] text-red-800">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" /> {state.error}
        </p>
      )}
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>
      <button type="submit" disabled={pending} className={buttonClasses("primary", "md", "w-full")}>
        {pending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
        {pending ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
