import { URL_api } from "./Url_api.js";
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
      if (data.length < 5) {
        alert("tên đăng nhập phải có tối thiểu 5 ký tự");
        return;
      } else if (
        form.elements["password"].value != form.elements["password_again"].value
      ) {
        alert("mật khẩu không trùng khớp");
        form.elements["password_again"].setAttribute("tabindex", "-1");
        form.elements["password_again"].focus();
        return;
      } else {
        try {
          const res = await fetch(`${URL_api()}/v1/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          const result = await res.json();
          if (res.ok) {
            alert(
              "tạo tài khoản thành công vui lòng đăng nhập bằng tài khảo vừa tạo "
            );
          } else alert("tài khoản đăng ký không thành công "+ result.message);
        } catch (err) {
          console.error("Fetch error:", err);
          alert("server bận");
        }
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
        const res = await fetch(`${URL_api()}/v1/auth/login`, {
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
          window.location.replace(`../public/profile.html?data=${result._id}`);
        } else alert("sai mật khẩu hoặc email");
      } catch (err) {
        console.error("Fetch error:", err);
        alert("server bận ");
      }
    });
  },

  // lưu lại token để sử dụng chức
  saveUsertoLocal: (user) => {
    const authData = {
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      userId: user._id,
      userRole: user.role,
    };
    localStorage.setItem("auth", JSON.stringify(authData));
    console.log("Auth info saved to localStorage.");
  },
};
