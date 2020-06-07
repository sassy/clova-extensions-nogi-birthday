const clova = require("@line/clova-cek-sdk-nodejs");
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const moment = require('moment-timezone');

const NOGIZAKA_MEMBERS = [
    { name: "あきもと まなつ", birthday: "1993年8月20日" },
    { name: "いくた えりか", birthday: "1997年1月22日" },
    { name: "いとう じゅんな", birthday: "1998年11月30日" },
    { name: "いとう りりあ", birthday: "2002年10月8日" },
    { name: "いわもと れんか", birthday: "2004年2月2日" },
    { name: "うめざわ みなみ", birthday: "1999年1月6日" },
    { name: "おおぞの ももこ", birthday: "1999年9月13日" },
    { name: "きたの ひなこ", birthday: "1996年7月17日" },
    { name: "くぼ しおり", birthday: "2001年7月14日" },
    { name: "さいとう あすか", birthday: "1998年8月10日" },
    { name: "さかぐち たまみ", birthday: "2001年11月10日" },
    { name: "さとう かえで", birthday: "1998年3月23日" },
    { name: "しらいし まい", birthday: "1992年8月20日" },
    { name: "しんうち まい", birthday: "1992年1月22日" },
    { name: "すずき あやね", birthday: "1999年3月5日" },
    { name: "たかやま かずみ", birthday: "1994年2月8日" },
    { name: "てらだ らんぜ", birthday: "1998年9月23日" },
    { name: "なかだ かな", birthday: "1994年8月6日" },
    { name: "なかむら れの", birthday: "2001年9月27日" },
    { name: "ひぐち ひな", birthday: "1998年1月31日" },
    { name: "ほしの みなみ", birthday: "1998年2月6日" },
    { name: "ほり みおな", birthday: "1996年10月15日" },
    { name: "まつむら さゆり", birthday: "1992年8月27日" },
    { name: "むかい はづき", birthday: "1999年8月23日" },
    { name: "やまざき れな", birthday: "1997年5月21日" },
    { name: "やました みづき", birthday: "1999年7月26日" },
    { name: "よしだ あやのくりすてぃー", birthday: "1995年9月6日" },
    { name: "よだ ゆうき", birthday: "2000年5月5日" },
    { name: "わたなべ みりあ", birthday: "1999年11月1日" },
    { name: "わだ まあや", birthday: "1998年4月23日" },
    { name: "えんどう さくら", birthday: "2001年10月3日" },
    { name: "かき はるか", birthday: "2001年8月8日" },
    { name: "かけはし さやか", birthday: "2002年11月20日" },
    { name: "かながわ さや", birthday: "2001年10月31日" },
    { name: "きたがわ ゆり", birthday: "2001年8月8日" },
    { name: "しばた ゆな", birthday: "2003年3月3日" },
    { name: "せいみや れい", birthday: "2003年8月1日" },
    { name: "たむら まゆ", birthday: "1999年1月12日" },
    { name: "つつい あやめ", birthday: "2004年6月8日" },
    { name: "はやかわ せいら", birthday: "2000年8月24日" },
    { name: "やくぼ みお", birthday: "2002年8月14日" },
    { name: "くろみ はるか", birthday: "2004年1月19日" },
    { name: "さとう りか", birthday: "2001年8月9日" },
    { name: "はやし るな", birthday: "2003年10月2日" },
    { name: "まつお みゆ", birthday: "2004年1月3日" },
    { name: "ゆみき なお", birthday: "1999年2月3日" },
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
