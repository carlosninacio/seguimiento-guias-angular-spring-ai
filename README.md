# 👟 Sistema de Gestión de Pedidos

> Aplicación Full Stack para la administración de pedidos de calzado, desarrollada con **React**, **Spring Boot** y **MySQL**, que además **genera y actualiza automáticamente un archivo Excel** con los registros, facilitando la revisión y pago de pedidos en la empresa.

---

## 🧩 Descripción del Proyecto

Este sistema permite **registrar, consultar, actualizar y eliminar pedidos** de manera sencilla y ordenada.  
Fue diseñado con el objetivo de optimizar el proceso de control de pedidos en una empresa de venta de calzado, reemplazando el registro manual en Word y Excel por una **aplicación moderna y automatizada**.

Cada vez que se registra un pedido, el sistema:
1. Guarda los datos en la base de datos **MySQL**.
2. **Escribe y actualiza automáticamente** un archivo **Excel local**, que puede entregarse fácilmente a otras áreas (revisión, pagos, archivo, etc.).

---

## ⚙️ Tecnologías Utilizadas

### 🖥️ Frontend
- [React](https://reactjs.org/)
- Axios
- React Router DOM
- HTML5 / CSS3 / Bootstrap

### 🧠 Backend
- [Spring Boot](https://spring.io/projects/spring-boot)
- Spring Data JPA
- Apache POI (para manejo de Excel)
- MySQL Driver
- Lombok (opcional)

### 🗄️ Base de Datos
- **MySQL 8+**

---

## 📂 Estructura del Proyecto

```
📦 pedidoApp
├── frontend-react/          # Aplicación React
│   ├── src/
│   └── package.json
│
├── backend-spring/          # API Spring Boot
│   ├── src/main/java/...    # Controladores, servicios, entidades
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── reportes/pedidos.xlsx
│   └── pom.xml
│
└── README.md
```

---

## 🚀 Funcionalidades Principales

✅ Registro de pedidos con número de guía, destino, nombre, valor, abono, fechas y cantidad de pares.  
✅ Actualización y eliminación de pedidos.  
✅ Visualización de todos los pedidos desde la interfaz web.  
✅ **Generación automática de Excel** con los datos sincronizados desde la base.  
✅ Descarga del archivo Excel desde el frontend (opcional).  

---

## 🧭 Flujo General

1. El usuario ingresa los datos del pedido desde la interfaz React.  
2. El backend (Spring Boot) guarda la información en la base de datos.  
3. El servicio `ExcelService` genera o actualiza el archivo `pedidos.xlsx`.  
4. El Excel queda disponible para revisión o envío al área contable.

---

## 🛠️ Configuración del Entorno

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/usuario/pedidoApp.git
```

### 2️⃣ Configurar el Backend (Spring Boot)
- Abre el proyecto en IntelliJ o VS Code.
- En `src/main/resources/application.properties`, configura tu conexión MySQL:
  ```properties
  spring.datasource.url=jdbc:mysql://localhost:3306/pedidos_db?useSSL=false&serverTimezone=UTC
  spring.datasource.username=tu_usuario
  spring.datasource.password=tu_contraseña
  spring.jpa.hibernate.ddl-auto=update
  ```
- Ejecuta el backend:
  ```bash
  mvn spring-boot:run
  ```

### 3️⃣ Configurar el Frontend (React)
- Ve a la carpeta `frontend-react`:
  ```bash
  cd frontend-react
  npm install
  npm start
  ```
- Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📊 Integración con Excel

El backend incluye un servicio `ExcelService` que usa **Apache POI** para:
- Crear el archivo `pedidos.xlsx` si no existe.
- Agregar una nueva fila cada vez que se registra un pedido.
- Mantener sincronizados los datos entre MySQL y Excel.

El archivo se guarda localmente en:
```
backend-spring/src/main/resources/reportes/pedidos.xlsx
```

---

## 💡 Mejoras Futuras

🚀 Panel de estadísticas por destino o estado del pedido.  
📅 Exportación mensual automática.  
🔍 Filtros y búsquedas avanzadas.  
🧾 Integración con control de pagos o reportes contables.  

---

## 👤 Autor

**Carlos Ramírez**  
Desarrollador Java | React | Spring Boot | MySQL  
📧 *[Tu correo profesional]*  
🌐 [Tu perfil de GitHub](https://github.com/usuario)

---

## 🏁 Estado del Proyecto

> 🚧 En desarrollo — actualmente se trabaja en la integración completa del backend con Excel y la interfaz React.

---

## 📘 Licencia

Este proyecto es de uso personal y profesional para la empresa de calzado.  
Queda autorizado su uso interno y su presentación como parte del portafolio profesional del autor.

---
