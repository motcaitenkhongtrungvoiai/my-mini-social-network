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
  return new Promise((resolve, reject) => {
    if (socket && socket.readyState === WebSocket.OPEN && isRegistered) {
      resolve(socket);
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
      resolve(socket);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      reject(err);
    };

    socket.onclose = () => {
      isRegistered = false;
    };

    // Giữ nguyên phần onmessage
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
  });
}

// Gửi thông báo qua WebSocket
export async function sendNotification({
  token,
  recipientId,
  senderId,
  notifType,
  postId = null,
  commentId = null,
}) {
  try {
    await initSocket(token); // Đợi kết nối hoàn tất
    
    const payload = {
      type: "notify",
      recipient: recipientId,
      sender: senderId,
      notifType,
      post: postId,
      comment: commentId,
    };

    // Kiểm tra lại trạng thái trước khi gửi
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
    } else {
      throw new Error("WebSocket connection is not open");
    }
  } catch (err) {
    console.error("Failed to send notification:", err);

  }
}
