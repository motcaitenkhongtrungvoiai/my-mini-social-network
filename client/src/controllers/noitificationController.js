import { noice } from "../modules/noiceModule.js";
import { renderNoiceItem } from "../views/noiceView.js";

const container = document.getElementById("menuNotifi");
const total_container = document.querySelector(".notification-badge");

export async function initNoice() {
  const { total, data } = await noice.getNoitifi();
  renderNoiceItem(data, container);
  if(total>0){total_container.textContent = total;}
  else {total_container.textContent = "";};
}
