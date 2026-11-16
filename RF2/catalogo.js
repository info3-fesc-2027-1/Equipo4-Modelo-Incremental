import { _supabase } from '../src/supabase.js';
import { icono, escaparHtml, formatearMoneda, abrirModal, mostrarToast } from '../src/ui.js';

const CLAVE_CARRITO = 'carrito_posa';
const CANTIDAD_MAXIMA = 99;

let productos = [];
let carrito = [];
let categoriaActiva = 'Todos';
let textoBusqueda = '';
let catalogoListo = false;

const contenedor = document.getElementById("catalogo-lista");
const estadoCatalogo = document.getElementById("catalogo-estado");
const panelCarrito = document.getElementById("carritoPanel");

function plantillaProducto(producto, indice) {
    const imagen = producto.imagen
        ? `<img src="${escaparHtml(producto.imagen)}" alt="${escaparHtml(producto.nombre)}" width="400" height="400" loading="lazy" decoding="async" class="imagen-producto h-full w-full object-cover transition-transform duration-500 group-hover:scale-105">`
        : '';

    return `
        <article class="tarjeta-producto group aparecer" style="animation-delay:${Math.min(indice, 8) * 60}ms">
            <div class="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-oro-50 via-white to-oro-100">
                <div class="respaldo-imagen absolute inset-0 flex items-center justify-center text-oro-600 transition-transform duration-500 group-hover:scale-110 ${producto.imagen ? 'hidden' : ''}">
                    ${icono(producto.categoria, 'h-20 w-20')}
                </div>
                ${imagen}
                <span class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-700 shadow-sm backdrop-blur">
                    ${escaparHtml(producto.categoria || 'Joyería')}
                </span>
            </div>

            <div class="flex flex-1 flex-col p-4">
                <h3 class="font-display text-lg font-semibold leading-snug text-stone-900">
                    ${escaparHtml(producto.nombre)}
                </h3>

                <p class="mt-1 line-clamp-2 text-sm text-stone-600">
                    ${escaparHtml(producto.descripcion || '')}
                </p>

                <div class="mt-auto flex items-center justify-between gap-3 pt-4">
                    <p class="text-lg font-bold text-oro-700">
                        ${formatearMoneda(producto.precio)}
                    </p>

                    <button
                        type="button"
                        data-agregar="${producto.id}"
                        class="btn btn-primario px-4 py-2"
                        aria-label="Agregar ${escaparHtml(producto.nombre)} al carrito">
                        ${icono('mas', 'h-4 w-4')}
                        <span>Agregar</span>
                    </button>
                </div>
            </div>
        </article>
    `;
}

function mostrarProductos(lista) {

    estadoCatalogo.hidden = lista.length > 0;
    if (!lista.length) {
        estadoCatalogo.innerHTML = `
            ${icono('joya', 'mx-auto h-12 w-12 text-oro-500')}
            <p class="mt-3 font-semibold text-stone-800">No encontramos joyas con esos filtros</p>
            <p class="mt-1 text-sm text-stone-600">Prueba con otra búsqueda o categoría.</p>`;
    }

    contenedor.innerHTML = lista.map(plantillaProducto).join('');
}

function filtrarProductos() {
    const texto = textoBusqueda.toLowerCase();
    const filtrados = productos.filter(producto => {
        const coincideCategoria = categoriaActiva === 'Todos' || producto.categoria === categoriaActiva;
        const coincideTexto = producto.nombre.toLowerCase().includes(texto)
            || (producto.descripcion || '').toLowerCase().includes(texto);
        return coincideCategoria && coincideTexto;
    });
    mostrarProductos(filtrados);
}

async function cargarProductos() {
    estadoCatalogo.hidden = true;

    const { data, error } = await _supabase
        .from('productos')
        .select('id, nombre, categoria, precio, descripcion, imagen')
        .order('id');

    if (error) {
        console.error('Error al cargar el catálogo:', error);
        contenedor.innerHTML = '';
        estadoCatalogo.hidden = false;
        estadoCatalogo.innerHTML = `
            ${icono('alerta', 'mx-auto h-12 w-12 text-rose-500')}
            <p class="mt-3 font-semibold text-stone-800">No se pudo cargar el catálogo</p>
            <p class="mt-1 text-sm text-stone-600">Revisa tu conexión e intenta de nuevo.</p>
            <button type="button" id="reintentarCatalogo" class="btn btn-secundario mt-4">
                ${icono('recargar', 'h-4 w-4')}<span>Reintentar</span>
            </button>`;
        document.getElementById('reintentarCatalogo').addEventListener('click', cargarProductos);
        return;
    }

    productos = data;
    catalogoListo = true;
    restaurarCarrito();
    filtrarProductos();
}

function guardarCarrito() {
    if (!catalogoListo) return;
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito.map(item => ({ id: item.producto.id, cantidad: item.cantidad }))));
    } catch {}
}

function restaurarCarrito() {
    let guardado = [];
    try {
        guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
    } catch {}

    carrito = guardado
        .map(item => ({ producto: productos.find(p => p.id === item.id), cantidad: Number(item.cantidad) }))
        .filter(item => item.producto && item.cantidad > 0);
    actualizarCarrito();
}

function agregarCarrito(id){

    const producto =
    productos.find(p => p.id === id);

    if (!producto) return;

    const item = carrito.find(i => i.producto.id === id);
    if (item) {
        if (item.cantidad >= CANTIDAD_MAXIMA) {
            mostrarToast(`Máximo ${CANTIDAD_MAXIMA} piezas por producto.`, 'error');
            return;
        }
        item.cantidad++;
    } else {
        carrito.push({ producto, cantidad: 1 });
    }

    actualizarCarrito();

    const contador = document.getElementById('contador-carrito');
    contador.classList.remove('rebote');
    void contador.offsetWidth;
    contador.classList.add('rebote');
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(i => i.producto.id === id);
    if (!item) return;

    item.cantidad = Math.min(CANTIDAD_MAXIMA, item.cantidad + cambio);
    if (item.cantidad <= 0) {
        carrito = carrito.filter(i => i.producto.id !== id);
    }
    actualizarCarrito();
}

function quitarDelCarrito(id) {
    carrito = carrito.filter(i => i.producto.id !== id);
    actualizarCarrito();
}

function actualizarCarrito(){

    const divCarrito =
    document.getElementById("carrito");

    const total =
    document.getElementById("total");

    let suma = 0;
    let piezas = 0;

    carrito.forEach(item => {
        suma += item.producto.precio * item.cantidad;
        piezas += item.cantidad;
    });

    divCarrito.innerHTML = carrito.length ? carrito.map(item => `
        <li class="aparecer flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-oro-50 to-oro-100 text-oro-600">
                ${icono(item.producto.categoria, 'h-7 w-7')}
            </div>
            <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-stone-900">${escaparHtml(item.producto.nombre)}</p>
                <p class="text-xs text-stone-600">${formatearMoneda(item.producto.precio)} c/u</p>
                <div class="mt-1.5 inline-flex items-center rounded-lg border border-stone-200">
                    <button type="button" data-restar="${item.producto.id}" class="boton-cantidad" aria-label="Quitar una pieza de ${escaparHtml(item.producto.nombre)}">${icono('menos', 'h-3.5 w-3.5')}</button>
                    <span class="w-8 text-center text-sm font-semibold" aria-live="polite">${item.cantidad}</span>
                    <button type="button" data-sumar="${item.producto.id}" class="boton-cantidad" aria-label="Agregar una pieza de ${escaparHtml(item.producto.nombre)}">${icono('mas', 'h-3.5 w-3.5')}</button>
                </div>
            </div>
            <div class="flex flex-col items-end gap-2">
                <p class="text-sm font-bold text-stone-900">${formatearMoneda(item.producto.precio * item.cantidad)}</p>
                <button type="button" data-quitar="${item.producto.id}" class="rounded-lg p-1.5 text-stone-500 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Eliminar ${escaparHtml(item.producto.nombre)} del carrito">
                    ${icono('basura', 'h-4 w-4')}
                </button>
            </div>
        </li>
    `).join('') : `
        <li class="flex flex-col items-center py-10 text-center">
            <span class="flex h-16 w-16 items-center justify-center rounded-full bg-oro-50 text-oro-600">${icono('bolsa', 'h-8 w-8')}</span>
            <p class="mt-4 font-semibold text-stone-800">Tu carrito está vacío</p>
            <p class="mt-1 text-sm text-stone-600">Agrega joyas desde el catálogo.</p>
        </li>`;

    total.textContent = formatearMoneda(suma);

    const contador = document.getElementById('contador-carrito');
    contador.textContent = piezas;
    contador.hidden = piezas === 0;
    document.getElementById('abrirCarritoBtn').setAttribute('aria-label', `Abrir carrito, ${piezas} ${piezas === 1 ? 'pieza' : 'piezas'}`);

    guardarCarrito();
    document.dispatchEvent(new CustomEvent('carrito:cambio'));
}

export function obtenerCarrito() {
    return carrito.map(item => ({ ...item }));
}

export function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}

contenedor.addEventListener('click', evento => {
    const boton = evento.target.closest('[data-agregar]');
    if (!boton) return;

    agregarCarrito(Number(boton.dataset.agregar));

    boton.classList.add('agregado');
    boton.innerHTML = `${icono('check', 'h-4 w-4')}<span>Agregado</span>`;
    clearTimeout(boton._temporizador);
    boton._temporizador = setTimeout(() => {
        boton.classList.remove('agregado');
        boton.innerHTML = `${icono('mas', 'h-4 w-4')}<span>Agregar</span>`;
    }, 1200);
});

contenedor.addEventListener('error', evento => {
    if (!evento.target.matches('.imagen-producto')) return;
    evento.target.hidden = true;
    evento.target.parentElement.querySelector('.respaldo-imagen').classList.remove('hidden');
}, true);

document.getElementById('carrito').addEventListener('click', evento => {
    const boton = evento.target.closest('button');
    if (!boton) return;
    if (boton.dataset.sumar) cambiarCantidad(Number(boton.dataset.sumar), 1);
    if (boton.dataset.restar) cambiarCantidad(Number(boton.dataset.restar), -1);
    if (boton.dataset.quitar) quitarDelCarrito(Number(boton.dataset.quitar));
});

document.getElementById('abrirCarritoBtn').addEventListener('click', () => abrirModal(panelCarrito));

const buscador = document.getElementById("buscarProducto");

if (buscador) {

    buscador.addEventListener("input", function(){

        textoBusqueda = this.value.trim();

        filtrarProductos();
    });

}

document.querySelectorAll(".categoria-btn")
.forEach(btn => {

    btn.addEventListener("click", () => {

        categoriaActiva = btn.dataset.cat;

        document.querySelectorAll(".categoria-btn").forEach(otro => {
            otro.setAttribute('aria-pressed', String(otro === btn));
        });

        filtrarProductos();
    });
});

actualizarCarrito();
cargarProductos();

window.agregarCarrito = agregarCarrito;
