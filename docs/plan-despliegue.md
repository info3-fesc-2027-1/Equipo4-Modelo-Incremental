# Plan de despliegue del incremento

**Informática III · Grupo 1301 · Ciclo 2027-1**
**Tema:** 3.5 Fase de Despliegue
**Entrega:** domingo 8 de noviembre de 2026, 22:00, con el enlace al commit en Classroom

| Dato | Respuesta |
|---|---|
| Equipo (número) | Equipo 4|
| Modelo asignado |modelo incremental |
| Integrantes | Diego Armando Carranza Vázquez, Karla Gabriela Matinez Villa, Oswaldo Gonzalez Gurierrez, Luis Omar Mercado Chavez, Michelle Rodriguez Vela |
| Contexto de negocio de nuestro sistema | Aplicación web de comercio electrónico y gestión para **Joyería Posa**, enfocada en el catálogo de productos, carrito de compras, filtrado por categorías de joyería y pruebas automatizadas con Jest. |

---

## 1. Alcance del incremento

| Requisito | ¿Entra en este despliegue? (Sí / Parcial / No) | Qué incluye exactamente o por qué queda fuera |
|---|---|---|
| RF1 | Sí | Catálogo interactivo de joyas de Joyería Posa con renderizado dinámico desde JavaScript. |
| RF2 | Sí | Sistema de carrito de compras y cálculo de subtotales en la interfaz. |
| RF3 | Sí | Estilos visuales responsivos implementados con Tailwind CSS. |
| RF4 | Sí | Pruebas unitarias y de integración utilizando Jest. |
| RF5 | No | Módulo de panel de administración avanzado (queda para el siguiente sprint). |
| Cambio de requisito (5 oct) | Sí | Ajuste en la visualización de los detalles de los productos y validaciones de stock solicitados en la fecha indicada. |

---

## 2. Destino y configuración

| Elemento | Respuesta |
|---|---|
| Destino | Vercel |
| Proyecto o URL en Vercel | joyeria-posa.vercel.app |
| Repositorio desde el que se despliega | GitHub - Joyeria-Posa (Equipo Chispitas) |
| Rama que se publica en producción | `main` |
| Comando de build (si aplica) | `npm run build` |

### Variables de entorno necesarias

| Nombre de la variable | Para qué sirve |
|---|---|
| Ninguna | El proyecto es una SPA basada en archivos estáticos (HTML, Tailwind CSS y JS en cliente), por lo que no requiere variables de entorno en Vercel para este incremento. |

### Servicios externos de los que depende el sistema

- Ninguno (alojamiento estático puro en Vercel).

---

## 3. Checklist pre-despliegue

| # | Verificación | ¿Cumple? (Sí / No) | Responsable |
|---|---|---|---|
| 1 | El proyecto compila y pasa todas las pruebas unitarias con Jest sin errores. | Sí | Diego Carranza |
| 2 | Los estilos de Tailwind CSS cargan correctamente en local sin clases rotas. | Sí | Equipo Chispitas |
| 3 | Los enlaces e imágenes del catálogo de Joyería Posa funcionan y cargan bien. | Sí | Equipo Chispitas |
| 4 | El repositorio en GitHub está actualizado y limpio en la rama `main`. | Sí | Diego Carranza |
| 5 | El archivo `docs/plan-despliegue.md` está creado y guardado correctamente. | Sí | Diego Carranza |

---

## 4. Smoke test (verificación posdespliegue)

| # | Acción | Resultado esperado | Resultado obtenido (se llena el lunes) |
|---|---|---|---|
| 1 | Abrir la URL de despliegue en Vercel. | La página principal de Joyería Posa carga en menos de 2 segundos. | [Se llena el lunes] |
| 2 | Navegar por las categorías del catálogo. | Se muestran los productos correspondientes sin errores en consola. | [Se llena el lunes] |
| 3 | Agregar un producto al carrito de compras. | El contador del carrito se actualiza correctamente. | [Se llena el lunes] |
| 4 | Comprobar la adaptabilidad visual en móvil/PC. | El diseño con Tailwind CSS se ajusta de forma fluida. | [Se llena el lunes] |

---

## 5. Plan de reversión

**Responsable de la reversión:** Diego Carranza / Equipo Chispitas

**Señal para revertir:** Falla crítica en la carga de la interfaz de usuario o errores fatales en la consola del navegador al intentar interactuar con el catálogo o el carrito tras el despliegue en Vercel.

**Pasos:**

1. Ingresar al panel de control de Vercel en el proyecto de Joyería Posa.
2. Ir a la sección de **Deployments**, ubicar el despliegue anterior inmediato que funcionaba de manera estable.
3. Hacer clic en los tres puntos del despliegue anterior y seleccionar **Rollback** (o volver a desplegar la versión estable previa desde el historial de commits de GitHub).

---

## 6. Despliegue según nuestro modelo

Bajo el modelo de desarrollo ágil y Scrum aplicado en nuestro equipo para el proyecto de Joyería Posa, los despliegues deben realizarse de manera iterativa al final de cada ciclo de sprint o cada vez que se consolida un incremento funcional validado en la rama principal. Esto permite asegurar que las nuevas características del catálogo y las pruebas con Jest lleguen a producción de forma controlada y continua. Nuestro plan real es totalmente coherente con este enfoque, ya que automatizamos la publicación a través de la integración directa con Vercel cada vez que hacemos un merge validado a la rama de producción, garantizando entregas frecuentes y de alta calidad para el usuario final.

---

## Bloqueos para el lunes

- Ninguno.

---

## Declaración de uso de IA

| Herramienta | Para qué la usamos | Qué verificamos nosotros |
|---|---|---|
| Gemini | Apoyo en la estructuración y redacción del plan de despliegue en formato Markdown siguiendo la plantilla institucional. | Verificamos que los datos del proyecto, los requisitos de Joyería Posa, las pruebas de Jest y la configuración de Vercel correspondieran exactamente a lo desarrollado por el equipo. |