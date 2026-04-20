import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: borrowId } = await params;

    const result = await prisma.$transaction(async (tx) => {
      const borrow = await tx.borrowRecord.findUnique({
        where: { id: borrowId },
        include: { equipment: true }
      });

      if (!borrow) throw new Error("Borrow record not found");
      if (borrow.status === "RETURNED") throw new Error("Equipment already returned");

      // 1. Update equipment quantity
      await tx.equipment.update({
        where: { id: borrow.equipmentId },
        data: { quantity: borrow.equipment.quantity + borrow.quantity }
      });

      // 2. Update borrow record
      const updatedBorrow = await tx.borrowRecord.update({
        where: { id: borrowId },
        data: {
          returnDate: new Date(),
          status: "RETURNED"
        }
      });

      // 3. Create transaction log
      await tx.transaction.create({
        data: {
          equipmentId: borrow.equipmentId,
          type: "IN",
          amount: borrow.quantity,
          notes: `Returned by ${borrow.borrowerName}`
        }
      });

      return updatedBorrow;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
