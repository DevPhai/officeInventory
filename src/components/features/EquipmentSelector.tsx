"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Package, ArrowRight, ChevronRight, PackageSearch } from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  category: {
    name: string;
  };
}

export default function EquipmentSelector({ equipment }: { equipment: Equipment[] }) {
  const [search, setSearch] = useState("");

  const filtered = equipment.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.sku.toLowerCase().includes(search.toLowerCase()) ||
    item.category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      <header style={{ marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.04em' }}>Select Item</h1>
        <p style={{ color: 'var(--secondary-foreground)', fontWeight: '500', marginTop: '0.25rem' }}>Choose an item from the inventory to borrow.</p>
      </header>

      <div style={{ position: 'relative', marginBottom: '3rem' }}>
        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary-foreground)' }}>
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search by name, SKU, or category..." 
          style={{ paddingLeft: '3rem', fontSize: '1.1rem', height: '3.5rem', boxShadow: 'var(--shadow-sm)' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <PackageSearch size={64} strokeWidth={1} opacity={0.3} style={{ margin: '0 auto 1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>No items found</h3>
          <p style={{ color: 'var(--secondary-foreground)', marginTop: '0.5rem' }}>Try searching with a different keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {filtered.map(item => (
            <Link key={item.id} href={`/inventory/${item.id}/borrow`}>
              <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ background: 'var(--accent-soft)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                    <Package size={20} />
                  </div>
                  <div className={`badge ${item.quantity <= 0 ? 'badge-danger' : ''}`} style={{ background: item.quantity <= 0 ? '#fee2e2' : 'var(--accent-soft)' }}>
                    {item.quantity} available
                  </div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '0.25rem' }}>{item.name}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--secondary-foreground)', fontWeight: '600' }}>
                    {item.category.name} • SKU: {item.sku}
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '0.875rem' }}>
                  Select for Borrowing <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
