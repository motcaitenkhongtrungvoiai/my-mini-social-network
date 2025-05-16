document.addEventListener("DOMContentLoaded", async () => {
  const avatarEl = document.querySelector(".avatar");
  const coverEl = document.querySelector(".coverphoto");

  const postFromUser = document.querySelector(".postFromUser");
  const username = document.querySelector(".username");
  const email = document.querySelector(".email");
  const desc = document.querySelector(".desc");
  const webside = document.querySelector(".webside");

  const authData = localStorage.getItem("auth");
  if (!authData) {
    console.warn("Chưa đăng nhập hoặc chưa có token.");
    window.location.href = "../public/login.html";
    return;
  }

  const auth = JSON.parse(authData);
  console.log(auth);

  try {
    const res = await fetch("http://localhost:3000/v1/users/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${auth.accessToken}`,
      },
      body: JSON.stringify({ userId: auth.userId }),
    });

    if (!res.ok) {
      throw new Error(`Lỗi từ server: ${res.status}`);
    }

    const user = await res.json();
    console.log("Thông tin người dùng:", user);

    //  Thêm hiển thị ảnh avatar & coverphoto
    if (user.avatar) {
      avatarEl.src = `${user.avatar}`;
    }

    if (user.coverphoto) {
      coverEl.src = `${user.coverphoto}`;
    }
    // hiển thị các thông tin liên quan khác
    username.innerHTML = `${user.username}`;
    email.innerHTML = `${user.email}`;
    desc.innerHTML = `${user.profileDesc}`;

    // gắn webside cá nhân nếu có.
    if (user.webside) webside.href = `${user.webside}`;

  } catch (err) {
    console.error("Không thể lấy thông tin người dùng:", err.message);
  }
});
