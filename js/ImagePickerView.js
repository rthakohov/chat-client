function ImagePickerView() {
	this.fileInput = document.getElementById("file-input");
	this.loadingView = document.getElementById("loader");
	this.attachmentView = document.getElementById("attachment");
	this.fileView = document.getElementById("file-name");
	this.crossView = document.getElementById("cross");

	this.fileChosen = false;

	var _this = this;
	this.attachmentView.onclick = function() {
		_this.attachClicked();
	}
	this.fileInput.onchange = function() {
		_this.fileWasChosen();
	}
	this.crossView.onclick = function() {
		_this.crossClicked(true);
	}
}

ImagePickerView.prototype = {
	setOnFileChosen: function(callback) {
		this.onFileChosen = callback;
	},

	setOnCrossClicked: function(callback) {
		this.onCrossClicked = callback;
	},

	attachClicked: function() {
		this.fileInput.click();
	},

	fileWasChosen: function() {
		this.fileChosen = true;
		this.attachmentView.style.display = "none";
		this.loadingView.style.display = "block";

		this.fileName = this.fileInput.files[0].name;

		this.onFileChosen(this.fileInput.files[0]);
	},

	loadingDone: function() {
		this.loadingView.style.display = "none";
		this.attachmentView.style.display = "block";

		this.fileView.style.display = "block";
		this.fileView.innerHTML = this.fileName;
		this.crossView.style.display = "block";
	},

	crossClicked: function(triggerCallback) {
		this.fileInput.value = "";

		this.fileView.style.display = "none";
		this.crossView.display = "none";
		this.attachmentView.style.display = "block";
		this.crossView.style.display = "none";
		this.loadingView.style.display = "none";

		if (triggerCallback) {
			this.onCrossClicked();
		}
	}
}