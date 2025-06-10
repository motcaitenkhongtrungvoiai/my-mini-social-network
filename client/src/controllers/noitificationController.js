import { noice } from "../modules/noiceModule.js";
import { renderNoiceItem } from "../views/noiceView.js";

const container = document.getElementById("menuNotifi");
const total_container = document.querySelector(".notification-badge");

export async function initNoice() {
  const { total, data } = await noice.getNoitifi();
  renderNoiceItem(data, container);
  setupdelNoice();
  if (total > 0) {
    total_container.textContent = total;
  } else {
    total_container.textContent = "";
  }
}

async function setupdelNoice() {
  const menuNotifi = document.getElementById("menuNotifi");
  const buttons = menuNotifi.querySelectorAll(".delNoice");
  if (!buttons.length) {
    console.warn("Không tìm thấy nút xóa thông báo nào.");
    return;
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      console.log(btn);
      e.stopPropagation();
      await NoiceDel(btn);
    });
  });
}

export async function NoiceDel(btn) {
  const parentItem = btn.closest(".notification-item");
  const { post, type, read } = btn.dataset;

  try {
    await noice.delNoitifi(post, type, read);
    parentItem.style.display = "none";
    console.log(`Đã xóa thông báo: post=${post}, type=${type}, read=${read}`);
  } catch (error) {
    console.error("Lỗi khi xóa thông báo:", error);
  }
}
