import { prisma } from "@/lib/prisma";
import EquipmentSelector from "@/components/features/EquipmentSelector";

export default async function BorrowSelectPage() {
  const equipment = await prisma.equipment.findMany({
    include: {
      category: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return <EquipmentSelector equipment={equipment} />;
}
