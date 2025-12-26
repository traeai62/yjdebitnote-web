'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Plus, FileText, Eye, Download, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function Home() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/debit-notes')
      .then(res => res.json())
      .then(data => {
        setNotes(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string, refNo: string) => {
    if (!confirm(`Are you sure you want to delete Debit Note ${refNo}?`)) return;

    try {
      const res = await fetch(`/api/debit-notes/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      } else {
        alert('Failed to delete debit note');
      }
    } catch (error) {
      console.error('Error deleting debit note:', error);
      alert('Error deleting debit note');
    }
  };

  const handleDownloadExcel = () => {
    // 1. Prepare data for Excel
    // Flatten the structure if needed, or select specific columns
    const excelData = notes.map(note => ({
      'Ref No': note.refNo,
      'Date': note.date,
      'Buyer': note.toCompany,
      'Attn': note.attn,
      'Claim Type': note.claimType,
      'Style/PO': note.styleInfo,
      'Total Qty': note.totalQty,
      'Currency': note.currency,
      'Total Amount': note.totalAmount,
      'Status': note.status,
      'Created At': note.created_at ? new Date(note.created_at).toLocaleString() : ''
    }));

    // 2. Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // 3. Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Debit Notes");

    // 4. Generate Excel file
    XLSX.writeFile(workbook, `DebitNotes_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Debit Note Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your claim letters and debit notes</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleDownloadExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <Download size={20} />
              Download Excel
            </button>
            <Link
              href="/debit-note/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              Create Debit Note
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : notes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Debit Notes Yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Start by creating your first debit note for claims or charges.</p>
            <Link
              href="/debit-note/new"
              className="text-blue-600 font-medium hover:underline"
            >
              Create one now &rarr;
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 tracking-wider">
                  <th className="px-6 py-4 font-semibold">Ref No</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">To (Buyer)</th>
                  <th className="px-6 py-4 font-semibold text-right">Total Amount</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {notes.map((note) => (
                  <tr key={note.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <Link href={`/debit-note/${note.id}`} className="hover:text-blue-600">
                        {note.refNo}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(note.date)}</td>
                    <td className="px-6 py-4 text-gray-700">{note.toCompany}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      {note.currency} {note.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${note.status === 'FINAL'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {note.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/debit-note/${note.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        {/* DELETE DISABLED - Uncomment to re-enable */}
                        {/* <button
                          onClick={() => handleDelete(note.id, note.refNo)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
