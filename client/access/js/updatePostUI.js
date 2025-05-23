export const updatedPostUi = {
  currentEditPostId: "",
  createEditPopup: () => {
    // nếu đã có rồi thì thôi
    if (document.getElementById("editPopup")) return;

    const popupOverlay = document.createElement("div");
    popupOverlay.id = "popupOverlay";
    popupOverlay.style.cssText = `
    display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); z-index: 999;
  `;
    popupOverlay.onclick = updatedPostUi.closeEditPopup;

    const popup = document.createElement("div");
    popup.id = "editPopup";
    popup.style.cssText = `
    display: none; position: fixed; top: 20%; left: 50%; transform: translateX(-50%);
    background: white; padding: 20px; border: 1px solid #ccc; border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 1000;
  `;

    popup.innerHTML = `
    <h3>Chỉnh sửa bài viết</h3>
    <textarea id="editContent" rows="5" style="width: 100%;"></textarea><br><br>
    <button class="save-option" >Lưu</button>
    <button class="close-option">Hủy</button>
  `;

    document.body.appendChild(popupOverlay);
    document.body.appendChild(popup);

    popup.querySelector(".save-option")?.addEventListener("click", () => {
      updatedPostUi.submitEdit();
    });
    popup.querySelector(".close-option")?.addEventListener("click", () => {
      updatedPostUi.closeEditPopup();
    });
  },
  // cần gọi cái này để thực thi
  openEditPopup: (postId, currentContent) => {
    updatedPostUi.createEditPopup();
    updatedPostUi.currentEditPostId = postId;
    document.getElementById("editContent").value = currentContent;
    document.getElementById("editPopup").style.display = "block";
    document.getElementById("popupOverlay").style.display = "block";
  },
  closeEditPopup: () => {
    document.getElementById("editPopup").style.display = "none";
    document.getElementById("popupOverlay").style.display = "none";
    updatedPostUi.currentEditPostId = "";
  },
  submitEdit: async () => {
    const newContent = document.getElementById("editContent").value;
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const response = await fetch(
        `http://localhost:3000/v1/post/${updatedPostUi.currentEditPostId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${auth.accessToken}`,
          },
          body: JSON.stringify({ content: newContent, userId: auth.userId }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Cập nhật thành công!");
        updatedPostUi.updateUi(newContent);
        updatedPostUi.closeEditPopup();
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      alert("Đã xảy ra lỗi khi gửi yêu cầu.");
    }
  },
  updateUi: (newContent) => {
    const currentPost = document.getElementById( updatedPostUi.currentEditPostId);    
    const currentContent = currentPost?.querySelector(".post-content");
    if (currentContent) currentContent.innerHTML = newContent;
  },
};
