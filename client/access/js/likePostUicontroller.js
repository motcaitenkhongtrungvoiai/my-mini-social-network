export const likePostUi = {
  handleLike: async (postId, buttonElement) => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const response = await fetch(
        `http://localhost:3000/v1/post/like/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${auth.accessToken}`,
          },
          body: JSON.stringify({ userId: auth.userId }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        let isliked= result.likes.includes(auth.userId);
        likePostUi.updateLikeUi(buttonElement, isliked);
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

    // Đổi icon và chữ
    if (isLiked) {
      icon.classList.remove("far");
      icon.classList.add("fas");
      icon.style.color="gold"
      spanText.textContent = "Đã thích";
      buttonElement.classList.add("liked");
    } else {
      icon.classList.remove("fas");
      icon.classList.add("far");
      spanText.textContent = "Thích";
      icon.style.color = "";
      buttonElement.classList.remove("liked");
    }
     buttonElement.dataset.isliked = isLiked.toString();
  },
  updateLikeCount: (curretLiked, btn,isLiked) => {
   const postContainer = btn.closest(".post-container");
    const statsDiv = postContainer.querySelector(".post-stats span");
    let likeCount = parseInt(curretLiked || "0", 10);
    likeCount += isLiked ? 1 : -1;
    statsDiv.innerHTML = `<i class="fas fa-thumbs-up"></i> ${likeCount}`;
  },
};
