import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  const { id } = request.query;

  if (!id) {
    return response.status(400).json({ error: 'ID is required' });
  }

  if (request.method === 'DELETE') {
    try {
      await sql`DELETE FROM investors WHERE id = ${id}`;
      
      // Return updated list
      const { rows } = await sql`SELECT * FROM investors ORDER BY last_update DESC`;
      
      const investors = rows.map(row => ({
        id: row.id,
        name: row.name,
        amount: Number(row.amount),
        maxAmount: row.max_amount ? Number(row.max_amount) : undefined,
        status: row.status,
        probability: Number(row.probability),
        lead: row.lead,
        contact: row.contact || undefined,
        dependency: row.dependency || undefined,
        lastUpdate: row.last_update,
        notes: row.notes,
        isBlocker: row.is_blocker
      }));

      return response.status(200).json(investors);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  return response.status(405).json({ message: 'Method not allowed' });
}