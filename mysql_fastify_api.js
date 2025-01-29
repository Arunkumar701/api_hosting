const fastify = require('fastify')({ logger: true });
const mysql = require('mysql2');

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'ak',
  password: 'root@12345',
  database: 'mobile_recharge_db'
});

// **GET** - Retrieve all users
fastify.get('/users', async (request, reply) => {
  try {
    connection.query('select * from users_tbl;', (err, results) => {
      if (err) {
        reply.status(500).send({ error: 'Database error', details: err.message });
      } else {
        reply.send(results);
      }
    });
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
    const query = 'INSERT INTO users_tbl (email_id, user_name, pass_word, access_key) VALUES (?, ?, ?, UUID())';
    connection.query(query, [email_id, user_name, pass_word], (err, results) => {
      if (err) {
        reply.status(500).send({ error: 'Database error', details: err.message });
      } else {
        reply.status(201).send({ message: 'User created', userId: results.insertId });
      }
    });
  } catch (err) {
    reply.status(500).send({ error: 'Database error', details: err.message });
  }
});

// Start Fastify server and use Render's provided PORT variable
const PORT = process.env.PORT || 3001; // Fallback to 3001 if PORT is not set
fastify.listen(PORT, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is running at ${address}`);
});
