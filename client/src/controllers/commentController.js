import { CommentSetup } from "../modules/commentUi.js";
import { commentUi } from "../views/commentView.js";
export function attachCommentEvents() {
  document.querySelectorAll(".comment-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      commentUi.initPopup();
      const viewcomment=new CommentSetup(btn.dataset.postid)
      
      // Prevent scrolling on body when popup is open
      document.body.style.overflow = 'hidden';
    });
  });
}