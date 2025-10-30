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

#### Estrategia Híbrida: MariaDB + Firestore (REQUERIDA)

El sistema utiliza una estrategia de doble persistencia para garantizar:
- **MariaDB**: Almacenamiento principal con configuración completa para ediciones
- **Firestore**: Colección `conocimiento_gpt` con prompt optimizado para acceso rápido del chatbot

**IMPORTANTE:**
- **Escritura (POST)**: Inserta en AMBAS bases de datos usando transacciones
- **Lectura (GET)**: Lee SOLO de MariaDB
- **Consistencia**: Si falla una inserción, se hace ROLLBACK de todo

#### Esquema MariaDB

Tabla `chatbot_configuracion`:

```sql
CREATE TABLE chatbot_configuracion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    negocio_id INT NOT NULL,
    configuracion JSON NOT NULL,
    prompt_completo TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY idx_negocio_id (negocio_id),
    FOREIGN KEY (negocio_id) REFERENCES consultorios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índice para búsquedas rápidas por negocio
CREATE INDEX idx_chatbot_negocio ON chatbot_configuracion(negocio_id);

-- Índice para consultas por fecha
CREATE INDEX idx_chatbot_updated ON chatbot_configuracion(updated_at);
```

**Notas del esquema:**
- `negocio_id`: Referencia al consultorio/negocio (equivalente a consultorio_id)
- `configuracion`: JSON con la estructura completa enviada por el frontend
- `prompt_completo`: Texto completo del prompt generado por el frontend
- `UNIQUE KEY`: Garantiza un solo registro por negocio
- `ON UPDATE CURRENT_TIMESTAMP`: Actualiza automáticamente la fecha de modificación
- `ENGINE=InnoDB`: Soporta transacciones con ROLLBACK
- `utf8mb4`: Soporta emojis y caracteres especiales

#### Esquema Firestore

Colección: `conocimiento_gpt`

```javascript
// Collection: conocimiento_gpt
// Document ID: {negocio_id} (ej: "123", "456")

{
  negocio_id: 123,                                    // INT - ID del negocio/consultorio
  prompt_completo: "Eres un asistente médico...",    // STRING - Prompt completo para el chatbot
  updated_at: Timestamp                               // TIMESTAMP - Fecha de última actualización
}
```

**Ejemplo de documento:**
```javascript
// Documento: conocimiento_gpt/123
{
  negocio_id: 123,
  prompt_completo: "Eres un asistente médico virtual del centro 'Centro Médico Salud y Vida'...",
  updated_at: Timestamp(2024, 1, 15, 10, 30, 0)
}
```

**Estructura de acceso:**
```javascript
// Acceso directo por negocio_id
const docRef = firestore.collection('conocimiento_gpt').doc(negocio_id.toString());
```

**Beneficios de esta estructura:**
1. **Acceso directo**: El chatbot puede obtener el prompt usando solo el negocio_id
2. **Rendimiento**: Sin necesidad de queries complejos, acceso O(1)
3. **Escalabilidad**: Cada negocio es un documento independiente
4. **Simplicidad**: Solo los datos necesarios para el chatbot (negocio_id + prompt)

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
Frontend                                    Backend                           Bases de Datos
   |                                           |                                     |
   | 1. Usuario edita config                   |                                     |
   | 2. Genera prompt_completo                 |                                     |
   | 3. POST { configuracion, prompt }         |                                     |
   |------------------------------------------>|                                     |
   |                                           | 4. Valida payload                   |
   |                                           | 5. START TRANSACTION                |
   |                                           |------------------------------------>|
   |                                           |                          MariaDB:  |
   |                                           | 6. UPSERT chatbot_configuracion     |
   |                                           |------------------------------------>|
   |                                           |<------------------------------------|
   |                                           |              negocio_id retornado   |
   |                                           |                                     |
   |                                           | 7. Firestore: set conocimiento_gpt  |
   |                                           |------------------------------------>|
   |                                           |                          Firestore:|
   |                                           |              doc {negocio_id, ...}  |
   |                                           |<------------------------------------|
   |                                           |                                     |
   |                                           | 8. COMMIT (ambos OK)                |
   |                                           |------------------------------------>|
   |<------------------------------------------|                                     |
   | 9. Respuesta éxito                        |                                     |


Si falla en paso 7 (Firestore):
   |                                           | 7. Error Firestore ❌              |
   |                                           | 8. ROLLBACK MariaDB                 |
   |                                           |------------------------------------>|
   |                                           |           (se deshace INSERT)       |
   |<------------------------------------------|                                     |
   | 9. Error 500                              |                                     |
```

### Seguridad
- Sanitizar todos los inputs para prevenir XSS
- Validar longitud máxima de campos de texto
- Limitar tamaño del payload (max 1MB sugerido)
- Rate limiting para prevenir abuso

### Testing

#### Casos de Prueba Funcionales

1. **Crear configuración nueva (INSERT)**
   - POST con datos válidos
   - Verificar que se cree registro en MariaDB
   - Verificar que se cree documento en Firestore `conocimiento_gpt/{negocio_id}`
   - Validar que ambos tengan los mismos datos
   - Respuesta debe incluir `id`, `negocio_id` y `updated_at`

2. **Actualizar configuración existente (UPDATE)**
   - POST con `negocio_id` que ya existe
   - Verificar que se actualice (no duplique) en MariaDB
   - Verificar que se actualice en Firestore
   - Validar que `updated_at` se actualice en ambas bases

3. **GET: Obtener configuración existente**
   - Verificar que retorne todos los campos correctamente
   - Validar que el JSON de `configuracion` se parsee correctamente
   - Verificar que NO consulte Firestore (solo MariaDB)

4. **GET: Configuración no existente (404)**
   - Solicitar con `negocio_id` que no existe
   - Debe retornar 404 con mensaje descriptivo

#### Casos de Prueba de Validación

5. **Validación de payload - campos requeridos**
   - POST sin `configuracion` → Error 400
   - POST sin `prompt_completo` → Error 400
   - POST con `prompt_completo` < 100 caracteres → Error 400

6. **Validación de configuración estructurada**
   - `negocio.nombre` vacío → Error 422
   - `negocio.horario` vacío → Error 422
   - `negocio.telefono` vacío → Error 422
   - `servicios.especialidades` array vacío → Error 422
   - Especialidad sin `nombre` o `precio` → Error 422

7. **Validación de formatos**
   - Email inválido en `negocio.email` → Error 422
   - URL inválida en `negocio.sitioWeb` → Error 422
   - Teléfono inválido → Error 422

#### Casos de Prueba de Transacciones

8. **Rollback: Fallo en Firestore después de MariaDB exitoso**
   - Simular error en Firestore (permisos, red, etc.)
   - Verificar que MariaDB haga ROLLBACK
   - Confirmar que NO quede registro en MariaDB
   - Confirmar que NO quede documento en Firestore
   - Debe retornar error 500 con detalle del fallo

9. **Rollback: Error en MariaDB**
   - Simular error en MariaDB (constraint violation, etc.)
   - Verificar que NO se inserte en Firestore
   - Debe retornar error 500

10. **Consistencia de datos entre bases**
    - Guardar configuración exitosamente
    - Leer de MariaDB y de Firestore por separado
    - Verificar que `prompt_completo` sea idéntico en ambas
    - Verificar que `negocio_id` coincida
    - Verificar que `updated_at` sea similar (tolerancia de segundos)

#### Casos de Prueba de Seguridad

11. **Autenticación requerida**
    - Request sin cookies de autenticación → Error 401
    - Request con token expirado → Error 401

12. **Autorización por negocio**
    - Usuario intenta acceder a configuración de otro negocio → Error 403
    - Solo admin del negocio puede modificar configuración

13. **SQL Injection y XSS**
    - Intentar inyectar SQL en campos de texto
    - Intentar inyectar scripts en `prompt_completo`
    - Verificar que se saniticen correctamente

14. **Rate Limiting**
    - Múltiples requests rápidos desde misma IP
    - Debe aplicar rate limiting después de N requests

#### Casos de Prueba de Performance

15. **Tiempo de respuesta aceptable**
    - POST debe completar en < 2 segundos
    - GET debe completar en < 500ms

16. **Payload grande**
    - POST con `prompt_completo` de ~8000 caracteres (válido)
    - POST con payload > 1MB → Error 413 (Request Entity Too Large)

#### Herramientas de Testing Sugeridas

```python
# Ejemplo de test con pytest
import pytest
from unittest.mock import patch

@pytest.mark.asyncio
async def test_rollback_on_firestore_failure():
    """Verifica que se haga rollback si Firestore falla"""

    # Arrange
    payload = {
        "configuracion": {...},
        "prompt_completo": "..." * 100
    }

    # Simular fallo en Firestore
    with patch('firestore.collection') as mock_firestore:
        mock_firestore.side_effect = Exception("Firestore connection failed")

        # Act
        response = await client.post("/chatbot/configuracion", json=payload)

        # Assert
        assert response.status_code == 500
        assert "Firestore" in response.json()["detail"]

        # Verificar que NO quedó registro en MariaDB
        result = await db.execute(
            "SELECT COUNT(*) as count FROM chatbot_configuracion WHERE negocio_id = %s",
            (test_negocio_id,)
        )
        assert result.fetchone()['count'] == 0
```

### Ejemplo de Implementación Backend

```python
# Ejemplo en Python/FastAPI con transacciones
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import json
from datetime import datetime

router = APIRouter()

class ConfiguracionChatbot(BaseModel):
    configuracion: dict
    prompt_completo: str

@router.post("/chatbot/configuracion")
async def guardar_configuracion(
    payload: ConfiguracionChatbot,
    negocio_id: int = Depends(get_current_negocio_id)
):
    """
    Guarda la configuración del chatbot en MariaDB y Firestore.
    Usa transacciones para garantizar consistencia entre ambas bases.
    """

    # 1. Validar payload
    if not payload.prompt_completo or len(payload.prompt_completo) < 100:
        raise HTTPException(400, "El prompt completo es requerido")

    if not payload.configuracion:
        raise HTTPException(400, "La configuración es requerida")

    # 2. Iniciar transacción en MariaDB
    conn = await get_db_connection()
    try:
        await conn.begin()

        # 3. UPSERT en MariaDB (INSERT o UPDATE si ya existe)
        query = """
            INSERT INTO chatbot_configuracion
                (negocio_id, configuracion, prompt_completo, created_at, updated_at)
            VALUES (%s, %s, %s, NOW(), NOW())
            ON DUPLICATE KEY UPDATE
                configuracion = VALUES(configuracion),
                prompt_completo = VALUES(prompt_completo),
                updated_at = NOW()
        """

        await conn.execute(
            query,
            (
                negocio_id,
                json.dumps(payload.configuracion, ensure_ascii=False),
                payload.prompt_completo
            )
        )

        # Obtener el ID del registro (ya sea el insertado o el existente)
        result = await conn.execute(
            "SELECT id, updated_at FROM chatbot_configuracion WHERE negocio_id = %s",
            (negocio_id,)
        )
        row = await result.fetchone()
        config_id = row['id']
        updated_at = row['updated_at']

        # 4. Guardar en Firestore colección 'conocimiento_gpt'
        try:
            firestore_db = get_firestore_client()
            doc_ref = firestore_db.collection('conocimiento_gpt').document(str(negocio_id))

            doc_ref.set({
                'negocio_id': negocio_id,
                'prompt_completo': payload.prompt_completo,
                'updated_at': firestore.SERVER_TIMESTAMP
            })

        except Exception as firestore_error:
            # Si falla Firestore, hacer ROLLBACK de MariaDB
            await conn.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Error al guardar en Firestore: {str(firestore_error)}"
            )

        # 5. Si ambas operaciones fueron exitosas, hacer COMMIT
        await conn.commit()

        return {
            "success": True,
            "message": "Configuración guardada exitosamente",
            "data": {
                "id": config_id,
                "negocio_id": negocio_id,
                "updated_at": updated_at.isoformat()
            }
        }

    except HTTPException:
        # Re-lanzar HTTPException sin modificar
        raise
    except Exception as e:
        # Cualquier otro error, hacer ROLLBACK
        await conn.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al guardar la configuración: {str(e)}"
        )
    finally:
        await conn.close()


@router.get("/chatbot/configuracion")
async def obtener_configuracion(
    negocio_id: int = Depends(get_current_negocio_id)
):
    """
    Obtiene la configuración del chatbot SOLO de MariaDB.
    No consulta Firestore.
    """
    try:
        conn = await get_db_connection()

        query = """
            SELECT
                id,
                negocio_id,
                configuracion,
                prompt_completo,
                created_at,
                updated_at
            FROM chatbot_configuracion
            WHERE negocio_id = %s
        """

        result = await conn.execute(query, (negocio_id,))
        row = await result.fetchone()

        if not row:
            raise HTTPException(
                status_code=404,
                detail="No se encontró configuración para este consultorio"
            )

        # Parsear el JSON de configuración
        configuracion = json.loads(row['configuracion'])

        return {
            "id": row['id'],
            "negocio_id": row['negocio_id'],
            "configuracion": configuracion,
            "prompt_completo": row['prompt_completo'],
            "created_at": row['created_at'].isoformat(),
            "updated_at": row['updated_at'].isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener la configuración: {str(e)}"
        )
    finally:
        await conn.close()
```

**Notas importantes del código:**

1. **Transacciones**: Se usa `BEGIN` → `COMMIT` / `ROLLBACK` para garantizar consistencia
2. **UPSERT**: `ON DUPLICATE KEY UPDATE` permite crear o actualizar en una sola operación
3. **Orden de operaciones**:
   - Primero MariaDB (dentro de transacción)
   - Luego Firestore
   - Si Firestore falla → ROLLBACK de MariaDB
4. **GET endpoint**: Lee SOLO de MariaDB, nunca de Firestore
5. **Manejo de errores**: Captura excepciones y hace rollback apropiadamente
6. **Firestore document ID**: Usa `negocio_id` como ID del documento para acceso directo
