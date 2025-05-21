
document.addEventListener("DOMContentLoaded", async () => {
  const postContainer = document.querySelector(".post-container");
  
  try {
    const response = await fetch("http://localhost:3000/v1/post/feed", {
      method: "get"
    });

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const posts = await response.json();

    if (posts.length === 0) {
      throw new Error("Something went wrong. Cannot find any posts.");
    }

    posts.forEach((post) => {
      let postElement = document.createElement("div");
      postElement.className = "post";
      postElement.innerHTML = `
        <div class="post-header ${post.type}">
          <img src="${post.user.avatar}" alt="${post.user.username}'s avatar" class="avatar">
          <span class="username">${post.user.username}</span>
        </div>
        <div class="post-body">
          <p>${post.content || ""}</p>
          ${post.image ? `<img src="${post.image}" class="post-image" alt="Post image">` : ""}
        </div>
        <div class="post-actions">
          <span>${post.likeCount} likes</span>
          <span>${post.commentCount} comments</span>
        </div>
      `;
      postContainer.appendChild(postElement);
    });
  } catch (err) {
    console.error("Fetch error:", err);
    postContainer.innerHTML = "<p>Failed to load posts.</p>";
  }
});
