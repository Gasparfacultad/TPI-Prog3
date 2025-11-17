document.addEventListener("DOMContentLoaded", async () => {
  const tablaPedidos = document.querySelector("#tablaPedidos tbody");
  const graficoCanvas = document.getElementById("graficoPedidos");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  // Verificar usuario admin
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
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
      const pedidos = await getOrders();

      tablaPedidos.innerHTML = "";

      pedidos.forEach(pedido => {
        const tr = document.createElement("tr");

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

        tablaPedidos.appendChild(tr);
      });

      // Agregar eventos a los botones
      document.querySelectorAll(".btnActualizar").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.dataset.id;
          const select = document.querySelector(`.selectEstado[data-id="${id}"]`);
          const nuevoEstado = select.value;

          const pedido = pedidos.find(p => p.id == id);
          if (!pedido) return;

          // Actualizar el pedido en MockAPI
          await updateOrder(id, { ...pedido, estado: nuevoEstado });

          alert(`Estado del pedido ${id} actualizado a "${nuevoEstado}"`);
          
          // Recargar gráfico con los nuevos estados
          actualizarGrafico(pedidos);
        });
      });

      actualizarGrafico(pedidos);

    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      tablaPedidos.innerHTML = `<tr><td colspan="6">Error al cargar pedidos.</td></tr>`;
    }
  }

  // Gráfico de estados de pedidos // 
  function actualizarGrafico(pedidos) {
    const estados = { "Pendiente": 0, "En preparación": 0, "Entregado": 0 };
    pedidos.forEach(p => estados[p.estado]++);

    if (window.chartPedidos) {
      window.chartPedidos.data.datasets[0].data = Object.values(estados);
      window.chartPedidos.update();
    } else {
      window.chartPedidos = new Chart(graficoCanvas, {
        type: 'pie',
        data: {
          labels: Object.keys(estados),
          datasets: [{
            label: 'Estado de pedidos',
            data: Object.values(estados),
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

  // Cargar pedidos al inicio
  cargarPedidos();
});