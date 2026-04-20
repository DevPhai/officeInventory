'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
}

interface EquipmentFormProps {
  categories: Category[];
  initialData?: {
    id: string;
    name: string;
    sku: string;
    description: string | null;
    quantity: number;
    minQuantity: number;
    categoryId: string;
  };
}

export default function EquipmentForm({ categories, initialData }: EquipmentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      sku: formData.get('sku'),
      description: formData.get('description'),
      quantity: parseInt(formData.get('quantity') as string),
      minQuantity: parseInt(formData.get('minQuantity') as string),
      categoryId: formData.get('categoryId'),
    };

    try {
      const url = initialData ? `/api/equipment/${initialData.id}` : '/api/equipment';
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Something went wrong');
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
    <form onSubmit={handleSubmit} method="POST" className="card">
      {error && (
        <div style={{ background: 'var(--danger)', color: 'white', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.8125rem', fontWeight: '600' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <div>
          <label>SKU *</label>
          <input
            name="sku"
            defaultValue={initialData?.sku}
            required
            placeholder="e.g. LAP-001"
          />
        </div>
        <div>
          <label>Item Name *</label>
          <input
            name="name"
            defaultValue={initialData?.name}
            required
            placeholder="e.g. MacBook Pro"
          />
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label>Category *</label>
        <select
          name="categoryId"
          defaultValue={initialData?.categoryId}
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <div>
          <label>Quantity</label>
          <input
            name="quantity"
            type="number"
            defaultValue={initialData?.quantity || 0}
            min="0"
          />
        </div>
        <div>
          <label>Min Quantity (Alert)</label>
          <input
            name="minQuantity"
            type="number"
            defaultValue={initialData?.minQuantity || 0}
            min="0"
          />
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label>Description</label>
        <textarea
          name="description"
          defaultValue={initialData?.description || ''}
          rows={3}
          placeholder="Additional details about the item..."
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={() => router.back()} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Saving...' : initialData ? 'Update Equipment' : 'Add Equipment'}
        </button>
      </div>
    </form>
  );
}
