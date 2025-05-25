export function setupImagePreview(fileInputId, previewImageId) {
  const fileInput = document.getElementById(fileInputId);
  const previewImage = document.getElementById(previewImageId);

  if (!fileInput || !previewImage) {
    console.error("Không tìm thấy phần tử!");
    return;
  }

  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block"; // Hiện ảnh
      };

      reader.readAsDataURL(file);
    } else {
      previewImage.src = "";
      previewImage.style.display = "none"; // Ẩn ảnh nếu file không hợp lệ
    }
  });
}
