import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const stockSchema = z.object({
  type: z.enum(['IN', 'OUT']),
  amount: z.number().int().positive(),
  notes: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { type, amount, notes } = stockSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      const equipment = await tx.equipment.findUnique({
        where: { id }
      });

      if (!equipment) throw new Error("Equipment not found");

      const newQuantity = type === 'IN' 
        ? equipment.quantity + amount 
        : equipment.quantity - amount;

      if (newQuantity < 0) throw new Error("Insufficient stock");

      const updated = await tx.equipment.update({
        where: { id },
        data: { quantity: newQuantity }
      });

      await tx.transaction.create({
        data: {
          equipmentId: id,
          type,
          amount,
          notes: notes || `Stock ${type}`
        }
      });

      return updated;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
