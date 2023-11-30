# Internado-PSlll
link del docker (entregado por Rodrigo Ancalle(subido a la tarea))
https://hub.docker.com/repository/docker/rodrigoanc69/internadodocker/general?classId=be18d407-78ba-4f50-aaf5-e494eb052dc2&assignmentId=9d5b869c-3d35-4cd8-8ec3-e2b1f0073892&submissionId=cb636808-cca4-65e2-7257-664474083497



    Manual Técnico 

INTERNADO(INTERVALLE) 

 

Introducción: 

Este proyecto desarrolla una aplicación web y móvil diseñada para mejorar la interacción entre doctores e internos en un entorno hospitalario. La aplicación facilita la asignación de tareas y fechas por parte de los doctores a los internos, quienes a su vez reciben y gestionan estas tareas. 

Descripción del proyecto: 

La aplicación incluye una funcionalidad de mapa para ubicar puntos de interés en los hospitales. Proporciona una plataforma interactiva y fácil de usar que permite a los doctores y estudiantes de medicina colaborar de manera efectiva, asegurando una gestión eficiente de tareas y responsabilidades dentro del entorno hospitalario. 

Roles / integrantes 

Santiago Ruben Jaldin Perez => Team Leader 

Nayghel Saul Soliz Garcia => Arquitecto de Base de Datos 

Adriana Estefani Farfan Llanos => QA 

Rodrigo Abel Ancalle Carrillo => Git Master 

 

Arquitectura del software:  

 

La aplicación se basa en React.js para la interfaz web y React Native para la aplicación móvil, proporcionando una experiencia de usuario coherente en ambas plataformas. La comunicación entre el frontend y el backend se maneja a través de APIs RESTful, con una base de datos relacional para almacenar los datos de los usuarios, tareas y hospitales 

Requisitos del sistema: 

Requerimientos de Hardware (Cliente) 

Procesador: Intel Core i3 o equivalente. 

Memoria RAM: 4 GB. 

Espacio en Disco Duro: 500 GB (HDD). 

Tarjeta Gráfica: Integrada, compatible con gráficos básicos. 

Conexión a Internet: Banda ancha con al menos 10 Mbps de velocidad de descarga. 

Requerimientos de Software (Cliente) 

Sistema Operativo: Windows 7 o superior, MacOS X 10.11 o superior, Linux (distribuciones modernas como Ubuntu 18.04 o superior). 

Navegadores Web: Últimas versiones de Google Chrome, Mozilla Firefox, Safari o Microsoft Edge. 

Otros: Software de cliente de correo electrónico (si es necesario para notificaciones), lector de PDF para documentación. 

Requerimientos de Hardware (Servidor/Hosting/BD) 

Procesador: Intel Xeon o equivalente, mínimo 4 núcleos. 

Memoria RAM: 8 GB. 

Espacio en Disco Duro: 1 TB SSD para mejor rendimiento. 

Conexión a Internet: Conexión dedicada con al menos 100 Mbps de velocidad de descarga y subida. 

Requerimientos de Software (Servidor/Hosting/BD) 

Firebase: Como backend y base de datos, no requiere hardware específico ya que es una solución completamente gestionada en la nube. 

Sistema Operativo del Servidor: Dependiendo de la configuración, generalmente no aplica ya que Firebase es una solución en la nube. 

 

Instalación y configuración:  

La instalación requiere clonar el repositorio del proyecto, instalar las dependencias mediante npm o yarn, y configurar las variables de entorno necesarias. Para la versión móvil, se utiliza Expo Go para la visualización y prueba en dispositivos móviles. 

 

 

PROCEDIMIENTO DE HOSTEADO / HOSTING (configuración) 

Sitio Web. - Por parte del Administrador manejado en una plataforma web, no se lo tiene “levantado” en un Servicio de Hosting, sino que más bien se ejecuta de manera local utilizando las herramientas de Node.js, agregando que ya se explicó su puesta en marcha en el apartado de la instalación. 

B.D.- La Base de Datos se encuentra alojada en una Instancia de Servicio de Base de Datos que provee el grupo “PocketBase” llamado PocketHost. Se maneja como una Base de Datos No Relacional mermada parcialmente un poco en su uso como si fuera una Base de Datos Relacional.  
El equipo de desarrollo utilizó la documentación misma que provee “PocketBase” para poder realizar las transacciones y consultas apropiadas al contexto del proyecto, simplemente haciendo referencia a la instancia con la sintaxis de javascript: 
import PocketBase from 'pocketbase';  

const pb = new PocketBase('https://intervalle-instance.pockethost.io');  
 

API / servicios Web. - Para poder acceder a PocketHost, el “Servicio”/”API GRATUITO” que consume nuestro proyecto, debe ingresar a su página web: 
https://app.pockethost.io/ 
Aquí debe ingresar con las siguientes credenciales: 
email.- jaldinsantiago1331@gmail.com 
password.- Sjp_13092003 
 
Al acceder se le mostrará el Dashboard principal que contiene todas las instancias activas, busque nuestra instancia “Intervalle” y como se dará cuenta aparecerán 2 botones: 
details.- muestra un detalle general de la instancia como logs, una tabla de uso, un pequeño bloque de código de muestra de uso, el modo de mantenimiento, etc. 
Admin.- Esta es la estrella del Servicio, acá se nos abrirá una nueva ventana en la que deberemos de ingresar las mismas credenciales que usamos para acceder a PocketHost, solo que aquí se maneja nuestra Base de Datos; podremos visualizar las diferentes tablas que creamos, los Logs totales de la Base de Datos, las configuraciones varias que tiene como el servicio de correos o la autenticación de terceros. 

 

GIT :  https://github.com/RodrigoAnc69/Internado-PSlll 

Versión final entregada del proyecto. 

Entrega compilados ejecutables 

 

Personalización y configuración:  
 
Boton de Cambio de Tema a Modo Oscuro, en forma de Luna 
 
 
Diferentes Opciones de Visualización en las Tablas de Datos, según lo requiera el cliente 
 
Debido a la Naturaleza del Manejo de Datos Auditables, Presentamos la Posibilidad de Exportar los Datos (Previamente Seleccionadas las Columnas que se desean exportar) de la tabla de Datos a un archivo .csv o directamente poder imprimirlos. 
 

 

Seguridad:  

 

Los datos de usuario están validados y encriptados para garantizar su seguridad. Se implementan prácticas estándar de autenticación y autorización para proteger contra accesos no autorizados y posibles vulnerabilidades. 

 

Depuración y solución de problemas: Instrucciones sobre cómo identificar y solucionar problemas comunes, mensajes de error y posibles conflictos con otros sistemas o componentes. 

 

Glosario de términos:  

 

 

React Native: 

 

Marco de Desarrollo Móvil Multiplataforma. 

Plataforma de Aplicaciones Nativas Híbridas. 

React.js: 

 

Biblioteca JavaScript para Interfaces de Usuario. 

Herramienta de Desarrollo Frontend. 

API RESTful: 

 

Interfaz de Programación de Aplicaciones Representational State Transfer. 

Protocolo de Comunicación Web basado en HTTP para Servicios Web. 

Expo Go: 

 

Plataforma de Desarrollo y Prueba para React Native. 

Entorno de Simulación para Aplicaciones Móviles. 

Autenticación: 

 

Verificación de Identidad. 

Proceso de Validación de Credenciales. 

Encriptación: 

 

Cifrado de Datos. 

Codificación de Información para Seguridad. 

Base de datos relacional: 

 

Sistema de Gestión de Bases de Datos basado en el Modelo Relacional. 

Almacenamiento de Datos Estructurados en Tablas. 

Bibliografía y Referencias 

 

 

Referencias y recursos adicionales: Enlaces o referencias a otros recursos útiles, como documentación técnica relacionada, tutoriales o foros de soporte. 

 

Herramientas de Implementación: 

Lenguajes de programación: 

Frameworks: 

APIs de terceros, etc. 

 

Bibliografía 

 

https://app.pockethost.io/ 
https://firebase.google.com/?gad_source=1&gclid=CjwKCAiAsIGrBhAAEiwAEzMlC44A7LzETjpICcpKE4NCJzG59Pxl1Kwhj4woAXrIUcH10n31YuVmjRoC7KoQAvD_BwE&gclsrc=aw.ds&hl=es-419 

 




link del manual de usuario 
https://univalleedu-my.sharepoint.com/:w:/g/personal/fla0030171_est_univalle_edu/ETkxQ1_nWGNFrceXEJYxPHkBvlrsxaSg7aNkuJLgK2A5FQ?e=ZJh3s3
