const productos = [

    {
        id: 1,
        nombre: "Anillo de Oro",
        categoria: "Anillos",
        precio: 2500
    },

    {
        id: 2,
        nombre: "Collar de Plata",
        categoria: "Collares",
        precio: 1800
    },

    {
        id: 3,
        nombre: "Pulsera de Oro",
        categoria: "Pulseras",
        precio: 3200
    },

    {
        id: 4,
        nombre: "Aretes de Diamante",
        categoria: "Aretes",
        precio: 4500
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

    mostrarProductos(filtrados);
});

document
.querySelectorAll(".categoria-btn")
.forEach(btn => {

    btn.addEventListener("click", () => {

        const categoria =
        btn.dataset.cat;

        if(categoria === "Todos"){

            mostrarProductos(productos);
        }
        else{

            const filtrados =
            productos.filter(
                p => p.categoria === categoria
            );

            mostrarProductos(filtrados);
        }
    });
});

window.agregarCarrito = agregarCarrito;
