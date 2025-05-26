const Notification = require("../model/notification");

const notificationController = {
  initNotification: async ({ recipient, sender, type, post, comment }) => {
    try{
        const newNotice = await Notification.create({
            recipient,sender,type,post,comment
        });
        return newNotice;
    }
    catch(err){
        console.error('\n noice wrong insert!!',err);
        return null;
    }
  },
};
module.exports=notificationController;