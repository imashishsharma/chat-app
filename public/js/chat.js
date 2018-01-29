var socket = io();

function scrollToBottom () {
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');
    var scrollTop = messages.prop('scrollTop');
    var clientHeight = messages.prop('clientHeight');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(scrollTop + clientHeight + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
};

socket.on('connect', function () {
    console.log("Connected to server");

});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    //console.log("New Message", message);
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (locationMessage) {
    var formattedTime = moment(locationMessage.createdAt).format('h:mm a');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
        url: locationMessage.url,
        from: locationMessage.from,
        createdAt: formattedTime
    });
    // var li = $('<li></li>');
    // var a = $('<a target="_blank">My current location</a>');
    // li.text(`${locationMessage.from} ${formattedTime}:`);
    // a.attr('href', locationMessage.url);
    // li.append(a);
    $('#messages').append(html);
    scrollToBottom();
});


jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    var messageTextBox = $('[name=message]');
    socket.emit('createMessage', {
        from: jQuery('[name=username]').val(),
        text:  messageTextBox.val()
    }, function (data) {
        messageTextBox.val('');       
    });    
});

var locationButton = $('#send-location');
locationButton.on('click', function (){
    if(!navigator.geolocation) {
        return alert('Gelocation is not supported by your browser');
    };
    locationButton.attr('disabled', 'disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            from: $('[name=username]').val(),
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })  ;     
    }, function () {
        ocationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    });
});