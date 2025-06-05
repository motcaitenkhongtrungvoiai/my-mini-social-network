export function renderPostList(posts, container) {
  container.innerHTML = "";
  posts.forEach((post) => {
    container.appendChild(createPostElement(post));
     if (!document.getElementById(post._id)) {
      container.appendChild(createPostElement(post));
    }
  });
   if (window.hljs) {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }
}

function createPostElement(post) {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const div = document.createElement("div");
  div.className = "post";
  const createdAt = timeAgo(post.createdAt);
  const maxLength = 300;
  const isLong = post.content.length > maxLength;
  const shortContent = post.content.slice(0, maxLength);

  const contentHtml = `
    <div class="post-content">
      ${isLong 
        ? `<span class="short-content">${shortContent}...</span>
           <span class="full-content" style="display:none;">${post.content}</span>
           <a href="#" class="see-more">Xem thêm</a>`
        : `<span class="full-content">${post.content}</span>`
      }
      <br>
      ${post.code ? `<pre><code>${post.code}</code></pre>` : ""}
      <br>
      ${post.link ? `<a href="${post.link}">${post.link}</a>` : ""}
    </div>
  `;

  div.innerHTML = `
    <img href="${post.link}">
    <div class="post-container" id="${post._id}">
      <div class="post-header">
        <img src="${post.user.avatar}" class="avatar">
        
        <div class="user-info">
          <a href="../public/profile.html?data=${post.user._id}" class="username">${post.user.username}</a>
          <p class="post-time">${createdAt}</p>
        </div>
        <div class="more-options">
          <button class="action-btn report-btn" data-userid="${post.user._id}" data-postid="${post._id}" data-postcontent="${post.content}">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>
      </div>
      ${contentHtml}
      ${post.image ? `<img src="${post.image}" class="post-image">` : ""}
      <div class="post-stats">
        <span><i class="fas fa-thumbs-up"></i> ${post.likeCount}</span>
        <span style="margin-left:15px;"><i class="fas fa-comment"></i> ${post.commentCount} bình luận</span>
      </div>
      <div class="post-actions">
        <button class="action-btn like-btn" data-postid="${post._id}" data-isliked="${post.likedPostIds.includes(auth.userId)}" data-postower="${post.user._id}">
          <i class="far fa-thumbs-up"></i><span>Thích</span>
        </button>
        <button class="action-btn comment-btn" data-postid="${post._id}" data-postower="${post.user._id}">
          <i class="far fa-comment"></i><span>Bình luận</span>
        </button>
      </div>
    </div>
  `;


  setTimeout(() => {
    const seeMoreBtn = div.querySelector(".see-more");
    if (seeMoreBtn) {
      seeMoreBtn.addEventListener("click", (e) => {
        e.preventDefault();
        div.querySelector(".short-content").style.display = "none";
        div.querySelector(".full-content").style.display = "inline";
        seeMoreBtn.style.display = "none";
      });
    }
  }, 100);

  return div;
}
function timeAgo(createdAt) {
  const now = new Date();
  const postTime = new Date(createdAt);
  const diff = Math.floor((now - postTime) / 1000); 

  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 30 * 86400) return `${Math.floor(diff / 86400)} ngày trước`;
  if (diff < 12 * 30 * 86400) return `${Math.floor(diff / (30 * 86400))} tháng trước`;
  return `${Math.floor(diff / (365 * 86400))} năm trước`;
}


