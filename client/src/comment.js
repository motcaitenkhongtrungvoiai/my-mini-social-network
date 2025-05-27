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

  const username = document.createElement("div");
  username.className = "username";
  username.textContent = comment.userId.username;

  const content = document.createElement("div");
  content.textContent = comment.content;

  const actions = document.createElement("div");
  actions.className = "actions";

  const btnReply = document.createElement("button");
  btnReply.textContent = "Trả lời";
  btnReply.onclick = () => showReplyInput(comment._id, div);

  const btnEdit = document.createElement("button");
  btnEdit.textContent = "Sửa";
  btnEdit.onclick = () => editComment(comment);

  const btnDelete = document.createElement("button");
  btnDelete.textContent = "Xóa";
  btnDelete.onclick = () => deleteComment(comment._id);

  actions.appendChild(btnReply);
  actions.appendChild(btnEdit);
  actions.appendChild(btnDelete);

  div.appendChild(username);
  div.appendChild(content);
  div.appendChild(actions);

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
        token: `Bearer ${token}`,
      },
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
    body: JSON.stringify({ content: newContent }),
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
