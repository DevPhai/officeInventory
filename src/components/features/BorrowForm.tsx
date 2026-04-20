'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
      <h3 style={{ marginBottom: '1rem' }}>Borrow Item</h3>
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label>Borrower Name *</label>
          <input name="borrowerName" required placeholder="Who is borrowing?" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label>Quantity *</label>
            <input name="quantity" type="number" min="1" max={maxQuantity} required defaultValue={1} />
          </div>
          <div>
            <label>Due Date (Optional)</label>
            <input name="dueDate" type="date" />
          </div>
        </div>

        <button type="submit" disabled={loading || maxQuantity <= 0} className="btn" style={{ width: '100%', background: 'var(--accent)', color: 'white' }}>
          {maxQuantity <= 0 ? 'Out of Stock' : loading ? 'Processing...' : 'Confirm Borrow'}
        </button>
      </form>
    </div>
  );
}
