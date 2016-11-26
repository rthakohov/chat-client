function EmojiView() {
	this.body = document.getElementById("emoji-view");

	for (var i = 13; i < 68; i++) {
		var emoji = document.createElement("button");
		emoji.className = "emoji";
		emoji.innerHTML = "&#1285" + i;
		this.body.appendChild(emoji);
	}

	var _this = this;
	var callback = function(event) {
		_this.onClick(event.target.childNodes[0].data);
	}
	this.body.onclick = callback;

}

EmojiView.prototype = {
	setOnClickListener: function(listener) {
		this.onClick = listener;
	}
}