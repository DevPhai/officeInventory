import { prisma } from "@/lib/prisma";
import EquipmentForm from "@/components/features/EquipmentForm";

export default async function NewEquipmentPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Add New Equipment</h1>
      <EquipmentForm categories={categories} />
    </div>
  );
}
