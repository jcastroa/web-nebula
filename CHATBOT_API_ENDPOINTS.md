# Endpoints API - Configuración del Chatbot

Este documento describe los endpoints que el backend debe implementar para la configuración del chatbot.

## Base URL

```
/api/v1/chatbot
```

## Endpoints

### 1. Obtener Configuración del Chatbot

**GET** `/chatbot/configuracion`

Obtiene la configuración actual del chatbot para el consultorio del usuario autenticado.

**Respuesta exitosa (200):**
```json
{
  "negocio": {
    "nombre": "Centro Médico Salud y Vida",
    "horario": "Lunes a viernes de 8:00 a 20:00, sábados de 9:00 a 14:00",
    "telefono": "(123) 456-7890",
    "direccion": "Av. Principal 123, Colonia Centro",
    "sitioWeb": "www.saludyvida.com",
    "email": "citas@saludyvida.com"
  },
  "servicios": {
    "especialidades": [
      {
        "nombre": "Medicina General",
        "precio": "120"
      },
      {
        "nombre": "Pediatría",
        "precio": "150"
      }
    ],
    "preciosAdicionales": [
      {
        "concepto": "Primera consulta (paciente nuevo)",
        "modificador": "+S/20 sobre el precio base"
      },
      {
        "concepto": "Consulta de urgencia (mismo día)",
        "modificador": "+S/50 sobre el precio base"
      }
    ]
  },
  "politicas": {
    "protocolos": [
      "Las citas deben agendarse con al menos 24 horas de anticipación",
      "Cancelaciones deben realizarse con mínimo 12 horas de antelación",
      "Se requiere llegar 15 minutos antes de la hora programada"
    ]
  },
  "preguntasFrecuentes": [
    {
      "pregunta": "¿Aceptan seguros médicos?",
      "respuesta": "Sí, trabajamos con los principales seguros del país incluyendo Pacífico, Rimac y La Positiva."
    },
    {
      "pregunta": "¿Hacen consultas a domicilio?",
      "respuesta": "Sí, contamos con servicio a domicilio con médicos certificados. El costo adicional es de S/100."
    }
  ]
}
```

**Respuesta cuando no hay configuración (404):**
```json
{
  "detail": "No se encontró configuración para este consultorio"
}
```

**Respuesta de error (500):**
```json
{
  "detail": "Error al obtener la configuración del chatbot"
}
```

---

### 2. Guardar Configuración del Chatbot

**POST** `/chatbot/configuracion`

Guarda o actualiza la configuración del chatbot para el consultorio del usuario autenticado.

El frontend envía tanto la configuración estructurada como el prompt completo ya generado, listo para ser usado directamente o guardado en Firestore.

**Request Body:**
```json
{
  "configuracion": {
    "negocio": {
      "nombre": "Centro Médico Salud y Vida",
      "horario": "Lunes a viernes de 8:00 a 20:00, sábados de 9:00 a 14:00",
      "telefono": "(123) 456-7890",
      "direccion": "Av. Principal 123, Colonia Centro",
      "sitioWeb": "www.saludyvida.com",
      "email": "citas@saludyvida.com"
    },
    "servicios": {
      "especialidades": [
        {
          "nombre": "Medicina General",
          "precio": "120"
        }
      ],
      "preciosAdicionales": [
        {
          "concepto": "Primera consulta (paciente nuevo)",
          "modificador": "+S/20 sobre el precio base"
        }
      ]
    },
    "politicas": {
      "protocolos": [
        "Las citas deben agendarse con al menos 24 horas de anticipación"
      ]
    },
    "preguntasFrecuentes": [
      {
        "pregunta": "¿Aceptan seguros médicos?",
        "respuesta": "Sí, trabajamos con los principales seguros del país."
      }
    ]
  },
  "prompt_completo": "Eres un asistente médico virtual del centro 'Centro Médico Salud y Vida'. Tu misión es ayudar de forma clara y profesional a los pacientes.\n\n**IMPORTANTE:** Durante este flujo, **no debes sugerir ni mencionar agendar ni cancelar citas**...\n\n[Prompt completo generado automáticamente por el frontend]"
}
```

**Campos del Request:**
- `configuracion` (object, requerido): Configuración estructurada del chatbot
- `prompt_completo` (string, requerido): Prompt completo ya formateado y listo para usar

> **Nota:** El `prompt_completo` es generado automáticamente por el frontend a partir de la configuración estructurada. El backend puede guardarlo directamente en Firestore sin necesidad de regenerarlo.

**Respuesta exitosa (200 o 201):**
```json
{
  "success": true,
  "message": "Configuración guardada exitosamente",
  "data": {
    "id": 123,
    "consultorio_id": 456,
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Respuesta de error de validación (422):**
```json
{
  "detail": [
    {
      "loc": ["body", "negocio", "nombre"],
      "msg": "El nombre del negocio es requerido",
      "type": "value_error"
    }
  ]
}
```

**Respuesta de error (500):**
```json
{
  "detail": "Error al guardar la configuración del chatbot"
}
```

---

## Notas de Implementación

### Autenticación
- Todos los endpoints requieren autenticación con cookies HttpOnly
- El usuario autenticado debe tener permisos de administrador del consultorio
- La configuración se asocia automáticamente al `consultorio_id` del usuario autenticado

### Base de Datos

#### Opción 1: PostgreSQL (Configuración + Prompt)
Sugerencia de esquema para PostgreSQL:

```sql
CREATE TABLE chatbot_configuracion (
    id SERIAL PRIMARY KEY,
    consultorio_id INTEGER NOT NULL REFERENCES consultorios(id),
    configuracion JSONB NOT NULL,
    prompt_completo TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(consultorio_id)
);

-- Índice para búsquedas rápidas
CREATE INDEX idx_chatbot_config_consultorio ON chatbot_configuracion(consultorio_id);
```

#### Opción 2: Firestore (Solo Prompt)
Si el backend solo necesita guardar en Firestore el prompt completo:

```javascript
// Estructura en Firestore
{
  consultorios: {
    [consultorio_id]: {
      chatbot: {
        prompt_completo: "Eres un asistente médico virtual...",
        configuracion: { /* config estructurada opcional */ },
        updated_at: timestamp
      }
    }
  }
}
```

#### Estrategia Híbrida (Recomendada)
- **PostgreSQL**: Guardar `configuracion` (JSONB) para ediciones futuras
- **Firestore**: Guardar `prompt_completo` (string) para acceso rápido del chatbot
- Beneficio: Ediciones en interfaz + acceso optimizado para el chatbot

### Validaciones Recomendadas

#### Validaciones del Payload Principal:
1. **configuracion** (object, requerido):
   - Debe contener la estructura completa de configuración
   - Ver validaciones específicas abajo

2. **prompt_completo** (string, requerido):
   - No puede estar vacío
   - Longitud mínima: 100 caracteres
   - Longitud máxima sugerida: 10,000 caracteres

#### Validaciones de la Configuración:
1. **Negocio:**
   - `nombre`: Requerido, máximo 200 caracteres
   - `horario`: Requerido, máximo 500 caracteres
   - `telefono`: Requerido, formato de teléfono válido
   - `email`: Opcional, formato de email válido
   - `direccion`: Opcional, máximo 300 caracteres
   - `sitioWeb`: Opcional, formato de URL válido

2. **Servicios:**
   - `especialidades`: Array requerido, mínimo 1 elemento
   - Cada especialidad debe tener `nombre` y `precio` no vacíos
   - `precio`: Debe ser numérico y positivo
   - `preciosAdicionales`: Array opcional

3. **Políticas:**
   - `protocolos`: Array opcional de strings

4. **Preguntas Frecuentes:**
   - Array opcional
   - Cada item debe tener `pregunta` y `respuesta` no vacías

### Generación del Prompt
**Importante:** El frontend genera automáticamente el `prompt_completo` antes de enviarlo al backend.

**Ventajas de este enfoque:**
1. El backend **NO necesita** regenerar el prompt
2. El formato está garantizado y es consistente
3. Se puede guardar directamente en Firestore
4. Reduce lógica en el backend
5. El prompt está listo para usar inmediatamente

**Flujo:**
```
Frontend                           Backend
   |                                  |
   | 1. Usuario edita config          |
   | 2. Genera prompt_completo        |
   | 3. POST { configuracion, prompt }|
   |--------------------------------->|
   |                                  | 4. Valida
   |                                  | 5. Guarda en PostgreSQL
   |                                  | 6. Guarda prompt en Firestore
   |<---------------------------------|
   | 7. Respuesta éxito              |
```

### Seguridad
- Sanitizar todos los inputs para prevenir XSS
- Validar longitud máxima de campos de texto
- Limitar tamaño del payload (max 1MB sugerido)
- Rate limiting para prevenir abuso

### Testing
Casos de prueba recomendados:
1. Crear configuración nueva (primera vez)
   - Validar que se guarde `configuracion` y `prompt_completo`
2. Actualizar configuración existente
   - Verificar que el `prompt_completo` se actualice correctamente
3. Obtener configuración sin datos guardados (404)
4. Validación de campos requeridos del payload
   - `configuracion` es obligatorio
   - `prompt_completo` es obligatorio y no vacío
5. Validación de campos de configuración
   - Negocio: nombre, horario, teléfono obligatorios
   - Servicios: al menos 1 especialidad
6. Validación de formatos (email, teléfono, URL)
7. Permisos de acceso (solo admin del consultorio)
8. Arrays vacíos y campos opcionales
9. Longitud del `prompt_completo` (no exceder límites de Firestore)

### Ejemplo de Implementación Backend

```python
# Ejemplo en Python/FastAPI
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

router = APIRouter()

class ConfiguracionChatbot(BaseModel):
    configuracion: dict
    prompt_completo: str

@router.post("/chatbot/configuracion")
async def guardar_configuracion(
    payload: ConfiguracionChatbot,
    consultorio_id: int = Depends(get_current_consultorio_id)
):
    # 1. Validar payload
    if not payload.prompt_completo or len(payload.prompt_completo) < 100:
        raise HTTPException(400, "El prompt completo es requerido")

    # 2. Guardar en PostgreSQL (para edición futura)
    db_config = await db.chatbot_configuracion.upsert({
        "consultorio_id": consultorio_id,
        "configuracion": payload.configuracion,
        "prompt_completo": payload.prompt_completo
    })

    # 3. Guardar en Firestore (para uso del chatbot)
    firestore.collection("consultorios").document(str(consultorio_id)).set({
        "chatbot": {
            "prompt_completo": payload.prompt_completo,
            "updated_at": firestore.SERVER_TIMESTAMP
        }
    }, merge=True)

    return {
        "success": True,
        "message": "Configuración guardada exitosamente",
        "data": {"id": db_config.id}
    }
```
