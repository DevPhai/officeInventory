'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface StockAdjustmentFormProps {
  equipmentId: string;
  currentQuantity: number;
}

export default function StockAdjustmentForm({ equipmentId, currentQuantity }: StockAdjustmentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'IN' | 'OUT'>('OUT');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const amount = parseInt(formData.get('amount') as string);
    const notes = formData.get('notes') as string;

    if (type === 'OUT' && amount > currentQuantity) {
      alert('Cannot remove more than current stock');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/equipment/${equipmentId}/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, amount, notes }),
      });

      if (!response.ok) throw new Error('Failed to update stock');

      router.refresh();
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      alert('Error updating stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => setType('IN')}
          className="btn"
          style={{ 
            flex: 1, 
            background: type === 'IN' ? 'var(--success)' : 'var(--accent-soft)',
            color: type === 'IN' ? 'white' : 'var(--foreground)',
          }}
        >
          Stock IN (+)
        </button>
        <button
          type="button"
          onClick={() => setType('OUT')}
          className="btn"
          style={{ 
            flex: 1, 
            background: type === 'OUT' ? 'var(--danger)' : 'var(--accent-soft)',
            color: type === 'OUT' ? 'white' : 'var(--foreground)',
          }}
        >
          Stock OUT (-)
        </button>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label>Amount</label>
        <input
          name="amount"
          type="number"
          min="1"
          required
          placeholder="0"
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label>Adjustment Notes</label>
        <input
          name="notes"
          type="text"
          placeholder="e.g. Restock from supplier"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading} 
        className="btn btn-primary" 
        style={{ width: '100%' }}
      >
        {loading ? 'Processing...' : `Confirm Stock ${type}`}
      </button>
    </form>
  );
}
