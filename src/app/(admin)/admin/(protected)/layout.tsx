import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { logout } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.isAdmin) redirect("/admin/login");

  return (
    <div className="mx-auto min-h-screen w-full max-w-110 bg-[#fbf7f0] px-4.5 py-4 text-stone-900">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-(family-name:--font-baloo) text-[19px] font-extrabold">
          Panel de administrador
        </span>
        <form action={logout}>
          <button type="submit" className="text-[12.5px] font-bold text-stone-500">
            Salir
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
