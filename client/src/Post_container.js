document.addEventListener("DOMContentLoaded", async () => {
  const postContainer = document.querySelector(".post-containerAll");

  try {
    const response = await fetch("http://localhost:3000/v1/post/feed", {
      method: "get",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const posts = await response.json();

    if (posts.length === 0) {
      throw new Error("Không tìm thấy bài viết nào.");
    }

    posts.forEach((post) => {
      const postId = post._id;
      const postElement = document.createElement("div");
      postElement.className = "post";
      postElement.innerHTML = `
        <div class="post-container" id="${postId}">
          <div class="post-header">
            <img src="${post.user.avatar}" alt="Avatar" class="avatar">
            <div class="user-info">
              <a href="/profile/${post.user._id}" class="username">${
        post.user.username
      }</a>
            </div>
            <div class="more-options">
              <button class="action-btn report-btn" data-userid="${post.user._id}" data-postid="${post._id}">
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
          <div class="post-stats">
            <span><i class="fas fa-thumbs-up"></i> ${post.likeCount}</span>
            <span style="margin-left: 15px;"><i class="fas fa-comment"></i> ${
              post.commentCount
            } bình luận</span>
          </div>
          <div class="post-actions">
            <button class="action-btn like-btn" data-postid="${postId}">
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

    attachEventHandlers(); // Thêm event sau khi tạo xong DOM
  } catch (err) {
    console.error("Fetch error:", err);
    postContainer.innerHTML = "<p>Không thể tải bài viết.</p>";
  }
});



function attachEventHandlers() {
  document.querySelectorAll(".like-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const postId = btn.dataset.postid;
      likePost(postId);
    });
  });

  document.querySelectorAll(".comment-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const postId = btn.dataset.postid;
      showComments(postId);
    });
  });

  document.querySelectorAll(".report-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); 
      const userId = btn.dataset.userid;
      const postId = btn.dataset.postid;
      callReportMenu(userId, postId, btn);
    });
  });
}

function checkPostOwner(postUserID) {
  const auth = JSON.parse(localStorage.getItem("auth"));
  console.log(auth.userId+" và "+postUserID);
  console.error(auth.userId === postUserID) ;
  
}

function callReportMenu(postUserID, postId) {
  let popup = document.querySelector(".popUpReport");

  if (!popup) {
    popup = document.createElement("div");
    popup.className = "popUpReport";
    document.body.appendChild(popup);
  }

  const isOwner = true;
  checkPostOwner(postUserID);
  popup.innerHTML = `
    <div class="options-menu">
      ${
        isOwner
          ? `
        <div class="option-item edit-option" onclick="editPost('${postId}')">
          <i class="fas fa-edit"></i><span>Chỉnh sửa bài viết</span>
        </div>
        <div class="option-item delete-option" onclick="deletePost('${postId}')">
          <i class="fas fa-trash-alt"></i><span>Xóa bài viết</span>
        </div>
      `
          : ""
      }
      <div class="option-item report-option" onclick="reportPost('${postId}')">
        <i class="fas fa-flag"></i><span>Báo cáo bài viết</span>
      </div>
    </div>
  `;

  popup.classList.add("show");
  document.addEventListener(
    "click",
    function handler(e) {
      if (!popup.contains(e.target)) {
        popup.classList.remove("show");
        document.removeEventListener("click", handler);
      }
    },
    { once: true }
  );
}

function likePost(postId) {
  console.log(`Đã like bài viết ${postId}`);
}

function showComments(postId) {
  console.log(`Hiển thị bình luận cho bài viết ${postId}`);
}

function editPost(postId) {
  console.log(`Chỉnh sửa bài viết ${postId}`);
}

function deletePost(postId) {
  if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
    console.log(`Đã xóa bài viết ${postId}`);
  }
}

function reportPost(postId) {
  console.log(`Báo cáo bài viết ${postId}`);
}
