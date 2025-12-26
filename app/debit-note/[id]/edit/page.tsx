import { notFound } from 'next/navigation';
import DebitNoteForm from '@/components/DebitNoteForm';
import { supabase } from '@/lib/supabaseClient';

interface PageProps {
    params: Promise<{ id: string }>;
}

async function getDebitNote(id: string) {
    try {
        const { data, error } = await supabase
            .from('debit_notes')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return null;
        }

        return {
            ...data.data,
            id: data.id,
            created_at: data.created_at
        };
    } catch (error) {
        console.error('Error fetching debit note:', error);
        return null;
    }
}

export default async function EditDebitNotePage(props: PageProps) {
    const params = await props.params;
    const note = await getDebitNote(params.id);

    if (!note) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className='max-w-5xl mx-auto mb-6'>
                <h1 className='text-2xl font-bold text-gray-800'>Edit Debit Note</h1>
                <p className='text-gray-500'>Updating {note.refNo}</p>
            </div>
            <DebitNoteForm initialData={note} />
        </div>
    );
}
