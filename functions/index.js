const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const firebase = require('./firebase');

app.use(bodyParser.urlencoded({ extended: false }));
const allowedOrigins = ['*',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://serenity-journal.web.app'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }

}));
app.get('/', (req, res) => {
    res.send(`
      <!doctype html>
      <body>
        <p>Hello World!</p>
      </body>
    </html>`);
});

app.post('/journal', async function (request, response) {
    const millis = Date.now();
    const currentTime = Math.floor(millis);

    const data = {
        user: request?.body?.user,
        title: request?.body?.title,
        text: request?.body?.text,
        createdAt: currentTime,
        updatedAt: currentTime,
    };

    try {
        await firebase.db.collection('journal').doc(currentTime.toString()).set(data);
        response.status(200).send("Success");
    } catch (e) {
        console.error('Unable to create journal database object', e);
        response.status(500).send("Failure");
    }
});

exports.app = functions.https.onRequest(app);