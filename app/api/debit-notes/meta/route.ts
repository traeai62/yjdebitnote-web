import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('debit_notes')
            .select('ref_no')
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) {
            console.error(error);
            return NextResponse.json({ lastSequence: 719 });
        }

        if (data && data.length > 0) {
            const lastRef = data[0].ref_no;
            // Extract the sequence number from Ref No (e.g. YJ2-251209-720 -> 720)
            const parts = lastRef.split('-');
            const lastSeq = parseInt(parts[parts.length - 1], 10);
            return NextResponse.json({ lastSequence: isNaN(lastSeq) ? 719 : lastSeq });
        } else {
            return NextResponse.json({ lastSequence: 719 });
        }
    } catch (e) {
        return NextResponse.json({ lastSequence: 719 });
    }
}
