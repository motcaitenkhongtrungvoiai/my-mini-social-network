import { searchModule } from "../modules/searchModule.js";
import { renderPostList } from "../views/postView.js";
import { attachLikeEvents } from "./likeController.js";
import { attachCommentEvents } from "./commentController.js";
import { attachReportEvents } from "./reportController.js";

export async function initSearch() {
  const keyword = geyKeyword();
  const post = await searchModule.searchPost(keyword);
  callPost(post);
}

async function callPost(post) {
  if (post.length === 0) container.innerHTML = "Không có bài viết nào.";
  else {
    renderPostList(post, container);
  }

  attachLikeEvents();
  attachCommentEvents();
  attachReportEvents();
}

async function callUser() {
  if (userPageData.length===0){container.innerHTML= "không tìm thấy người dùng nào"};


}

const btnUser = document.getElementById("showUser");
const btnPosts = document.getElementById("showPosts");
const container = document.querySelector(".data-container");

function geyKeyword() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("keyword");
}
