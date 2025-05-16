const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    username: form.elements["username"].value,
    email: form.elements["email"].value,
    password: form.elements["password"].value
  };

  try {
    const res = await fetch("http://localhost:3000/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    console.log("Server response:", result);
  } catch (err) {
    console.error("Fetch error:", err);
  }
});
 
const auth = JSON.parse(localStorage.getItem("auth"));
if (auth) {
  console.log("Người dùng đã đăng nhập, userID là:", auth);
}