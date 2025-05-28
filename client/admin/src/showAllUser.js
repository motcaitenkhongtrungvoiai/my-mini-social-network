import { getData } from "./module/getData.js";

const API_URL = "http://localhost:3000/v1/users";

window.addEventListener("DOMContentLoaded", () => {
  loadUsers();
});

async function loadUsers() {
  const auth = getData.getAuth();
  const token = auth.accessToken;
  const res = await fetch(`${API_URL}/alluser`, {
    method: "POST",
    headers: {
      token: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    alert("Failed to load users");
    return;
  }

  const data = await res.json();
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";

  if (!Array.isArray(data.users)) {
    alert("Dữ liệu trả về không đúng định dạng!");
    console.log("data nhận được:", data);
    return;
  }

  data.users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.className = "user-row";

    tr.innerHTML = `
      <td><img src="${user.avatar}" width="40" height="40" style="border-radius:50%"/></td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td id="role-${user._id}">${user.role}</td>
      <td>
        <select id="select-${user._id}">
          <option value="user" ${
            user.role === "user" ? "selected" : ""
          }>user</option>
          <option value="admin" ${
            user.role === "admin" ? "selected" : ""
          }>admin</option>
          <option value="criminal" ${
            user.role === "criminal" ? "selected" : ""
          }>criminal</option>
        </select>
        <button class="btnChange" data-userid="${user._id}">Update</button>
      </td>
    `;

    // Thêm nút vào tbody
    tbody.appendChild(tr);

    // Gán sự kiện click cho nút Update
    tr.querySelector(".btnChange").addEventListener("click", () => {
      changeRole(user._id);
    });
  });
}

async function changeRole(userId) {
  const auth = getData.getAuth();
  const token = auth.accessToken;
  const newRole = document.getElementById(`select-${userId}`).value;

  const res = await fetch(`${API_URL}/promote/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${token}`,
    },
    body: JSON.stringify({ newRole: newRole, requesterId: auth.userId }),
  });

  if (res.ok) {
    document.getElementById(`role-${userId}`).innerText = newRole;
    document.getElementById(`select-${userId}`).value = newRole;
    document
      .getElementById(`select-${userId}`)
      .closest("tr")
      .classList.add("updated");
    setTimeout(() => {
      document
        .getElementById(`select-${userId}`)
        .closest("tr")
        .classList.remove("updated");
    }, 1000);
  } else {
    alert("Failed to update role");
  }
}
