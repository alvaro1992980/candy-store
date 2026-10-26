import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-110 flex-col justify-center gap-6 bg-[#fbf7f0] px-6 text-stone-900">
      <div className="flex flex-col gap-1">
        <span className="font-(family-name:--font-baloo) text-[22px] font-extrabold">
          Modo administrador
        </span>
        <span className="text-[13px] text-stone-500">Ingresá la contraseña para gestionar el catálogo.</span>
      </div>
      <AdminLoginForm />
    </div>
  );
}
