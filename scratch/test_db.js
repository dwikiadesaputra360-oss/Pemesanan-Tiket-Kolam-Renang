const db = require('../api/db');
require('dotenv').config({ path: './backend/.env' });

async function testDB() {
  try {
    const res = await db.query('SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = \'public\'');
    console.log('Tables in database:');
    res.rows.forEach(row => console.log(' - ' + row.tablename));
    
    if (res.rows.some(r => r.tablename === 'users')) {
      console.log('\nSUCCESS: "users" table found.');
    } else {
      console.log('\nERROR: "users" table NOT found. Please run init.sql.');
    }
    process.exit(0);
  } catch (err) {
    console.error('\nDATABASE CONNECTION ERROR:', err.message);
    process.exit(1);
  }
}

testDB();
