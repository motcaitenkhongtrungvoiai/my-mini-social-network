export function renderNoiceItem(noice, container) {
  container.innerHTML = '';
  const typeReport = "bài viết của bạn đã bị xóa do vi phạm chính sách của web";

  const noiceHTML = noice.map(item => {
    const isReport = item._id.type === typeReport;
    const unreadClass = !item._id.read ? 'notification-unread' : '';

    if (isReport) {
      // báo cáo hệ thống
      return `
        <div class="notification-item ${unreadClass}" data-post="${item._id.post}">
          <div class="notification-text"> <span style="color:red">[CẢNH BÁO]</span> ${item._id.type}</div>
          <button class="delNoice" data-post="${item._id.post}" data-type="${item._id.type}" data-read="${item._id.read}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
    } else {
      //  thông báo bình thường
      return `
        <div class="notification-item ${unreadClass}" data-post="${item._id.post}">
          <a href="call-noice-Post.html?postid=${item._id.post}&commentId=${item._id.comment}">
            <div class="notification-text">Có ${item.count} người ${item._id.type}</div>
            <div class="noice-img">${item.image ? `<img src="${item.image}">` : ""}</div>
          </a>
          <button class="delNoice" data-post="${item._id.post}" data-type="${item._id.type}" data-read="${item._id.read ? 'true' : 'false'}"">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
    }
  }).join('');

  container.innerHTML = noiceHTML;
}
