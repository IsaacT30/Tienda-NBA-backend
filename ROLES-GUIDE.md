# Sistema de Roles - Guía de Implementación Frontend

## Resumen del Sistema

El backend ahora implementa un sistema de roles con las siguientes características:

### Roles Disponibles:
- **ADMIN**: Puede hacer CRUD completo en todos los recursos
- **CUSTOMER**: Puede registrarse, hacer órdenes y ver sus propias órdenes
- **USER**: Rol básico de usuario  
- **MODERATOR**: Para futuras funcionalidades

### Endpoints Públicos (sin autenticación):
- `GET /productos` - Ver productos
- `GET /productos/:id` - Ver producto específico
- `GET /categories` - Ver categorías
- `GET /categories/:id` - Ver categoría específica
- `GET /marcas` - Ver marcas
- `GET /marcas/:id` - Ver marca específica
- `GET /articulos` - Ver artículos
- `GET /articulos/:id` - Ver artículo específico

### Endpoints Solo ADMIN:
- `POST /productos` - Crear producto
- `PUT /productos/:id` - Actualizar producto
- `DELETE /productos/:id` - Eliminar producto
- `POST /categories` - Crear categoría
- `PUT /categories/:id` - Actualizar categoría
- `DELETE /categories/:id` - Eliminar categoría
- `POST /marcas` - Crear marca
- `PUT /marcas/:id` - Actualizar marca
- `DELETE /marcas/:id` - Eliminar marca
- `POST /articulos` - Crear artículo
- `PUT /articulos/:id` - Actualizar artículo
- `DELETE /articulos/:id` - Eliminar artículo
- `GET /users` - Ver todos los usuarios
- `POST /users` - Crear usuario
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario
- `GET /ordenes` - Ver todas las órdenes
- `PUT /ordenes/:id` - Actualizar orden
- `DELETE /ordenes/:id` - Eliminar orden

### Endpoints para Usuarios Autenticados:
- `POST /ordenes` - Crear orden (CUSTOMER y ADMIN)
- `GET /ordenes/my-orders` - Ver mis órdenes
- `GET /ordenes/:id` - Ver orden específica (propia o todas si es ADMIN)
- `GET /users/me/profile` - Ver mi perfil
- `PUT /users/me/profile` - Actualizar mi perfil
- `GET /auth/me` - Obtener información del usuario logueado

## Implementación en Frontend

### 1. Autenticación y Obtener Información del Usuario

```javascript
// Login
const login = async (username, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  if (data.access_token) {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  }
};

// Obtener información del usuario
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};
```

### 2. Verificación de Roles en Frontend

```javascript
// Enum de roles (debe coincidir con el backend)
const UserRole = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  USER: 'user',
  MODERATOR: 'moderator'
};

// Función para verificar si el usuario es admin
const isAdmin = (user) => {
  return user && user.role === UserRole.ADMIN;
};

// Función para verificar si el usuario puede realizar acciones CRUD
const canManageContent = (user) => {
  return isAdmin(user);
};

// Componente de ejemplo en React
const ProductManagement = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  if (!canManageContent(user)) {
    return <div>No tienes permisos para acceder a esta sección</div>;
  }

  return (
    <div>
      <h2>Gestión de Productos (Solo Admin)</h2>
      {/* Formularios para CRUD de productos */}
    </div>
  );
};
```

### 3. Configuración de Rutas Protegidas

```javascript
// React Router ejemplo
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

// Uso en el router
<Routes>
  <Route path="/admin/*" element={
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <AdminDashboard />
    </ProtectedRoute>
  } />
  <Route path="/profile" element={
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  } />
</Routes>
```

### 4. Interfaz de Usuario Condicional

```javascript
const Navigation = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  return (
    <nav>
      <Link to="/">Inicio</Link>
      <Link to="/productos">Productos</Link>
      
      {user ? (
        <>
          <Link to="/ordenes/my-orders">Mis Órdenes</Link>
          <Link to="/profile">Mi Perfil</Link>
          
          {isAdmin(user) && (
            <div className="admin-menu">
              <Link to="/admin/productos">Gestionar Productos</Link>
              <Link to="/admin/categorias">Gestionar Categorías</Link>
              <Link to="/admin/marcas">Gestionar Marcas</Link>
              <Link to="/admin/usuarios">Gestionar Usuarios</Link>
              <Link to="/admin/ordenes">Ver Todas las Órdenes</Link>
            </div>
          )}
          
          <button onClick={logout}>Cerrar Sesión</button>
        </>
      ) : (
        <>
          <Link to="/login">Iniciar Sesión</Link>
          <Link to="/register">Registrarse</Link>
        </>
      )}
    </nav>
  );
};
```

### 5. Gestión de Pedidos

```javascript
// Para customers - crear orden
const createOrder = async (orderData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/ordenes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  return await response.json();
};

// Para customers - ver mis órdenes
const getMyOrders = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/ordenes/my-orders', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};

// Para admin - ver todas las órdenes
const getAllOrders = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/ordenes', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};
```

## Configuración Inicial

### Crear el Primer Usuario Admin

```javascript
// Solo en desarrollo - crear primer admin
const createFirstAdmin = async () => {
  const response = await fetch('/api/users/create-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'admin',
      email: 'admin@tienda-nba.com',
      password: 'admin123456',
      first_name: 'Admin',
      last_name: 'User'
    })
  });
  return await response.json();
};
```

## Manejo de Errores

```javascript
const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall();
    
    if (response.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return;
    }
    
    if (response.status === 403) {
      // Sin permisos
      alert('No tienes permisos para realizar esta acción');
      return;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en API call:', error);
    alert('Error de conexión');
  }
};
```

## Resumen de la Arquitectura

1. **Los usuarios se registran como CUSTOMER por defecto**
2. **Solo ADMIN puede gestionar contenido (CRUD)**
3. **Los CUSTOMER pueden hacer órdenes y ver sus propias órdenes**
4. **Los ADMIN pueden ver y gestionar todas las órdenes**
5. **Todos pueden ver productos, categorías, marcas y artículos**
6. **El frontend debe verificar roles para mostrar/ocultar funcionalidades**
7. **El backend valida permisos en cada endpoint protegido**
