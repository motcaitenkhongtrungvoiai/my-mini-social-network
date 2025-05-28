 function checkAdmin(){
    const authData = localStorage.getItem("auth");
    if (!authData) window.location.replace("../../public/index.html");
    const role = JSON.parse(authData);
    if (role.userRole!="admin") window.location.replace("../../public/index.html");
  };
  
  window.addEventListener("DOMContentLoaded",()=>{
    checkAdmin();
  })