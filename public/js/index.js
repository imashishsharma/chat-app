var socket = io();

socket.on('connect', function () {
    console.log("Connected to server");

});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    console.log("New Message", message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (locationMessage) {
    var li = $('<li></li>');
    var a = $('<a target="_blank">My current location</a>');
    li.text(`${locationMessage.from}:`);
    a.attr('href', locationMessage.url);
    li.append(a);
    $('#messages').append(li);
});


jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: jQuery('[name=username]').val(),
        text:  jQuery('[name=message]').val()
    }, function (data) {
        console.log("Got response", data);        
    });
    $('input[name=message]').val('');
});

var locationButton = $('#send-location');
locationButton.on('click', function (){
    if(!navigator.geolocation) {
        return alert('Gelocation is not supported by your browser');
    };
    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            from: $('[name=username]').val(),
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })  ;     
    }, function () {
        alert('Unable to fetch location');
    });
});