import { URL_api } from "../modules/Url_api.js";
export function initcreatePostForm() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (!auth) return window.location.replace("../public/auth.html");

  const userId = auth.userId;
  const token = auth.accessToken;

  const form = document.getElementById("postForm");
  const btn = document.querySelector("#createPost_submit");
  if (!form) return;
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log ("post send")
    const formData = new FormData(form);

    try {
      const response = await fetch(`${URL_api()}/v1/post/${userId}`, {
        method: "POST",
        headers: { token: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Đăng bài thất bại");
      }

      const result = await response.json();
      alert("Đăng bài thành công!");
      console.log("Post created:", result);
      form.reset();
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  });
}
