export function renderNoiceItem(noice, container) {
  container.innerHTML = ''; 

  const noiceHTML = noice.map(item => `
    <div class="notification-item ${!item._id.read ? 'notification-unread' : ''}" data-post="${item._id.post}"  >
      <div class="notification-text">Có ${item.count} người  ${item._id.type} </div>
      <div class="noice-img">${item.image?`<img src="${item.image}">`:""}</div>

      <button class="delNoice"><i class="fa-solid fa-trash"></i></button>
    </div>
  `).join('');

  container.innerHTML = noiceHTML;
}
