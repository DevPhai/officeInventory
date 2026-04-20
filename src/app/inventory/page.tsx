import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Inventory Management</h1>
        <Link href="/inventory/new" className="btn btn-primary">
          Add Equipment
        </Link>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '1rem' }}>SKU</th>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Quantity</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipment.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>No equipment found.</td>
              </tr>
            ) : (
              equipment.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{item.sku}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.description}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{item.category.name}</td>
                  <td style={{ padding: '1rem' }}>{item.quantity}</td>
                  <td style={{ padding: '1rem' }}>
                    {item.quantity <= item.minQuantity ? (
                      <span style={{ 
                        background: '#fee2e2', 
                        color: '#991b1b', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        Low Stock
                      </span>
                    ) : (
                      <span style={{ 
                        background: '#dcfce7', 
                        color: '#166534', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        In Stock
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Link href={`/inventory/${item.id}/borrow`} style={{ color: 'var(--accent)', marginRight: '1rem', fontWeight: '600' }}>
                      Borrow
                    </Link>
                    <Link href={`/inventory/${item.id}`} style={{ color: 'var(--primary)' }}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
