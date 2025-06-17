import { URL_api } from "./Url_api.js";
export const likePostUi = {
  handleLike: async (postId, buttonElement) => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const response = await fetch(`${URL_api()}/v1/post/like/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({ userId: auth.userId }),
      });

      const result = await response.json();
      if (response.ok) {
        const isLiked = result.likes.includes(auth.userId);
        likePostUi.updateLikeUi(buttonElement, isLiked);
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu like:", err);
      alert("Đã xảy ra lỗi hệ thống.");
    }
  },

  updateLikeUi: (buttonElement, isLiked) => {
    const icon = buttonElement.querySelector("i");
    const spanText = buttonElement.querySelector("span");
    if (isLiked) {
      icon.classList.replace("far", "fas");
      icon.style.color = "gold";
      spanText.textContent = "Đã thích";
      buttonElement.classList.add("liked");
    } else {
      icon.classList.replace("fas", "far");
      icon.style.color = "";
      spanText.textContent = "Thích";
      buttonElement.classList.remove("liked");
    }
    buttonElement.dataset.isliked = isLiked.toString();
  },

  updateLikeCount: (currentLiked, btn, isLiked) => {
    const statsDiv = btn.closest(".post-container").querySelector(".post-stats span");
    let count = parseInt(currentLiked || "0", 10);
    count += isLiked ? 1 : -1;
    statsDiv.innerHTML = `<i class="fas fa-thumbs-up"></i> ${count}`;
  },
};

