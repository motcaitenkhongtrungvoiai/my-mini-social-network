document.addEventListener("DOMContentLoaded", async () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (!auth) window.location.replace("../public/auth.html");
   setupFormSubmit(auth,auth.userId);
});
function setupFormSubmit(auth, userId) {
  const form = document.querySelector("#updateUser");

  form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const res = await fetch(`http://localhost:3000/v1/users/${userId}`, {
        method: "PUT",
        headers: {
          token: `Bearer ${auth.accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Lỗi cập nhật:", errData);
        alert("Cập nhật thất bại!");
        return;
      }

      const updatedUser = await res.json();
      console.log("Cập nhật thành công:", updatedUser);
      alert("Cập nhật thành công!");
      location.reload();
    } catch (err) {
      console.error("Lỗi khi gửi cập nhật:", err.message);
      alert("Có lỗi xảy ra khi cập nhật.");
    }
  };
}
