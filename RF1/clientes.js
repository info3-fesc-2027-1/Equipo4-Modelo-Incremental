 const SUPABASE_URL = 'https://yzzkenopjopujyzcwhka.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6emtlbm9wam9wdWp5emN3aGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMTQ2MjcsImV4cCI6MjEwODc5MDYyN30.mPDtJsWpLA60CetA90u4jUzSFPIqbwE6cJoF6dEWzeY';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
 

function mostrarPantallaPrincipal(nombreUsuario) {
    document.getElementById('orderForm-container').style.display = 'none';
    document.getElementById('username-display').textContent = nombreUsuario;
    document.getElementById('user-avatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreUsuario)}&background=random`;
    document.getElementById('logoutBtn').style.display = 'inline-block';
}


function mostrarPantallaRegistro() {
    const contenedor = document.getElementById('orderForm-container');
    if (contenedor) contenedor.style.display = 'block';
    
    const displayUser = document.getElementById('username-display');
    if (displayUser) displayUser.textContent = 'Usuario';
    
    const avatar = document.getElementById('user-avatar');
    if (avatar) avatar.src = 'https://via.placeholder.com/40';
    
    const btnLogout = document.getElementById('logoutBtn');
    if (btnLogout) btnLogout.style.display = 'none';
}

const usuarioGuardado = localStorage.getItem('usuario_posa');
if (usuarioGuardado) {
    mostrarPantallaPrincipal(usuarioGuardado);
} else {
    mostrarPantallaRegistro();
}

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('usuario_posa'); 
    mostrarPantallaRegistro();                
});

 document.getElementById('confirmBtn').addEventListener('click', async function() {
    const nombre = document.getElementById('clientName').value.trim();
    const correo = document.getElementById('clientEmail').value.trim();
    const notas = document.getElementById('clientNotes').value.trim();

    if (!nombre || !correo) {
        alert('Por favor, completa todos los datos del cliente.');
        return;
    }
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

    localStorage.setItem('usuario_posa', nombre);
    mostrarPantallaPrincipal(nombre);


    document.getElementById('orderForm').reset();
    alert('Cliente registrado con éxito!');
});

