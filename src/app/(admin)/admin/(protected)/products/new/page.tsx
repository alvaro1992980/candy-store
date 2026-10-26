import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/actions/products";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-4">
      <span className="font-(family-name:--font-baloo) text-[17px] font-bold">Nuevo producto</span>
      <ProductForm action={createProduct} />
    </div>
  );
}
