import bcrypt from 'bcrypt';
import postgres from 'postgres';
//import { invoices, customers, revenue, users } from '../lib/placeholder-data';

import { dailyTemps, users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedDailyTemp(){
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS dailyTemp (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      lat DECIMAL(5,2) NOT NULL,
      lon DECIMAL(5,2) NOT NULL,
      timezone VARCHAR(255) NOT NULL,
      timezone_offset INT NOT NULL,
      dt INT NOT NULL,
      sunrise INT NOT NULL,
      sunset INT NOT NULL,
      moonrise INT NOT NULL,
      moonset INT NOT NULL,
      moon_phase DECIMAL(5,3),
      day_temp DECIMAL(5,2) NOT NULL,
      min_temp DECIMAL(5,2) NOT NULL,
      max_temp DECIMAL(5,2) NOT NULL,
      night_temp DECIMAL(5,2) NOT NULL,
      eve_temp DECIMAL(5,2) NOT NULL,
      morn_temp DECIMAL(5,2) NOT NULL,
      pressure DECIMAL(7,2) NOT NULL,
      humidity DECIMAL(5,2) NOT NULL,
      wind_speed DECIMAL(5,2) NOT NULL,
      wind_deg DECIMAL(5,2) NOT NULL,
      weather VARCHAR(255),
      clouds DECIMAL(5,2) NOT NULL,
      uvi DECIMAL (5,2) NOT NULL
    );
  `;

  const insertedDailyTemps = await Promise.all(
    dailyTemps.map(
      (dailyTemp) => sql`
        INSERT INTO dailyTemp (id, lat, lon, timezone, timezone_offset, dt, sunrise, sunset, moonrise, moonset,
        moon_phase, day_temp, min_temp, max_temp, night_temp, eve_temp, morn_temp, pressure,
        humidity, wind_speed, wind_deg, clouds, uvi)
        VALUES (${dailyTemp.id}, ${dailyTemp.lat}, ${dailyTemp.lon}, ${dailyTemp.timezone}, ${dailyTemp.timezone_offset},
        ${dailyTemp.dt}, ${dailyTemp.sunrise}, ${dailyTemp.sunset}, ${dailyTemp.moonrise}, ${dailyTemp.moonset},
        ${dailyTemp.moon_phase}, ${dailyTemp.day_temp}, ${dailyTemp.min_temp}, ${dailyTemp.max_temp}, 
        ${dailyTemp.night_temp}, ${dailyTemp.eve_temp}, ${dailyTemp.morn_temp}, ${dailyTemp.pressure},
        ${dailyTemp.humidity}, ${dailyTemp.wind_speed},${dailyTemp.wind_deg}, ${dailyTemp.clouds}, ${dailyTemp.uvi})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedDailyTemps;
}

/*
async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}
*/
export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      seedUsers(),
      seedDailyTemp()
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
