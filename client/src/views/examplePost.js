
export function setupImagePreview(){
  const fileInput = document.getElementById('postImage');
const previewImage = document.getElementById('previewImage');


fileInput.addEventListener('change', function (event) {
  const file = event.target.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.onload = function (e) {
      previewImage.style.display = 'block'; 
      previewImage.innerHTML=`<img  src="${e.target.result}" alt="Ảnh xem trước">`
    };

    reader.readAsDataURL(file);
  } else {
    previewImage.style.display = 'none'; 
  }
});
}
export function setupbtnCode(){
  document.getElementById('insertCodeTag').addEventListener('click', () => {
  const textarea = document.querySelector('textarea[name="content"]');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  // Nội dung mới có chèn tag
  const before = textarea.value.substring(0, start);
  const after = textarea.value.substring(end);
  const codeTag = '{code}{/code}';

  textarea.value = before + codeTag + after;

  // Đặt con trỏ vào giữa {code}|{/code}
  const cursorPosition = start + 6; 
  textarea.focus();
  textarea.setSelectionRange(cursorPosition, cursorPosition);
});
}