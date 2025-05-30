export const authModule = {
  register: async () => {
    const form = document.getElementById("registerForm");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        username: form.elements["username"].value,
        email: form.elements["email"].value,
        password: form.elements["password"].value,
      };

      try {
        const res = await fetch("http://localhost:3000/v1/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await res.json();
        console.log("Server response:", result);
      } catch (err) {
        console.error("Fetch error:", err);
        alert("server bận");
      }
    });

    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth) {
      console.log("Người dùng đã đăng nhập, userID là:", auth);
    }
  },

  login: async () => {
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        username: form.elements["username"].value,
        password: form.elements["password"].value,
      };

      try {
        const res = await fetch("http://localhost:3000/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await res.json();
        console.log("Server response:", result);
        authModule.saveUsertoLocal(result);
        // di chuyên đến trang cá nhân
        if (res.status === 200) {
          window.location.replace("../public/profile.html");
        }
        else alert("sai mật khẩu hoặc email")
      } catch (err) {
       
        console.error("Fetch error:", err);
        alert("server bận ")
      }
    });
  },

  // lưu lại token để sử dụng chức
  saveUsertoLocal: (user) => {
    const authData = {
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      userId: user._id,
      userRole:user.role,
    };
    localStorage.setItem("auth", JSON.stringify(authData));
    console.log("Auth info saved to localStorage.");
  },
};
