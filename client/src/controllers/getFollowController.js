import { followModule } from "../modules/followData.js";
import { renderUserList } from "../views/userList.js";

const followerBtn = document.querySelector("#showFollower");
const followingBtn = document.querySelector("#showFollowing");
const container = document.querySelector(".data-container");
export async function getFollow() {
  callFollowing();

  followerBtn.addEventListener("click", async () => {
    await callFollower();
  
  });

  followingBtn.addEventListener("click", async () => {
    await callFollowing();
  });
}
async function callFollowing() {
  const users = await followModule.getFollowing();
  if (!users || users.length === 0) {
    container.innerHTML = "Không có ai  nào.";
  } else {
    renderUserList(users, container);
  }
}

async function callFollower() {
  const user = await followModule.getFollowers();
  if (!user || user.length === 0) {
    container.innerHTML = "Không có ai  nào.";
  } else {
    renderUserList(user, container);
  }
}
