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

**Request Body:**
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
}
```

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
Sugerencia de esquema:

```sql
CREATE TABLE chatbot_configuracion (
    id SERIAL PRIMARY KEY,
    consultorio_id INTEGER NOT NULL REFERENCES consultorios(id),
    configuracion JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(consultorio_id)
);

-- Índice para búsquedas rápidas
CREATE INDEX idx_chatbot_config_consultorio ON chatbot_configuracion(consultorio_id);
```

### Validaciones Recomendadas
1. **Negocio:**
   - `nombre`: Requerido, máximo 200 caracteres
   - `telefono`: Opcional, formato de teléfono válido
   - `email`: Opcional, formato de email válido
   - `sitioWeb`: Opcional, formato de URL válido

2. **Servicios:**
   - `especialidades`: Array opcional, cada item debe tener `nombre` y `precio`
   - `precio`: Debe ser numérico y positivo
   - `preciosAdicionales`: Array opcional

3. **Políticas:**
   - `protocolos`: Array opcional de strings

4. **Preguntas Frecuentes:**
   - Array opcional
   - Cada item debe tener `pregunta` y `respuesta` no vacías

### Generación del Prompt
El frontend incluye métodos para generar el prompt completo del chatbot a partir de la configuración estructurada. El backend puede:
- Guardar solo la configuración estructurada (JSON)
- O también generar y guardar el prompt formateado para uso directo

### Seguridad
- Sanitizar todos los inputs para prevenir XSS
- Validar longitud máxima de campos de texto
- Limitar tamaño del payload (max 1MB sugerido)
- Rate limiting para prevenir abuso

### Testing
Casos de prueba recomendados:
1. Crear configuración nueva (primera vez)
2. Actualizar configuración existente
3. Obtener configuración sin datos guardados (404)
4. Validación de campos requeridos
5. Validación de formatos (email, teléfono, URL)
6. Permisos de acceso (solo admin del consultorio)
7. Arrays vacíos y campos opcionales
