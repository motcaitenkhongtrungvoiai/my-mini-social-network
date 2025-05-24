import { initFollow } from "./followUser.js";

export async function initProfile() {
  const queryUserId = getUrldata();
  const auth = getAuth();

  if (!auth && !queryUserId) return redirectToLogin();

  try {
    const user = await fetchUserProfile(queryUserId || auth.userId);
    if (!user) return;

    renderUserInfo(user);
  } catch (err) {
    console.error("Lỗi khi tải trang:", err.message);
  }
}
function getUrldata(){
     const urlParams = new URLSearchParams(window.location.search);
     return urlParams.get("data");
}
function getAuth() {
  const authData = localStorage.getItem("auth");
  if (!authData) return null;
  try {
    return JSON.parse(authData);
  } catch (err) {
    console.warn("Auth bị lỗi định dạng JSON:", err.message);
    return null;
  }
}

// Redirect về trang login
function redirectToLogin() {
  console.warn("Chưa đăng nhập và không có userId để xem profile.");
  window.location.href = "../public/login.html";
}

// Call API để lấy profile
async function fetchUserProfile(userId) {
  try {
    if (!userId) return null;

    const res = await fetch(
      `http://localhost:3000/v1/users/profile/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error(`Server trả về lỗi: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Không thể lấy thông tin người dùng:", err.message);
    return null;
  }
}

// Hiển thị load profile user
function renderUserInfo(user) {
  const avatarEl = document.querySelector(".avatar");
  const coverEl = document.querySelector(".coverphoto");
  const username = document.querySelector(".username");
  const email = document.querySelector(".email");
  const desc = document.querySelector(".desc");
  const webside = document.querySelector(".webside");
  const create = document.querySelector(".create-post");
  const follower = document.querySelector(".follower span");
  const followeing = document.querySelector(".following span");
  const followbtn = document.querySelector(".follow");
  if (user.avatar) avatarEl.src = user.avatar;
  if (user.coverphoto) coverEl.src = user.coverphoto;
  if (username) username.textContent = user.username || "";
  if (email) email.textContent = user.email || "";
  if (desc) desc.textContent = user.profileDesc || "";
  follower.textContent = user.followerCount ? user.followerCount : "0";
  followeing.textContent = user.followingCount ? user.followingCount : "0";
  
  const auth = getAuth();
  
  if (user.followers.includes(auth.userId)) {
    followbtn.textContent = "unfollow?";
    followbtn.style.color = "";
  }
  followbtn.addEventListener("click",()=>{
    initFollow(getUrldata())
  });
  if (user.website) {
    webside.href = user.website;
    webside.textContent = user.website;
  }

  if (auth.userId != user._id) {
    create.style.display = "none";
  }
}
