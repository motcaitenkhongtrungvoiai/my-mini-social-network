import { getData } from "./modules/getData.js";
import { initSocket, onNotification } from "./modules/wsNotifier.js";
import { initNoice } from "./controllers/noitificationController.js";
//tác vụ sử lý data chính
const auth = getData.getAuth();

initNoice();


initSocket(auth.accessToken);

try {
  onNotification(() => {
    const countEl = document.querySelector(".notification-badge");

    let currentCount = parseInt(countEl.textContent.trim()) || 0;

    currentCount += 1;

    if (currentCount >= 0) {
      countEl.textContent = currentCount;
      countEl.style.display = "block";
    } else {
      countEl.style.display = "none"; 
    }
  });
} catch (err) {
  console.error("Lỗi khi nhận dữ liệu:", err);
}


// thực hiện tác vụ đồ hoan
const notificationBtn = document.getElementById("notificationBtn");
const notificationPanel = document.getElementById("notificationPanel");
const closeNotification = document.getElementById("closeNotification");
const overlay = document.getElementById("overlay");
const Searchbox = document.querySelector(".search-bar");

const searchBar = document.getElementById("searchBar");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

searchBar.addEventListener("click", function () {
  this.classList.add("active");
  searchInput.focus();
});

searchButton.addEventListener("click", function (e) {
  e.stopPropagation();
  if (searchInput.value.trim() !== "") {
    window.location.href = `../public/searchPage.html?keyword=${searchInput.value}`;
  }
});
searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter" && this.value.trim() !== "") {
    window.location.href = `../public/searchPage.html?keyword=${this.value}`;
  }
});

document.addEventListener("click", function (e) {
  if (!searchBar.contains(e.target) && searchInput.value === "") {
    searchBar.classList.remove("active");
  }
});

notificationBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  notificationPanel.classList.add("active");
  overlay.classList.add("active");
  initNoice();
});

closeNotification.addEventListener("click", () => {
  notificationPanel.classList.remove("active");
  overlay.classList.remove("active");
});

overlay.addEventListener("click", () => {
  notificationPanel.classList.remove("active");
  overlay.classList.remove("active");
});

const profilebtn = document.getElementById("profilemove");

profilebtn.href = `../public/profile.html?data=${auth.userId}`;

const menu = document.querySelector("#menuOntop");

const adminJob = document.getElementById("calladmin");
if (auth.userRole != "admin") adminJob.style.display = "none";
