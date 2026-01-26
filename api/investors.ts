import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method === 'GET') {
    try {
      const { rows } = await sql`SELECT * FROM investors ORDER BY last_update DESC`;
      
      // Map snake_case DB columns to camelCase frontend types
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
  
  if (request.method === 'POST') {
    try {
      const { 
        id, name, amount, maxAmount, status, 
        probability, lead, contact, dependency, 
        lastUpdate, notes, isBlocker 
      } = request.body;

      // Upsert (Insert or Update on conflict)
      await sql`
        INSERT INTO investors (id, name, amount, max_amount, status, probability, lead, contact, dependency, last_update, notes, is_blocker)
        VALUES (${id}, ${name}, ${amount}, ${maxAmount || null}, ${status}, ${probability}, ${lead}, ${contact || null}, ${dependency || null}, ${lastUpdate}, ${notes}, ${isBlocker || false})
        ON CONFLICT (id) 
        DO UPDATE SET 
          name = EXCLUDED.name,
          amount = EXCLUDED.amount,
          max_amount = EXCLUDED.max_amount,
          status = EXCLUDED.status,
          probability = EXCLUDED.probability,
          lead = EXCLUDED.lead,
          contact = EXCLUDED.contact,
          dependency = EXCLUDED.dependency,
          last_update = EXCLUDED.last_update,
          notes = EXCLUDED.notes,
          is_blocker = EXCLUDED.is_blocker;
      `;

      // Fetch the updated/inserted record to return it
      const { rows } = await sql`SELECT * FROM investors WHERE id = ${id}`;
      // Note: In a real app we might return just the single object, but the frontend expects the full list or we can handle that optimization later. 
      // For consistency with the existing API service, let's fetch all.
      
      const { rows: allRows } = await sql`SELECT * FROM investors ORDER BY last_update DESC`;
       const investors = allRows.map(row => ({
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