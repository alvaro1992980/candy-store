"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { verifyAdminPassword } from "@/lib/auth/password";

export async function login(_prevState: { error: string } | undefined, formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!(await verifyAdminPassword(password))) {
    return { error: "Contraseña incorrecta" };
  }

  const session = await getSession();
  session.isAdmin = true;
  await session.save();
  redirect("/admin");
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/");
}
