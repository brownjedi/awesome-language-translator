'use strict';

const express = require('express');
const watson = require('watson-developer-cloud');
const vCapServices = require('./../utilities/bluemix');

let router = express.Router();

let languageTranslation = watson.language_translation({
	username: vCapServices.getServiceCredentials('language_translation').username,
	password: vCapServices.getServiceCredentials('language_translation').password,
	version: 'v2'
});

let textToSpeech = watson.text_to_speech({
	username: vCapServices.getServiceCredentials('text_to_speech').username,
	password: vCapServices.getServiceCredentials('text_to_speech').username,
	version: 'v1'
});

let voices = {
	'es': 'es-US_SofiaVoice',
	'en': 'en-US_AllisonVoice',
	'fr': 'fr-FR_ReneeVoice'
};

router.post('/translate', (req, res) => {
	languageTranslation.translate({
			text: req.body.text,
			source: req.body.source,
			target: req.body.target
		},
		function(err, translation) {
			if (err)
				res.status(500).send(err.message);
			else
				res.status(200).json(translation);
		});
});

router.get('/synthesize', (req, res) => {

	let transcript = textToSpeech.synthesize({
		voice: voices[req.query.languageCode],
		text: req.query.text
	});

	transcript.on('response', function(response) {
		if (req.query.download) {
			response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
		}
	});
	transcript.on('error', function(error) {
		next(error);
	});
	transcript.pipe(res);
});

module.exports = router;
