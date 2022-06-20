const P = require('pino')
const { delay, DisconnectReason, useSingleFileAuthState } = require('@adiwajshing/baileys')
const makeWASocket = require('@adiwajshing/baileys').default;
const qrcode = require('qrcode-terminal');
const { MessageType, MessageOptions, Mimetype }  = require('@adiwajshing/baileys')

const { state, saveState } = useSingleFileAuthState('./auth/auth.json')

const sock = makeWASocket({
    logger: P({ level: 'fatal' }),
    printQRInTerminal: true,
    auth: state,
    browser: ["WANIAN Multi Device", "MacOS", "3.0"] //custom agent name
});


const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT | 3000;
const host = process.env.HOST | "0.0.0.0";

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// start a connection
const sendMessage = async(msg, jid) => {
    await sock.sendMessage(jid, msg)
}

const startSock = () => {

    sock.ev.on('messages.update', m => {
        // console.log(m)
        qrcode.generate(m, {small: true});
    })

    // listen for when the auth credentials is updated
    sock.ev.on('creds.update', saveState)

    sock.ev.on('connection.update', function (update, connection2) {
        let _a, _b;
        let connection = update.connection, lastDisconnect = update.lastDisconnect;
        if (connection === 'close') {
            // reconnect if not logged out
            if (((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== DisconnectReason.loggedOut) {

                startSock()


            }
            else {
                console.log('connection closed');
            }
        }
        console.log('connection update', update);
    });


    return sock
}

const phoneNumberFormatter = function (number) {
    let formatted = number.replace(/\D/g, '');

    if (formatted.startsWith('0')) {
        formatted = '62' + formatted.substr(1);
    }

    if (!formatted.endsWith('@c.us')) {
        formatted += '@c.us';
    }

    return formatted;
}


app.post('/send-message', async (req, res) => {
    const key = req.body.key;
    const number = phoneNumberFormatter(req.body.number);
    const message = req.body.message;
    const type = req.body.type;
    const extraOptions = req.body.option;
    const buttons =[];

    let msg;
    switch(type) {
        case 'text':
            msg = {text: message}
            break;

        case 'button':
            if (extraOptions==undefined || !Array.isArray(extraOptions)){
                res.setHeader("Content-Type", "Application/Json");
                res.status(200).send(JSON.stringify({
                    info: false,
                    status: "options required"
                }));
                return
            }
            extraOptions.forEach((values, keys) => {
                buttons.push(
                    {buttonId: values.id, buttonText: {displayText: values.text}, type: 1}
                );
            })

            const buttonMessage = {
                text: message,
                buttons: buttons,
                headerType: 1
            }
            msg = buttonMessage
            break;

        case 'template':
            extraOptions.forEach((values, keys) => {
                if(values.type == 'url'){
                    buttons.push(
                        {index: keys+1, urlButton: {displayText: values.text, url: values.url}},
                    );
                }else if(values.type == 'call'){
                    buttons.push(
                        {index: keys+1, callButton: {displayText: values.text, phoneNumber: values.number}},
                    );
                }
            })

            const templateMessage = {
                text: message,
                templateButtons: buttons
            }
            msg = templateMessage
            break;

        case 'list':
            const sections =[]
            extraOptions.forEach((values, keys) => {
                const row = [];
                values.sections.forEach((v, k) => {
                    row.push({
                        title: v.title, rowId: v.rowid, description: v.description
                    });
                })
                sections.push({
                        title: values.text,
                        rows: row
                })

        console.log(row)
            })


            const listMessage = {
              text: message,
              footer: req.body.footer,
              title: req.body.title,
              buttonText: req.body.buttontext,
              sections
            }

        console.log(listMessage)
            msg = listMessage
            break;

        default:
            res.status(200).json({
                status: true,
                response: "asdad"
            });
            return false;
            break;
    }

    let response = await sock.sendMessage(number, msg)
    res.status(200).json({
        status: true,
        response: response
    });
})

startSock()

app.listen(port, host, () => console.log(`listening at http://${host}:${port}`));