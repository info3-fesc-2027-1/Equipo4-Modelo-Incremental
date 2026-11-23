import { _supabase } from '../src/supabase.js';
import { obtenerCliente } from '../src/sesion.js';
import { icono, escaparHtml, formatearMoneda, formatearFecha, mostrarToast, abrirModal, cerrarModal, validarFormulario, limpiarAlEscribir, limpiarError, activarCarga } from '../src/ui.js';

const ESTADOS = {
    'Pendiente': 'bg-amber-50 text-amber-800 ring-amber-200',
    'En proceso': 'bg-sky-50 text-sky-800 ring-sky-200',
    'Entregado': 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    'Cancelado': 'bg-rose-50 text-rose-800 ring-rose-200'
};

const ESTADOS_FINALES = ['Entregado', 'Cancelado'];

let pedidos = [];
let filtroEstado = 'Todos';
let consultaActual = 0;

const lista = document.getElementById('listaPedidos');
const modalEstado = document.getElementById('modalEstado');
const formEstado = document.getElementById('formEstadoPedido');
const selectEstado = document.getElementById('nuevoEstadoSelect');
const campoMotivo = document.getElementById('motivoCancelacionInput');
const grupoMotivo = document.getElementById('grupoMotivo');

function insignia(estado) {
    return `<span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${ESTADOS[estado] || 'bg-stone-100 text-stone-700 ring-stone-200'}">
        <span class="h-1.5 w-1.5 rounded-full bg-current"></span>${escaparHtml(estado)}
    </span>`;
}

function accionesPedido(pedido) {
    if (obtenerCliente()?.rol !== 'admin') return '';
    if (ESTADOS_FINALES.includes(pedido.estado_pedido)) {
        return `
                <span class="inline-flex items-center gap-1.5 rounded-xl bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-600">
                    ${icono('candado', 'h-4 w-4')}<span>Estado final</span>
                </span>`;
    }
    return `
                <button type="button" data-editar="${pedido.id_pedido}" class="btn btn-secundario px-3 py-2">
                    ${icono('lapiz', 'h-4 w-4')}<span>Cambiar estado</span>
                </button>`;
}

function plantillaPedido(pedido, indice) {
    const productos = (pedido.detalle_pedido || [])
        .map(detalle => `${escaparHtml(detalle.productos?.nombre || 'Producto')} × ${detalle.cantidad}`)
        .join(', ');

    return `
        <article class="tarjeta-pedido aparecer" style="animation-delay:${Math.min(indice, 8) * 50}ms">
            <div class="flex items-start justify-between gap-3">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-wider text-stone-500">Pedido #${pedido.id_pedido}</p>
                    <h3 class="mt-0.5 font-display text-lg font-semibold text-stone-900">${escaparHtml(pedido.clientes?.nombre || 'Cliente')}</h3>
                </div>
                ${insignia(pedido.estado_pedido)}
            </div>

            <p class="mt-3 line-clamp-2 text-sm text-stone-600">${productos || 'Sin productos registrados'}</p>

            ${pedido.estado_pedido === 'Cancelado' && pedido.motivo_cancelacion ? `
                <p class="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-800"><strong>Motivo:</strong> ${escaparHtml(pedido.motivo_cancelacion)}</p>` : ''}

            <div class="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-stone-100 pt-4">
                <dl class="flex gap-6 text-sm">
                    <div>
                        <dt class="text-xs text-stone-500">Entrega</dt>
                        <dd class="flex items-center gap-1 font-medium text-stone-800">${icono('calendario', 'h-3.5 w-3.5 text-oro-600')}${formatearFecha(pedido.fecha_entrega)}</dd>
                    </div>
                    <div>
                        <dt class="text-xs text-stone-500">Total</dt>
                        <dd class="font-bold text-stone-900">${formatearMoneda(pedido.total)}</dd>
                    </div>
                </dl>
                ${accionesPedido(pedido)}
            </div>
        </article>`;
}

function mostrarPedidos() {
    const filtrados = filtroEstado === 'Todos' ? pedidos : pedidos.filter(p => p.estado_pedido === filtroEstado);

    document.querySelectorAll('.filtro-estado').forEach(boton => {
        const estado = boton.dataset.estado;
        const cantidad = estado === 'Todos' ? pedidos.length : pedidos.filter(p => p.estado_pedido === estado).length;
        boton.querySelector('.cantidad').textContent = cantidad;
    });

    lista.innerHTML = filtrados.length ? filtrados.map(plantillaPedido).join('') : `
        <div class="col-span-full rounded-3xl border border-dashed border-stone-300 bg-white/60 px-6 py-12 text-center">
            ${icono('paquete', 'mx-auto h-12 w-12 text-oro-500')}
            <p class="mt-3 font-semibold text-stone-800">${pedidos.length ? 'No hay pedidos con este estado' : 'Aún no hay pedidos registrados'}</p>
            <p class="mt-1 text-sm text-stone-600">${obtenerCliente()?.rol === 'admin' ? 'Los pedidos de los clientes aparecerán aquí.' : 'Los pedidos que crees desde el carrito aparecerán aquí.'}</p>
        </div>`;
}

function mostrarSinSesion() {
    pedidos = [];
    lista.innerHTML = `
        <div class="col-span-full rounded-3xl border border-dashed border-stone-300 bg-white/60 px-6 py-12 text-center">
            ${icono('candado', 'mx-auto h-12 w-12 text-oro-500')}
            <p class="mt-3 font-semibold text-stone-800">Inicia sesión para ver tus pedidos</p>
            <p class="mt-1 text-sm text-stone-600">Regístrate o identifícate con tu correo para consultar el estado de tus compras.</p>
            <a href="#acceso" class="btn btn-primario mt-5">${icono('usuario', 'h-4 w-4')}<span>Ingresar</span></a>
        </div>`;
}

function actualizarEncabezado(usuario) {
    const textos = {
        admin: 'Todos los pedidos de la tienda. Como administrador puedes actualizar su estado.',
        cliente: 'Consulta tus pedidos y el estado en que se encuentran.'
    };
    document.getElementById('pedidosDescripcion').textContent = usuario ? textos[usuario.rol] : 'Inicia sesión para consultar tus pedidos.';
    document.getElementById('filtrosPedidos').hidden = !usuario;
    document.getElementById('recargarPedidosBtn').hidden = !usuario;
}

async function cargarPedidos() {
    const usuario = obtenerCliente();
    const consulta = ++consultaActual;
    actualizarEncabezado(usuario);

    if (!usuario) {
        mostrarSinSesion();
        return;
    }

    const boton = document.getElementById('recargarPedidosBtn');
    boton.disabled = true;
    boton.querySelector('svg').classList.add('animate-spin');

    let peticion = _supabase
        .from('pedidos')
        .select('id_pedido, fecha_entrega, estado_pedido, motivo_cancelacion, total, clientes(nombre), detalle_pedido(cantidad, productos(nombre))')
        .order('id_pedido', { ascending: false });
    if (usuario.rol !== 'admin') peticion = peticion.eq('id_cliente', usuario.id);

    const { data, error } = await peticion;
    if (consulta !== consultaActual) return;

    boton.disabled = false;
    boton.querySelector('svg').classList.remove('animate-spin');

    if (error) {
        console.error('Error al cargar pedidos:', error);
        lista.innerHTML = `
            <div class="col-span-full rounded-3xl border border-rose-200 bg-rose-50 px-6 py-10 text-center">
                ${icono('alerta', 'mx-auto h-10 w-10 text-rose-500')}
                <p class="mt-3 font-semibold text-rose-900">No se pudieron cargar los pedidos</p>
                <p class="mt-1 text-sm text-rose-800">Intenta de nuevo con el botón Actualizar.</p>
            </div>`;
        return;
    }

    pedidos = data;
    mostrarPedidos();
}

function alternarMotivo() {
    const esCancelado = selectEstado.value === 'Cancelado';
    grupoMotivo.classList.toggle('abierto', esCancelado);
    grupoMotivo.inert = !esCancelado;
    campoMotivo.required = esCancelado;
    if (!esCancelado) limpiarError(campoMotivo);
}

lista.addEventListener('click', evento => {
    const boton = evento.target.closest('[data-editar]');
    if (!boton || obtenerCliente()?.rol !== 'admin') return;

    const pedido = pedidos.find(p => p.id_pedido === Number(boton.dataset.editar));
    if (!pedido || ESTADOS_FINALES.includes(pedido.estado_pedido)) return;

    formEstado.reset();
    limpiarError(campoMotivo);
    document.getElementById('estadoPedidoId').value = pedido.id_pedido;
    document.getElementById('modalEstadoTitulo').textContent = `Pedido #${pedido.id_pedido}`;
    document.getElementById('modalEstadoResumen').innerHTML = `${escaparHtml(pedido.clientes?.nombre || 'Cliente')} · Estado actual ${insignia(pedido.estado_pedido)}`;
    if ([...selectEstado.options].some(opcion => opcion.value === pedido.estado_pedido)) {
        selectEstado.value = pedido.estado_pedido;
    }
    campoMotivo.value = pedido.motivo_cancelacion || '';
    alternarMotivo();
    abrirModal(modalEstado);
});

document.querySelectorAll('.filtro-estado').forEach(boton => {
    boton.addEventListener('click', () => {
        filtroEstado = boton.dataset.estado;
        document.querySelectorAll('.filtro-estado').forEach(otro => otro.setAttribute('aria-pressed', String(otro === boton)));
        mostrarPedidos();
    });
});

selectEstado.addEventListener('change', alternarMotivo);
limpiarAlEscribir(formEstado);
document.getElementById('recargarPedidosBtn').addEventListener('click', cargarPedidos);
document.addEventListener('pedido:creado', cargarPedidos);
document.addEventListener('sesion:cambio', () => {
    filtroEstado = 'Todos';
    document.querySelectorAll('.filtro-estado').forEach(boton => boton.setAttribute('aria-pressed', String(boton.dataset.estado === 'Todos')));
    if (modalEstado.open) cerrarModal(modalEstado);
    cargarPedidos();
});

formEstado.addEventListener('submit', async function(evento) {
    evento.preventDefault();

    const idPedido = Number(document.getElementById('estadoPedidoId').value);
    const nuevoEstado = selectEstado.value;
    const motivoCancelacion = campoMotivo.value.trim();

    if (obtenerCliente()?.rol !== 'admin') {
        cerrarModal(modalEstado);
        mostrarToast('Solo el administrador puede cambiar el estado de los pedidos.', 'error');
        return;
    }

    if (!idPedido || !nuevoEstado) {
        mostrarToast('Selecciona un pedido y un estado.', 'error');
        return;
    }

    const pedidoActual = pedidos.find(p => p.id_pedido === idPedido);
    if (pedidoActual && ESTADOS_FINALES.includes(pedidoActual.estado_pedido)) {
        mostrarToast('Este pedido ya está en un estado final y no puede cambiar.', 'error');
        return;
    }

    if (nuevoEstado === 'Cancelado') {
        const valido = validarFormulario([{
            campo: campoMotivo,
            validar: valor => valor ? '' : 'Debes escribir un motivo obligatorio para cancelar el pedido.'
        }]);
        if (!valido) return;
    }

    const boton = document.getElementById('actualizarEstadoBtn');
    activarCarga(boton, true, 'Guardando...');

    const { data, error } = await _supabase
        .from('pedidos')
        .update({
            estado_pedido: nuevoEstado,
            motivo_cancelacion: nuevoEstado === 'Cancelado' ? motivoCancelacion : null
        })
        .eq('id_pedido', idPedido)
        .select('id_pedido');

    activarCarga(boton, false);

    if (error || !data.length) {
        console.error('Error al actualizar estado:', error);
        mostrarToast('No se pudo actualizar el estado del pedido. Es posible que ya esté en un estado final.', 'error');
        cargarPedidos();
        return;
    }

    cerrarModal(modalEstado);
    mostrarToast(`Estado del pedido #${idPedido} actualizado a: ${nuevoEstado}`, 'exito');
    cargarPedidos();
});

cargarPedidos();
