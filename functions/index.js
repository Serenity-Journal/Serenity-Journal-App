const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const firebase = require('./firebase');
const { Configuration, OpenAIApi } = require("openai");

app.use(bodyParser.urlencoded({ extended: false }));
const allowedOrigins = ['*',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
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
    if (!process.env.OPEN_AI_API_KEY) {
        console.error("OPEN_AI_API_KEY environment variable not defined");
        process.exit(1);
    }

    const configuration = new Configuration({
        apiKey: process.env.OPEN_AI_API_KEY
    });
    const openai = new OpenAIApi(configuration);

    const millis = Date.now();
    console.log('request created at', request?.body?.createdAt);
    const currentTime = request?.body?.createdAt || Math.floor(millis);

    const newMessageData = {
        user: request?.body?.user,
        title: request?.body?.title,
        content: request?.body?.content,
        createdAt: currentTime,
        updatedAt: currentTime,
        role: 'user',
    };

    // messages to send to chat GPT
    const messages = [ {
        role: 'system',
        content: 'You are a therapist named Serenity. Respond with therapy.'
    } ];
    console.log('previous messages', request?.body?.messages);
    messages.concat(request?.body?.messages);
    if (request?.body?.messages) {
        for (let i = 0; i < request?.body?.messages.length; i++) {
            const message = request?.body?.messages[i];
            messages.push({
                role: message.role,
                content: message.content,
            });
        }
    }
    messages.push({
        role: newMessageData.role,
        content: newMessageData.content
    });
    console.log('messages being sent to ChatGPT', messages);
    let chatGPTResponse = undefined;
    try {
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages,
        });
        if (completion?.data?.choices && completion?.data?.choices?.length > 0) {
            // console.log('completion text (1)', completion.data.choices[0]);
            console.log('chat gpt message text', completion?.data?.choices[0].message);
            if (completion?.data?.choices[0].message) {
                chatGPTResponse = completion?.data?.choices[0].message?.content;
            }
        }
    } catch (e) {
        if (e.response) {
            console.error('chat gpt error response status', e.response.status);
            console.error('chat gpt error response data', e.response.data);
            response.status(500).send("Chat GPT failure");
            return;
        } else if (e.message) {
            console.error('chat gpt error response message', e.message);
            response.status(500).send("Chat GPT failure");
            return;
        } else {
            console.error('chat gpt error', e);
            response.status(500).send("Chat GPT failure");
            return;
        }
    }

    // update chatGPTResponse to use cached response if it exists
    const userId = newMessageData?.user?.uid || 'no_user_id';
    try {
        const journalCacheRef = firebase.db.collection('journal-cache');

        // console.log(newMessageData.content.replace(/\s+/g, "").replace(/%0A/g, '').toLowerCase())

        // const cachedJournalsSnapshot = await journalCacheRef.where("userID", "==", userId.toString())
        //     .where("key", "==", newMessageData.content).get();
        const cachedJournalsSnapshot = await journalCacheRef.where("userID", "==", userId.toString())
                                                            .where("key", "==", newMessageData.content.replace(/\s+/g, "").replace(/%0A/g, '').toLowerCase()).get();
        if (cachedJournalsSnapshot.empty) {
            console.log('No cached journal found');
        } else {
            cachedJournalsSnapshot.forEach(doc => {
                const cachedResponse = doc?.data()?.value;
                if (cachedResponse) {
                    chatGPTResponse = cachedResponse;
                }
            });
            console.log('Successfully retrieved cached journal response');
        }
    } catch (e) {
        console.error('Error retrieving cached response', e);
    }

    // add responses to database
    try {
        // print newMessageDataContent
        console.log('newMessageDataContent', newMessageData.content);
        await firebase.db.collection('journal').doc(currentTime.toString() + '.0u').set(newMessageData);
        if (chatGPTResponse) {
            const chatGPTMessageData = {
                createdAt: currentTime,
                updatedAt: currentTime,
                role: 'assistant',
                content: chatGPTResponse,
                title: 'chat gpt response',
                user: request?.body?.user,
            };
            await firebase.db.collection('journal').doc(currentTime.toString() + '.1a').set(chatGPTMessageData);
        }
        response.status(200).send("Success");
    } catch (e) {
        console.error('Unable to create journal database object', e);
        response.status(500).send("Unable to add journal to database");
    }
});

exports.app = functions.https.onRequest(app);
