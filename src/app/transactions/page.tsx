import { prisma } from "@/lib/prisma";

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    include: {
      equipment: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Global Transaction History</h1>

      <div className="card">
        {transactions.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>No transactions recorded yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Equipment</th>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>
                    {tx.date.toLocaleDateString()} {tx.date.toLocaleTimeString()}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                    {tx.equipment.name}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      color: tx.type === 'IN' ? 'green' : 'red', 
                      fontWeight: 'bold',
                      background: tx.type === 'IN' ? '#dcfce7' : '#fee2e2',
                      padding: '0.25rem 0.5rem',
                      borderRadius: 'var(--radius)',
                      fontSize: '0.75rem'
                    }}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{tx.amount}</td>
                  <td style={{ padding: '1rem', color: '#666' }}>{tx.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
