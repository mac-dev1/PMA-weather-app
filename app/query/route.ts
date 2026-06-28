import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function listTemps() {
	const data = await sql`
    SELECT *
    FROM dailyTemp;
  `;

	return data;
}

export async function GET() {
  try {
  	return Response.json(await listTemps());
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}
