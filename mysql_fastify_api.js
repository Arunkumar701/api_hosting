const fastify = require('fastify')({ logger: true });
const mysql = require('mysql2');

// Create MySQL connection (with Promisified queries)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'ak',
  password: 'root@12345',
  database: 'mobile_recharge_db'
});

// Promisify connection query to use async/await
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// **GET** - Retrieve all users
fastify.get('/users', async (request, reply) => {
  try {
    const results = await query('SELECT * FROM users_tbl;');
    reply.send(results);
  } catch (err) {
    reply.status(500).send({ error: 'Database error', details: err.message });
  }
});

// **POST** - Add a new user
fastify.post('/users', async (request, reply) => {
  const { email_id, user_name, pass_word } = request.body;

  // Validate input
  if (!email_id || !user_name || !pass_word) {
    return reply.status(400).send({ error: 'Missing required fields' });
  }

  try {
    const queryStr = 'INSERT INTO users_tbl (email_id, user_name, pass_word, access_key) VALUES (?, ?, ?, UUID())';
    const results = await query(queryStr, [email_id, user_name, pass_word]);
    reply.status(201).send({ message: 'User created', userId: results.insertId });
  } catch (err) {
    reply.status(500).send({ error: 'Database error', details: err.message });
  }
});

// Root route (remove or update if unnecessary)
fastify.get("/", async (request, reply) => {
  return { "mysql": "api hit" };
});

// Start Fastify server
fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is running at ${address}`);
});
