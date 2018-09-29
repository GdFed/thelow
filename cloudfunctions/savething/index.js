// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        return await db.collection('personsweethings').add({
            data: {
                openid: event.userInfo.openId,
                id: event.id,
                donetime: event.donetime,
                doneaddr: event.doneaddr,
                happy: event.happy,
                txt: event.txt,
                wallshow: event.wallshow,
                picaddr: event.picaddr,
                timestamp: +new Date()
            }
        })
    } catch (e) {
    console.error(e)
    }
}