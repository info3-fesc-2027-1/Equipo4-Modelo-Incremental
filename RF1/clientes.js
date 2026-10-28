 document.getElementById('confirmBtn').addEventListener('click', function() {
    const nombre = document.getElementById('clientName').value.trim();
    const correo = document.getElementById('clientEmail').value.trim();

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
        <p><strong>Productos:</strong></p>
        <ul>${listaHTML}</ul>
        <p class="total-text"><strong>Total:</strong> $${total}</p>
        <button class="btn-advance">Avanzar estado</button>
    `;

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