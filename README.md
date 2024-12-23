# SustainMap - Front

![React](https://img.shields.io/badge/React-v18.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.1.6-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-v4.4.0-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.3.0-blue?logo=tailwindcss)
![Leaflet](https://img.shields.io/badge/Leaflet-v1.9.4-green?logo=leaflet)

---


## **Resumen del Proyecto**

![udd40](https://bootcampvirtual.udd.cl/assets/img/logo4.png)
![matteroftrust](https://matteroftrust.org/wp-content/uploads/2019/01/mot_website_logo_small.png)

Este proyecto es una aplicación web interactiva diseñada para trabajar con mapas interactivos utilizando **Leaflet**, con un enfoque en la personalización y funcionalidades avanzadas. La aplicación está construida con **React** y **TypeScript**, y utiliza **Vite** como herramienta de desarrollo rápido. Los estilos son manejados con **TailwindCSS**, garantizando un diseño limpio y responsive.


### Funcionalidades principales:
1. Mapas interactivos con marcadores personalizados.
2. Integración de geolocalización.
3. Interfaz moderna y adaptable.
4. Estructura optimizada para colaboración en equipo y escalabilidad.

### Objetivo:
Proveer una base robusta para desarrollar aplicaciones web que requieran funcionalidades geográficas y mapas interactivos, manteniendo un enfoque en el rendimiento y la usabilidad.

---
## **Requisitos Previos**

Antes de empezar, asegúrate de tener instaladas las siguientes herramientas:
- Node.js (versión recomendada: >=20.x)

## **Instalación y Ejecución**

1. Clona este repositorio:
   ```bash
   git clone https://github.com/JonaDrar/sustainmap-front.git
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre el navegador en [http://localhost:5173](http://localhost:5173).

---

## **Reglas de Commits**

### Estructura del Mensaje de Commit
- Usa el formato: `tipo: descripción breve`
- Ejemplo: `feat: agregar funcionalidad de búsqueda en el mapa`

### Tipos de Commits
- **feat**: Para nuevas funcionalidades.
- **fix**: Para corregir errores.
- **docs**: Para cambios en la documentación.
- **style**: Cambios que no afectan la lógica (formato, espacios, etc.).
- **refactor**: Cambios de código que no corrigen errores ni añaden funcionalidades.
- **test**: Añadir o modificar pruebas.
- **chore**: Cambios en herramientas, configuración, o mantenimiento del proyecto.
- **perf**: Mejoras de rendimiento.
- **ci**: Cambios en integración continua.

### Descripción Detallada (Opcional)
- Si el cambio requiere explicación, añade un cuerpo descriptivo después de una línea en blanco.
- Ejemplo:
  feat: añadir botón para centrar el mapa

  Este botón permite centrar el mapa en la ubicación actual del usuario.

### Reglas Adicionales
- Commits pequeños y específicos.
- Usa el idioma inglés o español de manera consistente.
- Referencia tickets o tareas si aplica (e.g., `feat: agregar marcador en mapa (#123)`).

---


## **Reglas de Merge Requests (MR)**

### Creación de MR
- Usa un título claro y descriptivo (e.g., `Agregar funcionalidad de filtros en marcadores`).
- Rellena la plantilla estándar del proyecto para detallar:
  - **Qué se ha hecho.**
  - **Por qué se ha hecho.**
  - **Cómo probarlo.**

### Revisión de MR
- Al menos un miembro del equipo debe aprobar la MR antes de hacer merge.
- Comprueba:
  - Código limpio y sin errores.
  - Uso correcto de Tipos en TypeScript.
  - No se suban secretos o configuraciones locales.
  - Documentación actualizada si aplica.

### Reglas para Hacer Merge
- Solo el autor del commit puede hacer merge.

### Estado del Proyecto
- La rama `main` debe estar siempre lista para producción.
- La rama `develop` contendrá los cambios aprobados para pruebas internas.

---


## **Uso de Ramas**

### Estructura de Ramas
- Usa el formato: `<tipo>/<descripción>`
- Tipos de ramas:
  - **feature**: Para nuevas funcionalidades.  
    Ejemplo: `feature/mapa-interactivo`
  - **bugfix**: Para corregir errores.  
    Ejemplo: `bugfix/solucionar-scroll-en-el-mapa`
  - **hotfix**: Cambios urgentes en producción.  
    Ejemplo: `hotfix/corregir-bug-login`
  - **chore**: Mantenimiento o tareas menores.  
    Ejemplo: `chore/actualizar-dependencias`

### Flujo de Trabajo
- La rama base para las ramas nuevas es `develop`.
- Una vez completada, haz un Merge Request hacia `develop`.

### Ramas Principales
- **main**: Versión lista para producción.  
  - Solo recibe merges desde `develop`.
- **develop**: Rama de desarrollo principal.  
  - Recibe merges desde ramas de tipo `feature`, `bugfix`, y `hotfix`.

### Reglas Adicionales
- Realiza un pull de `develop` antes de crear nuevas ramas.
- Mantén tus ramas sincronizadas con `develop` mientras trabajas para evitar conflictos.

---


## **Guías Adicionales**

### Estilo de Código
- Sigue las convenciones de ESLint configuradas en el proyecto.
- Usa el formato de código automatizado con `Prettier`.

### Configuración de TailwindCSS
- Usa las clases utilitarias de manera consistente y elimina las no utilizadas.

### Mapas Interactivos con Leaflet
- Carga las dependencias necesarias y evita incluir imágenes o recursos que ya estén disponibles en la CDN.

---


## **Créditos**

Este proyecto es obra de **LatamCoders**, una célula de desarrollo colaborativa parte de la iniciativa **techXcellerators** de **UDD4.0**, el programa de bootcamps de la **Universidad del Desarrollo de Chile**, en colaboración con **MatterofTrust**.

### Sobre **techXcellerators**:
**techXcellerators** impulsa la transformación digital a través del desarrollo de talento en áreas tecnológicas clave, ofreciendo oportunidades reales para que estudiantes colaboren con empresas líderes en soluciones innovadoras.

---


## **Licencia**
Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

