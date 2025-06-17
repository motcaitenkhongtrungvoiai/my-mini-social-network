import { URL_api } from "./Url_api.js";
export const updatedPostUi = {
  currentEditPostId: "",

  createEditPopup: () => {
    if (document.getElementById("editPopup")) return;

    const overlay = document.createElement("div");
    overlay.id = "popupOverlay";
    overlay.onclick = updatedPostUi.closeEditPopup;

    const popup = document.createElement("div");
    popup.id = "editPopup";
    popup.innerHTML = `
    <h3>Chỉnh sửa bài viết</h3>
    <textarea id="editContent" rows="5"></textarea><br><br>
    <button class="save-option">Lưu</button>
    <button class="close-option">Hủy</button>
  `;

    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    popup.querySelector(".save-option").onclick = updatedPostUi.submitEdit;
    popup.querySelector(".close-option").onclick = updatedPostUi.closeEditPopup;
  },

  openEditPopup: (postId, content) => {
    updatedPostUi.createEditPopup();
    updatedPostUi.currentEditPostId = postId;
    document.getElementById("editContent").value = content;
    document.getElementById("editPopup").style.display = "block";
    document.getElementById("popupOverlay").style.display = "block";
  },

  closeEditPopup: () => {
    document.getElementById("editPopup").style.display = "none";
    document.getElementById("popupOverlay").style.display = "none";
  },

  submitEdit: async () => {
    const newContent = document.getElementById("editContent").value;
    const auth = JSON.parse(localStorage.getItem("auth"));
    const response = await fetch(
      `${URL_api()}/v1/post/${updatedPostUi.currentEditPostId}`,
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
      const post = document.getElementById(updatedPostUi.currentEditPostId);
      post.querySelector(".post-content").innerHTML = newContent;
      updatedPostUi.closeEditPopup();
    } else {
      alert("Lỗi: " + result.message);
    }
  },
};
