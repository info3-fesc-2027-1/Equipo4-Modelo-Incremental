const productos = [

    // ANILLOS
    {
        id: 1,
        nombre: "Anillo de Oro Clásico",
        categoria: "Anillos",
        precio: 2500
    },

    {
        id: 2,
        nombre: "Anillo de Diamante",
        categoria: "Anillos",
        precio: 8500
    },

    {
        id: 3,
        nombre: "Anillo Rosa Gold",
        categoria: "Anillos",
        precio: 3200
    },

    {
        id: 4,
        nombre: "Anillo de Compromiso",
        categoria: "Anillos",
        precio: 12000
    },

    // COLLARES
    {
        id: 5,
        nombre: "Collar de Plata",
        categoria: "Collares",
        precio: 1800
    },

    {
        id: 6,
        nombre: "Collar de Perlas",
        categoria: "Collares",
        precio: 4500
    },

    {
        id: 7,
        nombre: "Collar Corazón",
        categoria: "Collares",
        precio: 2200
    },

    {
        id: 8,
        nombre: "Collar Infinito",
        categoria: "Collares",
        precio: 2800
    },

    // PULSERAS
    {
        id: 9,
        nombre: "Pulsera de Oro",
        categoria: "Pulseras",
        precio: 3200
    },

    {
        id: 10,
        nombre: "Pulsera Charm",
        categoria: "Pulseras",
        precio: 2600
    },

    {
        id: 11,
        nombre: "Pulsera Elegance",
        categoria: "Pulseras",
        precio: 3900
    },

    {
        id: 12,
        nombre: "Pulsera de Plata",
        categoria: "Pulseras",
        precio: 2100
    },

    // ARETES
    {
        id: 13,
        nombre: "Aretes de Diamante",
        categoria: "Aretes",
        precio: 4500
    },

    {
        id: 14,
        nombre: "Aretes Flor",
        categoria: "Aretes",
        precio: 1700
    },

    {
        id: 15,
        nombre: "Aretes de Perla",
        categoria: "Aretes",
        precio: 2300
    },

    {
        id: 16,
        nombre: "Aretes Brillantes",
        categoria: "Aretes",
        precio: 3400
    }

];

let carrito = [];

const contenedor =
document.getElementById("catalogo-lista");

function mostrarProductos(lista){

    contenedor.innerHTML = "";

    lista.forEach(producto => {

        contenedor.innerHTML += `

            <div class="bg-white rounded-xl shadow p-4">

                <h3 class="font-bold text-lg">
                    ${producto.nombre}
                </h3>

                <p>
                    ${producto.categoria}
                </p>

                <p class="font-bold text-indigo-600">
                    $${producto.precio}
                </p>

                <button
                    onclick="agregarCarrito(${producto.id})"
                    class="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg">

                    Agregar

                </button>

            </div>

        `;
    });
}

function agregarCarrito(id){

    const producto =
    productos.find(p => p.id === id);

    carrito.push(producto);

    actualizarCarrito();
}

function actualizarCarrito(){

    const divCarrito =
    document.getElementById("carrito");

    const total =
    document.getElementById("total");

    divCarrito.innerHTML = "";

    let suma = 0;

    carrito.forEach(item => {

        suma += item.precio;

        divCarrito.innerHTML += `
            <p>
                ${item.nombre} - $${item.precio}
            </p>
        `;
    });

    total.textContent = suma;
}

mostrarProductos(productos);

document
.getElementById("buscarProducto")
.addEventListener("input", function(){

    const texto =
    this.value.toLowerCase();

    const filtrados =
    productos.filter(producto =>
        producto.nombre.toLowerCase()
        .includes(texto)
    );

    <div class="bg-white rounded-xl shadow-lg p-4 hover:scale-105 transition">

    <img
        src="https://via.placeholder.com/250x200"
        alt="${producto.nombre}"
        class="w-full rounded-lg mb-3"
    >

    <h3 class="font-bold text-lg">
        ${producto.nombre}
    </h3>

    <p class="text-gray-500">
        ${producto.categoria}
    </p>

    <p class="font-bold text-indigo-600 text-xl mt-2">
        $${producto.precio}
    </p>

    <button
        onclick="agregarCarrito(${producto.id})"
        class="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg">

        Agregar al carrito

    </button>

</div>

window.agregarCarrito = agregarCarrito;
