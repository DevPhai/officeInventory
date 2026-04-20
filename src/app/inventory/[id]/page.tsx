import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StockAdjustmentForm from "@/components/features/StockAdjustmentForm";
import EquipmentForm from "@/components/features/EquipmentForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.equipment.findUnique({
    where: { id },
    include: {
      category: true,
      transactions: {
        orderBy: { date: 'desc' },
        take: 5
      },
      borrows: {
        where: { status: 'BORROWED' },
        orderBy: { borrowDate: 'desc' }
      }
    }
  });

  if (!item) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div>
      <Link href="/inventory" className="btn btn-secondary" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Back to Inventory
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.04em' }}>{item.name}</h1>
          <p style={{ color: 'var(--secondary-foreground)', fontWeight: '600' }}>SKU: {item.sku} • {item.category.name}</p>
        </div>
        <div className="card" style={{ padding: '1rem 2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--secondary-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available Stock</p>
          <p style={{ fontSize: '2rem', fontWeight: '800', color: item.quantity <= item.minQuantity ? 'var(--danger)' : 'var(--foreground)', marginTop: '0.125rem' }}>{item.quantity}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2" style={{ gap: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Stock Management</h2>
            <StockAdjustmentForm equipmentId={item.id} currentQuantity={item.quantity} />
          </div>
          
          <div>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Item Details</h2>
            <EquipmentForm 
              categories={categories} 
              initialData={{
                id: item.id,
                name: item.name,
                sku: item.sku,
                description: item.description,
                quantity: item.quantity,
                minQuantity: item.minQuantity,
                categoryId: item.categoryId
              }} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Active Loans</h2>
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
              {item.borrows.length === 0 ? (
                <p style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--secondary-foreground)', fontWeight: '600' }}>No active borrows.</p>
              ) : (
                <ul style={{ listStyle: 'none' }}>
                  {item.borrows.map((borrow, idx) => (
                    <li key={borrow.id} style={{ 
                      padding: '1.25rem 1.5rem', 
                      borderBottom: idx === item.borrows.length - 1 ? 'none' : '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <p style={{ fontWeight: '700', fontSize: '0.9375rem' }}>{borrow.borrowerName}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--secondary-foreground)', fontWeight: '600', marginTop: '0.125rem' }}>
                          Qty: {borrow.quantity} • Since {borrow.borrowDate.toLocaleDateString()}
                        </p>
                      </div>
                      {borrow.dueDate && (
                        <div style={{ textAlign: 'right' }}>
                          <span className="badge" style={{ 
                            background: new Date() > borrow.dueDate ? '#fee2e2' : 'var(--accent-soft)',
                            color: new Date() > borrow.dueDate ? 'var(--danger)' : 'var(--accent)'
                          }}>
                            Due: {borrow.dueDate.toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Transaction History</h2>
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <div className="table-container">
                <table style={{ border: 'none' }}>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th style={{ textAlign: 'right' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>
                          <span style={{ 
                            color: tx.type === 'IN' ? 'var(--success)' : 'var(--danger)', 
                            fontWeight: '800',
                            fontSize: '0.75rem'
                          }}>
                            {tx.type}
                          </span>
                        </td>
                        <td style={{ fontWeight: '700' }}>{tx.amount}</td>
                        <td style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--secondary-foreground)', fontWeight: '600' }}>
                          {tx.date.toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
