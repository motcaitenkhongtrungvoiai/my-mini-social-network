const API_BASE = "http://localhost:3000"; 
import { getData } from "./module/getData.js";
const auth = getData.getAuth();

async function fetchReportedPosts() {
  try {
    const res = await fetch(`${API_BASE}/posts/report`);
    const posts = await res.json();

    const container = document.getElementById("reported-posts");
    container.innerHTML = "";

    posts.forEach(post => {
      const div = document.createElement("div");
      div.className = "post";

      div.innerHTML = `
        <img src="${API_BASE}${post.user.avatar || '/access/default.png'}" class="avatar" />
        <span class="username">${post.user.username}</span>
        <p>${post.content || "<i>(Không có nội dung)</i>"}</p>
        ${post.image ? `<img src="${API_BASE}${post.image}" class="post-image" />` : ""}
        <div class="buttons">
          <button onclick="removeReport('${post._id}')"> Bỏ báo cáo</button>
          <button onclick="deletePost('${post._id}')"> Xóa bài viết</button>
        </div>
      `;

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách:", err);
  }
}

async function removeReport(postId) {
  try {
    const res = await fetch(`${API_BASE}/posts/report/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" , token:`Bearer ${token}`},
      body: JSON.stringify({ status: false })
    });

    if (res.ok) {
      alert("Đã bỏ báo cáo");
      fetchReportedPosts();
    } else {
      const error = await res.json();
      alert("Lỗi: " + error.message);
    }
  } catch (err) {
    alert("Lỗi mạng khi bỏ báo cáo");
  }
}

async function deletePost(postId) {
  if (!confirm("Bạn có chắc muốn xóa bài viết này không?")) return;

  try {
    const res = await fetch(`${API_BASE}/posts/${postId}`, {
      method: "DELETE",
      token :`Bearer ${token}`
    });

    if (res.ok) {
      alert("Đã xóa bài viết");
      fetchReportedPosts();
    } else {
      const error = await res.json();
      alert("Lỗi: " + error.message);
    }
  } catch (err) {
    alert("Lỗi mạng khi xóa bài viết");
  }
}

// Tải dữ liệu khi trang được load
fetchReportedPosts();
