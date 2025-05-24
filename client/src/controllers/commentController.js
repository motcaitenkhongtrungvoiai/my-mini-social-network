import { commentUi } from "../modules/commentUi.js";

export function attachCommentEvents() {
  document.querySelectorAll(".comment-btn").forEach((btn) => {
    btn.addEventListener("click", () => commentUi.testfunc(btn.dataset.postid));
  });
}