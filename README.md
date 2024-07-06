# URL Shortener Backend

Este es el backend para un servicio de acortamiento de URLs, construido con Node.js, Express.js, y MongoDB. La aplicación permite a los usuarios registrar cuentas, iniciar sesión, acortar URLs, ver el historial de URLs acortadas, y más.

## Características

- **Registro de Usuarios**: Permite a los usuarios crear una cuenta.
- **Inicio de Sesión**: Permite a los usuarios iniciar sesión y obtener un token JWT.
- **Acortar URLs**: Permite a los usuarios autenticados acortar URLs proporcionando una URL original y opcionalmente una URL personalizada y una fecha de expiración.
- **Redireccionar URLs Acortadas**: Redirige a la URL original utilizando la URL acortada.
- **Historial de URLs Acortadas**: Permite a los usuarios ver todas sus URLs acortadas, junto con detalles como la URL original, la URL acortada, la fecha de creación, el número de clics y el estado.
- **Editar URLs Acortadas**: Permite a los usuarios actualizar la URL original, la fecha de expiración y el estado de las URLs acortadas.
- **Eliminar URLs Acortadas**: Permite a los usuarios eliminar URLs acortadas.
- **Validación de Input**: Valida las entradas del usuario para asegurar que las URLs proporcionadas son válidas.
- **API Rate Limiting**: Limita el número de solicitudes que una IP puede hacer en un período de tiempo determinado para prevenir abuso de la API.
- **Protección CSRF**: Implementa protección contra ataques CSRF para las solicitudes que modifican el estado.
- **Encriptación de Datos Sensibles**: Encripta las contraseñas antes de almacenarlas en la base de datos.
- **Caching**: Implementa caching para mejorar el rendimiento de las redirecciones.

## Tecnologías Utilizadas

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT (JSON Web Tokens)**
- **Express Validator**
- **Node-Cache**
- **Nodemon** (para desarrollo)

## Configuración

### Prerrequisitos

- Node.js y npm instalados en tu máquina.
- Una cuenta de MongoDB Atlas para la base de datos.

### Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/nombre-del-repo.git
   cd nombre-del-repo

2. Instalar las dependencias:
    ```bash
    npm install

3. Crear un archivo .env

4. Iniciar el servidor de desarrollo:
    ```bash
    npm run dev

### Licencia

- Este archivo `README.md` proporciona una descripción clara y completa de tu proyecto, sus características, tecnologías utilizadas, configuración, despliegue y cómo usar los endpoints. Si tienes más detalles específicos o deseas agregar información adicional, puedes personalizarlo según tus necesidades.