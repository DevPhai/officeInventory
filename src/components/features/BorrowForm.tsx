'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HandHelping, Calendar, User, Hash } from 'lucide-react';

interface BorrowFormProps {
  equipmentId: string;
  maxQuantity: number;
}

export default function BorrowForm({ equipmentId, maxQuantity }: BorrowFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      equipmentId,
      borrowerName: formData.get('borrowerName'),
      quantity: parseInt(formData.get('quantity') as string),
      dueDate: formData.get('dueDate') || null,
    };

    if (data.quantity > maxQuantity) {
      setError(`Cannot borrow more than available stock (${maxQuantity})`);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to process borrow');
      }

      router.push('/inventory');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ borderLeft: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--accent-soft)', padding: '0.5rem', borderRadius: '0.5rem' }}>
          <HandHelping size={20} />
        </div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Borrow Item</h3>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ background: 'var(--danger)', color: 'white', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.8125rem', fontWeight: '600' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={14} /> Borrower Name *
          </label>
          <input name="borrowerName" required placeholder="Full Name" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Hash size={14} /> Quantity *
            </label>
            <input name="quantity" type="number" min="1" max={maxQuantity} required defaultValue={1} />
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={14} /> Due Date
            </label>
            <input name="dueDate" type="date" />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || maxQuantity <= 0} 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '1rem', fontSize: '0.875rem' }}
        >
          {maxQuantity <= 0 ? 'Out of Stock' : loading ? 'Processing...' : 'Confirm Borrow'}
        </button>
      </form>
    </div>
  );
}
