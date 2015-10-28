// (function() {

// 	function getModel(language) {
// 		var models = {
// 			'English': 'en-US_BroadbandModel',
// 			'Spanish': 'es-ES_BroadbandModel'
// 		}
// 		return models[language];
// 	}

// 	$(document).ready(function() {
// 		navigator.getUserMedia = navigator.getUserMedia ||
// 			navigator.webkitGetUserMedia ||
// 			navigator.mozGetUserMedia ||
// 			navigator.msGetUserMedia;

// 		var isRunning = false;
// 		var rec;
// 		var websocket;
// 		var intervalKey;

// 		if (!navigator.getUserMedia) {
// 			$('#source-speech').hide();
// 		} else {
// 			$('#source-speech').click(function() {

// 				if (!isRunning) {
// 					console.log('Not Running');
// 					// Get Audio Stream
// 					var constraints = {
// 						audio: true
// 					};

// 					function successCallback(localMediaStream) {
// 						window.stream = localMediaStream; // stream available to console

// 						var request = $.get('/api/token');
// 						request.done(function(token) {
// 							var context = new AudioContext();
// 							var mediaStreamSource = context.createMediaStreamSource(localMediaStream);
// 							rec = new Recorder(mediaStreamSource);
// 							var wsURI = "wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=" + token + "&model=" + getModel($('#source-language-selection').text());

// 							websocket = new WebSocket(wsURI);

// 							websocket.onopen = function(evt) {
// 								console.log("Openened connection to websocket", evt);
// 								isRunning = true;
// 								rec.record();
// 								websocket.send(JSON.stringify({
// 									'action': 'start',
// 									'content-type': 'audio/wav',
// 									'interim_results': true
// 								}));
// 								intervalKey = setInterval(function() {
// 									rec.exportWAV(function(blob) {
// 										console.log(blob);
// 										rec.clear();
// 										websocket.send(blob);
// 									});
// 								}, 1000);
// 							};

// 							websocket.onclose = function(evt) {
// 								console.log("Closed connection to websocket");
// 								if (localMediaStream) {
// 									localMediaStream.stop();
// 								}
// 							};

// 							websocket.onmessage = function(evt) {
// 								console.log('Message', evt);
// 							};

// 							websocket.onerror = function(evt) {
// 								console.log("websocket error: ", evt);
// 								if (localMediaStream) {
// 									localMediaStream.stop();
// 								}
// 							};
// 						});

// 						request.fail(function(err) {
// 							localMediaStream.stop();
// 							console.log('Error while getting the token, err: ', err);
// 						})
// 					}

// 					function errorCallback(error) {
// 						console.log("navigator.getUserMedia error: ", error);
// 					}
// 					navigator.getUserMedia(constraints, successCallback, errorCallback);
// 				} else {
// 					console.log('Running');
// 					if (rec) {
// 						rec.stop();
// 					}
// 					clearInterval(intervalKey);
// 					if (websocket) {
// 						websocket.send(JSON.stringify({
// 							'action': 'stop'
// 						}));
// 						websocket.close();
// 					}
// 					isRunning = false;
// 				}
// 			});
// 		}
// 	});
// }());
