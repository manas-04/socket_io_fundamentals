const expect = require("expect");

var {generateMessage, generateLocationMessage} = require("./message");

describe('GenerateMessage', () => {
    it("should generate correct message object", ()=>{
        let from="Manas", text="test message";
        message = generateMessage(from,text);

        expect.expect(typeof message.createdAt).toBe('number');
        expect.expect(message).toMatchObject({from:from,text:text});
    })
});

describe('GenerateLocationMessage', () => {
    it("should generate correct location message object", ()=>{
        let from = "Admin",lat=15,long=15
        url = `https://www.google.com/maps?q=${lat}, ${long}`,
        message = generateLocationMessage(from,lat,long);

        expect.expect(typeof message.createdAt).toBe('number');
        expect.expect(message).toMatchObject({from:from,url:url});
    })
});
