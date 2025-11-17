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

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  actualizarCarritoDOM();

  // Función para agregar productos // 
  window.agregarAlCarrito = function(producto) {
    const existe = carrito.find(item => item.id === producto.id);

    if (existe) {
      existe.cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarritoDOM();
  };

  // Función para actualizar DOM del carrito // 
  function actualizarCarritoDOM() {
    carritoLista.innerHTML = "";

    if (carrito.length === 0) {
      carritoLista.innerHTML = "<p>El carrito está vacío.</p>";
      carritoTotal.innerHTML = "<strong>Total: $0</strong>";
      return;
    }

    carrito.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("item-carrito");
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
    carrito = carrito.filter(item => item.id != id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarritoDOM();
  }

  // Confirmar pedido //
  btnConfirmarPedido.addEventListener("click", async () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  const itemsParaOrden = carrito.map(item => ({
    nombre: item.nombre,
    precio: item.precio * item.cantidad
  }));

  const nuevaOrden = {
    userID: usuario.id.toString(),
    items: itemsParaOrden,
    total: itemsParaOrden.reduce((acc, item) => acc + item.precio, 0),
    estado: "Pendiente"
  };

  try {
    await createOrder(nuevaOrden);
    alert("Pedido enviado con éxito!");
    carrito = [];
    localStorage.removeItem("carrito");
    actualizarCarritoDOM();
    window.location.href = "menu.html";
  } catch (error) {
    console.error("Error al enviar pedido:", error);
    alert("Error al enviar el pedido. Intenta nuevamente.");
  }
});

  // Botones navegación //
  btnVolverMenu.addEventListener("click", () => window.location.href = "menu.html");
  btnCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    localStorage.removeItem("carrito");
    window.location.href = "login.html";
  });
  
});