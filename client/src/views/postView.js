export function renderPostList(posts, container) {
  container.innerHTML = "";
  posts.forEach((post) => {
    container.appendChild(createPostElement(post));
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
  div.innerHTML = `<img href="${post.link}">
    <div class="post-container" id="${post._id}">
      <div class="post-header">
        <img src="${post.user.avatar}" class="avatar">
        <div class="user-info">
        <a href="../public/profile.html?data=${post.user._id}" class="username">${post.user.username}</a>
        </div>
        <div class="more-options">
          <button class="action-btn report-btn" data-userid="${post.user._id}" data-postid="${post._id}" data-postcontent="${post.content}">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>
      </div>
      <div class="post-content">${post.content}<br>
      ${post.code?`<pre><code>${post.code}</pre></code>`:""}
      <br>${post.link? `<a href="${post.link}">${post.link}</a> `:""}
      </div>
                
            
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
  return div;
}

