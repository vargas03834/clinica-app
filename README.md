# Sistema de Gestión Clínica

Un sistema completo de gestión clínica desarrollado con Node.js (backend) y React (frontend).

## 🚀 Características

- **Gestión de Pacientes**: Registro y seguimiento de información de pacientes
- **Citas Médicas**: Programación y gestión de citas
- **Registros Médicos**: Historial médico completo
- **Gestión Financiera**: Control de pagos y facturación
- **Calendario Integrado**: Visualización de citas y horarios
- **Autenticación**: Sistema de login seguro
- **Notificaciones**: Email y WhatsApp para recordatorios

## 📁 Estructura del Proyecto

```
clinica-app/
├── backend/          # Servidor Node.js con Express
│   ├── controllers/  # Controladores de la API
│   ├── models/       # Modelos de base de datos
│   ├── routes/       # Rutas de la API
│   ├── middlewares/  # Middlewares de autenticación
│   ├── config/       # Configuración de DB y servicios
│   └── utils/        # Utilidades (email, WhatsApp)
├── frontend/         # Aplicación React
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── pages/       # Páginas principales
│   │   ├── services/    # Servicios para API
│   │   ├── context/     # Context de React
│   │   └── css/         # Estilos CSS
│   └── public/       # Archivos estáticos
└── README.md
```

## 🛠️ Instalación

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB
- npm o yarn

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 🔧 Configuración

1. Crear archivo `.env` en el directorio `backend/` con:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clinica
JWT_SECRET=tu_jwt_secret_aqui
```

2. Configurar servicios adicionales:
   - Google Calendar API (opcional)
   - Servicio de Email
   - WhatsApp API (opcional)

## 🚀 Uso

1. Iniciar el servidor backend: `npm start` en `/backend`
2. Iniciar la aplicación frontend: `npm start` en `/frontend`
3. Acceder a `http://localhost:3000` en el navegador

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Pacientes
- `GET /api/patients` - Obtener todos los pacientes
- `POST /api/patients` - Crear nuevo paciente
- `PUT /api/patients/:id` - Actualizar paciente
- `DELETE /api/patients/:id` - Eliminar paciente

### Citas
- `GET /api/appointments` - Obtener todas las citas
- `POST /api/appointments` - Crear nueva cita
- `PUT /api/appointments/:id` - Actualizar cita
- `DELETE /api/appointments/:id` - Eliminar cita

### Finanzas
- `GET /api/finances` - Obtener registros financieros
- `POST /api/finances` - Crear nuevo registro financiero

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Autor

- **vargas03834** - [GitHub](https://github.com/vargas03834)

## 🔗 Enlaces

- [Repositorio](https://github.com/vargas03834/clinica-app)
- [Issues](https://github.com/vargas03834/clinica-app/issues)
