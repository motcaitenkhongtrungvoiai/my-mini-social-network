import { getData } from "./module/getData.js";
import { URL_api } from "../../src/modules/Url_api.js";
const API_URL = `${URL_api()}/v1/users`;
const numberUser = document.getElementById("numberUser");
const reportedPosts = document.getElementById("reportedPosts");
const criminalUsers = document.getElementById("criminalUsers");
const reportedUsers = document.getElementById("reportedUsers");
const searchInput = document.getElementById("searchInput");
const searchReportedInput = document.getElementById("searchReportedInput");
const errorMessage = document.getElementById("errorMessage");

const btnSwichTable = document.querySelector("#swich-table");
const reportTable = document.querySelector(".reportUser-container");
const allUserTable = document.querySelector(".allUser-container");

let checkBTN = true;

btnSwichTable.addEventListener("click", () => {
  if (checkBTN) {
    allUserTable.style.display = "block";
    reportTable.style.display = "none";
  } else {
    allUserTable.style.display = "none";
    reportTable.style.display = "block";
  }
  checkBTN = !checkBTN;
});

window.addEventListener("DOMContentLoaded", () => {
  loadUsers();

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll("#usersTable tbody tr");

    rows.forEach((row) => {
      const username = row
        .querySelector("td:nth-child(2)")
        .textContent.toLowerCase();
      const email = row
        .querySelector("td:nth-child(3)")
        .textContent.toLowerCase();

      if (username.includes(searchTerm) || email.includes(searchTerm)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });

  searchReportedInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll("#reportedUsersTable tbody tr");

    rows.forEach((row) => {
      const username = row
        .querySelector("td:nth-child(2)")
        .textContent.toLowerCase();
      const email = row
        .querySelector("td:nth-child(3)")
        .textContent.toLowerCase();

      if (username.includes(searchTerm) || email.includes(searchTerm)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
});

async function loadUsers() {
  try {
    const auth = getData.getAuth();
    if (!auth || !auth.accessToken) {
      showError("Authentication failed. Please login again.");
      return;
    }

    const token = auth.accessToken;
    const res = await fetch(`${API_URL}/alluser`, {
      method: "POST",
      headers: {
        token: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to load users");
    }

    const data = await res.json();

    numberUser.textContent = data.totalUsers;
    reportedPosts.textContent = data.postReport || 0;

    const tbody = document.querySelector("#usersTable tbody");
    tbody.innerHTML = "";

    if (!Array.isArray(data.users)) {
      throw new Error("Invalid data format received from server");
    }

    let criminalCount = 0;
    let reportedCount = 0;

    data.users.forEach((user) => {
      if (user.role === "criminal") criminalCount++;
      if (user.reportCount > 0) reportedCount++;

      const tr = document.createElement("tr");
      if (user.reportCount > 0) {
        tr.classList.add("reported-row");
      }

      tr.className = "user-row";
      tr.innerHTML = `
                        <td><img src="${
                          user.avatar
                        }" width="40" height="40" class="avatar" onerror="this.src='http://localhost:3000/access/default.png'"/></td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td id="role-${user._id}">${user.role}</td>
                        <td>
                            <select id="select-${user._id}">
                                <option value="user" ${
                                  user.role === "user" ? "selected" : ""
                                }>user</option>        
                                <option value="criminal" ${
                                  user.role === "criminal" ? "selected" : ""
                                }>criminal</option>
                            </select>
                            <button class="btnChange" data-userid="${
                              user._id
                            }">Update</button>
                            ${
                              user.reportCount > 0
                                ? `<button class="btnBan" data-userid="${user._id}">Ban</button>`
                                : ""
                            }
                        </td>
                        <td><a href="../../public/profile.html?data=${
                          user._id
                        }" target="_blank">View Profile</a></td>
                    `;

      tbody.appendChild(tr);
      tr.querySelector(".btnChange")?.addEventListener("click", () => {
        changeRole(user._id);
      });

      tr.querySelector(".btnBan")?.addEventListener("click", () => {
        banUser(user._id);
      });
    });

    loadReportedUsers(data.users);

    criminalUsers.textContent = criminalCount;
    reportedUsers.textContent = reportedCount;

    errorMessage.style.display = "none";
  } catch (error) {
    showError(error.message);
    console.error("Error loading users:", error);
  }
}

function loadReportedUsers(users) {
  const reportedUsers = users.filter((user) => user.reportCount > 0);
  const tbody = document.querySelector("#reportedUsersTable tbody");
  tbody.innerHTML = "";

  reportedUsers.forEach((user) => {
    const tr = document.createElement("tr");
    tr.className = "reported-row";

    tr.innerHTML = `
                    <td><img src="${
                      user.avatar
                    }" width="40" height="40" class="avatar" onerror="this.src='http://localhost:3000/access/default.png'"/></td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td class="reported-count">${user.reportCount}</td>
                    <td id="reported-role-${user._id}">${user.role}</td>
                    <td>
                        <select id="reported-select-${user._id}">
                            <option value="user" ${
                              user.role === "user" ? "selected" : ""
                            }>user</option>        
                            <option value="criminal" ${
                              user.role === "criminal" ? "selected" : ""
                            }>criminal</option>
                        </select>
                        <button class="btnChange" data-userid="${
                          user._id
                        }">Update</button>
                        <button class="btnBan" data-userid="${
                          user._id
                        }">Ban</button>
                    </td>
                    <td><a href="../../public/profile.html?data=${
                      user._id
                    }" target="_blank">View Profile</a></td>
                `;

    tbody.appendChild(tr);
    tr.querySelector(".btnChange")?.addEventListener("click", () => {
      changeRole(user._id, true);
    });

    tr.querySelector(".btnBan")?.addEventListener("click", () => {
      banUser(user._id);
    });
  });
}

async function changeRole(userId, isReportedTable = false) {
  try {
    const auth = getData.getAuth();
    if (!auth || !auth.accessToken) {
      showError("Authentication failed. Please login again.");
      return;
    }

    const token = auth.accessToken;
    const selectorPrefix = isReportedTable ? "reported-" : "";
    const newRole = document.getElementById(
      `${selectorPrefix}select-${userId}`
    ).value;

    const res = await fetch(`${API_URL}/promote/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify({
        newRole: newRole,
        requesterId: auth.userId,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update role");
    }

    document.getElementById(`${selectorPrefix}role-${userId}`).innerText =
      newRole;
    document.getElementById(`${selectorPrefix}select-${userId}`).value =
      newRole;

    if (isReportedTable) {
      const mainRoleElement = document.getElementById(`role-${userId}`);
      if (mainRoleElement) {
        mainRoleElement.innerText = newRole;
        document.getElementById(`select-${userId}`).value = newRole;
      }
    } else {
      const reportedRoleElement = document.getElementById(
        `reported-role-${userId}`
      );
      if (reportedRoleElement) {
        reportedRoleElement.innerText = newRole;
        document.getElementById(`reported-select-${userId}`).value = newRole;
      }
    }

    const row = document
      .getElementById(`${selectorPrefix}select-${userId}`)
      .closest("tr");
    row.classList.add("updated");
    setTimeout(() => {
      row.classList.remove("updated");
    }, 1000);

    if (newRole === "criminal" || newRole === "user") {
      const criminalCount = Array.from(
        document.querySelectorAll("td[id^='role-'], td[id^='reported-role-']")
      ).filter((el) => el.innerText === "criminal").length;
      criminalUsers.textContent = criminalCount;
    }
  } catch (error) {
    showError(error.message);
    console.error("Error changing role:", error);
  }
}

async function banUser(userId) {
  if (
    !confirm(
      "Are you sure you want to ban this user? This action cannot be undone."
    )
  ) {
    return;
  }

  try {
    const auth = getData.getAuth();
    if (!auth || !auth.accessToken) {
      showError("Authentication failed. Please login again.");
      return;
    }

    const token = auth.accessToken;
    const res = await fetch(`${API_URL}/ban/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify({
        requesterId: auth.userId,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to ban user");
    }

    const role = "criminal";
    document.getElementById(`role-${userId}`).innerText = role;
    document.getElementById(`select-${userId}`).value = role;

    const reportedRoleElement = document.getElementById(
      `reported-role-${userId}`
    );
    if (reportedRoleElement) {
      reportedRoleElement.innerText = role;
      document.getElementById(`reported-select-${userId}`).value = role;
    }

    const criminalCount = Array.from(
      document.querySelectorAll("td[id^='role-'], td[id^='reported-role-']")
    ).filter((el) => el.innerText === "criminal").length;
    criminalUsers.textContent = criminalCount;

    alert("User has been banned successfully");
  } catch (error) {
    showError(error.message);
    console.error("Error banning user:", error);
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}
