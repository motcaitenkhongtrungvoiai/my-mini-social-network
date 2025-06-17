import { URL_api } from "./Url_api.js";
export const searchModule = {
  searchPost: async (keyword) => {
    try {
      const res = await fetch(`${URL_api()}/v1/search/posts?keyword=${keyword}`, {
        method: "get",
      });
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    } catch (err) {
      console.error("Error searching posts: " + err);
      throw err;
    }
  },

  searchUser: async (keyword) => {
    try {
      const res = await fetch(`${URL_api()}/v1/search/users?keyword=${keyword}`, {
        method: "get",
      });
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    } catch (err) {
      console.error("Error searching users: " + err);
      throw err;
    }
  }
}