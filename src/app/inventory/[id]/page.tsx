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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>{item.name}</h1>
          <p style={{ color: '#666' }}>SKU: {item.sku} • {item.category.name}</p>
        </div>
        <div className="card" style={{ padding: '0.75rem 1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' }}>Available Stock</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '800', color: item.quantity <= item.minQuantity ? 'var(--danger)' : 'var(--primary)' }}>{item.quantity}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 grid-cols-2" style={{ gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '700' }}>Management</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <StockAdjustmentForm equipmentId={item.id} currentQuantity={item.quantity} />
            </div>
          </div>
          
          <div>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '700' }}>Edit Details</h2>
            <EquipmentForm categories={categories} initialData={item} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '700' }}>Active Borrows</h2>
            <div className="card" style={{ padding: '0' }}>
              {item.borrows.length === 0 ? (
                <p style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No active borrows.</p>
              ) : (
                <ul style={{ listStyle: 'none' }}>
                  {item.borrows.map((borrow, idx) => (
                    <li key={borrow.id} style={{ 
                      padding: '1rem', 
                      borderBottom: idx === item.borrows.length - 1 ? 'none' : '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <p style={{ fontWeight: '700' }}>{borrow.borrowerName}</p>
                        <p style={{ fontSize: '0.75rem', color: '#666' }}>
                          Qty: {borrow.quantity} • Since {borrow.borrowDate.toLocaleDateString()}
                        </p>
                      </div>
                      {borrow.dueDate && (
                        <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
                          <p style={{ fontWeight: '600', color: new Date() > borrow.dueDate ? 'var(--danger)' : '#666' }}>
                            Due: {borrow.dueDate.toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '700' }}>Recent History</h2>
            <div className="card" style={{ padding: '0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem' }}>Type</th>
                    <th style={{ padding: '1rem' }}>Amount</th>
                    <th style={{ padding: '1rem' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {item.transactions.map((tx) => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ color: tx.type === 'IN' ? 'green' : 'red', fontWeight: 'bold' }}>
                          {tx.type}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>{tx.amount}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{tx.date.toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
