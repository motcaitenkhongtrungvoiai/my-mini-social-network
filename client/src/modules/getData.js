export const getData = {
  getUrldata: () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("data");
  },

  getAuth: () => {
    const authData = localStorage.getItem("auth");
    if (!authData) window.location.replace("../public/auth.html");
    try {
      return JSON.parse(authData);
    } catch (err) {
      console.warn("Auth bị lỗi định dạng JSON:", err.message);
      return null;
    }
  },
};
