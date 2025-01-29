const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'ak',
    password: 'root@12345',
    database: 'mobile_recharge_db'
});


connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as ID', connection.threadId);
});


connection.query('SELECT * FROM users_tbl', (err, results) => {
    if (err) {
        console.error('Error executing query:', err.stack);
        return;
    }
    console.log('Users:', results);
});


connection.end();
