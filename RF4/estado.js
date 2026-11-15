const SUPABASE_URL = 'https://yzzkenopjopujyzcwhka.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6emtlbm9wam9wdWp5emN3aGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMTQ2MjcsImV4cCI6MjEwODc5MDYyN30.mPDtJsWpLA60CetA90u4jUzSFPIqbwE6cJoF6dEWzeY';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById('actualizarEstadoBtn')?.addEventListener('click', async function() {
    const idPedido = document.getElementById('estadoPedidoId').value.trim();
    const nuevoEstado = document.getElementById('nuevoEstadoSelect').value;
    const motivoCancelacion = document.getElementById('motivoCancelacionInput').value.trim();

    if (!idPedido || !nuevoEstado) {
        alert('Ingresa el ID del pedido y selecciona un estado.');
        return;
    }

   
    if (nuevoEstado === 'Cancelado' && !motivoCancelacion) {
        alert('Error (RN-02): Debes escribir un motivo obligatorio para cancelar el pedido.');
        return;
    }

    
    const { data, error } = await _supabase
        .from('pedidos')
        .update({ 
            estado_pedido: nuevoEstado,
            motivo_cancelacion: nuevoEstado === 'Cancelado' ? motivoCancelacion : null
        })
        .eq('id_pedido', idPedido);

    if (error) {
        console.error('Error al actualizar estado:', error);
        alert('No se pudo actualizar el estado del pedido.');
        return;
    }

    alert(`Estado del pedido #${idPedido} actualizado a: ${nuevoEstado}`);
    document.getElementById('formEstadoPedido').reset();
});
