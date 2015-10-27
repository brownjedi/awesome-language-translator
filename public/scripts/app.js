function getLanguageCode(language) {

	var languageCodes = {
		'English': 'en',
		'Spanish': 'es',
		'French': 'fr',
		'Portuguese': 'pt',
		'Arabic': 'ar-en'
	}
	return languageCodes[language];
}

// On Document Ready
$(document).ready(function() {

	$('.help-screen').hide();
	$('#source-speech').hide();

	navigator.getUserMedia = navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia;

	if (!navigator.getUserMedia) {
		$('#source-speech').hide();
	}

	// $('#source-speech').click(function() {
	// 	// Get Audio Stream
	// 	if (navigator.getUserMedia) {

	// 		var constraints = {
	// 			audio: true
	// 		};

	// 		function successCallback(localMediaStream) {
	// 			window.stream = localMediaStream; // stream available to console
	// 			var audio = $('audio').get(0);
	// 			audio.src = window.URL.createObjectURL(localMediaStream);
	// 			audio.play();
	// 		}

	// 		function errorCallback(error) {
	// 			console.log("navigator.getUserMedia error: ", error);
	// 		}
	// 		navigator.getUserMedia(constraints, successCallback, errorCallback);
	// 	}
	// });

	$('#target-language-list > li').click(function(event) {
		var audioPlayer = $('.audio').get(0);
		audioPlayer.pause();
		audioPlayer.src = null;

		$('#target-textarea').val('');
		var selectedTargetLanguage = $(event.target).text();
		$('#target-language-selection').text(selectedTargetLanguage);
		if (selectedTargetLanguage == "English" || selectedTargetLanguage == "Spanish" || selectedTargetLanguage == "French") {
			$('#target-speech').show();
		} else {
			$('#target-speech').hide();
		}
	});

	$('#source-language-list > li').click(function(event) {
		$('#source-language-selection').text($(event.target).text());
	});

	$('#source-translate').click(function() {

		var audioPlayer = $('.audio').get(0);
		audioPlayer.pause();
		audioPlayer.src = null;

		var text = $('#source-textarea').val();
		var detectLanguage = false;

		if ($('#source-language-selection').text() == "Detect Language") {
			detectLanguage = true;
		}

		if (text) {
			// Do an ajax call to server to translate text
			var request = $.post('/api/translate', {
				text: text,
				source: getLanguageCode($('#source-language-selection').text()),
				target: getLanguageCode($('#target-language-selection').text()),
				detectLanguage: detectLanguage
			});

			$.blockUI({
				message: '<div class="disable-click-events">' +
					'<embed type="image/svg+xml" src="../images/loading-indicator.svg" class="wait-svg disable-click-events">' +
					'</div>',
				css: {
					'border': 'none',
					'backgroundColor': 'transparent !important',
					'background-color': 'transparent !important'
				}
			});

			request.done(function(data) {
				$.unblockUI();
				$('#target-textarea').val(data.translations[0].translation);
			});

			request.fail(function(err) {
				$.unblockUI();
				console.log(err);
			});
		} else {
			$('#target-textarea').val('');
		}
	});

	$('#target-speech').click(function() {
		var text = $('#target-textarea').val();
		if (text) {
			var audioPlayer = $('.audio').get(0);
			// Do text-to-speech
			var downloadURL = '/api/synthesize' +
				'?languageCode=' + getLanguageCode($('#target-language-selection').text()) +
				'&text=' + encodeURIComponent(text);
			audioPlayer.pause();
			try {
				audioPlayer.currentTime = 0;
			} catch (ex) {
				// ignore. Firefox just freaks out here for no apparent reason.
			}
			audioPlayer.src = downloadURL;
			audioPlayer.play();
		}
	});

	$('#help-button').click(function() {
		if ($('.help-screen').is(":visible")) {
			$('.help-screen').hide();
			$('#help-button > i').text('help_outline');
		} else {
			$('.help-screen').show();
			$('#help-button > i').text('close');
		}
	});
});
