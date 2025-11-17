document.addEventListener("DOMContentLoaded", async () => {
  const saludoUsuario = document.getElementById("saludoUsuario");
  const contenedorMenu = document.getElementById("contenedorMenu");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  const buscador = document.getElementById("buscador");
  const filtroCategoria = document.getElementById("filtroCategoria");

  // Verificar usuario logueado // -
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (!usuario) {
    window.location.href = "login.html";
    return;
  }
  saludoUsuario.textContent = `Bienvenido, ${usuario.nombre}`;

  // Cargar menú // 
  let menuCompleto = await cargarMenu();

  async function cargarMenu() {
    try {
      const items = await getMenu();
      if (!items || items.length === 0) {
        contenedorMenu.innerHTML = "<p>No hay productos en el menú.</p>";
        return [];
      }
      mostrarMenu(items);
      return items;
    } catch (error) {
      console.error("Error al cargar el menú:", error);
      contenedorMenu.innerHTML = "<p>Error al cargar el menú.</p>";
      return [];
    }
  }

  // Mostrar menú en la página // 
  function mostrarMenu(lista) {
    contenedorMenu.innerHTML = "";

    if (lista.length === 0) {
      contenedorMenu.innerHTML = "<p>No se encontraron productos.</p>";
      return;
    }

    lista.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("card-menu");

      card.innerHTML = `
        <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.nombre}" class="menu-img">
        <h3>${item.nombre}</h3>
        <div class="card-bottom">
          <p class="tipo">${item.tipo}</p>
          <p class="precio"><strong>$${item.precio}</strong></p>
          <button class="btn-agregar" data-id="${item.id}">Agregar</button>
        </div>
      `;

      contenedorMenu.appendChild(card);
    });

    // dejar la acción de agregar al carrito a carrito.js
    document.querySelectorAll(".btn-agregar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const producto = menuCompleto.find(p => p.id == id);
        if (producto && typeof agregarAlCarrito === "function") {
          agregarAlCarrito(producto);
        }
      });
    });
  }

  // Filtrar y buscar productos // 
  buscador.addEventListener("input", filtrarYBuscar);
  filtroCategoria.addEventListener("change", filtrarYBuscar);

  function filtrarYBuscar() {
    const texto = buscador.value.toLowerCase().trim();
    const categoria = filtroCategoria.value.toLowerCase().trim();

    const filtrado = menuCompleto.filter(item => {
      const nombre = item.nombre.toLowerCase();
      const tipo = item.tipo.toLowerCase();
      const coincideTexto = texto === "" || nombre.includes(texto) || tipo.includes(texto);
      const coincideCategoria = categoria === "todos" || tipo === categoria;
      return coincideTexto && coincideCategoria;
    });

    mostrarMenu(filtrado);
  }

  // Cerrar sesión // 
  btnCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "login.html";
  });
});