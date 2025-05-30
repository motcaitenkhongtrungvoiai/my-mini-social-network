export class searchModule {
  constructor(keyword) {
    this.API_URL = "http://localhost:3000/v1/search";
    this.keyword = keyword;
  }

 async searchPost() {
    try {
      const res = await fetch(`${this.API_URL}/posts?keyword=${this.keyword}`, {
        method: "get",
      });
      if (res.ok) {
        return res.json();
      }
    } catch (err) {
      console.error("somthing went wrong " + err);
    }
  }

  async searchUser() {
    try {
      const res = await fetch(`${this.API_URL}/users?keyword=${this.keyword}`, {
        method: "get",
      });
      if (res.ok) {
        return res.json();
      }
    } catch (err) {
      console.error("somthing went wrong " + err);
    }
  }

}
