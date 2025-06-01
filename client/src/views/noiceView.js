export function renderNoiceItem(noice, container) {
  container.innerHTML = ''; 

  const noiceHTML = noice.map(item => `
    <div class="notification-item notification-unread">
      <div class="notification-text">Có ${item.count} người đã ${item._id.type} bài đăng của bạn</div>
      <div class="noice-img">${item.image?`<img src="${item.image}">`:""}</div>
    </div>
  `).join('');

  container.innerHTML = noiceHTML;
}
