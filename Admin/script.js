var adminLoginAttempts = 0;
var lockoutTimeout = null;

function validateForm(event) {
  event.preventDefault();

  var username = document.getElementById('username').value.toUpperCase();
  var password = document.getElementById('password').value;

  var errorMessage = document.getElementById('error-message');

  if (username === '1' && password === '1') {
    window.open("admin.html");
    errorMessage.innerHTML = "Login Berhasil";
    adminLoginAttempts = 0;
  } else if (username === '1' && password!== '1') {
    adminLoginAttempts++;
    if (adminLoginAttempts >= 5) {
      lockoutTimeout = setTimeout(function() {
        adminLoginAttempts = 0;
      }, 300000); 
      errorMessage.innerHTML = " Anda telah salah memasukkan password 5 kali. Silakan coba lagi dalam 5 menit.";
      document.getElementById('admin-login-btn').disabled = true;
    } else {
      errorMessage.innerHTML = "Password salah, Anda memiliki " + (5 - adminLoginAttempts) + " kesempatan lagi";
    }
  } else if (username!== '1' && password === '1') {
    errorMessage.innerHTML = "Username salah";
  } else {
    errorMessage.innerHTML = "Username dan password salah";
  }

  return false;
}

document.getElementById('admin-login-btn').addEventListener('click', validateForm);
