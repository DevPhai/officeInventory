import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BorrowForm from "@/components/features/BorrowForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function BorrowItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.equipment.findUnique({
    where: { id },
    include: {
      category: true,
    }
  });

  if (!item) {
    notFound();
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Link href="/inventory" className="btn btn-secondary" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Back to Inventory
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Borrow Item</h1>
        <p style={{ color: '#666' }}>{item.name} • SKU: {item.sku}</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' }}>Available Stock</p>
          <p style={{ fontSize: '1.25rem', fontWeight: '800', color: item.quantity <= item.minQuantity ? 'var(--danger)' : 'var(--primary)' }}>{item.quantity} units</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' }}>Category</p>
          <p style={{ fontWeight: '600' }}>{item.category.name}</p>
        </div>
      </div>

      <BorrowForm equipmentId={item.id} maxQuantity={item.quantity} />
    </div>
  );
}
