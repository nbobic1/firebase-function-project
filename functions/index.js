/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
admin.initializeApp();
const collection = admin.firestore().collection('nada');
const express = require('express');
const app = express();
// Assuming you want to create a document in the "users" collection
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.get('/one', async (req, res) => {
	try {
		var a = req.query.name;
		const snapshot = await collection.where('name', '==', a).get();
		const data = [];
		snapshot.forEach(doc => {
			data.push(doc.data());
		});
		res.json({ res: data });
	} catch (b) {
		res.send('Something went wrong');
	}
});
app.get('/all', async (req, res) => {
	try {
		const snapshot = await collection.get();
		const data = [];
		snapshot.forEach(doc => {
			data.push(doc.data());
		});
		res.json({ res: data });
	} catch (b) {
		res.send('Something went wrong');
	}
});
app.post('/update', async (req, res) => {
	try {
		var a = req.query.name;
		const snapshot = await collection.where('name', '==', a).get();
		const batch = admin.firestore().batch();
		snapshot.forEach(doc => {
			// Update the desired fields here
			batch.update(doc.ref, req.body);
		});

		// Commit the batch update
		await batch.commit();
		res.send('Updated');
	} catch (b) {
		res.send('Something went wrong');
	}
});
app.get('/delete', async (req, res) => {
	try {
		var a = req.query.name;
		const snapshot = await collection.where('name', '==', a).get();
		const data = [];
		snapshot.forEach(doc => {
			collection.doc(doc.id).delete();
		});
		res.json({ res: data });
	} catch (b) {
		res.send('Something went wrong');
	}
});
app.post('/insert', (req, res) => {
	try {
		var a = req.body;
		collection.add(a);
		res.send(JSON.stringify(req.body));
	} catch {
		res.send('Something went wrong');
	}
});
exports.nada = onRequest(app);
