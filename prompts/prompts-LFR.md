Vamos a trabajar en una nueva funcionalidad de  frontend de una aplicación React de un Sistema de Gestión de Candidatos. Analiza el código existente en @frontend/src para detectar los patrones y buenas practicas que sigue el proyecto. Solo quiero que ls identifiques; no modifiques código.


Si crea una checlist sencilla con estas reglas; esta checklist servira como contexto y como auditoria para la nueva funcionalidad

Parece que el codigo actual usa fecth y services; vamos a queddarnos con una única forma de invocar al back; dime cual crees más conveniente

PLAN:
Vamos a implementar la funcionalidad de "Ver proceso" de @frontend/src/components/Positions.tsxEl comportamiento debe ser: Al pular en el botón se debe acceder a una nueva interfaz position que cumpla: Debe mostrar el título de la posición en la parte superior, para dar contexto
Con una flecha a la izquierda del título que permita volver al listado de posiciones
Deben mostrarse tantas columnas como fases haya en el proceso; en formato kanban (similar a la imagen adjunta)
La tarjeta de cada candidato/a debe situarse en la fase correspondiente, y debe mostrar su nombre completo y su puntuación media
Debe mostrarse adecuadamente en móvil. Ten en cuenta que para la implementación se deben seguir las reglas de  @prompts/frontend-checklist.md

Respecto al punto 3 no vamos a usar Mock sino que vamos a ejecutar el seed.ts del proyecto backend


PLAN GENERADO
Nº	Descripción	
0   Datos: seed (prisma generate, migrate, seed.ts)
1   Backend: GET /position (listado de posiciones)
2   Frontend: apiClient.js + positionService.js con fetch (getPositions, getInterviewFlow, getCandidatesByPosition)
3   Frontend: Positions.tsx sin mock, carga desde API, loading/error
4   Frontend: PositionProcess.tsx + CandidateKanbanCard.tsx (Kanban)
5   Ruta en App.js: /positions/:positionId/process + enlace "Ver proceso"
6    Prueba manual (listado, Kanban, back, móvil)


Vamos a implementar el plan; ejecuta el primer punto; si tienes alguna duda preguntame; no pases al siguiente hasta que hayamos confirmado que el primero está correcto

te has saltado el punto 0.

Por qué hs implementado en el backend /position, ¿No estaba en el back?

r cambiar esto. Puedes cambiar SOLO el que en lugar de un mock se cargue la información del nuevo endpoint 



Antes de pasar al siguiente punto, revisa que el código que hemos generado en fronted cumple con  @prompts/frontend-checklist.md 

Hay errores de compilación ERROR in src/components/Positions.tsx:132:45
TS2322: Type 'ForwardRefExoticComponent<LinkPro


Hazme un plan para añadir test a los archivos modificados. Solo quiero los test esenciales, aquellos que aportan más valor

Vamos a implementar una mejora en lel tablero Kanban del proceso; las tarjetas de los candidatos se deben poder mover de un stage a otro de forma sencilla para el usurio; el movimiento debe ser suave. Cuando se deje la tarjeta en un stage diferente se debe invocar a PUT /candidates/:id/stage para que se registre el cambio en BD. Sigue las buenas practicas de @prompts/frontend-checklist.md Si tienes alguna duda preguntame antes de empezar. 

revisa que el codigo cumple con @prompts/frontend-checklist.md 
