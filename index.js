const clova = require('@line/clova-cek-sdk-nodejs');
const express = require('express');
const bodyParser = require('body-parser');

const clovaSkillHandler = clova.Client
    .configureSkill()
    .onLaunchRequest(responseHelper => {
        responseHelper.setSimpleSpeech({
            lang: 'ja',
            type: 'PlainText',
            value: 'ようこそ'
        });
    })
    .onIntentRequest(responseHelper => {
        const intent = responseHelper.getIntentName();
        const sessionId = responseHelper.getSessionId();
        const slots = responseHelper.getSlots();
        console.log(slots);
        switch (intent) {
            case 'MembersIntent':
                responseHelper.setSimpleSpeech({
                    lang: 'ja',
                    type: 'PlainText',
                    value: 'メンバーです'
                })
            break;
        }
    })
    .onSessionEndedRequest(responseHelper => {
    })
    .handle();

const app = new express();
const clovaMiddleware = clova.Middleware({
    applicationId: process.env.APPLICATION_ID
});
app.post('/clova', clovaMiddleware, clovaSkillHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});