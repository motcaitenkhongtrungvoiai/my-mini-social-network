import { likePostUi } from "../modules/likePostUi.js";

export function attachLikeEvents() {
  document.querySelectorAll(".like-btn").forEach((btn) => {
    const isLiked = btn.dataset.isliked === "true";
    likePostUi.updateLikeUi(btn, isLiked);

    btn.addEventListener("click", () => {
      const postId = btn.dataset.postid;
      const wasLiked = btn.dataset.isliked === "true";
      const newLiked = !wasLiked;
      const likeCount = btn.closest(".post-container").querySelector(".post-stats span")?.textContent?.match(/\d+/)?.[0];

      likePostUi.updateLikeUi(btn, newLiked);
      likePostUi.updateLikeCount(likeCount, btn, newLiked);
      likePostUi.handleLike(postId, btn);
    });
  });
}