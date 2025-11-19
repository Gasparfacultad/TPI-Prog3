document.addEventListener("DOMContentLoaded", () => {
  const carritoLista = document.getElementById("carritoLista");
  const carritoTotal = document.getElementById("carritoTotal");
  const btnConfirmarPedido = document.getElementById("btnConfirmarPedido");
  const btnVolverMenu = document.getElementById("btnVolverMenu");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  // Verificar usuario activo
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (!usuario) {
    window.location.href = "login.html";
    return;
  }

  // Obtener carrito desde localStorage
  // Si no existe, se inicializa como array vacío
  let carrito = JSON.parse(localStorage.getItem("carrito")) || []; 

  actualizarCarritoDOM(); // Mostrar el carrito en la pantalla al cargar la página

  // Función para agregar productos al carrito // 
  window.agregarAlCarrito = function(producto) {
    const existe = carrito.find(item => item.id === producto.id);// Busca si el producto ya está dentro del carrito
    
    if (existe) {
      existe.cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito)); // Guarda el carrito actualizado en localStorage
    actualizarCarritoDOM(); // Actualiza la vista del carrito
  };

  // Función para actualizar DOM del carrito // 
  function actualizarCarritoDOM() {
    carritoLista.innerHTML = ""; // Limpia el listado del carrito

    if (carrito.length === 0) {
      carritoLista.innerHTML = "<p>El carrito está vacío.</p>";
      carritoTotal.innerHTML = "<strong>Total: $0</strong>";
      return;
    }

    // Recorre los productos y los muestra en pantalla
    carrito.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("item-carrito");
      
      // Inserta nombre, cantidad y subtotal
      div.innerHTML = `
        <span>${item.nombre} x ${item.cantidad} - $${item.precio * item.cantidad}</span>
        <button class="btn-eliminar" data-id="${item.id}">❌</button>
      `;
      carritoLista.appendChild(div);
    });

    // Actualizar total
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    carritoTotal.innerHTML = `<strong>Total: $${total}</strong>`;

    // Botones de eliminar
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        eliminarDelCarrito(id);
      });
    });

    // Mostrar carrito al agregar un producto
    const carritoSection = document.getElementById("carritoSection");
    carritoSection.style.display = carrito.length > 0 ? "block" : "none";
  }

  // Función eliminar producto // 
  function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id != id); // Filtra dejando solo los que NO coinciden con ese id
    localStorage.setItem("carrito", JSON.stringify(carrito)); // Actualiza el localStorage
    actualizarCarritoDOM(); // Actualiza la vista del carrito
  }

  // Confirmar pedido //
  btnConfirmarPedido.addEventListener("click", async () => {
  // Evita confirmar un carrito vacío
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  // Prepara los items para enviarlos a la API
  const itemsParaOrden = carrito.map(item => ({
    nombre: item.nombre,
    precio: item.precio * item.cantidad
  }));

  // Crea el objeto de la nueva orden
  const nuevaOrden = {
    userID: usuario.id.toString(), // Asegura que el userID sea string
    items: itemsParaOrden,
    total: itemsParaOrden.reduce((acc, item) => acc + item.precio, 0),
    estado: "Pendiente"
  };

  try {
    // Enviar orden a la API
    await createOrder(nuevaOrden);
    alert("Pedido enviado con éxito!");
    // Vaciar carrito
    carrito = [];
    localStorage.removeItem("carrito");

    actualizarCarritoDOM(); // Actualizar carrito en pantalla

    window.location.href = "menu.html";
  } catch (error) {
    console.error("Error al enviar pedido:", error);
    alert("Error al enviar el pedido. Intenta nuevamente.");
  }
});

  // Botones navegación //
  btnVolverMenu.addEventListener("click", () => window.location.href = "menu.html");
  // Cerrar sesión
  btnCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    localStorage.removeItem("carrito");
    window.location.href = "login.html";
  });
  
});