export function setupImagePreview() {
  const fileInput = document.getElementById("postImage");
  const previewImage = document.getElementById("previewImage");

  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = function (e) {
        previewImage.style.display = "block";
        previewImage.innerHTML = `<img  src="${e.target.result}" alt="Ảnh xem trước">`;
      };

      reader.readAsDataURL(file);
    } else {
      previewImage.style.display = "none";
    }
  });
}
export function setupbtnCode() {
  document.getElementById("insertCodeTag").addEventListener("click", () => {
    const textCode = document.getElementById("codetxt");
    if (textCode.style.display === "block") {
      textCode.style.display = "none";
    } else {
      textCode.style.display = "block";
    }
  });
}
