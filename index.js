const clova = require("@line/clova-cek-sdk-nodejs");
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const moment = require('moment-timezone');

const NOGIZAKA_MEMBERS = [
  { name: "あきもとまなつ", birthday: "1993年8月20日" },
  { name: "いくたえりか", birthday: "1997年1月22日" },
  { name: "いとうかりん", birthday: "1993年5月26日" },
  { name: "いとうじゅんな", birthday: "1998年11月30日" },
  { name: "いとうりりあ", birthday: "2002年10月8日" },
  { name: "いのうえさゆり", birthday: "1994年12月14日" },
  { name: "いわもとれんか", birthday: "2004年2月2日" },
  { name: "うめざわみなみ", birthday: "1999年1月6日" },
  { name: "えとうみさ", birthday: "1993年1月4日" },
  { name: "おおぞのももこ", birthday: "1999年9月13日" },
  { name: "かわごひな", birthday: "1998年3月22日" },
  { name: "きたのひなこ", birthday: "1996年7月17日" },
  { name: "くぼしおり", birthday: "2001年7月14日" },
  { name: "さいとうあすか", birthday: "1998年8月10日" },
  { name: "さいとうちはる", birthday: "1997年2月17日" },
  { name: "さいとうゆうり", birthday: "1993年7月20日" },
  { name: "さかぐちたまみ", birthday: "2001年11月10日" },
  { name: "さがらいおり", birthday: "1997年11月26日" },
  { name: "さくらいれいか", birthday: "1994年5月16日" },
  { name: "ささきことこ", birthday: "1998年8月28日" },
  { name: "さとうかえで", birthday: "1998年3月23日" },
  { name: "しらいしまい", birthday: "1992年8月21日" },
  { name: "しんうちまい", birthday: "1992年1月22日" },
  { name: "すずきあやね", birthday: "1999年3月5日" },
  { name: "たかやまかずみ", birthday: "1994年2月8日" },
  { name: "てらだらんぜ", birthday: "1998年9月23日" },
  { name: "なかだかな", birthday: "1994年8月6日" },
  { name: "なかむられの", birthday: "2001年9月27日" },
  { name: "にしのななせ", birthday: "1994年5月25日" },
  { name: "のうじょうあみ", birthday: "1994年10月18日" },
  { name: "ひぐちひな", birthday: "1998年1月31日" },
  { name: "ほしのみなみ", birthday: "1998年2月6日" },
  { name: "ほりみおな", birthday: "1996年10月15日" },
  { name: "まつむらさゆり", birthday: "1992年8月27日" },
  { name: "むかいはづき", birthday: "1999年8月23日" },
  { name: "やまざきれな", birthday: "1997年5月21日" },
  { name: "やましたみづき", birthday: "1999年7月26日" },
  { name: "よしだあやのくりすてぃー", birthday: "1995年9月6日" },
  { name: "よだゆうき", birthday: "2000年5月5日" },
  { name: "わかつきゆみ", birthday: "1994年6月27日" },
  { name: "わたなべみりあ", birthday: "1999年11月1日" },
  { name: "わだまあや", birthday: "1998年4月23日" }
];

function checkBirthDay() {
    const today = moment().tz('Asia/Tokyo');
    console.log((today.month() + 1).toString());
    console.log(today.date().toString());
    const birthdayMember = new Array();
    NOGIZAKA_MEMBERS.forEach((value) => {
        const m = value.birthday.match(/(\d+)年(\d+)月(\d+)日/);
        if ((today.month() + 1).toString() === m[2] && today.date().toString() === m[3]) {
            birthdayMember.push(value.name);
        }
    });
    if (birthdayMember.length === 0) {
        return '';
    }
    let message = '本日は、';
    birthdayMember.forEach((value) => {
        message += value;
        message += " さん、";
    });
    message += "のお誕生日です。おめでとうございます！";
    return message;
}


const clovaSkillHandler = clova.Client.configureSkill()
  .onLaunchRequest(responseHelper => {
    const speech =  checkBirthDay() +  "乃木坂46のメンバーの誕生日を教えます。メンバーの名前を言ってください。終了させるときは、終了と言ってください。";
    responseHelper.setSimpleSpeech({
      lang: "ja",
      type: "PlainText",
      value: speech
    });
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
