(function() {
	$(document).ready(function() {
		$('#target-speech').click(function() {
			var text = $('#target-textarea').val();
			if (text) {
				// Do text-to-speech
				var downloadURL = '/api/synthesize' +
					'?languageCode=' + getLanguageCode($('#target-language-selection').text()) +
					'&text=' + encodeURIComponent(text);

				audioController.pauseAudio();
				audioController.setAudioSource(downloadURL);
				audioController.playAudio();
			}
		});
	});
}());
