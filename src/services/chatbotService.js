class ChatbotService {
    constructor() {
        this.storageKey = 'chatbot-config';
    }

    /**
     * Obtiene la configuración del chatbot
     * En producción, esto sería una llamada a la API
     */
    async obtenerConfiguracion() {
        try {
            // Simular delay de API
            await this.delay(300);

            const data = localStorage.getItem(this.storageKey);
            if (data) {
                return JSON.parse(data);
            }

            // Retornar configuración por defecto
            return this.getConfiguracionDefault();
        } catch (error) {
            console.error('Error al obtener configuración:', error);
            throw error;
        }
    }

    /**
     * Guarda la configuración del chatbot
     * En producción, esto sería una llamada POST/PUT a la API
     */
    async guardarConfiguracion(config) {
        try {
            // Simular delay de API
            await this.delay(500);

            localStorage.setItem(this.storageKey, JSON.stringify(config));

            return {
                success: true,
                message: 'Configuración guardada exitosamente'
            };
        } catch (error) {
            console.error('Error al guardar configuración:', error);
            throw error;
        }
    }

    /**
     * Genera el prompt completo del chatbot a partir de las secciones
     */
    generarPromptCompleto(config) {
        const {
            negocio,
            servicios,
            preguntasFrecuentes,
            politicas
        } = config;

        let prompt = `Eres un asistente médico virtual del centro '${negocio.nombre}'. Tu misión es ayudar de forma clara y profesional a los pacientes.

**IMPORTANTE:** Durante este flujo, **no debes sugerir ni mencionar agendar ni cancelar citas**. El usuario está en un proceso de consulta y búsqueda de información sobre el consultorio y sus servicios. Solo responde sobre la información general del consultorio, servicios, especialidades, precios, protocolos, etc.

**No debes terminar ninguna respuesta con una pregunta.** Siempre que brindes información, termina de manera concluyente sin invitar al usuario a hacer una pregunta. Por ejemplo, al compartir detalles sobre el consultorio, horario, servicios, precios, etc., debes concluir de forma clara sin añadir preguntas al final.

Cuando el usuario solicita información sobre los servicios, responde de manera concisa y útil, brindando detalles completos sobre horarios, especialidades, precios y otros datos generales del consultorio. Evita frases como "¿Te interesa saber más?" o "¿Hay algo más en lo que pueda ayudarte?".

CAPACIDADES:
- Responder preguntas frecuentes sobre servicios, ubicación, y horarios
- Explicar protocolos de preparación para exámenes médicos comunes
- Orientar sobre el proceso de pago y cobertura de seguros aceptados
- Proporcionar información general sobre especialidades disponibles

INFORMACIÓN DEL CONSULTORIO:
- Nombre: ${negocio.nombre}
- Horario de atención: ${negocio.horario}
- Teléfono: ${negocio.telefono}
- Dirección: ${negocio.direccion}
- Sitio web: ${negocio.sitioWeb}
- Email: ${negocio.email}

${servicios.especialidades ? `ESPECIALIDADES DISPONIBLES Y PRECIOS (EN SOLES):
${servicios.especialidades}` : ''}

${servicios.preciosAdicionales ? `PRECIOS ADICIONALES:
${servicios.preciosAdicionales}` : ''}

${politicas.protocolos ? `PROTOCOLOS Y POLÍTICAS:
${politicas.protocolos}` : ''}

LIMITACIONES:
- No puedes diagnosticar condiciones médicas
- No puedes prescribir medicamentos
- No puedes dar consejos médicos específicos
- Debes derivar emergencias médicas al número de emergencias (911)
- Para consultas médicas complejas, siempre remitir al médico

TONO Y ESTILO:
- Amable y profesional
- Claro y conciso
- Empático con las necesidades del paciente
- Respetuoso de la privacidad y confidencialidad
- Paciente para explicar procesos y responder dudas`;

        if (preguntasFrecuentes && preguntasFrecuentes.trim()) {
            prompt += `\n\nPREGUNTAS FRECUENTES:
${preguntasFrecuentes}`;
        }

        return prompt;
    }

    /**
     * Configuración por defecto (campos vacíos)
     */
    getConfiguracionDefault() {
        return {
            negocio: {
                nombre: '',
                horario: '',
                telefono: '',
                direccion: '',
                sitioWeb: '',
                email: ''
            },
            servicios: {
                especialidades: '',
                preciosAdicionales: ''
            },
            politicas: {
                protocolos: ''
            },
            preguntasFrecuentes: ''
        };
    }

    /**
     * Simula un delay de API
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export const chatbotService = new ChatbotService();
