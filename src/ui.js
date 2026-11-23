const ICONOS = {
  check: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  alerta: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  mas: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  menos: '<path d="M5 12h14"/>',
  basura: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  bolsa: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  calendario: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  usuario: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  lapiz: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  paquete: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  recargar: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  candado: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  cargando: '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
  Anillos: '<circle cx="12" cy="15" r="6"/><circle cx="12" cy="15" r="3.5"/><path d="m9.5 6 2.5-3 2.5 3-2.5 3Z"/>',
  Collares: '<path d="M4 3c0 6.5 3.6 11 8 11s8-4.5 8-11"/><path d="M12 14v1.5"/><path d="m9.5 18.5 2.5-3 2.5 3-2.5 3Z"/>',
  Pulseras: '<ellipse cx="12" cy="12" rx="9" ry="5.5"/><ellipse cx="12" cy="12" rx="5.5" ry="2.8"/><circle cx="12" cy="17.5" r="1.2"/>',
  Aretes: '<circle cx="7" cy="4" r="1.5"/><path d="M7 5.5v3"/><path d="m7 8.5-2.5 5.5L7 20l2.5-6Z"/><circle cx="17" cy="4" r="1.5"/><path d="M17 5.5v3"/><path d="m17 8.5-2.5 5.5L17 20l2.5-6Z"/>',
  joya: '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>'
};

export function icono(nombre, clases = 'w-5 h-5') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="${clases}" aria-hidden="true">${ICONOS[nombre] || ICONOS.joya}</svg>`;
}

export function escaparHtml(texto) {
  const entidades = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(texto ?? '').replace(/[&<>"']/g, caracter => entidades[caracter]);
}

const formatoMoneda = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

export function formatearMoneda(valor) {
  return formatoMoneda.format(Number(valor) || 0);
}

export function formatearFecha(fecha) {
  const [anio, mes, dia] = String(fecha).slice(0, 10).split('-').map(Number);
  return new Date(anio, mes - 1, dia).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function fechaLocalHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

export function iniciales(nombre) {
  return String(nombre).trim().split(/\s+/).slice(0, 2).map(parte => parte[0]).join('').toUpperCase() || '?';
}

const ESTILOS_TOAST = {
  exito: { icono: 'check', clases: 'border-emerald-200 bg-emerald-50 text-emerald-900', color: 'text-emerald-600' },
  error: { icono: 'alerta', clases: 'border-rose-200 bg-rose-50 text-rose-900', color: 'text-rose-600' },
  info: { icono: 'info', clases: 'border-sky-200 bg-sky-50 text-sky-900', color: 'text-sky-600' }
};

export function mostrarToast(mensaje, tipo = 'info') {
  const contenedor = document.getElementById('toasts');
  const estilo = ESTILOS_TOAST[tipo] || ESTILOS_TOAST.info;
  const toast = document.createElement('div');
  toast.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
  toast.className = `toast pointer-events-auto flex w-full items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg shadow-stone-900/10 ${estilo.clases}`;
  toast.innerHTML = `
    ${icono(estilo.icono, `mt-0.5 h-5 w-5 shrink-0 ${estilo.color}`)}
    <p class="flex-1 text-sm font-medium">${escaparHtml(mensaje)}</p>
    <button type="button" class="-m-1 rounded-lg p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100" aria-label="Cerrar aviso">
      ${icono('x', 'h-4 w-4')}
    </button>`;

  let cerrado = false;
  const cerrar = () => {
    if (cerrado) return;
    cerrado = true;
    toast.classList.add('toast-salida');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };

  toast.querySelector('button').addEventListener('click', cerrar);
  contenedor.appendChild(toast);
  setTimeout(cerrar, 5000);
}

export function abrirModal(dialogo) {
  if (!dialogo.open) dialogo.showModal();
}

export function cerrarModal(dialogo) {
  if (!dialogo.open || dialogo.classList.contains('cerrando')) return;
  dialogo.classList.add('cerrando');
  const alTerminar = evento => {
    if (evento.target !== dialogo) return;
    dialogo.removeEventListener('animationend', alTerminar);
    dialogo.classList.remove('cerrando');
    dialogo.close();
  };
  dialogo.addEventListener('animationend', alTerminar);
}

document.querySelectorAll('dialog.modal').forEach(dialogo => {
  dialogo.addEventListener('click', evento => {
    if (evento.target === dialogo) cerrarModal(dialogo);
  });
  dialogo.addEventListener('cancel', evento => {
    evento.preventDefault();
    cerrarModal(dialogo);
  });
  dialogo.querySelectorAll('[data-cerrar-modal]').forEach(boton => {
    boton.addEventListener('click', () => cerrarModal(dialogo));
  });
});

export function confirmar({ titulo, mensaje, textoConfirmar = 'Confirmar', peligro = false }) {
  const dialogo = document.getElementById('modalConfirmar');
  const botonAceptar = document.getElementById('confirmarAceptar');
  document.getElementById('confirmarTitulo').textContent = titulo;
  document.getElementById('confirmarMensaje').innerHTML = mensaje;
  botonAceptar.textContent = textoConfirmar;
  botonAceptar.className = `btn ${peligro ? 'btn-peligro' : 'btn-primario'}`;

  return new Promise(resolver => {
    let aceptado = false;
    const aceptar = () => {
      aceptado = true;
      cerrarModal(dialogo);
    };
    botonAceptar.addEventListener('click', aceptar, { once: true });
    dialogo.addEventListener('close', () => {
      botonAceptar.removeEventListener('click', aceptar);
      resolver(aceptado);
    }, { once: true });
    abrirModal(dialogo);
  });
}

export function marcarError(campo, mensaje) {
  const error = document.getElementById(`${campo.id}-error`);
  campo.setAttribute('aria-invalid', 'true');
  if (error) {
    error.innerHTML = `${icono('alerta', 'h-3.5 w-3.5 shrink-0')}<span>${escaparHtml(mensaje)}</span>`;
    error.hidden = false;
  }
}

export function limpiarError(campo) {
  const error = document.getElementById(`${campo.id}-error`);
  campo.removeAttribute('aria-invalid');
  if (error) error.hidden = true;
}

export function validarFormulario(reglas) {
  let primerInvalido = null;
  reglas.forEach(({ campo, validar }) => {
    const mensaje = validar(campo.value.trim());
    if (mensaje) {
      marcarError(campo, mensaje);
      primerInvalido ??= campo;
    } else {
      limpiarError(campo);
    }
  });
  primerInvalido?.focus();
  return !primerInvalido;
}

export function limpiarAlEscribir(formulario) {
  formulario.addEventListener('input', evento => {
    if (evento.target.hasAttribute('aria-invalid')) limpiarError(evento.target);
  });
}

export function activarCarga(boton, activo, texto = 'Procesando...') {
  if (activo) {
    boton.dataset.contenido = boton.innerHTML;
    boton.disabled = true;
    boton.setAttribute('aria-busy', 'true');
    boton.innerHTML = `${icono('cargando', 'h-4 w-4 animate-spin')}<span>${texto}</span>`;
  } else {
    boton.disabled = false;
    boton.removeAttribute('aria-busy');
    if (boton.dataset.contenido) boton.innerHTML = boton.dataset.contenido;
  }
}