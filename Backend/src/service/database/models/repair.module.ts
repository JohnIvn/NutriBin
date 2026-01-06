import { Client } from 'pg';

export async function createRepairTable(client: Client) {
  await client.query(`
    DO $$
    BEGIN
      CREATE TYPE repair_status AS ENUM ('active', 'cancelled', 'postponed');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
    $$;
  `);
  await client.query(`
    CREATE TABLE IF NOT EXISTS repair (
      repair_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      machine_id text,
      user_id text,
      first_name text,
      last_name text,
      description text,
      repair_status repair_status DEFAULT 'active',
      date_created timestamptz DEFAULT now()
    );
  `);
}
