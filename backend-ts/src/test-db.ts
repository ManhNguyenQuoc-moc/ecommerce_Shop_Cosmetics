import pool from './config/db';

async function test() {
  try {
    const now = await pool.query('SELECT NOW()');
    console.log('Time from DB:', now.rows);

    const users = await pool.query('SELECT * FROM users');
    console.log('Users:', users.rows);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end(); // đóng connection khi test xong
  }
}

test();