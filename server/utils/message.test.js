const expect = require("expect");

var {generateMessage} = require("./message");

describe('GenerateMessage', () => {
    it("should generate correct message object", ()=>{
        let from="Manas", text="test message";
        message = generateMessage(from,text);

        expect.expect(typeof message.createdAt).toBe('number');
        expect.expect(message).toMatchObject({from:from,text:text});
    })
});
