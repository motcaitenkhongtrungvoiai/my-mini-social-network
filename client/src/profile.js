import { initProfile } from "./controllers/profileController.js";
import { getData } from "./modules/getData.js";
import { initSocket } from "./modules/wsNotifier.js";
import { getFollow } from "./controllers/getFollowController.js";
document.addEventListener("DOMContentLoaded", () => {
  initProfile();
  const auth = getData.getAuth();
  if (auth) initSocket(auth.accessToken);
});

//add some effect
document.addEventListener("DOMContentLoaded", function () {
  const toggleButtons = document.querySelector(".toggle-buttons");
  const showFollower = document.getElementById("showFollower");
  const showFollowing = document.getElementById("showFollowing");

  toggleButtons.classList.add("active-post");
  showFollowing.classList.add("active");

  showFollower.addEventListener("click", function () {
    toggleButtons.classList.remove("active-post");
    toggleButtons.classList.add("active-user");
    showFollowing.classList.remove("active");
    showFollower.classList.add("active");
  });

  showFollowing.addEventListener("click", function () {
    toggleButtons.classList.remove("active-user");
    toggleButtons.classList.add("active-post");
    showFollower.classList.remove("active");
    showFollowing.classList.add("active");
  });
});

document.querySelector(".content-footer").addEventListener("click", function () {
    const auth = getData.getAuth();
    const urlData = getData.getUrldata();
    if (auth.userId === urlData) {
      document.getElementById("popup").style.display = "flex";
      getFollow()
    }
  });

document.getElementById("popup").addEventListener("click", function (e) {
  if (e.target === this) {
    this.style.display = "none";
  }
});
