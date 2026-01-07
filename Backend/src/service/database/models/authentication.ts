import { Client } from 'pg';

export async function createAuthenticationTable(client: Client) {
  await client.query(`
    DO $$
    BEGIN
      CREATE TYPE authentication_type AS ENUM ('N/A', 'email', 'sms');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
    $$;
  `);
  await client.query(`
    CREATE TABLE IF NOT EXISTS authentication (
      authentication_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id text,
      authentication_type authentication_type DEFAULT 'N/A',
      enabled boolean DEFAULT false,
      date_created timestamptz DEFAULT now()
    );
  `);
}
