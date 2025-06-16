
import { renderPostList } from "../views/postView.js";
import { attachLikeEvents } from "./likeController.js";
import { attachCommentEvents } from "./commentController.js";
import { attachReportEvents } from "./reportController.js";

let currentPage = 1;
const postsPerPage = 4;
let isLoading = false;
let hasMorePosts = true;
let allPosts = []; 

export async function loadPosts(initialLoad = true) {
  if (isLoading || !hasMorePosts) return;
  
  isLoading = true;
  const container = document.querySelector(".post-containerAll");
  
  try {
    if (!initialLoad) {
      const loader = document.createElement('div');
      loader.className = 'loader';
      loader.innerHTML = 'Đang tải thêm bài viết...';
      container.appendChild(loader);
    }

    const res = await fetch(`http://localhost:3000/v1/post/feed?page=${currentPage}&limit=${postsPerPage}`);
    if (!res.ok) throw new Error("Không thể tải bài viết");
    
    const data = await res.json();
    const newPosts = data.posts || data;

    const loader = container.querySelector('.loader');
    if (loader) loader.remove();

    if (!newPosts || newPosts.length === 0) {
      hasMorePosts = false;
      if (initialLoad) container.innerHTML = "Không có bài viết nào.";
      return;
    }

    allPosts = initialLoad ? [...newPosts] : [...allPosts, ...newPosts];
    
    // Render lại toàn bộ từ allPosts thay vì chỉ newPosts
    container.innerHTML = "";
    renderPostList(allPosts, container);

    currentPage++;
    hasMorePosts = newPosts.length >= postsPerPage;
    
    attachLikeEvents();
    attachCommentEvents();
    attachReportEvents();
  } catch (err) {
    console.error("Lỗi khi tải bài viết:", err);
    if (initialLoad) container.innerHTML = `<p>Lỗi tải bài viết: ${err.message}</p>`;
  } finally {
    isLoading = false;
  }
}


let lastScrollTime = 0;
function checkScroll() {
  const now = Date.now();
  if (now - lastScrollTime < 500) return; // Giới hạn 500ms giữa các lần check
  
  lastScrollTime = now;
  
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 300 && !isLoading && hasMorePosts) {
    loadPosts(false);
  }
}

export function initInfiniteScroll() {
  window.addEventListener('scroll', () => {
    requestAnimationFrame(checkScroll);
  });
  
  // Load lần đầu
  loadPosts(true);
}
