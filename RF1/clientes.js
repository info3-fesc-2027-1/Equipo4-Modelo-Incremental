 const SUPABASE_URL = 'https://yzzkenopjopujyzcwhka.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6emtlbm9wam9wdWp5emN3aGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMTQ2MjcsImV4cCI6MjEwODc5MDYyN30.mPDtJsWpLA60CetA90u4jUzSFPIqbwE6cJoF6dEWzeY';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
 
 document.getElementById('confirmBtn').addEventListener('click', async function() {
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

    document.querySelector('.orders-section').style.display = 'block';


    const { data, error } = await _supabase
      .from('clientes')
      .insert([{ 
        nombre: nombre, 
        contacto: correo, 
        notas: notas 
      }]);

    if (error) {
      console.error('Error al guardar en Supabase:', error);
      alert('Hubo un error al guardar en la base de datos.');
      return;
    }

    ordersList.appendChild(card);
    document.getElementById('orderForm').reset();

    alert('¡Pedido registrado con éxito!');
});

