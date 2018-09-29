// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    let data = event.person
    data.openid = event.userInfo.openId
    try {
        const res = await db.collection('personinfo').where({openid: event.userInfo.openId}).count()
        console.log(res.total)
        if(res.total){
            return await db.collection('personinfo').where({
                openid: event.userInfo.openId
              }).update({data: event.person})
        } else {
            return await db.collection('personinfo').add({data})
        }
    
        
    } catch (e) {
    console.error(e)
    }
}