import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try {
    // 1. Investors Table
    await sql`
      CREATE TABLE IF NOT EXISTS investors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        amount NUMERIC,
        max_amount NUMERIC,
        status TEXT,
        probability NUMERIC,
        lead TEXT,
        contact TEXT,
        dependency TEXT,
        last_update TEXT,
        notes TEXT,
        is_blocker BOOLEAN DEFAULT FALSE
      );
    `;

    // 2. Deals Table (Placeholder for future use)
    await sql`
      CREATE TABLE IF NOT EXISTS deals (
        id TEXT PRIMARY KEY,
        investor_id TEXT REFERENCES investors(id),
        round_name TEXT,
        target_amount NUMERIC,
        closed_amount NUMERIC,
        timeline TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Seed Initial Data if empty
    const { rows } = await sql`SELECT count(*) FROM investors`;
    if (rows[0].count === '0') {
        await sql`
            INSERT INTO investors (id, name, amount, max_amount, status, probability, lead, contact, dependency, last_update, notes, is_blocker)
            VALUES 
            ('1', '산업은행 스케일실', 50, 70, 'Verbal', 0.9, 'CEO (황태일)', NULL, NULL, '2026-01-25', 'Max 70억 possibility depending on final committee.', FALSE),
            ('2', '뮤렉스파트너스', 10, NULL, 'Verbal', 0.9, 'CEO (황태일)', NULL, NULL, '2026-01-20', 'Confirmed.', FALSE),
            ('3', '스틱인베스트먼트', 20, NULL, 'HighInterest', 0.7, 'CEO (황태일)', NULL, NULL, '2026-01-24', 'High sensitivity. Term sheet discussion soon.', FALSE),
            ('4', '코로프라넥스트', 40, NULL, 'InProgress', 0.4, 'Shared', NULL, 'Fintech Thesis (MOU)', '2026-01-26', 'Requires fintech thesis. Co-GP with DTN.', TRUE),
            ('5', 'MUFG', 40, NULL, 'InProgress', 0.4, 'Shared', NULL, 'Fintech Thesis (MOU)', '2026-01-26', 'Requires fintech thesis.', TRUE)
        `;
    }

    return response.status(200).json({ message: 'Database setup and seeded successfully' });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}