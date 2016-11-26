function MentionsParser() {

}

MentionsParser.prototype = {
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