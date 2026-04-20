import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Package, 
  List, 
  Activity, 
  ArrowRight, 
  Clock, 
  Plus, 
  History, 
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal
} from "lucide-react";

export default async function DashboardPage() {
  const allEquipment = await prisma.equipment.findMany({
    include: { category: true }
  });
  
  const totalItems = allEquipment.length;
  const categoryCount = await prisma.category.count();
  const activeBorrowsCount = await prisma.borrowRecord.count({
    where: { status: 'BORROWED' }
  });
  
  const lowStockItems = allEquipment.filter(item => item.quantity <= item.minQuantity);
  
  const recentTransactions = await prisma.transaction.findMany({
    take: 6,
    orderBy: { date: 'desc' },
    include: { equipment: true }
  });

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.04em', color: 'var(--foreground)' }}>Overview</h1>
          <p style={{ color: 'var(--secondary-foreground)', marginTop: '0.25rem', fontSize: '1.05rem', fontWeight: '500' }}>System-wide equipment and stock tracking.</p>
        </div>
        <Link href="/inventory/new" className="btn btn-primary">
          <Plus size={16} /> Add Item
        </Link>
      </header>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-4" style={{ marginBottom: '4rem' }}>
        <div className="card">
          <div style={{ color: 'var(--foreground)', marginBottom: '1.25rem', opacity: 0.8 }}>
            <Package size={24} />
          </div>
          <h3 style={{ fontSize: '0.75rem', color: 'var(--secondary-foreground)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Assets</h3>
          <p style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '0.125rem', letterSpacing: '-0.02em' }}>{totalItems.toLocaleString()}</p>
        </div>
        
        <div className="card">
          <div style={{ color: 'var(--foreground)', marginBottom: '1.25rem', opacity: 0.8 }}>
            <Clock size={24} />
          </div>
          <h3 style={{ fontSize: '0.75rem', color: 'var(--secondary-foreground)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Loans</h3>
          <p style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '0.125rem', letterSpacing: '-0.02em' }}>{activeBorrowsCount.toLocaleString()}</p>
        </div>

        <div className="card">
          <div style={{ color: 'var(--foreground)', marginBottom: '1.25rem', opacity: 0.8 }}>
            <Layers size={24} />
          </div>
          <h3 style={{ fontSize: '0.75rem', color: 'var(--secondary-foreground)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Categories</h3>
          <p style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '0.125rem', letterSpacing: '-0.02em' }}>{categoryCount}</p>
        </div>

        <div className="card">
          <div style={{ color: 'var(--foreground)', marginBottom: '1.25rem', opacity: 0.8 }}>
            <Activity size={24} />
          </div>
          <h3 style={{ fontSize: '0.75rem', color: 'var(--secondary-foreground)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Operations</h3>
          <p style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '0.125rem', letterSpacing: '-0.02em' }}>{recentTransactions.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ gap: '2.5rem' }}>
        {/* Low Stock Alerts */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Stock Critical</h2>
            <MoreHorizontal size={20} style={{ color: 'var(--secondary-foreground)', cursor: 'pointer' }} />
          </div>
          
          <div className="card" style={{ padding: '0', overflow: 'hidden', borderColor: '#eef2f6' }}>
            {lowStockItems.length === 0 ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--secondary-foreground)', fontWeight: '600', fontSize: '0.875rem' }}>All stock levels are optimal.</p>
              </div>
            ) : (
              <ul style={{ listStyle: 'none' }}>
                {lowStockItems.map((item, idx) => (
                  <li key={item.id} style={{ 
                    padding: '1.25rem 1.5rem', 
                    borderBottom: idx === lowStockItems.length - 1 ? 'none' : '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background 0.2s ease',
                  }} className="list-item-hover">
                    <div>
                      <h4 style={{ fontWeight: '700', fontSize: '0.9375rem' }}>{item.name}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <span className="badge">{item.category.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--secondary-foreground)', fontWeight: '600' }}>#{item.sku}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        color: 'var(--danger)', 
                        fontWeight: '800', 
                        fontSize: '1.125rem',
                        display: 'block'
                      }}>
                        {item.quantity}
                      </span>
                      <p style={{ fontSize: '0.7rem', color: 'var(--secondary-foreground)', fontWeight: '700', marginTop: '0.125rem' }}>min: {item.minQuantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
              <Link href="/inventory" style={{ color: 'var(--secondary-foreground)', fontWeight: '700', fontSize: '0.8125rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} className="hover-dark">
                View Inventory <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Transactions */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Recent Transactions</h2>
            <History size={18} style={{ color: 'var(--secondary-foreground)', cursor: 'pointer' }} />
          </div>
          
          <div className="card" style={{ padding: '0', overflow: 'hidden', borderColor: '#eef2f6' }}>
            {recentTransactions.length === 0 ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--secondary-foreground)', fontWeight: '600', fontSize: '0.875rem' }}>No recent activity logged.</p>
              </div>
            ) : (
              <ul style={{ listStyle: 'none' }}>
                {recentTransactions.map((tx, idx) => (
                  <li key={tx.id} style={{ 
                    padding: '1.125rem 1.5rem', 
                    borderBottom: idx === recentTransactions.length - 1 ? 'none' : '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem'
                  }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: tx.type === 'IN' ? 'rgba(5, 150, 105, 0.15)' : 'rgba(220, 38, 38, 0.15)',
                      color: tx.type === 'IN' ? 'var(--success)' : 'var(--danger)',
                      transition: 'transform 0.2s ease'
                    }}>
                      {tx.type === 'IN' ? <ArrowDownLeft size={18} strokeWidth={3} /> : <ArrowUpRight size={18} strokeWidth={3} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '700', fontSize: '0.9375rem' }}>{tx.equipment.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--secondary-foreground)', marginTop: '0.125rem', fontWeight: '600' }}>
                        {tx.type === 'IN' ? 'Stock In-take' : tx.notes || 'Dispatched'} • {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ 
                      fontWeight: '800', 
                      color: tx.type === 'IN' ? 'var(--success)' : 'var(--foreground)',
                      fontSize: '0.875rem',
                    }}>
                      {tx.type === 'IN' ? '+' : '-'}{tx.amount}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
              <Link href="/transactions" style={{ color: 'var(--secondary-foreground)', fontWeight: '700', fontSize: '0.8125rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} className="hover-dark">
                All Activity <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


