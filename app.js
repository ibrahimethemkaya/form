const { Pool } = require('pg');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Eğer CORS gerekiyorsa ekleyin
const port = process.env.PORT || 3000;


const app = express();

app.use(cors()); // Eğer CORS gerekiyorsa ekleyin
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Eğer gerekirse bodyParser ile JSON datayı alın
app.use(express.static(path.join(__dirname, 'public')));
app.set("views","public");
app.use(express.static('public')); 



const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'form',
    password: 'password',
    port: 5432,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('PostgreSQL connected...');
});

app.get('/form', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/submit-form', (req, res) => {
    console.log('Form submission received');
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.textarea;

    // Debugging logs
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    // Check if all fields are provided
    if (!name || !email || !message) {
        return res.status(400).send('All fields are required');
    }

    const sql = 'INSERT INTO form_data (name_, mail_, question) VALUES ($1, $2, $3)';
    const values = [name, email, message];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing query', err.stack);
            res.status(500).send('An error occurred');
        } else {
            res.send('Data saved successfully');
        }
    });
});

app.listen(port, () => {
    console.log('Server started at port ' + port);
});


