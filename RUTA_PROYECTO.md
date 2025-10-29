# 🗺️ Hoja de Ruta del Proyecto “Gestión de Pedidos”

> **Autor:** Carlos Ramírez  
> **Propósito:** Desarrollar una aplicación completa para gestionar pedidos de calzado, automatizando el registro y actualización de datos en una base de datos **MySQL** y un archivo **Excel**, integrando **React** + **Spring Boot**.  
> **Objetivo final:** Ofrecer la aplicación como herramienta de trabajo en la empresa y consolidar la primera experiencia real como desarrollador de software.  

---

## 🌱 FASE 1: Planificación y Diseño
🧩 *Objetivo:* Definir el propósito, flujo y visual del proyecto.  

**Tareas:**
- [ ] Crear el **repositorio GitHub** (`pedidoApp` o `gestion-pedidos`).
- [ ] Escribir un **README inicial** con descripción breve.
- [ ] En una hoja o bloc, definir:
  - Campos del pedido (número de guía, destino, nombre, estado, valor, abono, fecha revisión, fecha archivado, cantidad de pares).
  - Acciones del usuario (crear, editar, ver, eliminar, exportar Excel).
  - Boceto visual de la interfaz.
- [ ] Decidir si habrá **roles** o solo un usuario.
- [ ] Esquematizar el flujo general:
  > “Registrar pedido → Guardar en base → Visualizar → Actualizar → Exportar Excel”.

📘 **Resultado esperado:** visión clara del proyecto y su alcance.

---

## ⚙️ FASE 2: Backend (Spring Boot + MySQL)
🧠 *Objetivo:* Crear la API REST y operaciones CRUD básicas.  

**Tareas:**
- [ ] Crear proyecto **Spring Boot** con dependencias:
  - Spring Web  
  - Spring Data JPA  
  - MySQL Driver  
  - Lombok *(opcional)*
- [ ] Crear la entidad `Pedido` con todos los campos definidos.
- [ ] Crear `PedidoRepository` (extiende `JpaRepository`).
- [ ] Crear `PedidoService` (lógica de negocio).
- [ ] Crear `PedidoController` con endpoints REST:
  - `GET /pedidos` → listar  
  - `POST /pedidos` → crear  
  - `PUT /pedidos/{id}` → editar  
  - `DELETE /pedidos/{id}` → eliminar  
- [ ] Configurar conexión MySQL (`application.properties`).
- [ ] Probar endpoints con **Postman**.

📘 **Resultado esperado:** API funcional, conectada correctamente a MySQL.

---

## 💻 FASE 3: Frontend (React)
🎨 *Objetivo:* Crear la interfaz de usuario conectada con la API.  

**Tareas:**
- [ ] Crear el proyecto con `create-react-app` o Vite.
- [ ] Instalar dependencias:
  - `axios`
  - `react-router-dom`
- [ ] Crear componentes:
  - `PedidoForm` → formulario para crear/editar.
  - `PedidoList` → tabla para listar pedidos.
  - `Navbar` → barra de navegación básica.
- [ ] Conectar el frontend con la API (Axios).
- [ ] Manejar estados con **Hooks (useState, useEffect)**.
- [ ] Probar flujo completo: crear → ver → eliminar.

📘 **Resultado esperado:** Interfaz funcional y conectada con el backend.

---

## 📊 FASE 4: Integración Excel (Spring Boot)
🪄 *Objetivo:* Sincronizar base de datos con un archivo Excel local.  

**Tareas:**
- [ ] Agregar dependencia **Apache POI** en `pom.xml`:
  ```xml
  <dependency>
      <groupId>org.apache.poi</groupId>
      <artifactId>poi-ooxml</artifactId>
      <version>5.3.0</version>
  </dependency>
  ```
- [ ] Crear `ExcelService` con métodos:
  - `crearArchivoSiNoExiste()`
  - `agregarPedido(Pedido pedido)`
  - `exportarPedidos(List<Pedido> pedidos)`
- [ ] Modificar `PedidoService` para llamar a `ExcelService` tras cada operación CRUD.
- [ ] Agregar endpoint:
  - `GET /pedidos/exportar` → genera o actualiza el Excel.
- [ ] Probar que al crear un pedido se refleje una fila nueva en el Excel.

📘 **Resultado esperado:** Excel local actualizado automáticamente con los cambios.

---

## 💎 FASE 5: Extras y Pulido
✨ *Objetivo:* Mejorar la presentación y la experiencia del usuario.  

**Tareas opcionales:**
- [ ] Agregar botón en frontend para **descargar el Excel**.
- [ ] Implementar **filtros y búsqueda** (por guía, destino, estado).
- [ ] Formatear fechas localmente.
- [ ] Validaciones y alertas (por ejemplo, con SweetAlert2).
- [ ] Escribir **README final** con descripción, capturas y pasos de ejecución.
- [ ] Desplegar el proyecto:
  - Backend → Render / Railway  
  - Frontend → Vercel / Netlify

📘 **Resultado esperado:** Aplicación completa, visualmente agradable y lista para producción.

---

## 🏁 FASE 6: Presentación a la Empresa
🎯 *Objetivo:* Mostrar la solución como una herramienta útil y mantenible.  

**Tareas:**
- [ ] Preparar una demo o video mostrando el flujo de uso.
- [ ] Crear guía de instalación y uso.
- [ ] Mostrar cómo el Excel se actualiza automáticamente.
- [ ] Presentar posibles **mejoras futuras** (reportes, control de pagos, estadísticas).

📘 **Resultado esperado:** Aplicación funcional, documentada y lista para ser adoptada.

---

## 📔 CONSEJO FINAL
Guarda esta hoja como una **bitácora viva**.  
Marca los pasos que completes y anota lo que aprendas o los retos que enfrentes.  
Al finalizar, tendrás no solo un proyecto completo, sino una **historia técnica personal** que mostrarás con orgullo en tu portafolio. 🚀

---
