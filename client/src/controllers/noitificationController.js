import { noice } from "../modules/noiceModule.js";
import { renderNoiceItem } from "../views/noiceView.js";

const container = document.getElementById("menuNotifi");
const total_container = document.querySelector(".notification-badge");

export async function initNoice() {
  const { total, data } = await noice.getNoitifi();
  renderNoiceItem(data, container);
  if (total > 0) {
    total_container.textContent = total;
    setupdelNoice();
  } else {
    total_container.textContent = "";
  }
}

function setupdelNoice() {
  document.querySelectorAll(".delNoice").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
     NoiceDel(btn);
    });
  });
}

export function NoiceDel(btn) {
  const parentItem = btn.closest(".notification-item");
  const { post, type, read } = btn.dataset;
   noice.delNoitifi(post,type,read);
   parentItem.style.display = 'none';
  console.log(`Xóa thông báo: post=${post}, type=${type}, read=${read}`);
}
