## 1. Alcance del incremento


| Requisito | ¿Entra en este despliegue? (Sí / Parcial / No) | Qué incluye exactamente o por qué queda fuera |
|---  |---|---|
| RF1 |  Parcial |  Se incluye únicamente el registro de clientes base; el módulo de consulta se deja para un incremento posterior |
| RF2 |  Si |  Registro y consulta del catálogo de productos/servicios de la joyería (nombre, precio, descripción). |
| RF3 |  Si |  Creación de pedidos completa (asociar cliente, uno o más productos/servicios y fecha) |
| RF4 | No  |  No es fundamental para la base del proyecto ya que al buscar una entrega funcional eficaz nos basta con la creacion del pedido  |
| RF5 | No |  Al igual que el RF1 los listados se dejaran para un incremento posterior al no ser fundamentales en la construccion funcional de la pagina web  |
| Cambio de requisito (5 oct) | Parcial | Se trabajara unicamente con el punto a, que hace referencia a la fecha de compromiso del pedido |

---

## 2. Destino y configuración

| Elemento | Respuesta |
|---|---|
| Destino | Vercel |
| Proyecto o URL en Vercel |  equipo-4-modelo-incremental.vercel.app
  |
| Repositorio desde el que se despliega |  info3-fesc-2027-1  |
| Rama que se publica en producción |  main  |
| Comando de build (si aplica) |  npm run build  |

### Variables de entorno necesarias


| Nombre de la variable | Para qué sirve |
|---|---|
|  VITE_SUPABASE_URL  |  Direccion web del proyecto en Subabase, funciona para que Vercel sepa que datos debe usar en las funciones de clientes y catalogo  |
|  VITE_SUPABASE_ANON_KEY  |  Permite que nuestro proyecto (Funciones de Javascript y HTML) se comuniquen de manera segura con SupaBase en Vercel  |

### Servicios externos de los que depende el sistema


-  Base de Datos(SupaBase) 

---

## 3. Checklist pre-despliegue


| # | Verificación | ¿Cumple? (Sí / No) | Responsable |
|---|---|---|---|
| 1 | Asignación de tareas: Cada pareja desarrolla/tiene el codigo para su implementacion | | TODOS |
| 2 | Funciones funcionando: Se verifica la logica de las funciones de JavaScript a partir del comando npm test | | Martinez Villa Karla Gabriela |
| 3 |  Entorno configurado: La base de datos en SubaBase no presenta errores dentro de la pagina web en Vercel  | | Rodriguez Vela Michelle |
| 4 |  Revision a detalle: Se revisa que el codigo este bien escrito y funcione correctamente antes de su implementacion en main  | | Carranza Vázquez Diego Armando |
| 5 |  Implementar en main: La rama en main se encuentra actualizada, sin confictos de integracion y con todo lo necesario para el despliegue  | | Gonzalez Gutierrez Oswaldo |

---

## 4. Smoke test (verificación posdespliegue)


| # | Acción | Resultado esperado | Resultado obtenido (se llena el lunes) |
|---|---|---|---|
| 1 | Registrar un cliente nuevo en el formulario de la joyería | El cliente se guarda y aparece reflejado en el listado de la base de datos | |
| 2 |  Creacion de el catalogo  |  Se muestrea en la paginas nuestro catalogo con los diferentes productos del negocio  | |
| 3 |  Creacion del pedido  | Se registra el pedido con los productos seleccionados y el precio total calculado | |


---

## 5. Plan de reversión


**Responsable de la reversión:** [ Rodriguez Vela Michelle ]

**Señal para revertir:** [Ej.: falla cualquiera de las pruebas 1 a 3 del smoke test]

**Pasos:**

1.  Identificar el fallo critico dentro de la pagina web 
2.  Ingresar al panel de control de Vercel 
3.  Seleccionar el último despliegue estable previo y activar la opción de restaurarlo o promoverlo a producción. 

---

## 6. Despliegue según nuestro modelo


 Segun nuestro modelo de desarrollo incremental, lo correcto seria desplegar la pagina web de manera iterativa al terminar cada incremento funcional que se haya planeado, por lo que las veces que desplegara dependen de la planeacion de incrementos que se haga. El plan de despliegue es coherente debido a que se desarrolla y despliega algo funcional por partes, aunque considero que no se usara debido a que se desplegara apartir de cada cambio dentro del proyecto para asi evitar algun fallo. 

---

## Bloqueos para el lunes


- [ Ninguno ]

---

## Declaración de uso de IA


| Herramienta | Para qué la usamos | Qué verificamos nosotros |
|---|---|---|
| [ ChatGPT ] | [ Verificacion de contenido ] | [ La redaccion general del documento, el punto 2; principalmente en el comando build y las variables de entorno y los pasos para el despliegue. ] |