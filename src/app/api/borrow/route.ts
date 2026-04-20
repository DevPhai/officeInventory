import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const borrowSchema = z.object({
  equipmentId: z.string().min(1),
  borrowerName: z.string().min(1),
  quantity: z.number().int().positive(),
  dueDate: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { equipmentId, borrowerName, quantity, dueDate } = borrowSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      const equipment = await tx.equipment.findUnique({
        where: { id: equipmentId }
      });

      if (!equipment) throw new Error("Equipment not found");
      if (equipment.quantity < quantity) throw new Error("Insufficient stock available");

      // 1. Update equipment quantity
      await tx.equipment.update({
        where: { id: equipmentId },
        data: { quantity: equipment.quantity - quantity }
      });

      // 2. Create borrow record
      const borrow = await tx.borrowRecord.create({
        data: {
          equipmentId,
          borrowerName,
          quantity,
          dueDate: dueDate ? new Date(dueDate) : null,
          status: "BORROWED"
        }
      });

      // 3. Create transaction log
      await tx.transaction.create({
        data: {
          equipmentId,
          type: "OUT",
          amount: quantity,
          notes: `Borrowed by ${borrowerName}`
        }
      });

      return borrow;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  const borrows = await prisma.borrowRecord.findMany({
    include: { equipment: true },
    orderBy: { borrowDate: 'desc' }
  });
  return NextResponse.json(borrows);
}
