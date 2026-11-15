const SUPABASE_URL = 'https://yzzkenopjopujyzcwhka.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6emtlbm9wam9wdWp5emN3aGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMTQ2MjcsImV4cCI6MjEwODc5MDYyN30.mPDtJsWpLA60CetA90u4jUzSFPIqbwE6cJoF6dEWzeY';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById('crearPedidoBtn')?.addEventListener('click', async function() {
    const idCliente = document.getElementById('pedidoClienteId').value.trim();
    const idProducto = document.getElementById('pedidoProductoId').value.trim();
    const cantidad = parseInt(document.getElementById('pedidoCantidad').value) || 1;
    const fechaCompromiso = document.getElementById('pedidoFechaCompromiso').value;

   
    if (!idCliente || !idProducto || !fechaCompromiso) {
        alert('Por favor, completa todos los datos del pedido y la fecha compromiso.');
        return;
    }

    
    const hoy = new Date().toISOString().split('T')[0];
    if (fechaCompromiso < hoy) {
        alert('Error (RN-06): La fecha compromiso no puede ser anterior al día de hoy.');
        return;
    }

    
    const { data, error } = await _supabase
        .from('pedidos')
        .insert([{
            id_cliente: idCliente,
            fecha_entrega: fechaCompromiso,
            estado_pedido: 'Pendiente'
        }])
        .select();

    if (error) {
        console.error('Error al crear pedido:', error);
        alert('Hubo un error al guardar el pedido en Supabase.');
        return;
    }

    alert('¡Pedido creado con éxito en estado Pendiente!');
    document.getElementById('formCrearPedido').reset();
});
