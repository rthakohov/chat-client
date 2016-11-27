/*
 * This class contains functions for making API calls.
*/
function ApiCaller() {
	this.API_URL = "http://localhost:8888/chatapi/index.php/";
}

ApiCaller.prototype = {
	createUser: function(name, username, password, context, onSuccess, onFail) {
		this.sendRequest("users", "POST", {name : name, login : username, password : password}, context, onSuccess, onFail);
	},

	createSession: function(username, password, context, onSuccess, onFail) {
		this.sendRequest("sessions", "POST", {login : username, password : password}, context, onSuccess, onFail);
	},

	uploadImage: function(data, context, onSuccess, onFail) {
		this.sendRequest("attachments", "POST", {imageData: data}, context, onSuccess, onFail);
	},

	sendMessage: function(message, context, onSuccess, onFail) {
		this.sendRequest("messages", "POST", message, context, onSuccess, onFail);
	},

	waitForMessages: function(lastId, context, onSuccess, onFail) {
		this.sendRequest("messages", "GET", {lastLoadedId : lastId}, context, onSuccess, onFail);
	},

	getMessages: function(cnt, context, onSuccess, onFail) {
		this.sendRequest("messages", "GET", {count : cnt}, context, onSuccess, onFail);
	},

	getMessagesRange: function(start, end, context, onSuccess, onFail) {
		this.sendRequest("messages", "GET", {start: start, end : end}, context, onSuccess, onFail);
	},

	sendRequest: function(resource, type, params, context, onSuccess, onFail) {
		var _this = this;
		$.ajax({
			type: type, 
			url : _this.API_URL + resource,
			data: params,
			dataType: "json",
			success: function(data) {
				if (onSuccess) {
					onSuccess(context, data);
				}
			},
			error: function(rq, er, err) {
				console.log("fail: " + rq + " " + er + " " + err);
				if (onFail) {
					onFail(context, err);
				}
			}
		}); 
	}
}