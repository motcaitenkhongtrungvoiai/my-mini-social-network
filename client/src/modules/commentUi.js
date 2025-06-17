import { getData } from "./getData.js";
import { sendNotification } from "./wsNotifier.js";
import { URL_api } from "./Url_api.js";
export class CommentSetup {
  constructor(postId, postOwer) {
    this.API_URL = `${URL_api()}/v1/comment`;
    this.POST_ID = postId;
    this.auth = getData.getAuth();
    this.POST_OWER = postOwer;
    this.init();
  }

  async init() {
    await this.fetchComments();
    this.setupEventListeners();
  }

  async fetchComments() {
    try {
      const res = await fetch(`${this.API_URL}/${this.POST_ID}`);
      const comments = await res.json();

      const container = document.getElementById("comments-container");
      container.innerHTML = "";
      comments.forEach((c) => {
        container.appendChild(this.renderComment(c));
      });
    } catch (err) {
      console.error("Lỗi tải bình luận:", err);
    }
  }

  renderComment(comment) {
    const div = document.createElement("div");
    div.className = "comment";
    div.id= comment._id;

    // Header: chứa avatar, username và các nút hành động
    const header = document.createElement("div");
    header.className = "comment-header";

    // User info
    const userInfo = document.createElement("div");
    userInfo.className = "user-info";

    const avatar = document.createElement("img");
    avatar.className = "avatar";
    avatar.src = comment.userId.avatar;
    avatar.alt = "avatar";

    const username = document.createElement("div");
    username.className = "username";
    username.textContent = comment.userId.username;

    userInfo.appendChild(avatar);
    userInfo.appendChild(username);

    // Actions
    const actions = document.createElement("div");
    actions.className = "comment-actions";

    const btnReply = document.createElement("button");
    btnReply.textContent = "Trả lời";
    btnReply.className = "btn-reply";
    btnReply.onclick = () =>
      this.showReplyInput(comment._id, div, comment.userId._id);

    actions.appendChild(btnReply);

    if (this.auth.userId === comment.userId._id) {
      const btnEdit = document.createElement("button");
      btnEdit.textContent = "Sửa";
      btnEdit.className = "btn-edit";
      btnEdit.onclick = () => this.editComment(comment);

      const btnDelete = document.createElement("button");
      btnDelete.textContent = "Xóa";
      btnDelete.className = "btn-delete";
      btnDelete.onclick = () => this.deleteComment(comment._id);

      actions.appendChild(btnEdit);
      actions.appendChild(btnDelete);
    }

    header.appendChild(userInfo);
    header.appendChild(actions);

    // Nội dung bình luận
    const content = document.createElement("div");
    content.className = "comment-content";
    content.textContent = comment.content;

    div.appendChild(header);
    div.appendChild(content);

    // Replies
    if (comment.replies?.length) {
      const repliesDiv = document.createElement("div");
      repliesDiv.className = "replies";
      comment.replies.forEach((reply) => {
        repliesDiv.appendChild(this.renderComment(reply));
      });
      div.appendChild(repliesDiv);
    }

    return div;
  }

  showReplyInput(parentId, parentDiv, commentParentOwnerId) {
    if (parentDiv.querySelector(".reply-input")) return;

    const textarea = document.createElement("textarea");

    textarea.className = "reply-input";
    textarea.rows = 2;
    textarea.cols = 50;

    const btn = document.createElement("button");
    btn.textContent = "Gửi";
    btn.onclick = async () => {
      const content = textarea.value.trim();
      if (!content) return alert("Vui lòng nhập nội dung phản hồi");
      await this.createComment(parentId, content, commentParentOwnerId);
      this.fetchComments();
    };

    parentDiv.appendChild(textarea);
    parentDiv.appendChild(btn);
    textarea.placeholder = "Viết phản hồi...";
    textarea.setAttribute("tabindex", "-1");
    textarea.focus();
  }

  async createComment(parentId, content, commentParentOwnerId = null) {
    try {
      const token = this.auth.accessToken;
      const res = await fetch(`${this.API_URL}/${this.POST_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          parentId,
          userId: this.auth.userId,
          
        }),
      });
      const data = await res.json();
      console.log(data._id);
      if (res.ok) {
        if (
          parentId &&
          commentParentOwnerId &&
          commentParentOwnerId !== this.auth.userId
        ) {
          sendNotification({
            token,
            recipientId: commentParentOwnerId,
            senderId: this.auth.userId,
            notifType: "đã phản hồi bình luận của bạn",
            postId: this.POST_ID,
            commentId: data._id,
          });
        }

        if (
          this.POST_OWER !== this.auth.userId &&
          this.POST_OWER !== commentParentOwnerId
        ) {
          sendNotification({
            token,
            recipientId: this.POST_OWER,
            senderId: this.auth.userId,
            notifType: "đã bình luận trong bài viết của bạn",
            postId: this.POST_ID,
            commentId:data._id,
          });
        }
      }
    } catch (err) {
      console.error(err);
      alert("Tạo bình luận thất bại");
    }
  }

  async deleteComment(commentId) {
    if (!confirm("Bạn chắc chắn muốn xóa?")) return;
    const token = this.auth.accessToken;
    try {
      await fetch(`${this.API_URL}/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: this.auth.userId }),
      });
      this.fetchComments();
    } catch {
      alert("Không thể xóa bình luận");
    }
  }

  editComment(comment) {
    const newContent = prompt("Sửa bình luận:", comment.content);
    if (!newContent || newContent === comment.content) return;

    const token = this.auth.accessToken;
    fetch(`${this.API_URL}/${comment._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newContent, userId: this.auth.userId }),
    })
      .then(() => this.fetchComments())
      .catch(() => alert("Không thể sửa bình luận"));
  }

  setupEventListeners() {
    const commentBtn = document.getElementById("create_comment");
    if (commentBtn) {
      commentBtn.addEventListener("click", async () => {
        const textarea = document.getElementById("main-comment-content");
        const content = textarea.value.trim();
        if (!content) return alert("Vui lòng nhập bình luận");

        await this.createComment(null, content);
        textarea.value = "";
        this.fetchComments();
      });
    }
  }
}
