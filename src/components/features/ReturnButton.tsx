'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReturnButton({ borrowId }: { borrowId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleReturn = async () => {
    if (!confirm('Are you sure you want to mark this item as returned?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/borrow/${borrowId}/return`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to process return');

      router.refresh();
    } catch (err) {
      alert('Error processing return');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleReturn} 
      disabled={loading}
      className="btn btn-primary"
      style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', background: '#16a34a' }}
    >
      {loading ? '...' : 'Mark Returned'}
    </button>
  );
}
