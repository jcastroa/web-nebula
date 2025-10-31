# API de Medios de Pago

Documentación de los endpoints necesarios para la gestión de medios de pago.

## Base URL
```
/api/v1/medios-pago
```

## Endpoints

### 1. Listar Medios de Pago

**Endpoint:** `GET /api/v1/medios-pago`

**Descripción:** Obtiene todos los medios de pago registrados.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Respuesta Exitosa (200 OK):**
```json
[
  {
    "id": 1,
    "descripcion": "Yape",
    "detalle": "Pago mediante aplicación Yape",
    "nombre_titular": "Juan Pérez García",
    "numero_cuenta": "987654321",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "descripcion": "Efectivo",
    "detalle": "Pago en efectivo al momento de la cita",
    "nombre_titular": null,
    "numero_cuenta": null,
    "created_at": "2024-01-15T10:35:00Z",
    "updated_at": "2024-01-15T10:35:00Z"
  }
]
```

**Respuesta de Error (401 Unauthorized):**
```json
{
  "detail": "No autenticado"
}
```

---

### 2. Crear Medio de Pago

**Endpoint:** `POST /api/v1/medios-pago`

**Descripción:** Crea un nuevo medio de pago.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (Request):**
```json
{
  "descripcion": "Plin",
  "detalle": "Pago mediante aplicación Plin",
  "nombre_titular": "María López Sánchez",
  "numero_cuenta": "912345678"
}
```

**Campos:**
- `descripcion` (string, requerido): Nombre del medio de pago
- `detalle` (string, requerido): Descripción general del medio de pago
- `nombre_titular` (string, opcional): Nombre del titular de la cuenta
- `numero_cuenta` (string, opcional): Número de cuenta o teléfono asociado

**Respuesta Exitosa (201 Created):**
```json
{
  "id": 3,
  "descripcion": "Plin",
  "detalle": "Pago mediante aplicación Plin",
  "nombre_titular": "María López Sánchez",
  "numero_cuenta": "912345678",
  "created_at": "2024-01-15T11:00:00Z",
  "updated_at": "2024-01-15T11:00:00Z"
}
```

**Respuesta de Error (400 Bad Request):**
```json
{
  "detail": "La descripción es requerida"
}
```

**Respuesta de Error (422 Unprocessable Entity):**
```json
{
  "detail": [
    {
      "loc": ["body", "descripcion"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

### 3. Actualizar Medio de Pago

**Endpoint:** `PUT /api/v1/medios-pago/{id}`

**Descripción:** Actualiza un medio de pago existente.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros URL:**
- `id` (integer, requerido): ID del medio de pago a actualizar

**Body (Request):**
```json
{
  "descripcion": "Transferencia Bancaria BCP",
  "detalle": "Transferencia a cuenta corriente BCP",
  "nombre_titular": "Clínica Dental Lima SAC",
  "numero_cuenta": "0011-2233-4455-6677"
}
```

**Campos:**
- `descripcion` (string, requerido): Nombre del medio de pago
- `detalle` (string, requerido): Descripción general del medio de pago
- `nombre_titular` (string, opcional): Nombre del titular de la cuenta
- `numero_cuenta` (string, opcional): Número de cuenta o teléfono asociado

**Respuesta Exitosa (200 OK):**
```json
{
  "id": 1,
  "descripcion": "Transferencia Bancaria BCP",
  "detalle": "Transferencia a cuenta corriente BCP",
  "nombre_titular": "Clínica Dental Lima SAC",
  "numero_cuenta": "0011-2233-4455-6677",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T12:00:00Z"
}
```

**Respuesta de Error (404 Not Found):**
```json
{
  "detail": "Medio de pago no encontrado"
}
```

**Respuesta de Error (400 Bad Request):**
```json
{
  "detail": "La descripción es requerida"
}
```

---

### 4. Eliminar Medio de Pago

**Endpoint:** `DELETE /api/v1/medios-pago/{id}`

**Descripción:** Elimina un medio de pago.

**Headers:**
```
Authorization: Bearer {token}
```

**Parámetros URL:**
- `id` (integer, requerido): ID del medio de pago a eliminar

**Respuesta Exitosa (200 OK):**
```json
{
  "message": "Medio de pago eliminado exitosamente",
  "id": 1
}
```

**Respuesta de Error (404 Not Found):**
```json
{
  "detail": "Medio de pago no encontrado"
}
```

**Respuesta de Error (400 Bad Request):**
```json
{
  "detail": "No se puede eliminar el medio de pago porque está asociado a pagos existentes"
}
```

---

## Modelo de Datos

### Tabla: `medios_pago`

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | INTEGER | Sí (PK) | Identificador único |
| descripcion | VARCHAR(100) | Sí | Nombre del medio de pago |
| detalle | TEXT | Sí | Descripción general |
| nombre_titular | VARCHAR(200) | No | Nombre del titular |
| numero_cuenta | VARCHAR(100) | No | Número de cuenta/teléfono |
| created_at | TIMESTAMP | Sí | Fecha de creación |
| updated_at | TIMESTAMP | Sí | Fecha de última actualización |

### Índices Sugeridos
- PRIMARY KEY (id)
- INDEX idx_descripcion (descripcion)

---

## Validaciones en el Backend

1. **descripcion**:
   - Requerido
   - Máximo 100 caracteres
   - No puede estar vacío

2. **detalle**:
   - Requerido
   - Máximo 500 caracteres
   - No puede estar vacío

3. **nombre_titular**:
   - Opcional
   - Máximo 200 caracteres

4. **numero_cuenta**:
   - Opcional
   - Máximo 100 caracteres

---

## Códigos de Error HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - No autorizado |
| 404 | Not Found - Recurso no encontrado |
| 422 | Unprocessable Entity - Error de validación |
| 500 | Internal Server Error - Error del servidor |

---

## Ejemplo de Implementación en FastAPI (Python)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas
from .database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/api/v1/medios-pago", tags=["medios-pago"])

# GET /api/v1/medios-pago
@router.get("/", response_model=List[schemas.MedioPago])
def listar_medios_pago(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    medios = db.query(models.MedioPago).all()
    return medios

# POST /api/v1/medios-pago
@router.post("/", response_model=schemas.MedioPago, status_code=201)
def crear_medio_pago(
    medio: schemas.MedioPagoCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_medio = models.MedioPago(**medio.dict())
    db.add(db_medio)
    db.commit()
    db.refresh(db_medio)
    return db_medio

# PUT /api/v1/medios-pago/{id}
@router.put("/{id}", response_model=schemas.MedioPago)
def actualizar_medio_pago(
    id: int,
    medio: schemas.MedioPagoUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_medio = db.query(models.MedioPago).filter(models.MedioPago.id == id).first()
    if not db_medio:
        raise HTTPException(status_code=404, detail="Medio de pago no encontrado")

    for key, value in medio.dict(exclude_unset=True).items():
        setattr(db_medio, key, value)

    db.commit()
    db.refresh(db_medio)
    return db_medio

# DELETE /api/v1/medios-pago/{id}
@router.delete("/{id}")
def eliminar_medio_pago(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_medio = db.query(models.MedioPago).filter(models.MedioPago.id == id).first()
    if not db_medio:
        raise HTTPException(status_code=404, detail="Medio de pago no encontrado")

    db.delete(db_medio)
    db.commit()
    return {"message": "Medio de pago eliminado exitosamente", "id": id}
```

### Schemas (Pydantic)

```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MedioPagoBase(BaseModel):
    descripcion: str
    detalle: str
    nombre_titular: Optional[str] = None
    numero_cuenta: Optional[str] = None

class MedioPagoCreate(MedioPagoBase):
    pass

class MedioPagoUpdate(MedioPagoBase):
    pass

class MedioPago(MedioPagoBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
```

### Model (SQLAlchemy)

```python
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from .database import Base

class MedioPago(Base):
    __tablename__ = "medios_pago"

    id = Column(Integer, primary_key=True, index=True)
    descripcion = Column(String(100), nullable=False)
    detalle = Column(Text, nullable=False)
    nombre_titular = Column(String(200), nullable=True)
    numero_cuenta = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

---

## Notas Adicionales

1. **Autenticación:** Todos los endpoints requieren autenticación mediante token JWT o cookie HttpOnly.

2. **Autorización:** Verificar que el usuario tenga permisos para gestionar medios de pago.

3. **Validación:** El backend debe validar que los campos requeridos no estén vacíos.

4. **Relaciones:** Si un medio de pago está asociado a pagos existentes, considerar implementar soft delete o restricción de eliminación.

5. **Paginación:** Para el endpoint de listado, considerar implementar paginación si hay muchos registros.

6. **Búsqueda:** Considerar agregar endpoint de búsqueda por descripción:
   ```
   GET /api/v1/medios-pago/search?q={término}
   ```
