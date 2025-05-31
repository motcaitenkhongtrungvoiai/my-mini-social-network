let socket = null;
let isRegistered = false;
let onNotificationCallback = null;

const SERVER_URL = "ws://localhost:3000";

// Gán callback để xử lý khi có thông báo mới
export function onNotification(callback) {
  onNotificationCallback = callback;
}

// Khởi tạo kết nối WebSocket với token xác thực
export function initSocket(token) {
  if (socket && socket.readyState === WebSocket.OPEN && isRegistered) {
    return;
  }

  socket = new WebSocket(SERVER_URL);

  socket.onopen = () => {
    socket.send(
      JSON.stringify({
        type: "register",
        token: `Bearer ${token}`,
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
      console.error("WS parse error:", err);
    }
  };

  socket.onerror = (err) => console.error("WebSocket error:", err);
  socket.onclose = () => (isRegistered = false);
}

// Gửi thông báo qua WebSocket
export function sendNotification({
  token,
  recipientId,
  senderId,
  notifType,
  postId = null,
}) {
  initSocket(token); // đảm bảo socket mở trước

  const payload = {
    type: "notify",
    recipient: recipientId,
    sender: senderId,
    notifType,
    post: postId,
  };

  // Gửi nếu socket đã sẵn sàng, nếu chưa thì đợi và gửi sau
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
