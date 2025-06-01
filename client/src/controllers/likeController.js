import { likePostUi } from "../modules/likePostUi.js";
import { sendNotification } from "../modules/wsNotifier.js";
import { getData } from "../modules/getData.js";
export function attachLikeEvents() {
  document.querySelectorAll(".like-btn").forEach((btn) => {
    const isLiked = btn.dataset.isliked === "true";
    likePostUi.updateLikeUi(btn, isLiked);

    btn.addEventListener("click", () => {
      const postId = btn.dataset.postid;
      const wasLiked = btn.dataset.isliked === "true";
      const newLiked = !wasLiked;
      const likeCount = btn.closest(".post-container").querySelector(".post-stats span")?.textContent?.match(/\d+/)?.[0];
       const postOwner = btn.dataset.postower;
      likePostUi.updateLikeUi(btn, newLiked);
      likePostUi.updateLikeCount(likeCount, btn, newLiked);
      const auth = getData.getAuth();
            
      try {
        likePostUi.handleLike(postId, btn);

        if (newLiked) {
          const notificationResult = sendNotification({
            token: auth.accessToken,
            recipientId: postOwner,
            senderId: auth.userId,
            notifType: "đã thích bài viết của bạn",
            postId: postId,
          });
          console.log("Kết quả gửi thông báo:", notificationResult);
        }
      } catch (err) {
        console.error("like logic wrong" + err);
      }
    });
  });
}
