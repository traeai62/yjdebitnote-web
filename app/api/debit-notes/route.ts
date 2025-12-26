import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('debit_notes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Map Supabase data structure to our app structure
        // We stored the main content in the 'data' JSONB column
        const notes = data.map(item => ({
            ...item.data,
            id: item.id, // Ensure we use the UUID from Supabase
            created_at: item.created_at
        }));

        return NextResponse.json(notes);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newNote = {
            ...body,
            createdAt: new Date().toISOString(),
            status: 'DRAFT'
        };

        const { data, error } = await supabase
            .from('debit_notes')
            .insert([
                {
                    ref_no: newNote.refNo,
                    data: newNote
                }
            ])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            ...data.data,
            id: data.id
        });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
