"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        autoFocus
        className="rounded-2xl border-[1.5px] border-stone-900/10 bg-white px-3.5 py-3 text-[15px] outline-none"
      />
      {state?.error && <span className="text-[13px] font-bold text-rose-600">{state.error}</span>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-2xl bg-stone-900 py-3 text-[14px] font-bold text-white disabled:opacity-50"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
