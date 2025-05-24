const form = document.querySelector("form");



form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    username: form.elements["username"].value,
    password: form.elements["password"].value
  };

  try {
    const res = await fetch("http://localhost:3000/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    console.log("Server response:", result);
    saveUsertoLocal(result);
    // di chuyên đến trang cá nhân
  if(res.status===200) {window.location.replace("../public/profile.html")}
   
  } catch (err) {
    console.error("Fetch error:", err);
  }
});

// lưu lại token để sử dụng chức 
function saveUsertoLocal(user) {
  const authData = {
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
    userId: user._id
  };
  localStorage.setItem("auth", JSON.stringify(authData));
  console.log("Auth info saved to localStorage.");
}

