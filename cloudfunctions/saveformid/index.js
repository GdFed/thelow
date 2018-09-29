// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        if(event.formid != 'the formId is a mock one'){
            return await db.collection('formid').add({
                data: {
                    openid: event.userInfo.openId,
                    formid: event.formid,
                    timestamp: +new Date()
                }
            })
        }
    } catch (e) {
    console.error(e)
    }
}