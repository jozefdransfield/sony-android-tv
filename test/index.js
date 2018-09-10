const ServerMock = require("mock-http-server");
const assert = require('chai').assert;

const remoteFor = require("../index");

describe('Sony-Android-TV Remote', function () {

    const server = new ServerMock({host: "localhost", port: 9000});

    beforeEach(function (done) {
        server.start(done);
    });

    afterEach(function (done) {
        server.stop(done);
    });

    describe('new remote', () => {
        let tvRemote;
        beforeEach(async () => {
            respondWithCommandList(server);
            tvRemote = await remoteFor("http://localhost:9000", 'psk');
        });

        it('will send the turn off command', async () => {
            server.on({
                method: 'POST',
                path: '/sony/IRCC',
                reply: {
                    status: 200,
                    headers: {},
                    body: ""
                }
            });
            await tvRemote.turnOff()
        })
    });
});

function respondWithCommandList(server) {
    server.on({
        method: 'POST',
        path: '/sony/system',
        reply: {
            status: 200,
            headers: {},
            body: JSON.stringify({
                result: [
                    {ignored: true},
                    [
                        {name: 'PowerOff', value: 'x1'},
                        {name: 'TvPower', value: 'x2'}
                    ],
                ]
            })
        }
    });
}


// TODO: Need to check the xml content of the rquest
function hasCommandCode(code) {
    return (req) => {
        console.log(req);
        assert.include(req.body, '<IRCCCode>' + code + '</IRCCCode>');
        return true;
    }
}