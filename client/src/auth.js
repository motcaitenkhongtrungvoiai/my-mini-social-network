import { authModule } from "./modules/authModule.js";

 const btnLogin = document.getElementById('btnLogin');
 const btnRegister = document.getElementById('btnRegister')

 btnLogin.addEventListener("click",()=>{showForm("login")})
 btnRegister.addEventListener("click",()=>{showForm("register")})

function showForm(type) {
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            const btnLogin = document.getElementById('btnLogin');
            const btnRegister = document.getElementById('btnRegister');

            if (type === 'login') {
                loginForm.classList.add('active');
                registerForm.classList.remove('active');
                btnLogin.classList.add('active');
                btnRegister.classList.remove('active');
            } else {
                loginForm.classList.remove('active');
                registerForm.classList.add('active');
                btnLogin.classList.remove('active');
                btnRegister.classList.add('active');
            }
        }

authModule.login();
authModule.register();