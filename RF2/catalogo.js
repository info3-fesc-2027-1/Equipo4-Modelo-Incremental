const contenedor = document.getElementById("catalogo-lista");

const joyas = [
    {
        nombre: "Anillo de Oro",
        precio: 2500,
        categoria: "Anillos"
    },
    {
        nombre: "Collar de Plata",
        precio: 1800,
        categoria: "Collares"
    },
    {
        nombre: "Pulsera de Oro",
        precio: 3200,
        categoria: "Pulseras"
    },
    {
        nombre: "Aretes de Diamante",
        precio: 4500,
        categoria: "Aretes"
    }
];

joyas.forEach(joya => {
    contenedor.innerHTML += `
        <div class="border p-4 rounded-xl shadow bg-white">
            <h3 class="font-bold text-lg">${joya.nombre}</h3>
            <p>Categoría: ${joya.categoria}</p>
            <p>Precio: $${joya.precio}</p>
        </div>
    `;
});
