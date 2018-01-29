const expect  = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = 'admin';
        var text = "some text";
        var result = generateMessage(from, text);
        expect(result.createdAt).toBeA('number');
        expect(result).toInclude({from,text});
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        var from = 'admin';
        var latitude = 10;
        var longitude = 15;
        var url = `https://google.com/maps?q=${latitude},${longitude}`;
        var result = generateLocationMessage(from, latitude, longitude);
        expect(result.createdAt).toBeA('number');
        expect(result).toInclude({from,url});
    });
});