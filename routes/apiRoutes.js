'use strict';

const express = require('express');
const watson = require('watson-developer-cloud');
const twilio = require('twilio');
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

function getLanguageCode(language) {

	var languageCodes = {
		'English': 'en',
		'Spanish': 'es',
		'French': 'fr',
		'Portuguese': 'pt',
		'Arabic': 'ar'
	}
	return languageCodes[language];
}

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

router.post('/twilio/sms/response', (req, res) => {
	let twimlResponse = new twilio.TwimlResponse();
	res.writeHead(200, {
		'Content-Type': 'text/xml'
	});

	if (req.body.Body) {
		if (req.body.Body.split(",")[0].trim().toLowerCase() === "tutorial") {
			// Help Twiml
			twimlResponse.message("Hello. Select Language from English, Spanish, French, Portuguese and Arabic. Send the message in the following format: \n\n <source_lang>,<target_lang>\n<text>");
			return res.end(twimlResponse.toString());
		} else if (req.body.Body.split("\n").length < 2 || req.body.Body.split("\n")[0].split(",") < 2) {
			// Invalid Format
			twimlResponse.message("Invalid Format. Send the message in the following format: \n\n <source_lang>,<target_lang>\n<text>");
			return res.end(twimlResponse.toString());
		} else {
			let allowedLanguages = ['English', 'Spanish', 'French', 'Portuguese', 'Arabic'];
			let languages = req.body.Body.split("\n")[0].split(",");
			if (allowedLanguages.indexOf(languages[0].trim()) <= -1 || allowedLanguages.indexOf(languages[1].trim()) <= -1) {
				// Not a valid language
				twimlResponse.message("Invalid Language Selection. Select Language from English, Spanish, French, Portuguese and Arabic");
				return res.end(twimlResponse.toString());
			} else {
				// If source and target is of same language
				if (languages[0].trim() == languages[1].trim()) {
					twimlResponse.message(req.body.Body.split("\n").slice(1).join("\n").trim());
					return res.end(twimlResponse.toString());
				}

				languageTranslation.translate({
						text: req.body.Body.split("\n").slice(1).join("\n").trim(),
						source: getLanguageCode(languages[0].trim()),
						target: getLanguageCode(languages[1].trim())
					},
					function(err, translation) {
						if (err) {
							console.log('err', err);
							return res.status(500).send(err.message);
						} else {
							twimlResponse.message(translation.translations[0].translation);
							return res.end(twimlResponse.toString());
						}
					});
			}
		}
	}
});

module.exports = router;
