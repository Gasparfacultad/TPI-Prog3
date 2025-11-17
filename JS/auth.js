// -------------------- LOGIN --------------------
document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("formLogin");
  const mensaje = document.getElementById("mensaje");

  if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const usuarios = await getUsers();
      const usuarioValido = usuarios.find(
        (u) => u.email === email && u.password === password
      );

      if (usuarioValido) {
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioValido));
        mensaje.textContent = "Inicio de sesión exitoso";
        mensaje.style.color = "green";

        console.log("Usuario logueado:", usuarioValido); //  Para verificar rol

        setTimeout(() => {
          if (usuarioValido.role && usuarioValido.role.toLowerCase() === "admin") {
            window.location.href = "./dashboard.html";

          } else {
            window.location.href = "./menu.html";
          }
        }, 1000);
      } else {
        mensaje.textContent = "Email o contraseña incorrectos";
        mensaje.style.color = "red";
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      mensaje.textContent = "Error al conectar con el servidor.";
      mensaje.style.color = "red";
    }
  });
 }

  // -------------------- REGISTRO --------------------
  const formRegistro = document.getElementById("formRegistro");
  const mensajeRegistro = document.getElementById("mensaje");

  if (formRegistro) {
    formRegistro.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!nombre || !email || !password) {
        mensajeRegistro.textContent = "Por favor, completa todos los campos";
        mensajeRegistro.style.color = "red";
        return;
      }

      try {
        const usuarios = await getUsers();
        const existe = usuarios.some((u) => u.email === email);

        if (existe) {
          mensajeRegistro.textContent = "Ya existe un usuario con ese correo";
          mensajeRegistro.style.color = "red";
          return;
        }

        const nuevoUsuario = {
          nombre,
          email,
          password,
          role: "user", // Rol por defecto
        };

        await createUser(nuevoUsuario);

        mensajeRegistro.textContent = "Se registro correctamente";
        mensajeRegistro.style.color = "green";

        setTimeout(() => {
          window.location.href = "./login.html";
        }, 1500);
      } catch (error) {
        console.error("Error al registrar:", error);
        mensajeRegistro.textContent = "Error al registrar usuario.";
        mensajeRegistro.style.color = "red";
      }
    });
  }
});