
const notificationBtn = document.getElementById('notificationBtn');
const notificationPanel = document.getElementById('notificationPanel');
const closeNotification = document.getElementById('closeNotification');
const overlay = document.getElementById('overlay');

notificationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationPanel.classList.add('active');
    overlay.classList.add('active');
});

closeNotification.addEventListener('click', () => {
    notificationPanel.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    notificationPanel.classList.remove('active');
    overlay.classList.remove('active');
});
function getUrldata() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("data");
}
function getAuth() {
  const authData = localStorage.getItem("auth");
  if (!authData) window.location.replace("login.html");
  try {
    return JSON.parse(authData);
  } catch (err) {
    console.warn("Auth bị lỗi định dạng JSON:", err.message);
    return null;
  }
}
const profilebtn=document.getElementById("profilemove")
const auth=getAuth();
profilebtn.href=`../public/profile.html?data=${auth.userId}`;