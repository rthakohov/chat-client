function ChatController() {
  this.model = new ChatModel([]);
  this.view = new ListView([], this.renderer, this);
  this.emojiView = new EmojiView();
  this.imagePicker = new ImagePickerView();
  this.attachmentUrl = null;
  this.apiCaller = new ApiCaller();
  this.cookies = new CookieManager();
  this.parser = new MentionsParser();

  this.sendButton = document.getElementById("send");
  this.messageField = document.getElementById("message-field");

  this.firstLoadDone = false;

  this.notificationsAllowed = false;

  var _this = this;

  this.model.setOnMessagesAdded(function(elements, start, end) {
    _this.modelChanged(elements, start, end);
  });
  this.view.setScrolledToTop(function() {
    _this.viewScrolledToTop();
  });
  this.emojiView.setOnClickListener(function(html) {
    _this.emojiClicked(html);
  });
  this.imagePicker.setOnFileChosen(function(file) {
    _this.fileChosen(file);
  });
  this.sendButton.onclick = function() {
    _this.sendMessage();
  }
  $('#message-field').keydown(function (e) {
    if (e.metaKey && e.keyCode == 13) {
      _this.sendMessage();
    }
  });

  this.init();
}

ChatController.prototype = {
  init: function() {
    this.firstLoaded = -1;
    this.lastLoaded = 0;

    this.apiCaller.getMessages(100, this, this.newMessagesLoaded, this.requestFailed);

    var _this = this;
    if (Notification.permission !== "denied") {
      Notification.requestPermission(function(permission) {
        if (permission == "granted") {
          _this.notificationsAllowed = true;
          console.log("notifications allowed");
        }
      });
    }
  },

  startLoading: function(context) {
    this.apiCaller.waitForMessages(this.lastLoaded, this, this.newMessagesLoaded, this.requestFailed);
  },

  oldMessagesLoaded: function(context, data) {
    context.view.hideSpinner();
    if (data.data) {
      context.model.insertMessages(0, data.data.reverse());
    }
  },

  newMessagesLoaded: function(context, data) {
    if (data.data) {
      context.model.addMessages(data.data.reverse());
      if (context.firstLoadDone) {
        context.checkMentions(data.data);
      }
    }
    context.firstLoadDone = true;
    context.startLoading();
  },

  checkMentions: function(messages) {
    for (var i = 0; i < messages.length; i++) {
      var mentions = this.parser.extractMentions(messages[i].messageText);
      for (var j = 0; j < mentions.length; j++) {
        if (mentions[j] == this.cookies.getCookie("username")) {
          var notification = new Notification(messages[i].senderName + " (@" + messages[i].senderLogin + "): " + messages[i].messageText);
          break;
        }
      }
    }
  },

  sendMessage: function() {
    if (this.messageField.value == "" && !this.attachmentUrl) {
      return false;
    }
    
    var message = {};
    message.messageText = this.messageField.value;
    message.senderLogin = this.cookies.getCookie("username");
    message.senderName = this.cookies.getCookie("fullname");
    this.messageField.value = "";
    this.imagePicker.crossClicked();
    if (this.attachmentUrl) {
      message.attachmentUrl = this.attachmentUrl;
    }
    this.attachmentUrl = null;
    
    this.apiCaller.sendMessage(message);
  },

  imageUploaded: function(context, data) {
    context.imagePicker.loadingDone();
    context.attachmentId = data.data.id;
    context.attachmentUrl = data.data.url;
  },

  modelChanged: function(newMessages, start, end) {
    if (end == this.model.messages.length) {
      this.view.appendRows(newMessages);
      this.view.jumpToBottom();
    } else if (start == 0) {
      this.view.insertRowsAtBeginning(newMessages);
    } else {
      console.log("Unexpected model change!");
    }

    this.firstLoaded = this.model.messages[0].id;
    this.lastLoaded = this.model.messages[this.model.messages.length - 1].id + 1;
  },

  viewScrolledToTop: function() {
    this.view.showSpinner();
    if (this.firstLoaded !== -1) {
      this.apiCaller.getMessagesRange(this.firstLoaded - 20, this.firstLoaded, this, this.oldMessagesLoaded, this.requestFailed);
    }
  },

  emojiClicked: function(html) {
    document.getElementById("message-field").value += html;
    document.getElementById("message-field").focus();
  },

  fileChosen: function(file) {
    var _this = this;
    this.validateImage(file, function(result) {
      if (result) {
        _this.encodeFile(file);
      } else {
        alert("Image is too big!");
        _this.imagePicker.crossClicked();
      }
    });
  },

  validateImage: function(file, callback) {
    if (file.size > 1024 * 1024 * 1.5) {
      callback(false);
    }

    var img = new Image();
    img.src = window.URL.createObjectURL( file );
    img.onload = function() {
      var width = img.naturalWidth;
      var height = img.naturalHeight;

      window.URL.revokeObjectURL(img.src);

      if( width > 450 || height > 450 ) {
        callback(false);
      }
      else {
        callback(true);
      }
    };
  },

  encodeFile: function(file) {
    var reader = new FileReader();

    var _this = this;
    reader.onload = function (e) {
      var imageData = reader.result.substring(reader.result.indexOf(',') + 1);
      _this.apiCaller.uploadImage(imageData, _this, _this.imageUploaded, _this.requestFailed);
    };
    reader.onerror = function (error) {
      alert("Failed to upload image!");
      imagePicker.crossClicked();
      console.log('Error: ', error);
    };

    reader.readAsDataURL(file);
  },

  renderer: function(element, context) {
    var message = document.createElement("div");
    message.className = "message";

    var messageHeader = document.createElement("div");
    messageHeader.className = "message-header";
    var senderName = document.createElement("div");
    senderName.className = "sender-name";
    senderName.innerHTML = element.senderName + " (@" + element.senderLogin + ")";
    var timestamp = document.createElement("div");
    timestamp.className = "timestamp";
    timestamp.innerHTML = element.timestamp;
    messageHeader.appendChild(senderName);
    messageHeader.appendChild(timestamp);

    var messageText = document.createElement("div");
    messageText.className = "message-text";
    messageText.innerHTML = context.parser.formatMentions(element.messageText);


    var messageImage = document.createElement("img");
    var _this = this;
    messageImage.onload = function() {
      _this.jumpToBottom();
    }
    if (element.attachmentUrl) {
      messageImage.src = element.attachmentUrl;
    }

    message.appendChild(messageHeader);
    message.appendChild(messageText);
    if (element.attachmentUrl) {
      message.appendChild(messageImage);
    }


    return message;
  }
}