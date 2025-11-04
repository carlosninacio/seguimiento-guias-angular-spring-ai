# 👟 Sistema de Gestión de Pedidos

> Aplicación **Full Stack** para la administración de pedidos de calzado, desarrollada con **React**, **Spring Boot** y **MySQL**, que integra **OCR con Tesseract (IA)** para lectura automática de guías y genera **rótulos personalizados en Word**.  
> Además, **actualiza y exporta automáticamente un archivo Excel** con todos los pedidos, facilitando la gestión, revisión y control de pagos.

---

## 🧩 Descripción del Proyecto

Este sistema reemplaza los procesos manuales en Word y Excel por una **solución moderna, automatizada y conectada**.  
Permite **registrar, consultar, actualizar y eliminar pedidos** de forma rápida, además de procesar **imágenes de guías de envío** mediante **inteligencia artificial (OCR con Tesseract)**.

Cada vez que se registra o procesa un pedido, el sistema:
1. Guarda los datos en la base de datos **MySQL**.  
2. **Genera o actualiza automáticamente** un archivo **Excel local**.  
3. Crea **rótulos en formato Word (.docx)** listos para imprimir y pegar en los paquetes.  

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
- Apache POI → Manejo y generación de archivos **Excel (.xlsx)**  
- Apache POI + DOCX4J → Generación de **rótulos Word (.docx)**  
- **Tesseract OCR** → Procesamiento de imágenes de guías (IA)  
- MySQL Driver  
- Lombok  

### 🗄️ Base de Datos
- **MySQL 8+**

---

## 🤖 Integración con OCR (IA - Tesseract)

El sistema incorpora **Tesseract OCR**, una librería de reconocimiento óptico de caracteres, para **leer automáticamente los datos de las guías escaneadas o fotografiadas**.

Al subir una imagen:
1. El backend procesa el archivo con **Google Tesseract**.  
2. Extrae automáticamente el número de guía, destino, cliente y valores.  
3. Crea o actualiza el pedido en la base de datos.  

Esto elimina la digitación manual y reduce errores humanos en el registro de pedidos.

---

## 🧾 Generación de Rótulos en Word

El sistema incluye una función para **generar rótulos personalizados (.docx)** por cada pedido.  
Cada rótulo contiene:
- Número de guía  
- Destino  
- Nombre del cliente  
- Fecha de admisión  
- Código de pedido o referencia  

Los archivos Word pueden imprimirse directamente para el embalaje o archivo físico de los pedidos.

> 📂 Los rótulos se generan automáticamente desde el backend usando **Apache POI / DOCX4J**, garantizando formato uniforme y profesional.

---

## 📊 Integración con Excel

El backend incluye un servicio `ExcelService` que usa **Apache POI** para:
- Crear el archivo `pedidos.xlsx` si no existe.  
- Agregar o actualizar filas automáticamente con cada pedido nuevo.  
- Mantener sincronizados los datos entre **MySQL y Excel**.  

Archivo de salida:
```
backend-spring/src/main/resources/reportes/pedidos.xlsx
```

---
## 🚀 Funcionalidades Principales

✅ Registro, edición y eliminación de pedidos.  
✅ **Lectura automática de guías** mediante OCR (IA).  
✅ **Generación de rótulos en Word (.docx)**.  
✅ **Exportación y sincronización de Excel (.xlsx)**.  
✅ Interfaz web moderna e intuitiva (React + Bootstrap).  
✅ Búsqueda, filtrado y gestión completa desde el navegador.  

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

## 🧭 Flujo General

1. El usuario registra o sube una guía desde la interfaz React.  
2. El backend (Spring Boot) procesa la imagen con **Tesseract OCR**.  
3. Los datos extraídos se guardan en **MySQL**.  
4. Se actualiza el **Excel** y se genera el **rótulo Word**.  
5. Todo queda disponible para descarga o impresión.  

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

🚀 Implementación de usuarios de tipo administrador y vendedor.  
📅 Exportación automática de reportes mensuales.  
🔍 Filtros avanzados por rango de fechas.  
🧾 Dashboard de pagos y control contable.  

---

## 👤 Autor

**Carlos Ramírez**  
Desarrollador Java | React | Spring Boot | MySQL  
📧 *ingcirp@gmail.com*  
🌐 [GitHub/carlosninacio](https://github.com/carlosninacio)

---

## 🏁 Estado del Proyecto

> 🧩 En desarrollo — Actualmente con OCR funcional, generación de rótulos Word y exportación automática a Excel.

---

## 📘 Licencia

Este proyecto es de uso personal y profesional para la empresa de calzado.  
Queda autorizado su uso interno y su presentación como parte del portafolio profesional del autor.

---
