import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export function getDebitNoteById(id: string) {
    try {
        if (!fs.existsSync(DB_PATH)) return null;
        const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
        return data.debitNotes.find((n: any) => n.id === id) || null;
    } catch (e) {
        return null;
    }
}
