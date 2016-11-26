// A model class that
// * stores and gives access to data
// * triggers a callback when data changes
function ChatModel(messages) {
	this.messages = messages;
}

ChatModel.prototype = {
	setOnMessagesAdded: function(callback) {
		this.onMessagesAdded = callback;
	},

	addMessages: function(newMessages) {
		this.messages = this.messages.concat(newMessages);
		if (this.onMessagesAdded) {
			this.onMessagesAdded(newMessages, this.messages.length - newMessages.length, this.messages.length);
		}
	},

	insertMessages: function(position, newMessages) {
		this.messages = newMessages.concat(this.messages);
		if (this.onMessagesAdded) {
			this.onMessagesAdded(newMessages, position, position + newMessages.length);
		}
	},

	getMessages: function() {
		return this.messages;
	}
}

// Representation of a chat message
function Message(data) {
	this.senderLogin = data["sender_login"]; 
	this.senderName = data["sender_name"];
	this.text = data["message_text"];
	this.timestamp = data["_tc"];
};