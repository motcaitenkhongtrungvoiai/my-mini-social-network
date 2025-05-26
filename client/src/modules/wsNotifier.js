let socket = null;
let isRegistered = false;
let onNotificationCallback = null;
import { getData } from "./getData.js";
const SERVER_URL = "ws://localhost:3000";

export function onNotification(callback) {
  onNotificationCallback = callback;
}

function initSocket(token) {
  if (socket && socket.readyState === WebSocket.OPEN && isRegistered) {
    return;
  }
  auth = getData.getAuth();
  socket = new WebSocket(SERVER_URL);

  socket.onopen = () => {
    socket.send(
      JSON.stringify({
        type: "register",
        token: `Bearer ${auth.accessToken}`,
      })
    );
    isRegistered = true;
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "new_notification" && onNotificationCallback) {
        onNotificationCallback(data.notification);
      }
    } catch (err) {
      console.error(" WS parse error:", err);
    }
  };

  socket.onerror = (err) => console.error("WebSocket error:", err);
  socket.onclose = () => (isRegistered = false);
}

export function sendNotification({
  token,
  recipientId,
  senderId,
  notifType,
  postId = null,
  commentId = null,
}) {
  initSocket(token);
  const payload = {
    type: "notify",
    recipient: recipientId,
    sender: senderId,
    notifType,
    post: postId,
    comment: commentId,
  };

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  } else {
    const waitSend = setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
        clearInterval(waitSend);
      }
    }, 100);
  }
}
