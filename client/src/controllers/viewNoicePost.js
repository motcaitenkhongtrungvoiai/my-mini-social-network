import { renderPostList } from "../views/postView.js";
import { attachLikeEvents } from "./likeController.js";
import { attachCommentEvents } from "./commentController.js";
import { attachReportEvents } from "./reportController.js";
import { getData } from "../modules/getData.js";
const auth = getData.getAuth();
export async function noicePostView() {
  const urlParams = new URLSearchParams(window.location.search);
  const commentId = urlParams.get("commentId");
  const postId = urlParams.get("postid");
  const res = await fetch(`http://localhost:3000/v1/post/noice/${postId}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${auth.accessToken}`,
    },
  });
  const post = await res.json()
  const container = document.querySelector(".Post_container");
  renderPostList(post, container);
  attachLikeEvents();
  attachCommentEvents();
  attachReportEvents();
 setTimeout(()=>{callComment(commentId)},1000)
  ;
}

function callComment(commentId) {
  if (commentId && commentId !== "null") {
    document.querySelector(".comment-btn").click();

    const waitForComment = setInterval(() => {
      const noiceComment = document.getElementById(commentId);
      if (noiceComment) {
        noiceComment.setAttribute("tabindex", "-1");
        noiceComment.focus();
        noiceComment.scrollIntoView({ behavior: "smooth", block: "center" });
        clearInterval(waitForComment);
      }
    }, 200); 
  }
}
