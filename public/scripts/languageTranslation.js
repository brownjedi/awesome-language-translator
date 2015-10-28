(function() {

	$(document).ready(function() {

		$('#target-language-list > li').click(function(event) {

			audioController.pauseAudio();
			audioController.setAudioSource("");

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

			audioController.pauseAudio();
			audioController.setAudioSource("");

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
	});
}());
