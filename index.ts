import * as clova from '@line/clova-cek-sdk-nodejs';
import * as Express from 'express';
import bodyParser = require('body-parser');

const clovaSkillHandler  = clova.Client
    .configureSkill()
    .onLaunchRequest(async responseHelper => {
        responseHelper.setSimpleSpeech({
            lang: 'ja',
            type: 'PlainText',
            value: '乃木坂46のメンバーの誕生日を教えます。メンバーの名前を言ってください。'
        });
    })
    .onIntentRequest(async responseHelper => {
        const intent = responseHelper.getIntentName();
        const sessionId = responseHelper.getSessionId();
        const slots = responseHelper.getSlots();
        switch (intent) {
            case 'MembersIntent':
                switch (slots.memberName) {
                    case 'しらいしまい':
                    responseHelper.setSimpleSpeech({
                        lang: 'ja',
                        type: 'PlainText',
                        value: '白石麻衣さんは1992年8月20日です。'
                    })
                    break;
                }
            break;
        }
    })
    .onSessionEndedRequest(async responseHelper => {
    })
    .handle();

const app = Express();
const clovaMiddleware = clova.Middleware({
    applicationId: process.env.APPLICATION_ID
});
app.post('/clova', clovaMiddleware, (req, res) => { 
    clovaSkillHandler();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});

export default app
