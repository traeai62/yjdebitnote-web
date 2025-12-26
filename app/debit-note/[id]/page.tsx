import { notFound } from 'next/navigation';
import DebitNotePreview from '@/components/DebitNotePreview';
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

export default async function ViewDebitNotePage(props: PageProps) {
    const params = await props.params;
    const note = await getDebitNote(params.id);

    if (!note) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <DebitNotePreview data={note} />
        </div>
    );
}
