const API_BASE = "http://localhost:3000/v1/post";
import { getData } from "./module/getData.js";
const auth = getData.getAuth();
const token = auth.accessToken;

async function fetchReportedPosts() {
  try {
    const res = await fetch(`${API_BASE}/report`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token}`,
      },
    });

    const posts = await res.json();
    const container = document.getElementById("reported-posts");
    container.innerHTML = "";

    posts.forEach((post) => {
      const div = document.createElement("div");
      div.className = "post";
      div.id=post._id;

      div.innerHTML = `
        <img src="${post.user.avatar || "/access/default.png"}" class="avatar" />
        <span class="username">${post.user.username}</span>
        <p>${post.content || "<i>(Không có nội dung)</i>"}</p>      
         ${post.code?`<pre><code>${post.code}</pre></code>`:""}
        ${post.image ? `<img src="${post.image}" class="post-image" />` : ""}
        <div class="buttons">
          <button class="unReport" data-postid="${post._id}">Bỏ báo cáo</button>
          <button class="destroy" data-postid="${post._id}">Xóa bài viết</button>
        </div>
      `;

      container.appendChild(div);
    });

   
 document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
    // Gắn sự kiện sau khi các nút đã được render
    document.querySelectorAll(".unReport").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        removeReport(btn.dataset.postid);
      });
    });

    document.querySelectorAll(".destroy").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        deletePost(btn.dataset.postid);
      });
    });
    
  } catch (err) {
    console.error("Lỗi khi lấy danh sách:", err);
    alert("Không thể tải danh sách bài viết bị báo cáo.");
  }
  
}

async function removeReport(postId) {
  try {
    const res = await fetch(`${API_BASE}/report/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: false }),
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
    const res = await fetch(`${API_BASE}/report/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${token}`,
        },
         
      })

    if (res.ok) {
      alert("Đã xóa bài viết");
      document.getElementById(postId).style.display="none";
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
