const auth = JSON.parse(localStorage.getItem("auth"));
if (!auth){
  window.location.replace("../public/login.html")
}
const userId = auth.userId;
const token = auth.accessToken;

document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  try {
    const response = await fetch(`http://localhost:3000/v1/post/${userId}`, {
      method: "POST",
      headers: {
        token: `Bearer ${token}`,
      },
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
