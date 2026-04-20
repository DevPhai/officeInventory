import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AlertTriangle, Package, List, Activity, ArrowRight, Clock } from "lucide-react";

export default async function DashboardPage() {
  const allEquipment = await prisma.equipment.findMany({
    include: { category: true }
  });
  
  const totalItems = allEquipment.length;
  const categoryCount = await prisma.category.count();
  const activeBorrowsCount = await prisma.borrowRecord.count({
    where: { status: 'BORROWED' }
  });
  
  // Identify low stock items
  const lowStockItems = allEquipment.filter(item => item.quantity <= item.minQuantity);
  
  const recentTransactions = await prisma.transaction.findMany({
    take: 8,
    orderBy: { date: 'desc' },
    include: { equipment: true }
  });

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.025em' }}>Dashboard</h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>Welcome to your office equipment overview.</p>
      </header>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 grid-cols-4" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '1rem', color: 'var(--primary)' }}>
            <Package size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.7rem', color: '#666', fontWeight: '600', textTransform: 'uppercase' }}>Items</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '800' }}>{totalItems}</p>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--accent)' }}>
          <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '1rem', color: 'var(--accent)' }}>
            <Clock size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.7rem', color: '#666', fontWeight: '600', textTransform: 'uppercase' }}>Borrowed</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '800' }}>{activeBorrowsCount}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ background: '#f5f3ff', padding: '0.75rem', borderRadius: '1rem', color: '#8b5cf6' }}>
            <List size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.7rem', color: '#666', fontWeight: '600', textTransform: 'uppercase' }}>Cats</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '800' }}>{categoryCount}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #ec4899' }}>
          <div style={{ background: '#fdf2f8', padding: '0.75rem', borderRadius: '1rem', color: '#ec4899' }}>
            <Activity size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.7rem', color: '#666', fontWeight: '600', textTransform: 'uppercase' }}>Activity</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '800' }}>{recentTransactions.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 grid-cols-2" style={{ alignItems: 'start' }}>
        {/* Low Stock Alerts */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <AlertTriangle color="var(--danger)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Low Stock Alerts</h2>
          </div>
          
          <div className="card" style={{ padding: '0' }}>
            {lowStockItems.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                <p>All items are sufficiently stocked.</p>
              </div>
            ) : (
              <ul style={{ listStyle: 'none' }}>
                {lowStockItems.map((item, idx) => (
                  <li key={item.id} style={{ 
                    padding: '1.25rem', 
                    borderBottom: idx === lowStockItems.length - 1 ? 'none' : '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ fontWeight: '700' }}>{item.name}</h4>
                      <p style={{ fontSize: '0.875rem', color: '#666' }}>SKU: {item.sku} • {item.category.name}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        color: 'var(--danger)', 
                        fontWeight: '800', 
                        fontSize: '1.25rem',
                        display: 'block'
                      }}>
                        {item.quantity}
                      </span>
                      <p style={{ fontSize: '0.75rem', color: '#666' }}>min: {item.minQuantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', textAlign: 'center', background: '#fafafa' }}>
              <Link href="/inventory" style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                Manage Inventory <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Transactions */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Activity color="var(--primary)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Recent Activity</h2>
          </div>
          
          <div className="card" style={{ padding: '0' }}>
            {recentTransactions.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No recent activity</p>
            ) : (
              <ul style={{ listStyle: 'none' }}>
                {recentTransactions.map((tx, idx) => (
                  <li key={tx.id} style={{ 
                    padding: '1rem 1.25rem', 
                    borderBottom: idx === recentTransactions.length - 1 ? 'none' : '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: tx.type === 'IN' ? '#22c55e' : '#ef4444' 
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600' }}>{tx.equipment.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#666' }}>{tx.date.toLocaleDateString()} • {tx.notes || (tx.type === 'IN' ? 'Stock Added' : 'Stock Removed')}</p>
                    </div>
                    <div style={{ 
                      fontWeight: '700', 
                      color: tx.type === 'IN' ? '#16a34a' : '#dc2626'
                    }}>
                      {tx.type === 'IN' ? '+' : '-'}{tx.amount}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', textAlign: 'center', background: '#fafafa' }}>
              <Link href="/transactions" style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                View All History <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
