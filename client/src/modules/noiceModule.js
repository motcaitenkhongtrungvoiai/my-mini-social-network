import { getData } from "./getData.js";
const auth = getData.getAuth();
export const noice = {
  Url_Api: "http://localhost:3000/v1/noice/",

 getNoitifi: async () => {
  try {
    const getNoice = await fetch(`${noice.Url_Api}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${auth.accessToken}`,
      },
    });
    const data = await getNoice.json();

    const unreadGroups = Array.isArray(data)
      ? data.filter(group => !group._id.read)
      : [];

    const total = unreadGroups.reduce((acc, group) => acc + (group.count || 0), 0);

    return { total, data };
  } catch (err) {
    console.error("lỗi lấy noitifi", err);
  }
},


  readNoitifi: async () => {
    try {
      const response = await fetch(`${noice.Url_Api}read`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({
          post: postId,
          comment: commentId,
          type,
        }),
      });

      return await response.json();
    } catch (err) {
      console.error("lỗi lấy đọc" + err);
    }
  },

  delNoitifi: async () => {
    try {
      const response = await fetch(`${noice.Url_Api}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({
          post: postId,
          comment: commentId,
          type,
        }),
      });

      return await response.json();
    } catch (err) {
      console.error("lỗi lấy xóa noitifi" + err);
    }
  },
};
