import { searchModule } from "../modules/searchModule.js";

export async function initSearch() {
  const keyword = geyKeyword();
  const search = new searchModule(keyword);
  const postPageData= await search.searchPost();
  const userPageData= await search.searchUser();
  console.log(userPageData);
 
}

function geyKeyword() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("keyword");
}
