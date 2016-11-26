// ListView is a view for displaying lists of arbitrary data
// rowRenderer is a function that accepts a model object (e.g. a chat message)
// and renders a list row. This is done to keep the ListView generic
// and independent of the type of content being displayed.
function ListView(elements, rowRenderer) {
	this.elements = elements;
	this.rowRenderer = rowRenderer;
	this.body = document.getElementById("listBody");
	this.showingSpinner = false;

	for (var i = 0; i < elements.length; i++) {
		this.body.appendChild(rowRenderer(elements[i]));
	}
}

ListView.prototype = {
	onScroll: function() {
		var body = document.getElementById("listBody");
		if (body.scrollTop == 0) {
			this.scrolledToTop();
		} else if (body.scrollTop == body.scrollHeight - body.offsetHeight) {
			this.scrolledToBottom();
		}
	},

	setScrolledToTop: function(callback) {
		this.scrolledToTop = callback;
		var _this = this;
		this.body.onscroll = function() { _this.onScroll(); };
	},

	setScrolledToBottom: function(callback) {
		this.scrolledToBottom = callback;
		var _this = this;
		this.body.onscroll = function() { _this.onScroll(); };
	},

	insertRows: function(position, newElements) {
		for (var i = newElements.length - 1; i >= 0; i--) {
			this.body.insertBefore(this.rowRenderer(newElements[i]), this.body.children[position]);
		}
	},

	appendRows: function(newElements) {
		for (var i = 0; i < newElements.length; i++) {
			this.body.appendChild(this.rowRenderer(newElements[i]));
		}
	},

	hideSpinner: function() {
		if (this.showingSpinner) {
			this.body.removeChild(this.body.children[0]);
			this.showingSpinner = false;
		}
	},

	jumpToBottom: function() {
		this.body.scrollTop = this.body.scrollHeight;
	}

	showSpinner: function() {
		if (!this.showingSpinner) {
			var spinner = document.createElement("div");
			spinner.className = "loader";
			this.body.insertBefore(spinner, this.body.children[0]);
			this.showingSpinner = true;
		}
	}
}

