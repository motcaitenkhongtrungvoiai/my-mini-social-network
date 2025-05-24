import { commentUi } from "../access/js/commentUIcontroller.js";
import { updatedPostUi } from "../access/js/updatePostUI.js";
import { likePostUi } from "../access/js/likePostUicontroller.js";
 const auth = JSON.parse(localStorage.getItem("auth"));
document.addEventListener("DOMContentLoaded", async () => {
  const postContainer = document.querySelector(".post-containerAll");

  try {
    const response = await fetch("http://localhost:3000/v1/post/feed", {
      method: "get",
    });
    
    if (!response.ok) throw new Error("Failed to fetch posts");

    const posts = await response.json();

    if (posts.length === 0) throw new Error("Không tìm thấy bài viết nào.");

    posts.forEach((post) => {
      const postId = post._id;
      const postElement = document.createElement("div");
      postElement.className = "post";
      postElement.innerHTML = `
        <div class="post-container" id="${postId}">
          <div class="post-header">
            <img src="${post.user.avatar}" alt="Avatar" class="avatar">
            <div class="user-info">
              <a href="/profile/${post.user._id}" class="username">${post.user.username}</a>
            </div>
            <div class="more-options">
              <button class="action-btn report-btn" 
                      data-userid="${post.user._id}" 
                      data-postid="${postId}"
                      data-postcontent="${post.content}"
                      >
                <i class="fas fa-ellipsis-h"></i>
              </button>
            </div>
          </div>

          <div class="post-content">${post.content || ""}</div>
          ${
            post.image
              ? `<img src="${post.image}" alt="Post image" class="post-image">`
              : ""
          }
          <div class="post-stats"   data-commentCount="${post.commentCount}">
            <span><i class="fas fa-thumbs-up"></i> ${post.likeCount}</span>
            <span style="margin-left: 15px;"><i class="fas fa-comment"></i> ${post.commentCount} bình luận</span>
          </div>
          <div class="post-actions">
            <button class="action-btn like-btn" data-postid="${postId}" data-isliked="${post.likedPostIds.includes(auth.userId)}" data-likecount="${post.likeCount}">
              <i class="far fa-thumbs-up"></i><span>Thích</span>
            </button>
            <button class="action-btn comment-btn" data-postid="${postId}">
              <i class="far fa-comment"></i><span>Bình luận</span>
            </button>
          </div>
        </div>
      `;

      postContainer.appendChild(postElement);
    });

    attachEventHandlers();
  } catch (err) {
    console.error("Fetch error:", err);
    postContainer.innerHTML = "<p>Không thể tải bài viết.</p>";
  }
});

function attachEventHandlers() {
  document.querySelectorAll(".like-btn").forEach((btn) => {
    const isLiked = btn.dataset.isliked === "true";
    
    // Cập nhật giao diện khi tải trang
    likePostUi.updateLikeUi(btn, isLiked);

    btn.addEventListener("click", () => {
      const postId = btn.dataset.postid;
      const wasLiked = btn.dataset.isliked === "true";
      const newLiked = !wasLiked;

      likePostUi.updateLikeUi(btn, newLiked);
      const currentLikeCount = btn.closest(".post-container").querySelector(".post-stats span")?.textContent?.match(/\d+/)?.[0];
      likePostUi.updateLikeCount(currentLikeCount, btn, newLiked);

      likePost(postId, newLiked);
    });
  });

  document.querySelectorAll(".comment-btn").forEach((btn) => {
    btn.addEventListener("click", () => showComments(btn.dataset.postid));
  });

  document.querySelectorAll(".report-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      callReportMenu(btn.dataset.userid, btn.dataset.postid,btn.dataset.postcontent ,btn);
    });
  });
}

function checkPostOwner(postUserID) {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth?.userId === postUserID;
}

function callReportMenu(postUserID, postId, oldContent ,triggerBtn) {
  let popup = document.querySelector(".popUpReport");

  if (!popup) {
    popup = document.createElement("div");
    popup.className = "popUpReport";
    document.body.appendChild(popup);
  }

  const isOwner = checkPostOwner(postUserID);
  popup.innerHTML = `
    <div class="options-menu">
      ${
        isOwner
          ? `
        <div class="option-item edit-option">
          <i class="fas fa-edit"></i><span>Chỉnh sửa bài viết</span>
        </div>
        <div class="option-item delete-option">
          <i class="fas fa-trash-alt"></i><span>Xóa bài viết</span>
        </div>
      `
          : ""
      }
      <div class="option-item report-option">
        <i class="fas fa-flag"></i><span>Báo cáo bài viết</span>
      </div>
    </div>
  `;

  popup.classList.add("show");

  // Gắn sự kiện cho các lựa chọn
  popup.querySelector(".report-option")?.addEventListener("click", () => {
    reportPost(postId);
    popup.classList.remove("show");
  });

  popup.querySelector(".delete-option")?.addEventListener("click", () => {
    deletePost(postId);
    popup.classList.remove("show");
  });

  popup.querySelector(".edit-option")?.addEventListener("click", () => {
    editPost(postId,oldContent);
    popup.classList.remove("show");
  });

  // Ẩn popup nếu click ra ngoài
  document.addEventListener(
    "click",
    function handler(e) {
      if (!popup.contains(e.target) && e.target !== triggerBtn) {
        popup.classList.remove("show");
        document.removeEventListener("click", handler);
      }
    },
    { once: true }
  );
}

function likePost(postId) {
  console.log(`Đã like bài viết ${postId}`);
  const button = document.querySelector(`.like-btn[data-postid="${postId}"]`);
  if (button) likePostUi.handleLike(postId,button);
}

function showComments(postId) {
  console.log(`Hiển thị bình luận cho bài viết ${postId}`);
  commentUi.testfunc(postId);
}

function editPost(postId,oldContent) {
  console.log(`Chỉnh sửa bài viết ${postId}`);
  updatedPostUi.openEditPopup(postId,oldContent)
}

async function deletePost(postId) {
  if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

  try {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const res = await fetch(`http://localhost:3000/v1/post/${postId}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${auth.accessToken}`,
      },
      body: JSON.stringify({ userId: auth.userId }),
    });

    if (res.ok) {
      document.getElementById(postId).style.display = "none";
      console.log("Đã xóa bài viết:", postId);
    } else {
      console.error("Không xóa được bài viết.");
    }
  } catch (err) {
    console.error("Lỗi khi xóa bài viết:", err);
  }
}

function reportPost(postId) {
  console.log(`Báo cáo bài viết ${postId}`);
}
