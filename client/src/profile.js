import { initProfile } from "./controllers/profileController.js";
import { getData } from "./modules/getData.js";
import { initSocket } from "./modules/wsNotifier.js";
document.addEventListener("DOMContentLoaded", () => {
  initProfile();
  const auth = getData.getAuth();
  if (auth) initSocket(auth.accessToken);
});
