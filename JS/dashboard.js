document.addEventListener("DOMContentLoaded", async () => {
  const tablaPedidos = document.querySelector("#tablaPedidos tbody"); // Obtiene el cuerpo de la tabla donde se mostrarán los pedidos
  const graficoCanvas = document.getElementById("graficoPedidos"); // Obtiene el canvas donde se renderizará el gráfico
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo")); // Recupera el usuario almacenado en localStorage

  // Si no existe usuario o su rol no es admin → redirige al login
  if (!usuario || usuario.role.toLowerCase() !== "admin") { 
    window.location.href = "login.html";
    return;
  }

  // Cerrar sesión
  btnCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "login.html";
  });

  // Cargar pedidos y mostrarlos //
  async function cargarPedidos() {
    try {
      // Llama a la API para obtener la lista de pedidos
      const pedidos = await getOrders();

      tablaPedidos.innerHTML = ""; // Limpia la tabla antes de volver a llenarla

      pedidos.forEach(pedido => {  // Recorre cada pedido recibido
        const tr = document.createElement("tr"); // Crea un <tr> (fila) para la tabla
        
        // Inserta el contenido HTML de cada fila
        tr.innerHTML = `
          <td>${pedido.id}</td>
          <td>${pedido.userID}</td>
          <td>${pedido.items.map(i => i.nombre).join(", ")}</td>
          <td>$${pedido.total}</td>
          <td>
            <select class="selectEstado" data-id="${pedido.id}">
              <option value="Pendiente" ${pedido.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
              <option value="En preparación" ${pedido.estado === "En preparación" ? "selected" : ""}>En preparación</option>
              <option value="Entregado" ${pedido.estado === "Entregado" ? "selected" : ""}>Entregado</option>
            </select>
          </td>
          <td>
            <button class="btnActualizar" data-id="${pedido.id}">Actualizar</button>
          </td>
        `;

        // Agrega la fila a la tabla
        tablaPedidos.appendChild(tr);
      });

      // Agregar eventos a los botones
      document.querySelectorAll(".btnActualizar").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.dataset.id;  // Obtiene el ID del pedido desde el botón
          const select = document.querySelector(`.selectEstado[data-id="${id}"]`); // Obtiene el select asociado a este pedido
          const nuevoEstado = select.value; // Obtiene el nuevo estado seleccionado

          // Busca el pedido original en el array
          const pedido = pedidos.find(p => p.id == id);
          if (!pedido) return;

          // Actualiza el pedido en la API con el nuevo estado
          await updateOrder(id, { ...pedido, estado: nuevoEstado });

          alert(`Estado del pedido ${id} actualizado a "${nuevoEstado}"`);
          
          // Recargar gráfico con los nuevos estados
          actualizarGrafico(pedidos);
        });
      });

      // Actualizar gráfico con los datos iniciales
      actualizarGrafico(pedidos);

    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      tablaPedidos.innerHTML = `<tr><td colspan="6">Error al cargar pedidos.</td></tr>`;
    }
  }

  // Gráfico de estados de pedidos // 
  function actualizarGrafico(pedidos) {
    const estados = { "Pendiente": 0, "En preparación": 0, "Entregado": 0 }; // Objeto que cuenta cuántos pedidos hay por estado
    pedidos.forEach(p => estados[p.estado]++); // Recorre todos los pedidos y suma según su estado

    // Si el gráfico ya existe → solo actualiza datos
    if (window.chartPedidos) {
      window.chartPedidos.data.datasets[0].data = Object.values(estados);
      window.chartPedidos.update();

    } else {
      // Si el gráfico no existe, crea uno nuevo.
      window.chartPedidos = new Chart(graficoCanvas, {
        type: 'pie',  // Tipo de gráfico
        data: {
          labels: Object.keys(estados),      // ["Pendiente", "En preparación", "Entregado"]
          datasets: [{
            label: 'Estado de pedidos',
            data: Object.values(estados),    // [cantidadPendiente, cantidadEnPrep, cantidadEntregado]
            backgroundColor: ['#ff9800','#03a9f4','#4caf50']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }
  }

  // Llama a la función para cargar pedidos al iniciar el dashboard
  cargarPedidos();
});