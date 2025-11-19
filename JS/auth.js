// -------------------- LOGIN --------------------
document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("formLogin"); // Obtiene el formulario de login por su ID
  const mensaje = document.getElementById("mensaje"); // Obtiene el elemento donde se mostrará el mensaje

  if (formLogin) { // Verifica que el formulario de login exista
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();// Evita que el formulario recargue la página

    const email = document.getElementById("email").value.trim(); // Obtiene el valor del campo email y elimina espacios
    const password = document.getElementById("password").value.trim(); // Obtiene el valor del campo password

    try {
      const usuarios = await getUsers(); // Obtiene la lista de usuarios desde la API

      // Busca un usuario cuyo email y contraseña coincidan
      const usuarioValido = usuarios.find(
        (u) => u.email === email && u.password === password
      );

      if (usuarioValido) { // Si se encontró un usuario que coincide
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioValido)); // Guarda el usuario logueado en el localStorage
        mensaje.textContent = "Inicio de sesión exitoso";
        mensaje.style.color = "green";

        console.log("Usuario logueado:", usuarioValido);

        setTimeout(() => {
          // Si tiene rol admin lo manda al dashboard
          if (usuarioValido.role && usuarioValido.role.toLowerCase() === "admin") {
            window.location.href = "./dashboard.html";
          
          // Si no es admin, va al menú común
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

      // Verifica que ningún campo esté vacío
      if (!nombre || !email || !password) {
        mensajeRegistro.textContent = "Por favor, completa todos los campos";
        mensajeRegistro.style.color = "red";
        return;
      }

      try {
        const usuarios = await getUsers(); // Obtiene usuarios para verificar si ya existe el email
        const existe = usuarios.some((u) => u.email === email); // Verifica si el email ya está registrado

        if (existe) {
          mensajeRegistro.textContent = "Ya existe un usuario con ese correo";
          mensajeRegistro.style.color = "red";
          return;
        }

        // Crea un objeto con los datos del nuevo usuario
        const nuevoUsuario = {
          nombre,
          email,
          password,
          role: "user", // Rol por defecto
        };

        // Envía el usuario nuevo a la API
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