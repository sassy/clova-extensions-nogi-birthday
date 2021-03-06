const clova = require("@line/clova-cek-sdk-nodejs");
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const moment = require('moment-timezone');

const NOGIZAKA_MEMBERS = [
    { name: "あきもとまなつ", birthday: "1993年8月20日" },
    { name: "いくたえりか", birthday: "1997年1月22日" },
    { name: "いとうじゅんな", birthday: "1998年11月30日" },
    { name: "いとうりりあ", birthday: "2002年10月8日" },
    { name: "いわもとれんか", birthday: "2004年2月2日" },
    { name: "うめざわみなみ", birthday: "1999年1月6日" },
    { name: "おおぞのももこ", birthday: "1999年9月13日" },
    { name: "きたのひなこ", birthday: "1996年7月17日" },
    { name: "くぼしおり", birthday: "2001年7月14日" },
    { name: "さいとうあすか", birthday: "1998年8月10日" },
    { name: "さかぐちたまみ", birthday: "2001年11月10日" },
    { name: "さとうかえで", birthday: "1998年3月23日" },
    { name: "しらいしまい", birthday: "1992年8月20日" },
    { name: "しんうちまい", birthday: "1992年1月22日" },
    { name: "すずきあやね", birthday: "1999年3月5日" },
    { name: "たかやまかずみ", birthday: "1994年2月8日" },
    { name: "てらだらんぜ", birthday: "1998年9月23日" },
    { name: "なかだかな", birthday: "1994年8月6日" },
    { name: "なかむられの", birthday: "2001年9月27日" },
    { name: "ひぐちひな", birthday: "1998年1月31日" },
    { name: "ほしのみなみ", birthday: "1998年2月6日" },
    { name: "ほりみおな", birthday: "1996年10月15日" },
    { name: "まつむらさゆり", birthday: "1992年8月27日" },
    { name: "むかいはづき", birthday: "1999年8月23日" },
    { name: "やまざきれな", birthday: "1997年5月21日" },
    { name: "やましたみづき", birthday: "1999年7月26日" },
    { name: "よしだあやのくりすてぃー", birthday: "1995年9月6日" },
    { name: "よだゆうき", birthday: "2000年5月5日" },
    { name: "わたなべみりあ", birthday: "1999年11月1日" },
    { name: "わだまあや", birthday: "1998年4月23日" },
    { name: "えんどうさくら", birthday: "2001年10月3日" },
    { name: "かきはるか", birthday: "2001年8月8日" },
    { name: "かけはしさやか", birthday: "2002年11月20日" },
    { name: "かながわさや", birthday: "2001年10月31日" },
    { name: "きたがわゆり", birthday: "2001年8月8日" },
    { name: "しばたゆな", birthday: "2003年3月3日" },
    { name: "せいみやれい", birthday: "2003年8月1日" },
    { name: "たむらまゆ", birthday: "1999年1月12日" },
    { name: "つついあやめ", birthday: "2004年6月8日" },
    { name: "はやかわせいら", birthday: "2000年8月24日" },
    { name: "やくぼみお", birthday: "2002年8月14日" },
    { name: "くろみはるか", birthday: "2004年1月19日" },
    { name: "さとうりか", birthday: "2001年8月9日" },
    { name: "はやしるな", birthday: "2003年10月2日" },
    { name: "まつおみゆ", birthday: "2004年1月3日" },
    { name: "ゆみきなお", birthday: "1999年2月3日" },
];

function checkBirthDay() {
    const today = moment().tz('Asia/Tokyo');
    const birthdayMember = new Array();
    NOGIZAKA_MEMBERS.forEach((value) => {
        const m = value.birthday.match(/(\d+)年(\d+)月(\d+)日/);
        if ((today.month() + 1).toString() === m[2] && today.date().toString() === m[3]) {
            birthdayMember.push(value.name);
        }
    });
    if (birthdayMember.length === 0) {
        return [];
    }
    let message = '本日は、';
    birthdayMember.forEach((value) => {
        message += value;
        message += " さん、";
    });
    message += "のお誕生日です。おめでとうございます！";
    return [
        clova.SpeechBuilder.createSpeechUrl('https://s3-ap-northeast-1.amazonaws.com/nogi-birthday/happy.mp3'),
        clova.SpeechBuilder.createSpeechText(message)
    ];
}


const clovaSkillHandler = clova.Client.configureSkill()
  .onLaunchRequest(responseHelper => {
    const speechArray = checkBirthDay();
    speechArray.push(
        clova.SpeechBuilder.createSpeechText( "乃木坂46のメンバーの誕生日を教えます。メンバーの名前を言ってください。終了させるときは、終了と言ってください。")
    );

    responseHelper.setSpeechList(speechArray);
  })
  .onIntentRequest(responseHelper => {
    const intent = responseHelper.getIntentName();
    const sessionId = responseHelper.getSessionId();
    const slots = responseHelper.getSlots();
    switch (intent) {
        case "MembersIntent":
            const member = _.find(NOGIZAKA_MEMBERS, { name: slots.memberName });
            if (!_.isUndefined(member)) {
                responseHelper.setSimpleSpeech({
                    lang: "ja",
                    type: "PlainText",
                    value: `${member.name}さんは　${member.birthday} です。`
                });
            } else {
                responseHelper.setSimpleSpeech({
                    lang: "ja",
                    type: "PlainText",
                    value: "そのメンバーはいません。" + 
                        "乃木坂46のメンバーの誕生日を教えます。メンバーの名前を言ってください。終了させるときは、終了と言ってください。" 
                });
            }
            break;
        case "Clova.GuideIntent":
            responseHelper.setSimpleSpeech({
                lang: "ja",
                type: "PlainText",
                value:
                "乃木坂46のメンバーの誕生日を教えます。メンバーの名前を言ってください。終了させるときは、終了と言ってください。"
            });
            break;
        case "Clova.YesIntent":
        case "Clova.NoIntent":
        case "Clova.CancelIntent":
            /* do nothing */
            break;
    }
  })
  .onSessionEndedRequest(responseHelper => {})
  .handle();

const app = new express();
const clovaMiddleware = clova.Middleware({
  applicationId: process.env.APPLICATION_ID
});
app.post("/clova", clovaMiddleware, clovaSkillHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
