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
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => setType('IN')}
          className="btn"
          style={{ 
            flex: 1, 
            background: type === 'IN' ? '#16a34a' : 'transparent',
            color: type === 'IN' ? 'white' : 'var(--foreground)',
            border: `1px solid ${type === 'IN' ? '#16a34a' : 'var(--border)'}`
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
            background: type === 'OUT' ? 'var(--danger)' : 'transparent',
            color: type === 'OUT' ? 'white' : 'var(--foreground)',
            border: `1px solid ${type === 'OUT' ? 'var(--danger)' : 'var(--border)'}`
          }}
        >
          Stock OUT (-)
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Amount</label>
        <input
          name="amount"
          type="number"
          min="1"
          required
          placeholder="Enter amount"
          style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Notes</label>
        <input
          name="notes"
          type="text"
          placeholder="Reason for adjustment"
          style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
        />
      </div>

      <button 
        type="submit" 
        disabled={loading} 
        className="btn btn-primary" 
        style={{ width: '100%', background: type === 'IN' ? '#16a34a' : 'var(--danger)' }}
      >
        {loading ? 'Processing...' : `Confirm Stock ${type}`}
      </button>
    </form>
  );
}
