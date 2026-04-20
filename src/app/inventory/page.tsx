import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, HandHelping, Settings2, PackageSearch } from "lucide-react";

export default async function InventoryPage() {
  const equipment = await prisma.equipment.findMany({
    include: {
      category: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.04em' }}>Inventory</h1>
          <p style={{ color: 'var(--secondary-foreground)', fontWeight: '500', marginTop: '0.25rem' }}>Manage and track all office equipment.</p>
        </div>
        <Link href="/inventory/new" className="btn btn-primary">
          <Plus size={16} /> Add Equipment
        </Link>
      </header>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Item Details</th>
                <th>Category</th>
                <th style={{ textAlign: 'center' }}>Stock</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipment.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '4rem', textAlign: 'center' }}>
                    <div style={{ color: 'var(--secondary-foreground)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <PackageSearch size={48} strokeWidth={1.5} opacity={0.5} />
                      <p style={{ fontWeight: '600' }}>No equipment found in the inventory.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                equipment.map((item) => (
                  <tr key={item.id} className="list-item-hover">
                    <td>
                      <div style={{ fontWeight: '700', fontSize: '0.9375rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--secondary-foreground)', fontWeight: '600', marginTop: '0.125rem' }}>SKU: {item.sku}</div>
                    </td>
                    <td>
                      <span className="badge">{item.category.name}</span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '700' }}>{item.quantity}</td>
                    <td>
                      {item.quantity <= item.minQuantity ? (
                        <span className="badge" style={{ background: '#fee2e2', color: 'var(--danger)' }}>
                          Low Stock
                        </span>
                      ) : (
                        <span className="badge" style={{ background: '#dcfce7', color: 'var(--success)' }}>
                          In Stock
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Link 
                          href={`/inventory/${item.id}/borrow`} 
                          className="btn btn-secondary" 
                          style={{ padding: '0.5rem', borderRadius: '0.5rem' }}
                          title="Borrow Item"
                        >
                          <HandHelping size={18} />
                        </Link>
                        <Link 
                          href={`/inventory/${item.id}`} 
                          className="btn btn-secondary" 
                          style={{ padding: '0.5rem', borderRadius: '0.5rem' }}
                          title="Edit / View Details"
                        >
                          <Settings2 size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
