import { updatedPostUi } from "../modules/updatePostUi.js";

function checkPostOwner(postUserID) {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth?.userId === postUserID;
  
}

export function attachReportEvents() {
  document.querySelectorAll(".report-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const { userid, postid, postcontent } = btn.dataset;
      showReportMenu(userid, postid, postcontent, btn);
    });
  });
}

function showReportMenu(postUserID, postId, oldContent, triggerBtn) {
  let popup = document.querySelector(".popUpReport") || document.createElement("div");
  popup.className = "popUpReport";
  document.body.appendChild(popup);

  const isOwner = checkPostOwner(postUserID);
  popup.innerHTML = `
    <div class="options-menu">
      ${
        isOwner
          ? `<div class="option-item edit-option"><i class="fas fa-edit"></i><span>Chỉnh sửa</span></div>
             <div class="option-item delete-option"><i class="fas fa-trash"></i><span>Xóa</span></div>`
          : ""
      }
      <div class="option-item report-option"><i class="fas fa-flag"></i><span>Báo cáo</span></div>
    </div>`;

  popup.classList.add("show");

  popup.querySelector(".report-option")?.addEventListener("click", () => {
    alert(`Đã báo cáo bài viết ${postId}`);
    popup.classList.remove("show");
  });

  popup.querySelector(".delete-option")?.addEventListener("click", async () => {
    if (confirm("Bạn có chắc muốn xóa?")) {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const res = await fetch(`http://localhost:3000/v1/post/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", token: `Bearer ${auth.accessToken}` },
        body: JSON.stringify({ userId: auth.userId }),
      });
      if (res.ok) document.getElementById(postId).style.display = "none";
      else alert("Lỗi khi xóa bài viết.");
    }
    popup.classList.remove("show");
  });

  popup.querySelector(".edit-option")?.addEventListener("click", () => {
    updatedPostUi.openEditPopup(postId, oldContent);
    popup.classList.remove("show");
  });

  document.addEventListener("click", function handler(e) {
    if (!popup.contains(e.target) && e.target !== triggerBtn) {
      popup.classList.remove("show");
      document.removeEventListener("click", handler);
    }
  }, { once: true });
}
