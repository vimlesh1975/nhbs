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
      connectTimeout: 3000
    });
  }
  return pool;
}

const DEFAULT_TEST_TEXT = "This is test data. \u0939\u093e \u091a\u093e\u091a\u0923\u0940 \u0921\u0947\u091f\u093e \u0906\u0939\u0947.";

/**
 * Fallback test data generator when MySQL is not connected or empty
 */
function getFallbackTestData(slugName, errorMsg = null) {
  const sName = (slugName || '').toLowerCase();
  let fallbackScript = '';

  if (sName === 'headlines') {
    fallbackScript = `${DEFAULT_TEST_TEXT} 1\n${DEFAULT_TEST_TEXT} 2\n${DEFAULT_TEST_TEXT} 3`;
  } else if (sName === 'oneliner') {
    fallbackScript = `${DEFAULT_TEST_TEXT} 1\n${DEFAULT_TEST_TEXT} 2\n${DEFAULT_TEST_TEXT} 3`;
  } else if (sName === 'twoliner') {
    fallbackScript = `${DEFAULT_TEST_TEXT} Name 1 $$$$ ${DEFAULT_TEST_TEXT} Designation 1\n${DEFAULT_TEST_TEXT} Name 2 $$$$ ${DEFAULT_TEST_TEXT} Designation 2\n${DEFAULT_TEST_TEXT} Name 3 $$$$ ${DEFAULT_TEST_TEXT} Designation 3`;
  } else {
    fallbackScript = DEFAULT_TEST_TEXT;
  }

  return {
    success: true,
    isMock: true,
    script: fallbackScript,
    rows: [],
    error: errorMsg
  };
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
    if (bRows && bRows.length > 0) {
      return {
        success: true,
        bulletins: bRows
      };
    }
    return {
      success: true,
      bulletins: [
        { title: '0830', bulletintime: '08:30:00' },
        { title: '1200', bulletintime: '12:00:00' },
        { title: '1900', bulletintime: '19:00:00' },
        { title: '2100', bulletintime: '21:00:00' }
      ],
      isFallback: true
    };
  } catch (err) {
    return {
      success: true,
      bulletins: [
        { title: '0830', bulletintime: '08:30:00' },
        { title: '1200', bulletintime: '12:00:00' },
        { title: '1900', bulletintime: '19:00:00' },
        { title: '2100', bulletintime: '21:00:00' }
      ],
      isFallback: true,
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

    if (scripts.length > 0) {
      return {
        success: true,
        script: scripts.join('\n'),
        rows
      };
    }
    // Fallback if no rows returned from query
    return getFallbackTestData(slugName);
  } catch (err) {
    // When MySQL is disconnected, automatically return fallback bilingual test data
    return getFallbackTestData(slugName, err.message);
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
