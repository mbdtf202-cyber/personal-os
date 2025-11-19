const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://personalos:your_secure_password_here@127.0.0.1:5433/personalos',
});

client.connect()
    .then(() => {
        console.log('Connected successfully');
        return client.end();
    })
    .catch(err => {
        console.error('Connection error', err.stack);
        process.exit(1);
    });
