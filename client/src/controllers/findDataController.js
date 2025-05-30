import { searchModule } from "../modules/searchModule.js";
import { renderPostList } from "../views/postView.js";
import { attachLikeEvents } from "./likeController.js";
import { attachCommentEvents } from "./commentController.js";
import { attachReportEvents } from "./reportController.js";
import { renderUserList } from "../views/userList.js";

const btnUser = document.getElementById("showUsers");
const btnPosts = document.getElementById("showPosts");
const container = document.querySelector(".data-container");

export async function initSearch() {
  await callPost();
  btnUser.addEventListener("click", async () => {
    await callUser();
  });

  btnPosts.addEventListener("click", async () => {
    await callPost();
  });
}

async function callPost() {
  const keyword = getKeyword();
  const post = await searchModule.searchPost(keyword);
  if (!post || post.length === 0) {
    container.innerHTML = "Không có bài viết nào.";
  } else {
    renderPostList(post, container);
    attachLikeEvents();
    attachCommentEvents();
    attachReportEvents();
  }
}

async function callUser() {
  const keyword = getKeyword();
  const users = await searchModule.searchUser(keyword);
  if (!users || users.length === 0) {
    container.innerHTML = "Không tìm thấy người dùng.";
  } else {
    renderUserList(users, container);
  }
}

function getKeyword() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("keyword") || "";
}
