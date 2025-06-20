import { getData } from "./modules/getData.js";
import { initSocket, onNotification } from "./modules/wsNotifier.js";
import { initNoice } from "./controllers/noitificationController.js";
import { noice } from "./modules/noiceModule.js";
//tác vụ sử lý data chính
const auth = getData.getAuth();

window.addEventListener("DOMContentLoaded", () => {
  initNoice();
  initSocket(auth.accessToken);
});

try {
  onNotification(() => {
    const countEl = document.querySelector(".notification-badge");

    let currentCount = parseInt(countEl.textContent.trim()) || 0;
    console.log(parseInt(countEl.textContent.trim()));
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

// thực hiện tác vụ đồ họa
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

notificationBtn.addEventListener("click", async (e) => {
  e.stopPropagation();
  notificationPanel.classList.add("active");
  overlay.classList.add("active");
  await initNoice();
});

closeNotification.addEventListener("click", async () => {
  notificationPanel.classList.remove("active");
  overlay.classList.remove("active");
  const countEl = document.querySelector(".notification-badge");

  const read = await noice.readNoitifi();
  if (read) {
    countEl.textContent = "0";
    countEl.style.display = "none";
  }
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

//swich theme

const swichBtn = document.querySelector("#dark-lightMode");

swichBtn.addEventListener("click", () => {
  toggleTheme();
});

if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}
