import { getData } from "./getData.js";
import { URL_api } from "./Url_api.js";
const auth = getData.getAuth();

export const followModule = {
  API_URL: `${URL_api()}/v1/users`,

  getFollowers: async () => {
    try {
      const res = await fetch(`${followModule.API_URL}/followers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${auth.accessToken}`,
        },
      });
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    } catch (err) {
      console.error("Error getting followers: " + err);
      throw err;
    }
  },

  getFollowing: async () => {
    try {
      const res = await fetch(`${followModule.API_URL}/following`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${auth.accessToken}`,
        },
      });
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    } catch (err) {
      console.error("Error getting following: " + err);
      throw err;
    }
  },
};
