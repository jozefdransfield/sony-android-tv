const rp = require('request-promise');
const _ = require('lodash');

async function remoteFor(address, psk) {
    const commandList = await getCommandList(address);
    console.log(commandList);
    return new Remote(address, psk, commandList);
}

async function getCommandList(address) {
    const response = await rp({
        method: "POST",
        uri: address + '/sony/system',
        json: {
            'id': 20,
            'method': 'getRemoteControllerInfo',
            'version': '1.0',
            'params': []
        }
    });
    return response.result[1];
}

class Remote {
    constructor(address, psk, commandList) {
        this.address = address;
        this.psk = psk;
        this.commandList = commandList;
    }

    async turnOff() {
        return await this.execute('PowerOff');
    }

    async turnOn() {
        return await this.execute('TvPower');
    }

    async execute(commandName) {
        const code = _.find(this.commandList, (command) => {
            return command.name == commandName
        }).value;
        var body = '<?xml version="1.0"?>' +
            '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
            '<s:Body>' +
            '<u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">' +
            '<IRCCCode>' + code + '</IRCCCode>' +
            '</u:X_SendIRCC>' +
            '</s:Body>' +
            '</s:Envelope>';

        const response = await rp({
            method: "POST",
            uri: this.address + '/sony/IRCC',
            body: body,
            headers: {
                'Content-Type': 'text/xml; charset=UTF-8',
                'X-Auth-PSK': this.psk,
                'SOAPACTION': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"'
            }
        });
        return true;
    }
}

module.exports = remoteFor;
