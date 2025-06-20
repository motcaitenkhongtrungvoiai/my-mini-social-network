import { CommentSetup } from "../modules/commentUi.js";
import { commentUi } from "../views/commentView.js";
import { getData } from "../modules/getData.js";

const auth=getData.getAuth()

export function attachCommentEvents() {
  document.querySelectorAll(".comment-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      commentUi.initPopup();
      const viewcomment=new CommentSetup(btn.dataset.postid,btn.dataset.postower);
    
      console.log(btn.dataset.postower);
      // Prevent scrolling on body when popup is open
      document.body.style.overflow = 'hidden';
    });
  });
}
 