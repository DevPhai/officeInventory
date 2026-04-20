import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const equipmentSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  description: z.string().optional().nullable(),
  quantity: z.number().min(0),
  minQuantity: z.number().min(0),
  categoryId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = equipmentSchema.parse(body);

    // Check if SKU already exists
    const existing = await prisma.equipment.findUnique({
      where: { sku: data.sku }
    });

    if (existing) {
      return NextResponse.json(
        { error: "Equipment with this SKU already exists" },
        { status: 400 }
      );
    }

    const equipment = await prisma.equipment.create({
      data: {
        ...data,
        description: data.description || null,
        // When creating new equipment, also create an initial 'IN' transaction
        transactions: {
          create: {
            type: 'IN',
            amount: data.quantity,
            notes: 'Initial stock'
          }
        }
      }
    });

    return NextResponse.json(equipment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status:400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  const equipment = await prisma.equipment.findMany({
    include: { category: true },
    orderBy: { updatedAt: 'desc' }
  });
  return NextResponse.json(equipment);
}
