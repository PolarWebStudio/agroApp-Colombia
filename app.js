// --- MANEJO DE TEMA (CLARO / OSCURO) ---
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const targetTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("theme_agro", targetTheme);

    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.textContent = targetTheme === "dark" ? "☀️" : "🌙";
    }
}

function cargarTemaGuardado() {
    const themeGuardado = localStorage.getItem("theme_agro") || "light";
    document.documentElement.setAttribute("data-theme", themeGuardado);
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.textContent = themeGuardado === "dark" ? "☀️" : "🌙";
    }
}

// --- MANEJO DE PESTAÑAS ---
function switchTab(tabId, eventObj) {
    document
        .querySelectorAll(".tab-content")
        .forEach(el => el.classList.remove("active"));
    document
        .querySelectorAll(".tab-btn")
        .forEach(el => el.classList.remove("active"));

    const targetContent = document.getElementById(`tab-${tabId}`);
    if (targetContent) targetContent.classList.add("active");

    const e = eventObj || window.event;
    if (e && e.target) {
        e.target.classList.add("active");
    }
}

// --- ESTADO DE RED (ONLINE / OFFLINE) ---
function updateOnlineStatus() {
    const badge = document.getElementById("status-badge");
    if (!badge) return;
    if (navigator.onLine) {
        badge.textContent = "En línea";
        badge.className = "badge online";
    } else {
        badge.textContent = "Sin conexión (Offline)";
        badge.className = "badge offline";
    }
}

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

// --- FORMATEADOR DE MILES ---
function formatearMiles(input) {
    let valor = input.value.replace(/\D/g, "");
    if (valor === "") {
        input.value = "";
        return;
    }
    input.value = parseInt(valor, 10).toLocaleString("es-CO");
}

function limpiarNumero(val) {
    if (!val) return 0;
    return (
        parseFloat(val.toString().replace(/\./g, "").replace(/,/g, ".")) || 0
    );
}

// --- CALCULADORA DE MÁRGENES ---
function calcularGanancia() {
    const producto = document.getElementById("producto").value;
    const cantidad = limpiarNumero(document.getElementById("cantidad").value);
    const costoTotal = limpiarNumero(
        document.getElementById("costo-total").value
    );
    const precioOferta = limpiarNumero(
        document.getElementById("precio-oferta").value
    );

    if (!producto || cantidad <= 0 || costoTotal < 0 || precioOferta <= 0) {
        alert("Por favor completa todos los campos correctamente.");
        return;
    }

    const ingresoTotal = cantidad * precioOferta;
    const gananciaNeta = ingresoTotal - costoTotal;
    const costoPorUnidad = costoTotal / cantidad;
    const margenPorcentaje = ((gananciaNeta / ingresoTotal) * 100).toFixed(1);

    const resultDiv = document.getElementById("resultado-calc");
    resultDiv.classList.remove("hidden");

    const esRentable = gananciaNeta > 0;
    resultDiv.style.borderLeftColor = esRentable ? "#2e7d32" : "#c62828";

    resultDiv.innerHTML = `
        <h3>Resumen para: ${producto}</h3>
        <p><strong>Ingreso Bruto Total:</strong> $${ingresoTotal.toLocaleString("es-CO")} COP</p>
        <p><strong>Costo de Producción por Unidad:</strong> $${costoPorUnidad.toLocaleString("es-CO", { maximumFractionDigits: 0 })} COP</p>
        <hr style="margin: 8px 0; border: 0; border-top: 1px solid var(--border-color);">
        <p style="font-size: 1.1rem; font-weight: bold; color: ${esRentable ? "#2e7d32" : "#c62828"};">
            ${esRentable ? "Ganancia Neta Estimada:" : "Pérdida Estimada:"} $${gananciaNeta.toLocaleString("es-CO")} COP
        </p>
        <p><strong>Margen de Ganancia:</strong> ${margenPorcentaje}%</p>
    `;
}

// --- PRECIOS DE REFERENCIA ---
const datosPreciosDefecto = [
    {
        producto: "Café Pasilla (Kilo)",
        precio: "$9.500 COP",
        mercado: "Nacional"
    },
    {
        producto: "Cacao en Grano Seco (Kilo)",
        precio: "$22.000 COP",
        mercado: "Nacional / Santander"
    },
    {
        producto: "Yuca Criolla (Bulto 50kg)",
        precio: "$75.000 COP",
        mercado: "Bucaramanga / Centrales"
    },
    {
        producto: "Plátano Hartón (Kilo)",
        precio: "$2.800 COP",
        mercado: "Corabastos / Centrales"
    },
    {
        producto: "Banano Criollo (Kilo)",
        precio: "$1.800 COP",
        mercado: "Local / Regional"
    },
    {
        producto: "Ahuyama / Zapallo (Kilo)",
        precio: "$1.500 COP",
        mercado: "Plazas Locales"
    },
    {
        producto: "Arracacha Amarilla (Bulto 50kg)",
        precio: "$120.000 COP",
        mercado: "Centrales"
    },
    {
        producto: "Papa Negra (Bulto 50kg)",
        precio: "$65.000 COP",
        mercado: "Centrales"
    },
    {
        producto: "Maíz Blanco Seco (Kilo)",
        precio: "$1.900 COP",
        mercado: "Nacional"
    },
    {
        producto: "Ñame Espino (Kilo)",
        precio: "$3.200 COP",
        mercado: "Costa / Regional"
    },
    {
        producto: "Frijol Rojo Seco (Kilo)",
        precio: "$8.500 COP",
        mercado: "Nacional"
    }
];

function cargarPrecios() {
    const lista = document.getElementById("lista-precios");
    if (!lista) return;
    lista.innerHTML = "";

    let precios = JSON.parse(localStorage.getItem("precios_agro"));

    if (!precios || precios.length === 0) {
        precios = datosPreciosDefecto;
        localStorage.setItem("precios_agro", JSON.stringify(precios));
    }

    precios.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "price-item";

        li.innerHTML = `
            <div class="price-info">
                <strong>${item.producto}</strong>
                <span class="price-tag">${item.precio}</span>
                <small style="color: var(--subtext-color);">${item.mercado}</small>
            </div>
            <button onclick="editarPrecio(${index})" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; padding: 8px;" title="Editar">✏️</button>
        `;
        lista.appendChild(li);
    });
}

function agregarPrecioNuevo() {
    const prodInput = prompt("Nombre del Producto / Cultivo:");
    if (!prodInput) return;

    const precioInput = prompt("Precio y Unidad (Ej: $15.000 COP / Kilo):");
    if (!precioInput) return;

    const mercadoInput = prompt("Mercado / Ubicación:") || "Local";

    const precios =
        JSON.parse(localStorage.getItem("precios_agro")) || datosPreciosDefecto;
    precios.unshift({
        producto: prodInput,
        precio: precioInput,
        mercado: mercadoInput
    });

    localStorage.setItem("precios_agro", JSON.stringify(precios));
    cargarPrecios();
}

function editarPrecio(index) {
    const precios =
        JSON.parse(localStorage.getItem("precios_agro")) || datosPreciosDefecto;
    const item = precios[index];

    const nuevoNombre = prompt("Editar nombre del producto:", item.producto);
    if (nuevoNombre === null) return;

    const nuevoPrecio = prompt("Editar precio y unidad:", item.precio);
    if (nuevoPrecio === null) return;

    const nuevoMercado = prompt("Editar plaza o mercado:", item.mercado);
    if (nuevoMercado === null) return;

    precios[index] = {
        producto: nuevoNombre.trim() || item.producto,
        precio: nuevoPrecio.trim() || item.precio,
        mercado: nuevoMercado.trim() || item.mercado
    };

    localStorage.setItem("precios_agro", JSON.stringify(precios));
    cargarPrecios();
}

function filtrarPrecios() {
    const query = document.getElementById("search-precio").value.toLowerCase();
    const items = document.querySelectorAll(".price-item");

    items.forEach(item => {
        const texto = item.textContent.toLowerCase();
        item.style.display = texto.includes(query) ? "flex" : "none";
    });
}

// --- NOTAS OFFLINE ---
function guardarNota() {
    const input = document.getElementById("nota-input");
    const texto = input.value.trim();
    if (!texto) return;

    const notas = JSON.parse(localStorage.getItem("notas_agro")) || [];
    notas.unshift({ fecha: new Date().toLocaleDateString(), texto: texto });
    localStorage.setItem("notas_agro", JSON.stringify(notas));

    input.value = "";
    cargarNotas();
}

function cargarNotas() {
    const lista = document.getElementById("lista-notas");
    if (!lista) return;
    lista.innerHTML = "";
    const notas = JSON.parse(localStorage.getItem("notas_agro")) || [];

    notas.forEach(nota => {
        const li = document.createElement("li");
        li.innerHTML = `<small style="color: var(--subtext-color);">[${nota.fecha}]</small> ${nota.texto}`;
        lista.appendChild(li);
    });
}

// --- INICIALIZACIÓN ---
document.addEventListener("DOMContentLoaded", () => {
    cargarTemaGuardado();
    updateOnlineStatus();
    cargarPrecios();
    cargarNotas();
});
