import { getData } from "./modules/getData.js";
import { }
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