export const commentUi = {
  // Initialize the popup
  initPopup() {
    // Remove existing popup if any
    const existingPopup = document.getElementById("comment-popup");
    if (existingPopup) {
      document.body.removeChild(existingPopup);
    }

    // Create popup container
    const popup = document.createElement("div");
    popup.id = "comment-popup";
    popup.className = "comment-popup";

    // Create popup content
    popup.innerHTML = `
      <div class="popup-header">
        <h3>Bình luận</h3>
        <button class="close-popup">&times;</button>
      </div>
      <div class="popup-content">
        <div class="all_comment_container">
          <textarea id="main-comment-content" rows="3" placeholder="Viết bình luận..."></textarea>
          <button id="create_comment">Gửi bình luận</button>
          <div id="comments-container"></div>
        </div>
      </div>
    `;

    // Append to body
    document.body.appendChild(popup);

    // Add close event
    popup.querySelector(".close-popup").addEventListener("click", () => {
      const popup = document.querySelector(".comment-popup");
      popup.style.display = "none";
      document.body.style.overflow = "";
    });
  },
};
