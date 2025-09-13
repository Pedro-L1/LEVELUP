/*
// --- Catálogo de productos (puedes editar aquí los productos) ---
const productos = [
  {id:"producto1",nombre:"Catan 🎲",precio:29990,categoria:"juegos",img:"assets/image/catan.webp",descripcion:"Clásico juego de estrategia..."},
  {id:"producto2",nombre:"Carcassonne 🎲",precio:24990,categoria:"juegos",img:"assets/image/carcassonne.webp",descripcion:"Coloca fichas y construye Carcassonne."},
  {id:"producto3",nombre:"Control Xbox Series X 🎮",precio:59990,categoria:"accesorios",img:"assets/image/Controlador Inalámbrico Xbox Series X.webp",descripcion:"Control cómodo y preciso."},
  {id:"producto4",nombre:"Play Station 5 🕹️",precio:549990,categoria:"computacion",img:"assets/image/D_NQ_NP_2X_883946-MLA79964406701_102024-F.webp",descripcion:"Consola de última generación."},
  {id:"producto5",nombre:"Auriculares HyperX Cloud II 🎧",precio:79990,categoria:"accesorios",img:"assets/image/Auriculares-gamer_HyperX Cloud II.jpg",descripcion:"Sonido envolvente profesional."},
  {id:"producto6",nombre:"Asus Rog Strix Scar 15 💻",precio:1299990,categoria:"computacion",img:"assets/image/Asus Rog Strix Scar 15 Gaming Laptop-15.6.jpg",descripcion:"Laptop gamer potente."},
  {id:"producto7",nombre:"Secretlab Titan Evo Frost 💺",precio:349990,categoria:"accesorios",img:"assets/image/Secretlab Titan Evo Frost -Silla Gamer.jpg",descripcion:"Silla gamer ergonómica."},
  {id:"producto8",nombre:"Mouse Logitech G502 HERO 🖱️",precio:49990,categoria:"accesorios",img:"assets/image/Mouse Gamer Logitech G502 HERO.webp",descripcion:"Mouse gamer profesional."},
  {id:"producto9",nombre:"Mousepad Razer Goliathus 👾",precio:29990,categoria:"accesorios",img:"assets/image/Mousepad Razer Goliathus Extended Chroma.webp",descripcion:"Mousepad extendido RGB."},
  {id:"producto10",nombre:"Polera Level UP Gamer 👕",precio:19990,categoria:"ropa",img:"assets/image/PoleraLevelUP.jpg",descripcion:"Polera gamer exclusiva."},
  {id:"producto11",nombre:"Refrigeración Cougar ARGB ❄️",precio:70990,categoria:"computacion",img:"assets/image/Refrigeración Liquida Cougar Poseidon Elite ARGB 240-Black1.webp",descripcion:"Refrigeración líquida para CPU."},
  {id:"producto12",nombre:"Monitor Xiaomi G34 🖥️",precio:295990,categoria:"computacion",img:"assets/image/Monitor Gamer Xiaomi G34″, WQi, 180Hz.webp",descripcion:"Monitor ultrawide gamer."},
];

// --- Utilidades ---
function esCorreoDuoc(email) {
  return email && email.toLowerCase().endsWith("@duoc.cl");
}
function showNotification(message, type) {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-bg-${type} border-0 mb-2`;
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  toastContainer.appendChild(toast);
  new bootstrap.Toast(toast).show();
  setTimeout(() => toast.remove(), 3500);
}
function togglePassword(id) {
  const input = document.getElementById(id);
  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}

// --- Render catálogo ---
function renderCatalogo() {
  const cont = document.getElementById('catalogoProductos');
  if (!cont) return;
  cont.innerHTML = productos.map(p => `
    <div class="col-md-4 d-flex align-items-stretch mb-4">
      <div class="card h-100 w-100">
        <img src="${p.img}" class="card-img-top" alt="${p.nombre}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.nombre}</h5>
          <p class="card-text">${p.descripcion}</p>
          <p class="card-text" style="color:#00F7FF;">$${p.precio.toLocaleString('es-CL')}</p>
          <a href="#" class="btn btn-primary btn-comprar"
            data-id="${p.id}" data-nombre="${p.nombre}"
            data-precio="${p.precio}" data-categoria="${p.categoria}"
            data-img="${p.img}" data-descripcion="${p.descripcion}"
          >Comprar</a>
        </div>
      </div>
    </div>
  `).join('');
  agregarEventosComprar();
}

// --- Busqueda catálogo ---
document.addEventListener('DOMContentLoaded', () => {
  renderCatalogo();
  document.getElementById('buscadorCatalogo')?.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('#catalogo .card').forEach(card => {
      const nombre = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
      const descripcion = (card.querySelector('.card-text')?.textContent || '').toLowerCase();
      card.style.display = (nombre.includes(query) || descripcion.includes(query)) ? '' : 'none';
    });
  });
});

// --- Carrito ---
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo')) || null;

function agregarAlCarrito(producto) {
  if (!producto || !producto.id) return Swal.fire('Error', 'Producto no válido', 'error');
  const itemExistente = carrito.find(item => item.id === producto.id);
  if (itemExistente) {
    itemExistente.cantidad++;
    Swal.fire('¡Actualizado!', `${producto.nombre} ahora tiene ${itemExistente.cantidad} en el carrito`, 'info');
  } else {
    carrito.push({ ...producto, cantidad: 1 });
    Swal.fire('¡Agregado!', `${producto.nombre} se añadió al carrito`, 'success');
  }
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarritoUI();
}
function vaciarCarrito() {
  carrito = [];
  localStorage.removeItem('carrito');
  actualizarCarritoUI();
}
function getTotalCarrito() {
  let total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const totalDescuentoEl = document.getElementById('totalDescuento');
  if (usuarioActivo && esCorreoDuoc(usuarioActivo.email)) {
    total = Math.round(total * 0.8);
    if (totalDescuentoEl) totalDescuentoEl.textContent = 'Se aplicó descuento Duoc (-20%)';
  } else {
    if (totalDescuentoEl) totalDescuentoEl.textContent = '';
  }
  return total;
}
function actualizarCarritoUI() {
  const contador = document.getElementById('contadorCarrito');
  const carritoItems = document.getElementById('carritoItems');
  const totalCarrito = document.getElementById('totalCarrito');
  if (!contador || !carritoItems || !totalCarrito) return;
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  contador.textContent = totalItems;
  let html = '';
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    html += `
      <div class="cart-item d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6>${item.nombre}</h6>
          <small>Cantidad: ${item.cantidad}</small>
        </div>
        <div>
          <span>$${subtotal.toLocaleString('es-CL')}</span>
          <button class="btn btn-sm btn-danger ms-2" onclick="eliminarDelCarrito('${item.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });
  carritoItems.innerHTML = html || '<p>El carrito está vacío</p>';
  totalCarrito.textContent = getTotalCarrito().toLocaleString('es-CL');
}
window.eliminarDelCarrito = function(productId) {
  carrito = carrito.filter(item => item.id !== productId);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarritoUI();
}
function guardarHistorialCompraCarrito() {
  let historial = JSON.parse(localStorage.getItem('historialCompras')) || [];
  carrito.forEach(item => {
    if (!historial.some(h => h.id === item.id)) {
      historial.push({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        categoria: item.categoria || '',
        img: item.img || '',
        descripcion: item.descripcion || ''
      });
    }
  });
  localStorage.setItem('historialCompras', JSON.stringify(historial));
}
function agregarEventosComprar() {
  document.querySelectorAll('.btn-comprar').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      const producto = {
        id: btn.dataset.id,
        nombre: btn.dataset.nombre,
        precio: parseInt(btn.dataset.precio),
        categoria: btn.dataset.categoria || '',
        img: btn.dataset.img || '',
        descripcion: btn.dataset.descripcion || ''
      };
      agregarAlCarrito(producto);
    };
  });
}

// --- Integración carrito ---
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('vaciarCarritoBtn')?.addEventListener('click', vaciarCarrito);
  document.getElementById('finalizarCompraBtn')?.addEventListener('click', () => {
    if (carrito.length === 0) return Swal.fire('Error', 'El carrito está vacío', 'error');
    Swal.fire({
      title: '¿Confirmar compra?',
      text: `Total: $${document.getElementById('totalCarrito').textContent}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Comprar!'
    }).then((result) => {
      if (result.isConfirmed) {
        guardarHistorialCompraCarrito();
        Swal.fire('¡Éxito!', 'Compra realizada', 'success');
        vaciarCarrito();
        bootstrap.Modal.getInstance(document.getElementById('carritoModal')).hide();
        mostrarRecomendados();
      }
    });
  });
  actualizarCarritoUI();
});

// --- Registro/Login/Validaciones ---
function validarEdad(fechaNacimiento) {
  const hoy = new Date();
  const fechaNac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const m = hoy.getMonth() - fechaNac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) edad--;
  return edad >= 18;
}
function registrarUsuario(email, fechaNacimiento, password) {
  if (!validarEdad(fechaNacimiento)) {
    Swal.fire('Error', 'Debes tener al menos 18 años para registrarte.', 'error');
    return false;
  }
  const users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.find(u => u.email === email)) {
    showNotification('El correo ya está registrado', 'danger');
    return false;
  }
  users.push({ email, fechaNacimiento, password, carrito: [], registro: new Date().toISOString() });
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('usuarioActivo', JSON.stringify({ email, fechaNacimiento }));
  usuarioActivo = { email, fechaNacimiento };
  return true;
}
document.getElementById('registroForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const fechaNacimiento = document.getElementById('fechaNacimiento').value;
  const email = document.getElementById('emailRegistro').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  if (password !== confirmPassword) {
    showNotification('Las contraseñas no coinciden', 'danger');
    return;
  }
  if (registrarUsuario(email, fechaNacimiento, password)) {
    Swal.fire({
      icon: 'success',
      title: '¡Registro exitoso!',
      text: esCorreoDuoc(email) ?
        '¡Eres usuario Duoc! Obtienes 20% de descuento en todas tus compras.' :
        'Revisa tu correo para tu contraseña temporal.',
      confirmButtonText: 'Aceptar'
    });
    bootstrap.Modal.getInstance(document.getElementById('registroModal')).hide();
    actualizarCarritoUI();
  }
});
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const usuario = users.find(u => u.email === email && u.password === password);
  if (usuario) {
    showNotification('Inicio de sesión exitoso', 'success');
    localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
    usuarioActivo = usuario;
    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
    actualizarCarritoUI();
  } else {
    showNotification('Correo o contraseña incorrectos', 'danger');
  }
});

// --- Recuperación de contraseña ---
document.getElementById('recoveryForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('recoveryEmail').value;
  const users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.find(u => u.email === email)) {
    Swal.fire('¡Instrucciones enviadas!', 'Revisa tu correo institucional.', 'success');
    bootstrap.Modal.getInstance(document.getElementById('recoveryModal')).hide();
  } else {
    Swal.fire('Error', 'Correo no registrado.', 'error');
  }
});

// --- Perfil ---
function cargarPerfilUsuario() {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo')) || {};
  document.getElementById('perfilNombre').value = usuario.nombre || '';
  document.getElementById('perfilTelefono').value = usuario.telefono || '';
  document.getElementById('perfilCorreo').value = usuario.email || '';
  document.getElementById('perfilFechaNacimiento').value = usuario.fechaNacimiento || '';
  document.getElementById('perfilPais').value = usuario.pais || 'CL';
}
document.getElementById('perfilModal')?.addEventListener('show.bs.modal', cargarPerfilUsuario);
document.getElementById('perfilForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo')) || {};
  usuario.nombre = document.getElementById('perfilNombre').value;
  usuario.telefono = document.getElementById('perfilTelefono').value;
  usuario.fechaNacimiento = document.getElementById('perfilFechaNacimiento').value;
  usuario.pais = document.getElementById('perfilPais').value;
  localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
  showNotification('Perfil actualizado correctamente', 'success');
});

// --- Preferencias ---
document.getElementById('preferenciasForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const preferencias = {
    metodoPago: document.getElementById('metodoPago').value,
    notificaciones: document.getElementById('notificaciones').checked,
    categorias: Array.from(document.querySelectorAll('input[type="checkbox"][id^="categoria"]:checked')).map(cb => cb.id.replace('categoria',''))
  };
  localStorage.setItem('userPreferences', JSON.stringify(preferencias));
  showNotification('Preferencias guardadas', 'info');
});

// --- Recomendados ---
function mostrarRecomendados() {
  let historial = JSON.parse(localStorage.getItem('historialCompras')) || [];
  if (!historial.length) return document.getElementById('recomendados').style.display = 'none';
  let categoriasCompradas = [...new Set(historial.map(p => p.categoria))];
  let recomendados = productos.filter(p => categoriasCompradas.includes(p.categoria) && !historial.some(h => h.id === p.id));
  let contenedor = document.getElementById('recomendadosProductos');
  if (!contenedor) return;
  contenedor.innerHTML = recomendados.map(p => `
    <div class="col-md-4">
      <div class="card">
        <img src="${p.img}" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">${p.nombre}</h5>
          <p class="card-text">${p.descripcion}</p>
          <p class="card-text">$${p.precio.toLocaleString('es-CL')}</p>
          <a href="#" class="btn btn-primary btn-comprar"
            data-id="${p.id}" data-nombre="${p.nombre}"
            data-precio="${p.precio}" data-categoria="${p.categoria}"
            data-img="${p.img}" data-descripcion="${p.descripcion}"
          >Comprar</a>
        </div>
      </div>
    </div>
  `).join('');
  document.getElementById('recomendados').style.display = recomendados.length ? '' : 'none';
  agregarEventosComprar();
}
document.addEventListener('DOMContentLoaded', mostrarRecomendados);

// --- Contacto ---
document.getElementById('formContacto')?.addEventListener('submit', function(e) {
  e.preventDefault();
  Swal.fire('¡Mensaje enviado!', 'Te contactaremos pronto.', 'success');
  this.reset();
});
*/

// ======================
// Level UP Gamer - JS
// ======================

// --------- Utilidades ---------
function mostrarToast(mensaje, tipo = "info", tiempo = 2500) {
  const toastContainer = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-bg-${tipo} border-0 show mb-2`;
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${mensaje}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.remove("show"), tiempo);
  setTimeout(() => toast.remove(), tiempo + 500);
}

// --------- Catálogo, Carrito, Compra ---------
const productos = [
  {id:"producto1", nombre:"Catan 🎲", precio:29990, img:"assets/image/catan.webp"},
  {id:"producto2", nombre:"Carcassonne 🎲", precio:24990, img:"assets/image/carcassonne.webp"},
  {id:"producto3", nombre:"Control Xbox Series X 🎮", precio:59990, img:"assets/image/Controlador Inalámbrico Xbox Series X.webp"},
  {id:"producto4", nombre:"Play Station 5 🕹️", precio:549990, img:"assets/image/D_NQ_NP_2X_883946-MLA79964406701_102024-F.webp"},
  {id:"producto5", nombre:"Auriculares Gamer HyperX Cloud II 🎧", precio:79990, img:"assets/image/Auriculares-gamer_HyperX Cloud II.jpg"},
  {id:"producto6", nombre:"Asus Rog Strix Scar 15 Gaming Laptop 💻", precio:1299990, img:"assets/image/Asus Rog Strix Scar 15 Gaming Laptop-15.6.jpg"},
  {id:"producto7", nombre:"Secretlab Titan Evo Frost 💺", precio:349990, img:"assets/image/Secretlab Titan Evo Frost -Silla Gamer.jpg"},
  {id:"producto8", nombre:"Mouse Gamer Logitech G502 HERO 🖱️", precio:49990, img:"assets/image/Mouse Gamer Logitech G502 HERO.webp"},
  {id:"producto9", nombre:"Mousepad Razer Goliathus Extended Chroma 👾", precio:29990, img:"assets/image/Mousepad Razer Goliathus Extended Chroma.webp"},
  {id:"producto10", nombre:"Polera Level UP Gamer 👕", precio:19990, img:"assets/image/PoleraLevelUP.jpg"},
  {id:"producto11", nombre:"Refrigeración Liquida Cougar Poseidon Elite ARGB 240-Black ❄️", precio:70990, img:"assets/image/Refrigeración Liquida Cougar Poseidon Elite ARGB 240-Black1.webp"},
  {id:"producto12", nombre:"Monitor Gamer Xiaomi G34, WQi, 180Hz 🖥️", precio:295990, img:"assets/image/Monitor Gamer Xiaomi G34″, WQi, 180Hz.webp"},
  {id:"oferta-teclado", nombre:"Teclado Inalámbrico", precio:49990, img:"assets/image/Teclado_Inspire_Smart_TI707.jpg"},
];

function obtenerProductoPorId(id) {
  return productos.find(p => p.id === id);
}

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function actualizarContadorCarrito() {
  document.getElementById("contadorCarrito").textContent = carrito.length;
}

// --------- Carrito Modal ---------
function renderizarCarrito() {
  const carritoItems = document.getElementById("carritoItems");
  carritoItems.innerHTML = "";
  let total = 0;
  carrito.forEach(item => {
    const prod = obtenerProductoPorId(item.id);
    const subtotal = prod.precio * item.cantidad;
    total += subtotal;
    carritoItems.innerHTML += `
      <div class="d-flex align-items-center mb-2">
        <img src="${prod.img}" width="50" class="me-2 rounded" alt="${prod.nombre}">
        <span class="flex-grow-1">${prod.nombre} x${item.cantidad}</span>
        <span class="me-2">$${subtotal.toLocaleString()}</span>
        <button class="btn btn-danger btn-sm" onclick="quitarDelCarrito('${item.id}')">Eliminar</button>
      </div>
    `;
  });
  document.getElementById("totalCarrito").textContent = total.toLocaleString();

  // Descuento Duoc
  let descuento = 0;
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (usuario && usuario.email && usuario.email.endsWith("@duoc.cl")) {
    descuento = Math.round(total * 0.2);
    document.getElementById("totalDescuento").textContent =
      `Descuento Duoc: -$${descuento.toLocaleString()}`;
  } else {
    document.getElementById("totalDescuento").textContent = "";
  }
}

function quitarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
  actualizarContadorCarrito();
  mostrarToast("Producto eliminado del carrito", "warning");
}

document.getElementById("vaciarCarritoBtn").onclick = () => {
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
  actualizarContadorCarrito();
  mostrarToast("Carrito vaciado", "info");
};

document.getElementById("finalizarCompraBtn").onclick = () => {
  if (carrito.length === 0) {
    mostrarToast("El carrito está vacío", "danger");
    return;
  }
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  let mensaje = "¡Compra realizada!";
  if (usuario && usuario.email && usuario.email.endsWith("@duoc.cl")) {
    mensaje += " ¡Has apoyado la comunidad gamer y obtuviste descuento Duoc!";
  }
  mostrarToast(mensaje, "success");
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
  actualizarContadorCarrito();
};

// --------- Catálogo y Buscador ---------
function filtrarCatalogo(busqueda) {
  busqueda = busqueda.toLowerCase();
  document.querySelectorAll("#catalogo .card").forEach(card => {
    const nombre = card.querySelector(".card-title").textContent.toLowerCase();
    const desc = card.querySelector(".card-text").textContent.toLowerCase();
    if (nombre.includes(busqueda) || desc.includes(busqueda)) {
      card.parentElement.style.display = "";
    } else {
      card.parentElement.style.display = "none";
    }
  });
}

document.getElementById("buscadorCatalogo").addEventListener("input", e => {
  filtrarCatalogo(e.target.value);
});

// --------- Botones Comprar ---------
document.querySelectorAll(".btn-comprar").forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.preventDefault();
    const id = this.getAttribute("data-id");
    let item = carrito.find(i => i.id === id);
    if (item) {
      item.cantidad += 1;
    } else {
      carrito.push({id, cantidad: 1});
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    mostrarToast("Producto agregado al carrito", "success");
  });
});

// --------- Abrir Modal Carrito ---------
document.getElementById("carritoModal").addEventListener("show.bs.modal", renderizarCarrito);

// --------- Registro y Login ---------
function validarFecha(fecha) {
  // dd/mm/yyyy
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(fecha)) return false;
  const [d, m, y] = fecha.split("/").map(Number);
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

document.getElementById("registroForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const fechaNacimiento = document.getElementById("fechaNacimiento");
  if (!validarFecha(fechaNacimiento.value)) {
    fechaNacimiento.classList.add("is-invalid");
    document.getElementById("fechaNacimientoHelp").textContent = "Formato inválido. Usa dd/mm/yyyy";
    return;
  } else {
    fechaNacimiento.classList.remove("is-invalid");
    document.getElementById("fechaNacimientoHelp").textContent = "Ejemplo: 11/09/2000";
  }
  const email = document.getElementById("emailRegistro").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  if (password.length < 8) {
    mostrarToast("La contraseña debe tener al menos 8 caracteres", "danger");
    return;
  }
  if (password !== confirmPassword) {
    mostrarToast("Las contraseñas no coinciden", "danger");
    return;
  }
  // Guardar usuario en localStorage
  const usuario = {
    email,
    fechaNacimiento: fechaNacimiento.value,
    password
  };
  localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
  mostrarToast("¡Registro exitoso!", "success");
  bootstrap.Modal.getInstance(document.getElementById("registroModal")).hide();
  this.reset();
});

// --------- Login ---------
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (!usuario || usuario.email !== email || usuario.password !== password) {
    mostrarToast("Usuario o contraseña inválidos", "danger");
    return;
  }
  mostrarToast("¡Bienvenido!", "success");
  bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
});

// --------- Recuperar Contraseña ---------
document.getElementById("recoveryForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("recoveryEmail").value;
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (!usuario || usuario.email !== email) {
    mostrarToast("Correo no registrado", "danger");
    return;
  }
  mostrarToast("Instrucciones enviadas al correo", "info");
  bootstrap.Modal.getInstance(document.getElementById("recoveryModal")).hide();
});

// --------- Perfil Modal ---------
document.getElementById("perfilModal").addEventListener("show.bs.modal", function () {
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo")) || {};
  document.getElementById("perfilNombre").value = usuario.nombre || "";
  document.getElementById("perfilTelefono").value = usuario.telefono || "";
  document.getElementById("perfilCorreo").value = usuario.email || "";
  document.getElementById("perfilFechaNacimiento").value = usuario.fechaNacimiento || "";
  document.getElementById("perfilPais").value = usuario.pais || "CL";
});

document.getElementById("perfilForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const fechaNacimiento = document.getElementById("perfilFechaNacimiento");
  if (!validarFecha(fechaNacimiento.value)) {
    fechaNacimiento.classList.add("is-invalid");
    return;
  } else {
    fechaNacimiento.classList.remove("is-invalid");
  }
  const usuario = {
    nombre: document.getElementById("perfilNombre").value,
    telefono: document.getElementById("perfilTelefono").value,
    email: document.getElementById("perfilCorreo").value,
    fechaNacimiento: fechaNacimiento.value,
    pais: document.getElementById("perfilPais").value,
    password: JSON.parse(localStorage.getItem("usuarioActivo"))?.password || ""
  };
  localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
  mostrarToast("¡Perfil actualizado!", "success");
  bootstrap.Modal.getInstance(document.getElementById("perfilModal")).hide();
});

// --------- Contacto ---------
document.getElementById("formContacto").addEventListener("submit", function(e){
  e.preventDefault();
  mostrarToast("¡Mensaje enviado! Te responderemos pronto.", "success");
  this.reset();
});

// --------- Toggle Password Buttons ---------
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', function() {
    const input = document.getElementById(this.getAttribute('onclick').match(/'(.+)'/)[1]);
    if (input.type === "password") {
      input.type = "text";
      btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
      input.type = "password";
      btn.innerHTML = '<i class="fas fa-eye"></i>';
    }
  });
});

// --------- Inicialización ---------
actualizarContadorCarrito();