//----------------------------USERS---------------------------------------//

async function getUsers() {
    try {
        const response = await fetch(URL_USERS);
        if (!response.ok) {
            throw new Error(`Error al obtener usuarios: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en getUsers:", error);
        throw error;
    }
}

async function createUser(userData) {
    try {
        if (!userData) throw new Error("Datos de usuario no proporcionados");

        const response = await fetch(URL_USERS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`Error al crear usuario: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en createUser:", error);
        throw error;
    }
}

//----------------------------MENU---------------------------------------//

async function getMenu() {
    try {
        const response = await fetch(URL_MENU);
        if (!response.ok) {
            throw new Error(`Error al obtener menú: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en getMenu:", error);
        throw error;
    }
}

async function createMenuItem(menuItemData) {
    try {
        if (!menuItemData) throw new Error("Datos del ítem del menú no proporcionados");

        const response = await fetch(URL_MENU, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(menuItemData)
        });

        if (!response.ok) {
            throw new Error(`Error al crear ítem del menú: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en createMenuItem:", error);
        throw error;
    }
}

async function updateMenuItem(menuItemId, updatedMenuItemData) {
    try {
        if (!menuItemId || !updatedMenuItemData)
            throw new Error("ID o datos del ítem del menú no proporcionados");

        const response = await fetch(`${URL_MENU}/${menuItemId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedMenuItemData)
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar ítem del menú: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en updateMenuItem:", error);
        throw error;
    }
}

async function deleteMenuItem(menuItemId) {
    try {
        if (!menuItemId) throw new Error("ID del ítem del menú no proporcionado");

        const response = await fetch(`${URL_MENU}/${menuItemId}`, { method: "DELETE" });

        if (!response.ok) {
            throw new Error(`Error al eliminar ítem del menú: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en deleteMenuItem:", error);
        throw error;
    }
}

//----------------------------ORDERS---------------------------------------//

async function getOrders() {
    try {
        const response = await fetch(URL_ORDERS);
        if (!response.ok) {
            throw new Error(`Error al obtener órdenes: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en getOrders:", error);
        throw error;
    }
}

async function createOrder(orderData) {
    try {
        if (!orderData) throw new Error("Datos de la orden no proporcionados");

        const response = await fetch(URL_ORDERS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error(`Error al crear orden: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en createOrder:", error);
        throw error;
    }
}

async function updateOrder(orderId, updatedOrderData) {
    try {
        if (!orderId || !updatedOrderData)
            throw new Error("ID o datos de la orden no proporcionados");

        const response = await fetch(`${URL_ORDERS}/${orderId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedOrderData)
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar orden: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en updateOrder:", error);
        throw error;
    }
}

async function deleteOrder(orderId) {
    try {
        if (!orderId) throw new Error("ID de la orden no proporcionado");

        const response = await fetch(`${URL_ORDERS}/${orderId}`, { method: "DELETE" });

        if (!response.ok) {
            throw new Error(`Error al eliminar orden: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en deleteOrder:", error);
        throw error;
    }
}