/*
 * This class contains functions for processing mentions in messages
*/
function MentionsParser() {

}

MentionsParser.prototype = {
	// Returns an array of usernames found in the message
	extractMentions: function(message) {
		var expr = /@[a-zA-Z1-9]+/;

		var mentions = [];
		while (true) {
			var result = message.match(expr);
			if (!result) {
				break;
			}
			mentions.push(result[0].substring(1));
			message = message.substring(result.index + result[0].length);
		}

		return mentions;
	},

	// Reformats the message so that usernames are highlited
	formatMentions: function(message) {
		var expr = /@[a-zA-Z1-9]+/;

		var html = "";
		while (true) {
			var result = message.match(expr);
			if (!result) {
				html += message;
				break;
			}
			html += message.substring(0, result.index);
			html += '<span class = "mention">';
			html += message.substring(result.index, result.index + result[0].length);
			html += "</span>";
			message = message.substring(result.index + result[0].length);
		}

		return html;
	}


}