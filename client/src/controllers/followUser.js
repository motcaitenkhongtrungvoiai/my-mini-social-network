export function initFollow(idolId) {
  const queryIdolId = idolId;
  fetchFollowing(queryIdolId);
}
async function fetchFollowing(idolId) {
  try {
    if (!idolId) return null;
    const auth = getAuth();
    const res = await fetch( `http://localhost:3000/v1/users/follow/${idolId}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${auth.accessToken}`,
        },

        body: JSON.stringify({ userId: auth.userId }),
      });   
    if (res) {
      reloadPage();
    }
    return await res.json();
  } catch (err) {
    console.error("Không thể lấy thông tin người dùng:", err.message);
    return null;
  }
}
function reloadPage() {
  window.location.reload();
}
function getAuth() {
  const authData = localStorage.getItem("auth");
  if (!authData) return null;
  try {
    return JSON.parse(authData);
  } catch (err) {
    console.warn("Auth bị lỗi định dạng JSON:", err.message);
    return null;
  }
}
