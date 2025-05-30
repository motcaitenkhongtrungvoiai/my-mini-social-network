
export function renderUserList(users, container) {
  container.innerHTML = '';
  const usersHTML = users.map(user => `
   <a href="../public/profile.html?data=${user._id}">
    <div class="user-card">
      <div class="user-avatar">
        <img src="${user.avatar || 'https://via.placeholder.com/50'}" alt="${user.username}'s avatar">
      </div>
      <div class="user-info">
        <h2 class="username">${user.username}</h2>
        ${user.desc?`<span>${user.desc}</span>`:""}
      </div>
      <i class="fa-solid fa-eye"></i>
    </div>
    </a>
  `).join('');
  const wrapper = document.createElement('div');
  wrapper.className = 'user-list';
  wrapper.innerHTML = usersHTML
  container.appendChild(wrapper);
}