import { prisma } from "@/lib/prisma";
import ReturnButton from "@/components/features/ReturnButton";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

export default async function BorrowsPage() {
  const allBorrows = await prisma.borrowRecord.findMany({
    include: { equipment: true },
    orderBy: { borrowDate: 'desc' }
  });

  const activeBorrows = allBorrows.filter(b => b.status === 'BORROWED');
  const pastBorrows = allBorrows.filter(b => b.status === 'RETURNED');

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.25rem', fontWeight: '800' }}>Borrowing Records</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {/* Active Borrows */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Clock color="var(--accent)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Currently Out</h2>
            <span style={{ background: 'var(--accent)', color: 'white', padding: '0.1rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem' }}>
              {activeBorrows.length}
            </span>
          </div>

          <div className="card" style={{ padding: '0' }}>
            {activeBorrows.length === 0 ? (
              <p style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>No active borrows at the moment.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '1rem' }}>Equipment</th>
                    <th style={{ padding: '1rem' }}>Borrower</th>
                    <th style={{ padding: '1rem' }}>Qty</th>
                    <th style={{ padding: '1rem' }}>Due Date</th>
                    <th style={{ padding: '1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeBorrows.map((borrow) => {
                    const isOverdue = borrow.dueDate && new Date() > borrow.dueDate;
                    return (
                      <tr key={borrow.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem', fontWeight: '700' }}>{borrow.equipment.name}</td>
                        <td style={{ padding: '1rem' }}>{borrow.borrowerName}</td>
                        <td style={{ padding: '1rem' }}>{borrow.quantity}</td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isOverdue ? 'var(--danger)' : 'inherit' }}>
                            {isOverdue && <AlertCircle size={14} />}
                            {borrow.dueDate ? borrow.dueDate.toLocaleDateString() : 'No limit'}
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <ReturnButton borrowId={borrow.id} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Borrow History */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <CheckCircle color="#16a34a" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Return History</h2>
          </div>

          <div className="card" style={{ padding: '0' }}>
            {pastBorrows.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No history yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '1rem' }}>Equipment</th>
                    <th style={{ padding: '1rem' }}>Borrower</th>
                    <th style={{ padding: '1rem' }}>Borrowed</th>
                    <th style={{ padding: '1rem' }}>Returned</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pastBorrows.map((borrow) => (
                    <tr key={borrow.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem' }}>{borrow.equipment.name}</td>
                      <td style={{ padding: '1rem' }}>{borrow.borrowerName}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{borrow.borrowDate.toLocaleDateString()}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{borrow.returnDate?.toLocaleDateString()}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '700' }}>RETURNED</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
