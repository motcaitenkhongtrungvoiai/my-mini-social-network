document.addEventListener("DOMContentLoaded", async () => {
  const auth = getAuth();
  if (!auth) return redirectToLogin();

  try {
    const user = await fetchUserProfile(auth);
    if (!user) return;

    renderUserInfo(user);
    setupFormSubmit(auth, user._id);
  } catch (err) {
    console.error("Lỗi khi tải trang:", err.message);
  }
});

// ====== Các hàm riêng ======

// Lấy token từ localStorage
function getAuth() {
  const authData = localStorage.getItem("auth");
  if (!authData) return null;
  return JSON.parse(authData);
}

// Chuyển hướng nếu chưa đăng nhập
function redirectToLogin() {
  console.warn("Chưa đăng nhập hoặc chưa có token.");
  window.location.href = "../public/login.html";
}

// Gọi API để lấy thông tin người dùng
async function fetchUserProfile(auth) {
  try {
    const res = await fetch("http://localhost:3000/v1/users/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${auth.accessToken}`,
      },
      body: JSON.stringify({ userId: auth.userId }),
    });

    if (!res.ok) throw new Error(`Server trả về lỗi: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Không thể lấy thông tin người dùng:", err.message);
    return null;
  }
}

// Hiển thị thông tin người dùng lên trang
function renderUserInfo(user) {
  const avatarEl = document.querySelector(".avatar");
  const coverEl = document.querySelector(".coverphoto");
  const username = document.querySelector(".username");
  const email = document.querySelector(".email");
  const desc = document.querySelector(".desc");
  const webside = document.querySelector(".webside");

  if (user.avatar) avatarEl.src = `${user.avatar}`;
  if (user.coverphoto) coverEl.src = `${user.coverphoto}`;
  username.textContent = user.username || "";
  email.textContent = user.email || "";
  desc.textContent = user.profileDesc || "";

  if (user.webside) {
    webside.href = user.webside;
    webside.textContent = user.webside;
  }
}

// Gắn sự kiện xử lý cập nhật user
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
