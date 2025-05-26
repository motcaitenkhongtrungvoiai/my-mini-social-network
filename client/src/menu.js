import { getData } from "./modules/getData.js";
import { onNotification } from "./modules/wsNotifier.js";
import { initSocket } from "./modules/wsNotifier.js";
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

const profilebtn=document.getElementById("profilemove")
const auth=getData.getAuth();
profilebtn.href=`../public/profile.html?data=${auth.userId}`;

console.log("kết nối với js menu");
try{
initSocket(auth.accessToken);

onNotification((notification) => {
    console.log("nhận tin nhắn");
  const panelBody = document.querySelector("#notificationPanel .panel-body");

  const notifDiv = document.createElement("div");
  notifDiv.className = "notification-item notification-unread";

  const textDiv = document.createElement("div");
  textDiv.className = "notification-text";
  textDiv.textContent = `Bạn có ${notification.notifType} mới`;

  notifDiv.appendChild(textDiv);
  panelBody.prepend(notifDiv); 
});}
catch(err){
    console.log("lỗi nhận dư lieu"+err)
}