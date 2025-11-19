document.addEventListener("DOMContentLoaded", async () => {
  // Obtiene elementos del DOM necesarios para mostrar datos y manejar eventos
  const saludoUsuario = document.getElementById("saludoUsuario");
  const contenedorMenu = document.getElementById("contenedorMenu");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  const buscador = document.getElementById("buscador");
  const filtroCategoria = document.getElementById("filtroCategoria");

  // Verificar usuario logueado // 
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo")); // Recupera la información del usuario desde localStorage
  if (!usuario) {
    window.location.href = "login.html";
    return;
  }
  saludoUsuario.textContent = `Bienvenido, ${usuario.nombre}`;

  // Cargar menú // 
  let menuCompleto = await cargarMenu(); // menuCompleto almacenará la lista completa de productos obtenida desde la API

  // Funcion que obtiene los datos de la API y los muestra en pantalla
  async function cargarMenu() {
    try {
      const items = await getMenu();  // Llama a la API para obtener los productos

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
      
      // Crea un contenedor tipo tarjeta para el producto
      const card = document.createElement("div");
      card.classList.add("card-menu");

      // Inserta el contenido HTML de cada tarjeta
      card.innerHTML = `
        <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.nombre}" class="menu-img">
        <h3>${item.nombre}</h3>
        <div class="card-bottom">
          <p class="tipo">${item.tipo}</p>
          <p class="precio"><strong>$${item.precio}</strong></p>
          <button class="btn-agregar" data-id="${item.id}">Agregar</button>
        </div>
      `;

      // Agrega la tarjeta al contenedor general del menú
      contenedorMenu.appendChild(card);
    });

    // dejar la acción de agregar al carrito a carrito.js
    document.querySelectorAll(".btn-agregar").forEach(btn => {
      btn.addEventListener("click", (e) => {

        const id = e.target.dataset.id; // Obtiene el id del producto desde el atributo data-id
        const producto = menuCompleto.find(p => p.id == id); // Busca el producto correspondiente dentro del menú completo
        if (producto && typeof agregarAlCarrito === "function") { // Si existe y la función agregarAlCarrito está definida, lo agrega al carrito
          agregarAlCarrito(producto);
        }
      });
    });
  }

  // Filtrar y buscar productos // 
  buscador.addEventListener("input", filtrarYBuscar); // Cuando el usuario escribe en el buscador, actualiza la lista
  filtroCategoria.addEventListener("change", filtrarYBuscar); // Cuando cambia la categoría seleccionada, actualiza la lista

  function filtrarYBuscar() {
    const texto = buscador.value.toLowerCase().trim(); // Convierte el texto ingresado a minúsculas para facilitar coincidencias
    const categoria = filtroCategoria.value.toLowerCase().trim(); // Categoría seleccionada en el filtro

    const filtrado = menuCompleto.filter(item => {
      const nombre = item.nombre.toLowerCase();
      const tipo = item.tipo.toLowerCase();

      
      const coincideTexto = texto === "" || nombre.includes(texto) || tipo.includes(texto); // Verifica coincidencia con el texto escrito
      const coincideCategoria = categoria === "todos" || tipo === categoria; // Verifica coincidencia de categoría
      return coincideTexto && coincideCategoria;// El producto será mostrado solo si cumple ambas condiciones
    });

    mostrarMenu(filtrado); // Muestra en pantalla la lista filtrada
  }

  // Cerrar sesión // 
  btnCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "login.html";
  });
});