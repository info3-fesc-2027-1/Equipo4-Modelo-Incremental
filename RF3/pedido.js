import { supabase } from '../src/supabase.js';
import { obtenerCliente } from '../src/sesion.js';
import { obtenerCarrito, vaciarCarrito } from '../RF2/catalogo.js';
import { mostrarToast, confirmar, cerrarModal, validarFormulario, limpiarAlEscribir, activarCarga, fechaLocalHoy, formatearFecha, formatearMoneda, escaparHtml } from '../src/ui.js';

const campoFecha = document.getElementById('pedidoFechaCompromiso');
const formPedido = document.getElementById('formCrearPedido');
const panelCarrito = document.getElementById('carritoPanel');

campoFecha.min = fechaLocalHoy();
limpiarAlEscribir(formPedido);

function actualizarBoton() {
  document.getElementById('crearPedidoBtn').disabled = obtenerCarrito().length === 0;
}

document.addEventListener('carrito:cambio', actualizarBoton);
actualizarBoton();

formPedido.addEventListener('submit', async function(evento) {
  evento.preventDefault();

  const cliente = obtenerCliente();
  const carrito = obtenerCarrito();
  campoFecha.min = fechaLocalHoy();

  if (!cliente) {
    cerrarModal(panelCarrito);
    mostrarToast('Regístrate o identifícate con tu correo para crear un pedido.', 'info');
    document.getElementById('acceso').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.getElementById('clientName').focus({ preventScroll: true }), 500);
    return;
  }

  if (cliente.rol === 'admin') {
    mostrarToast('La cuenta de administrador no crea pedidos. Inicia sesión como cliente para comprar.', 'info');
    return;
  }

  if (!carrito.length) {
    mostrarToast('Agrega al menos una joya al carrito.', 'error');
    return;
  }

  const valido = validarFormulario([{
    campo: campoFecha,
    validar: valor => {
      if (!valor) return 'Selecciona la fecha compromiso de entrega.';
      if (valor < fechaLocalHoy()) return 'La fecha compromiso no puede ser anterior al día de hoy.';
      return '';
    }
  }]);
  if (!valido) return;

  const fechaCompromiso = campoFecha.value;
  const total = carrito.reduce((suma, item) => suma + item.producto.precio * item.cantidad, 0);
  const piezas = carrito.reduce((suma, item) => suma + item.cantidad, 0);

  const aceptado = await confirmar({
    titulo: 'Confirmar pedido',
    mensaje: `
      <span class="block">Cliente: <strong>${escaparHtml(cliente.nombre)}</strong></span>
      <span class="block">${piezas} ${piezas === 1 ? 'pieza' : 'piezas'} · Total <strong>${formatearMoneda(total)}</strong></span>
      <span class="block">Entrega comprometida: <strong>${formatearFecha(fechaCompromiso)}</strong></span>`,
    textoConfirmar: 'Crear pedido'
  });
  if (!aceptado) return;

  const boton = document.getElementById('crearPedidoBtn');
  activarCarga(boton, true, 'Creando pedido...');

  const { data, error } = await supabase.rpc('crear_pedido', {
    p_id_cliente: cliente.id,
    p_fecha_entrega: fechaCompromiso,
    p_items: carrito.map(item => ({ id_producto: item.producto.id, cantidad: item.cantidad }))
  });

  activarCarga(boton, false);

  if (error) {
    console.error('Error al crear pedido:', error);
    mostrarToast(error.code === 'P0001' ? error.message : 'Hubo un error al guardar el pedido en Supabase.', 'error');
    actualizarBoton();
    return;
  }

  vaciarCarrito();
  formPedido.reset();
  cerrarModal(panelCarrito);
  mostrarToast(`¡Pedido #${data} creado con éxito en estado Pendiente!`, 'exito');
  document.dispatchEvent(new CustomEvent('pedido:creado', { detail: data }));
});