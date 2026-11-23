const CLAVE_SESION = 'usuario_posa';

export const CORREO_ADMIN = 'admin@gmail.com';

export function obtenerCliente() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_SESION));
    if (!datos || !datos.nombre) return null;
    if (datos.rol === 'admin') return { id: null, nombre: datos.nombre, rol: 'admin' };
    return datos.id ? { id: datos.id, nombre: datos.nombre, rol: 'cliente' } : null;
  } catch {
    return null;
  }
}

export function esAdmin() {
  return obtenerCliente()?.rol === 'admin';
}

export function guardarCliente(cliente) {
  try {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ id: cliente.id ?? null, nombre: cliente.nombre, rol: cliente.rol === 'admin' ? 'admin' : 'cliente' }));
  } catch {}
  notificar();
}

export function iniciarSesionAdmin() {
  guardarCliente({ id: null, nombre: 'Administrador', rol: 'admin' });
}

export function cerrarSesion() {
  try {
    localStorage.removeItem(CLAVE_SESION);
  } catch {}
  notificar();
}

function notificar() {
  document.dispatchEvent(new CustomEvent('sesion:cambio', { detail: obtenerCliente() }));
}