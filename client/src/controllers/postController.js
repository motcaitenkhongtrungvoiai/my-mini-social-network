import { renderPostList } from "../views/postView.js";
import { attachLikeEvents } from "./likeController.js";
import { attachCommentEvents } from "./commentController.js";
import { attachReportEvents } from "./reportController.js";

export async function loadPosts() {
  const container = document.querySelector(".post-containerAll");
  try {
    const res = await fetch("http://localhost:3000/v1/post/feed");
    if (!res.ok) throw new Error("Không thể tải bài viết");
    const posts = await res.json();

    if (posts.length === 0) container.innerHTML = "Không có bài viết nào.";
    else renderPostList(posts, container);

    attachLikeEvents();
    attachCommentEvents();
    attachReportEvents();
  } catch (err) {
    container.innerHTML = "<p>Lỗi tải bài viết.</p>";
    console.error(err);
  }
}