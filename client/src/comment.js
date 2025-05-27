import { getData } from "./modules/getData.js";

const API_URL = "http://localhost:3000/v1/comment";
const POST_ID = "68306cee462e63cfcd680acd"; // thay bằng postId thật
const auth = getData.getAuth();

async function fetchComments() {
  try {
    const res = await fetch(`${API_URL}/${POST_ID}`);
    const comments = await res.json();
    const container = document.getElementById("comments-container");
    container.innerHTML = "";
    comments.forEach((c) => {
      container.appendChild(renderComment(c));
    });
  } catch (err) {
    console.error("Lỗi tải bình luận:", err);
  }
}

function renderComment(comment) {
  const div = document.createElement("div");
  div.className = "comment";

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
  btnReply.onclick = () => showReplyInput(comment._id, div);

  actions.appendChild(btnReply);

  if (auth.userId === comment.userId._id) {
    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Sửa";
    btnEdit.className = "btn-edit";
    btnEdit.onclick = () => editComment(comment);

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Xóa";
    btnDelete.className = "btn-delete";
    btnDelete.onclick = () => deleteComment(comment._id);

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

  // Replies (comment con)
  if (comment.replies?.length) {
    const repliesDiv = document.createElement("div");
    repliesDiv.className = "replies";
    comment.replies.forEach((reply) => {
      repliesDiv.appendChild(renderComment(reply));
    });
    div.appendChild(repliesDiv);
  }

  return div;
}


function showReplyInput(parentId, parentDiv) {
  if (parentDiv.querySelector(".reply-input")) return;

  const textarea = document.createElement("textarea");
  textarea.className = "reply-input";
  textarea.rows = 2;
  textarea.cols = 50;
  textarea.placeholder = "Viết phản hồi...";

  const btn = document.createElement("button");
  btn.textContent = "Gửi";
  btn.onclick = async () => {
    const content = textarea.value.trim();
    if (!content) return alert("Vui lòng nhập nội dung phản hồi");
    await createComment(parentId, content);
    fetchComments();
  };

  parentDiv.appendChild(textarea);
  parentDiv.appendChild(btn);
}

async function createComment(parentId, content) {
  try {
    const token = auth.accessToken;
    await fetch(`${API_URL}/${POST_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
        parentId,
        userId: auth.userId,
      }),
    });
  } catch (err) {
    console.error(err);
    alert("Tạo bình luận thất bại");
  }
}

async function deleteComment(commentId) {
  if (!confirm("Bạn chắc chắn muốn xóa?")) return;
  const token = auth.accessToken;
  try {
    await fetch(`${API_URL}/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: auth.userId }),
    });
    fetchComments();
  } catch {
    alert("Không thể xóa bình luận");
  }
}

function editComment(comment) {
  const newContent = prompt("Sửa bình luận:", comment.content);
  if (!newContent || newContent === comment.content) return;

  const token = auth.accessToken;
  fetch(`${API_URL}/${comment._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${token}`,
    },
    body: JSON.stringify({ content: newContent, userId: auth.userId }),
  })
    .then(() => fetchComments())
    .catch(() => alert("Không thể sửa bình luận"));
}

// Gửi bình luận cha
const commentBtn = document.getElementById("create_comment");
commentBtn.addEventListener("click", async () => {
  const textarea = document.getElementById("main-comment-content");
  const content = textarea.value.trim();
  if (!content) return alert("Vui lòng nhập bình luận");

  await createComment(null, content);
  textarea.value = "";
  fetchComments();
});

fetchComments();
