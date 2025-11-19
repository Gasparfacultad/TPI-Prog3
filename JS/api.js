//----------------------------USERS---------------------------------------//

// funcion para obtener todos los usuarios de la API.
async function getUsers() {
    try {
        const response = await fetch(URL_USERS); // Realiza una solicitud HTTP GET al endpoint donde estan los usuarios.

        if (!response.ok) { // Si la respuesta no es correcta, da un error manual.
            throw new Error(`Error al obtener usuarios: ${response.status} ${response.statusText}`);
        }
        return await response.json(); // Convierte la respuesta a JSON y la devuelve.
    } catch (error) {
        console.error("Error en getUsers:", error);
        throw error; // Lo relanza para que otras funciones lo puedan capturar.
    }
}

// Funcion que envia un POST para crear un nuevo usuario.
async function createUser(userData) {
    try {
        if (!userData) throw new Error("Datos de usuario no proporcionados"); // Valida que se hayan enviado datos.

        // Envia la solicitud POST con los datos del usuario convertidos a json.
        const response = await fetch(URL_USERS, {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // Indica que se enviara JSON.
            body: JSON.stringify(userData)  // Convierte el objeto a json.
        });

        if (!response.ok) {
            throw new Error(`Error al crear usuario: ${response.status} ${response.statusText}`);
        }

        return await response.json();   // Devuelve el usuario recien creado.
    } catch (error) {
        console.error("Error en createUser:", error);
        throw error;
    }
}

//----------------------------MENU---------------------------------------//

// Función que obtiene todos los items del menu.
async function getMenu() {
    try {
        const response = await fetch(URL_MENU);
        if (!response.ok) {
            throw new Error(`Error al obtener menú: ${response.status} ${response.statusText}`);
        }
        return await response.json(); // Retorna el JSON del menu.
    } catch (error) {
        console.error("Error en getMenu:", error);
        throw error;
    }
}


//----------------------------ORDERS---------------------------------------//

// Función que obtiene todas las ordenes.
async function getOrders() {
    try {
        // Solicitud GET al endpoint del menú.
        const response = await fetch(URL_ORDERS);

        if (!response.ok) {
            throw new Error(`Error al obtener órdenes: ${response.status} ${response.statusText}`);
        }
        return await response.json(); // Retorna el JSON de las ordenes.
    } catch (error) {
        console.error("Error en getOrders:", error); 
        throw error;
    }
}

// Función que crea una orden (pedido).
async function createOrder(orderData) {
    try {
        // Valida los datos.
        if (!orderData) throw new Error("Datos de la orden no proporcionados");

        // POST con los datos del pedido.
        const response = await fetch(URL_ORDERS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error(`Error al crear orden: ${response.status} ${response.statusText}`);
        }

        // Devuelve la orden creada.
        return await response.json();
    } catch (error) {
        console.error("Error en createOrder:", error);
        throw error;
    }
}

// Función para actualizar una orden existente.
async function updateOrder(orderId, updatedOrderData) {
    try {
        // Verifica ID y datos.
        if (!orderId || !updatedOrderData)
            throw new Error("ID o datos de la orden no proporcionados");

        // PUT al pedido elegido.
        const response = await fetch(`${URL_ORDERS}/${orderId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedOrderData)
        });

        // Si falla, da error.
        if (!response.ok) {
            throw new Error(`Error al actualizar orden: ${response.status} ${response.statusText}`);
        }

        // Devuelve la orden modificada.
        return await response.json();
    } catch (error) {
        console.error("Error en updateOrder:", error);
        throw error;
    }
}