const WebSocket = require("ws");

const notificationController = require("../../controllers/notificationController");
const { verifyTokenSocket } = require("../../middleware/websocketAuth");

const userSockets = new Map();
const notificationSocket = (wss) => {
  wss.on("connection", (ws) => {
    let userId = null;
    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);
        if (data.type === "register") {
          const token = data.token?.split(" ")[1];
          if (!token) return;

          try {
            const user = await verifyTokenSocket(token);
            userId = user._id;
            userSockets.set(userId, ws);
            console.log(` [WS] User ${userId} kết nối với sever`);
          } catch (err) {
            console.error(` [WS] Lỗi xác thực token: ${err}`);
          }
        }
        if (data.type === "notify") {
          const { recipient, sender, notifType, post ,comment} = data;
          const newNotif = await notificationController.initNotification({
            recipient,
            sender,
            type: notifType,
            post,        
            comment:comment, 
          });
          if (!newNotif) return;

          const recipientSocket = userSockets.get(recipient);
          if (
            recipientSocket &&
            recipientSocket.readyState === WebSocket.OPEN
          ) {
            recipientSocket.send(
              JSON.stringify({
                type: "new_notification",
                notification: newNotif,
              })
            );
            console.log(` Đã gửi thông báo cho ${recipient}`);
          }
        }
      } catch (err) {
        console.error("lỗi sử lý noice", err);
      }
    });
    ws.on("close", () => {
      if (userId) {
        userSockets.delete(userId);
        console.log(` [WS] User ${userId} ngắt kết nối`);
      }
    });
  });
};
module.exports = notificationSocket;
