import { getData } from "./modules/getData.js";
import { onNotification } from "./modules/wsNotifier.js";

const notificationBtn = document.getElementById("notificationBtn");
const notificationPanel = document.getElementById("notificationPanel");
const closeNotification = document.getElementById("closeNotification");
const overlay = document.getElementById("overlay");
const Searchbox=document.querySelector(".search-bar")

  const searchBar = document.getElementById('searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
  
    searchBar.addEventListener('click', function() {
      this.classList.add('active');
      searchInput.focus();
    });
    
   
    searchButton.addEventListener('click', function(e) {
      e.stopPropagation();
      if(searchInput.value.trim() !== '') {
        alert('Đã gửi tìm kiếm: ' + searchInput.value);
      }
    });
    
    
    document.addEventListener('click', function(e) {
      if (!searchBar.contains(e.target) && searchInput.value === '') {
        searchBar.classList.remove('active');
      }
    });
    
    // Khi nhấn Enter
    searchInput.addEventListener('keypress', function(e) {
      if(e.key === 'Enter' && this.value.trim() !== '') {
        alert('Đã gửi tìm kiếm: ' + this.value);
      }
    });


notificationBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  notificationPanel.classList.add("active");
  overlay.classList.add("active");
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
const auth = getData.getAuth();
profilebtn.href = `../public/profile.html?data=${auth.userId}`;

const menu = document.querySelector("#menuOntop");

const adminJob = document.getElementById("calladmin");
if (auth.userRole != "admin") adminJob.style.display = "none";

try {
  onNotification((notification) => {
    console.log("nhận tin nhắn: " + notification);
    const panelBody = document.querySelector("#notificationPanel .panel-body");

    const notifDiv = document.createElement("div");
    notifDiv.className = "notification-item notification-unread";

    const textDiv = document.createElement("div");
    textDiv.className = "notification-text";
    textDiv.textContent = `Bạn có ${notification.type} mới`;

    notifDiv.appendChild(textDiv);
    panelBody.prepend(notifDiv);
  });
} catch (err) {
  console.log("lỗi nhận dư lieu" + err);
}
