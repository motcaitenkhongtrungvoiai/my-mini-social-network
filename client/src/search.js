import { initSearch } from "./controllers/findDataController.js";
initSearch()
document.addEventListener('DOMContentLoaded', function() {
  const toggleButtons = document.querySelector('.toggle-buttons');
  const showUsers = document.getElementById('showUsers');
  const showPosts = document.getElementById('showPosts');


  toggleButtons.classList.add('active-post');
  showPosts.classList.add('active');

  showUsers.addEventListener('click', function() {
    toggleButtons.classList.remove('active-post');
    toggleButtons.classList.add('active-user');
    showPosts.classList.remove('active');
    showUsers.classList.add('active');

  });

  showPosts.addEventListener('click', function() {
    toggleButtons.classList.remove('active-user');
    toggleButtons.classList.add('active-post');
    showUsers.classList.remove('active');
    showPosts.classList.add('active');

  });
});