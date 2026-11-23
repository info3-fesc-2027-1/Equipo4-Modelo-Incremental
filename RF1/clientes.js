
 document.getElementById('confirmBtn').addEventListener('click', function() {
    const nombre = document.getElementById('clientName').value.trim();
    const correo = document.getElementById('clientEmail').value.trim();
    const notas = document.getElementById('clientNotes').value.trim();

    if (!nombre || !correo) {
        alert('Por favor, completa todos los datos del cliente.');
        return;
    }

    const productosSeleccionados = [];
    document.querySelectorAll('.producto-en-carrito, .item-seleccionado').forEach(item => {
        const prodNombre = item.querySelector('.nombre-producto').textContent;
        const prodPrecio = parseFloat(item.querySelector('.precio-producto').textContent.replace('$', ''));
        productosSeleccionados.push({ nombre: prodNombre, precio: prodPrecio });
    });

    if (productosSeleccionados.length === 0) {
        alert('No hay productos seleccionados en el pedido.');
        return;
    }

    const total = productosSeleccionados.reduce((acc, item) => acc + item.precio, 0);
    const ordersList = document.getElementById('ordersList');
    
    const card = document.createElement('div');
    card.classList.add('order-card', 'pending');

    let listaHTML = productosSeleccionados.map(p => `<li>${p.nombre} - $${p.precio}</li>`).join('');

    card.innerHTML = `
        <div class="card-header">
            <h4>${nombre}</h4>
            <span class="status-badge">PENDIENTE</span>
        </div>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>Notas:</strong> ${notas ? notas : 'Sin observaciones'}</p>
        <ul>${listaHTML}</ul>
        <p class="total-text"><strong>Total:</strong> $${total}</p>
        <button class="btn-advance">Avanzar estado</button>
    `;

    ordersList.appendChild(card);
    document.getElementById('orderForm').reset();
    document.querySelector('.orders-section').style.display = 'block';

    card.querySelector('.btn-advance').addEventListener('click', function() {
        const badge = card.querySelector('.status-badge');
        if (badge.textContent === 'PENDIENTE') {
            badge.textContent = 'ENTREGADO';
            card.classList.remove('pending');
            card.classList.add('delivered');
        } else {
            badge.textContent = 'PENDIENTE';
            card.classList.remove('delivered');
            card.classList.add('pending');
        }
    });

    ordersList.appendChild(card);
    document.getElementById('orderForm').reset();
    alert('¡Pedido registrado con éxito!');
});

document.getElementById('clearBtn').addEventListener('click', function() {
    document.getElementById('orderForm').reset();
});

import { _supabase } from '../src/supabase.js';
import { obtenerCliente, guardarCliente, cerrarSesion, iniciarSesionAdmin, CORREO_ADMIN } from '../src/sesion.js';
import { mostrarToast, confirmar, validarFormulario, limpiarAlEscribir, marcarError, activarCarga, iniciales } from '../src/ui.js';

const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'.\- ]+$/;
const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const formRegistro = document.getElementById('orderForm');
const formAcceso = document.getElementById('accesoForm');
const campoNombre = document.getElementById('clientName');
const campoCorreo = document.getElementById('clientEmail');
const campoNotas = document.getElementById('clientNotes');
const campoCorreoAcceso = document.getElementById('accesoEmail');

function mostrarPantallaPrincipal(cliente) {
    document.getElementById('orderForm-container').hidden = true;
    document.getElementById('bienvenida').hidden = false;
    const admin = cliente.rol === 'admin';
    document.getElementById('bienvenidaNombre').textContent = cliente.nombre.split(' ')[0];
    document.getElementById('bienvenidaTexto').textContent = admin
        ? 'Tienes acceso a todos los pedidos de la tienda y puedes actualizar su estado.'
        : 'Ya puedes agregar joyas a tu carrito y crear tu pedido con la fecha de entrega que necesites.';
    document.getElementById('rolUsuario').hidden = !admin;
    document.getElementById('username-display').textContent = cliente.nombre;
    document.getElementById('user-avatar').textContent = iniciales(cliente.nombre);
    document.getElementById('usuarioChip').hidden = false;
    document.getElementById('ingresarBtn').hidden = true;
}

function mostrarPantallaRegistro() {
    document.getElementById('orderForm-container').hidden = false;
    document.getElementById('bienvenida').hidden = true;
    document.getElementById('username-display').textContent = 'Usuario';
    document.getElementById('user-avatar').textContent = '';
    document.getElementById('rolUsuario').hidden = true;
    document.getElementById('usuarioChip').hidden = true;
    document.getElementById('ingresarBtn').hidden = false;
}

function cambiarPestana(pestana) {
    const esRegistro = pestana === 'registro';
    document.getElementById('tabRegistro').setAttribute('aria-pressed', String(esRegistro));
    document.getElementById('tabAcceso').setAttribute('aria-pressed', String(!esRegistro));
    formRegistro.hidden = !esRegistro;
    formAcceso.hidden = esRegistro;
}

function escaparPatron(texto) {
    return texto.replace(/[\\%_]/g, caracter => `\\${caracter}`);
}

async function buscarClientePorCorreo(correo) {
    const { data, error } = await _supabase
        .from('clientes')
        .select('id, nombre')
        .ilike('contacto', escaparPatron(correo))
        .limit(1);

    if (error) throw error;
    return data[0] || null;
}

function validarCorreo(valor) {
    if (!valor) return 'El correo electrónico es obligatorio.';
    if (!REGEX_CORREO.test(valor)) return 'Escribe un correo válido, por ejemplo nombre@dominio.com.';
    return '';
}

function actualizarSesion() {
    const cliente = obtenerCliente();
    if (cliente) {
        mostrarPantallaPrincipal(cliente);
    } else {
        mostrarPantallaRegistro();
    }
}

actualizarSesion();
document.addEventListener('sesion:cambio', actualizarSesion);

document.getElementById('tabRegistro').addEventListener('click', () => cambiarPestana('registro'));
document.getElementById('tabAcceso').addEventListener('click', () => cambiarPestana('acceso'));
document.querySelectorAll('[data-ir-acceso]').forEach(enlace => {
    enlace.addEventListener('click', () => cambiarPestana('acceso'));
});

limpiarAlEscribir(formRegistro);
limpiarAlEscribir(formAcceso);

campoNotas.addEventListener('input', () => {
    document.getElementById('contadorNotas').textContent = `${campoNotas.value.length}/${campoNotas.maxLength}`;
});

document.getElementById('logoutBtn').addEventListener('click', async function() {
    const aceptado = await confirmar({
        titulo: '¿Cerrar sesión?',
        mensaje: 'Tu carrito se conservará en este dispositivo.',
        textoConfirmar: 'Salir'
    });
    if (!aceptado) return;
    cerrarSesion();
    mostrarToast('Sesión cerrada correctamente.', 'info');
});

formRegistro.addEventListener('submit', async function(evento) {
    evento.preventDefault();

    const valido = validarFormulario([
        {
            campo: campoNombre,
            validar: valor => {
                if (!valor) return 'El nombre es obligatorio.';
                if (valor.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
                if (!REGEX_NOMBRE.test(valor)) return 'El nombre solo puede contener letras y espacios.';
                return '';
            }
        },
        { campo: campoCorreo, validar: validarCorreo },
        {
            campo: campoNotas,
            validar: valor => valor.length > campoNotas.maxLength ? `Máximo ${campoNotas.maxLength} caracteres.` : ''
        }
    ]);
    if (!valido) return;

    const nombre = campoNombre.value.trim().replace(/\s+/g, ' ');
    const correo = campoCorreo.value.trim().toLowerCase();
    const notas = campoNotas.value.trim();
    const boton = document.getElementById('confirmBtn');

    activarCarga(boton, true, 'Registrando...');
    try {
        if (correo === CORREO_ADMIN) {
            marcarError(campoCorreo, 'Este correo está reservado para el administrador. Usa la pestaña "Ya estoy registrado".');
            campoCorreo.focus();
            return;
        }

        const existente = await buscarClientePorCorreo(correo);
        if (existente) {
            marcarError(campoCorreo, 'Este correo ya está registrado. Usa la pestaña "Ya estoy registrado".');
            campoCorreo.focus();
            return;
        }

        const { data, error } = await _supabase
            .from('clientes')
            .insert([{
                nombre: nombre,
                contacto: correo,
                notas: notas
            }])
            .select('id, nombre')
            .single();

        if (error) throw error;

        guardarCliente(data);
        formRegistro.reset();
        document.getElementById('contadorNotas').textContent = `0/${campoNotas.maxLength}`;
        mostrarToast(`¡Bienvenido, ${data.nombre}! Tu registro fue exitoso.`, 'exito');
    } catch (error) {
        console.error('Error al guardar en Supabase:', error);
        mostrarToast('Hubo un error al guardar en la base de datos. Intenta de nuevo.', 'error');
    } finally {
        activarCarga(boton, false);
    }
});

formAcceso.addEventListener('submit', async function(evento) {
    evento.preventDefault();

    if (!validarFormulario([{ campo: campoCorreoAcceso, validar: validarCorreo }])) return;

    const correo = campoCorreoAcceso.value.trim().toLowerCase();
    if (correo === CORREO_ADMIN) {
        iniciarSesionAdmin();
        formAcceso.reset();
        mostrarToast('Sesión de administrador iniciada. Ahora puedes gestionar todos los pedidos.', 'exito');
        return;
    }

    const boton = document.getElementById('accesoBtn');
    activarCarga(boton, true, 'Buscando...');
    try {
        const cliente = await buscarClientePorCorreo(correo);
        if (!cliente) {
            marcarError(campoCorreoAcceso, 'No encontramos un cliente con este correo. Regístrate primero.');
            campoCorreoAcceso.focus();
            return;
        }

        guardarCliente(cliente);
        formAcceso.reset();
        mostrarToast(`¡Hola de nuevo, ${cliente.nombre}!`, 'exito');
    } catch (error) {
        console.error('Error al buscar cliente:', error);
        mostrarToast('No se pudo consultar la base de datos. Intenta de nuevo.', 'error');
    } finally {
        activarCarga(boton, false);
    }
});

