let socket = null;
let isRegistered = false;
let onNotificationCallback = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000;


const SERVER_URL ="ws://localhost:3000";

export function onNotification(callback) {
  onNotificationCallback = callback;
}

function setupSocketHandlers(token, resolve, reject) {
  socket.onopen = () => {
    console.log("WebSocket connected");
    socket.send(
      JSON.stringify({
        type: "register",
        token: `Bearer ${token}`,
      })
    );
    isRegistered = true;
    reconnectAttempts = 0; 
    resolve(socket);
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
    reject(err);
  };

  socket.onclose = (event) => {
    console.log(`WebSocket closed: ${event.code} ${event.reason}`);
    isRegistered = false;
    

    if (event.code !== 1000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
      setTimeout(() => initSocket(token), RECONNECT_DELAY);
    }
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
}

export function initSocket(token) {
  return new Promise((resolve, reject) => {

    if (socket && socket.readyState === WebSocket.OPEN && isRegistered) {
      resolve(socket);
      return;
    }

   
    if (socket) {
      socket.onopen = null;
      socket.onerror = null;
      socket.onclose = null;
      socket.onmessage = null;
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    }

    socket = new WebSocket(SERVER_URL);
    setupSocketHandlers(token, resolve, reject);
  });
}

export async function sendNotification({
  token,
  recipientId,
  senderId,
  notifType,
  postId = null,
  commentId = null,
}) {
  try {
    await initSocket(token);
    
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
      throw new Error("WebSocket connection is not open");
    }
  } catch (err) {
    console.error("Failed to send notification:", err);
  
    throw err;
  }
}