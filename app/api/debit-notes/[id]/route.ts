import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const id = params.id;

        const { data, error } = await supabase
            .from('debit_notes')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return NextResponse.json({}, { status: 404 });

        return NextResponse.json({
            ...data.data,
            id: data.id,
            created_at: data.created_at
        });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const id = params.id;
        const body = await request.json();

        // We only update the JSONB 'data' column
        const updatedNote = {
            ...body,
            id, // Ensure ID in JSON matches row ID
            updatedAt: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('debit_notes')
            .update({
                ref_no: updatedNote.refNo, // Also update ref_no column if it changed
                data: updatedNote
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            ...data.data,
            id: data.id
        });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    // DELETE FUNCTIONALITY DISABLED
    // To re-enable: uncomment the code below and remove the return statement
    return NextResponse.json({
        error: 'Delete functionality is currently disabled'
    }, { status: 403 });

    /* ORIGINAL DELETE CODE - Uncomment to re-enable
    try {
        const params = await props.params;
        const id = params.id;

        const { error } = await supabase
            .from('debit_notes')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
    */
}
