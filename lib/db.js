import mysql from 'mysql2/promise';

let pool = null;

export function getDbPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'itmaint',
      password: process.env.DB_PASSWORD || 'itddkchn',
      database: process.env.DB_NAME || 'nrcsnew',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 5000
    });
  }
  return pool;
}

/**
 * Fetch bulletin list for dropdown combo box:
 * SELECT DISTINCT bulletinname AS title, bulletintime FROM bulletin WHERE bulletinname != '' AND bulletintype = 'News Bulletin' AND status = 1 ORDER BY bulletintime ASC;
 */
export async function fetchBulletinOptions() {
  try {
    const dbPool = getDbPool();
    const [bRows] = await dbPool.execute(
      `SELECT DISTINCT bulletinname AS title, bulletintime FROM bulletin WHERE bulletinname != '' AND bulletintype = 'News Bulletin' AND status = 1 ORDER BY bulletintime ASC`
    );
    return {
      success: true,
      bulletins: bRows
    };
  } catch (err) {
    return {
      success: false,
      bulletins: [],
      error: err.message
    };
  }
}

/**
 * Exact SQL Query:
 * SELECT Script FROM Script WHERE bulletinname = ? AND SlugName = 'headlines' AND DATE(bulletindate) = ? ORDER BY id DESC;
 */
export async function fetchScriptByBulletinAndDate(bulletinName = '', dateStr = '', slugName = 'headlines') {
  try {
    const dbPool = getDbPool();
    const sql = `SELECT Script FROM Script WHERE bulletinname = ? AND LOWER(SlugName) = LOWER(?) AND DATE(bulletindate) = ? ORDER BY id DESC`;
    const [rows] = await dbPool.execute(sql, [bulletinName, slugName, dateStr]);
    const scripts = rows.map(r => r.Script || r.script || '').filter(Boolean);

    return {
      success: true,
      script: scripts.join('\n'),
      rows
    };
  } catch (err) {
    return {
      success: false,
      script: '',
      rows: [],
      error: err.message
    };
  }
}

/**
 * Generic query executor
 */
export async function executeQuery() {
  return { success: true, data: [] };
}

/**
 * Test MySQL connection
 */
export async function testDbConnection() {
  try {
    const dbPool = getDbPool();
    await dbPool.execute('SELECT 1');
    return {
      connected: true,
      database: process.env.DB_NAME || 'nrcsnew',
      host: process.env.DB_HOST || '127.0.0.1'
    };
  } catch (error) {
    return {
      connected: false,
      message: error.message
    };
  }
}
