window.onload = function() {

    // 1. Elementos del DOM
    const formulario = document.getElementById('form-suscripcion');
    const tituloSaludo = document.getElementById('titulo-saludo');

    const inputs = {
        nombre: document.getElementById('nombre'),
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        repetirPassword: document.getElementById('repetir-password'),
        edad: document.getElementById('edad'),
        telefono: document.getElementById('telefono'),
        direccion: document.getElementById('direccion'),
        ciudad: document.getElementById('ciudad'),
        codigoPostal: document.getElementById('codigo-postal'),
        dni: document.getElementById('dni')
    };

    // 2. Funciones Auxiliares de Validación
    function tieneSoloLetrasYNumeros(str) {
        return /^[a-zA-Z0-9]+$/.test(str);
    }

    function tieneLetrasYNumeros(str) {
        const tieneLetras = /[a-zA-Z]/.test(str);
        const tieneNumeros = /[0-9]/.test(str);
        return tieneLetras && tieneNumeros;
    }

    function esEmailValido(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function esSoloNumero(str) {
        return /^[0-9]+$/.test(str);
    }

    // 3. Reglas de Validación por campo
    const validaciones = {
        nombre: function(valor) {
            valor = valor.trim();
            if (valor.length <= 6) return "Debe tener más de 6 letras.";
            if (!valor.includes(" ")) return "Debe contener al menos un espacio en el medio.";
            return "";
        },
        email: function(valor) {
            if (!esEmailValido(valor)) return "Formato de email inválido.";
            return "";
        },
        password: function(valor) {
            if (valor.length < 8) return "Debe tener al menos 8 caracteres.";
            if (!tieneLetrasYNumeros(valor)) return "Debe contener tanto letras como números.";
            return "";
        },
        repetirPassword: function(valor) {
            if (valor !== inputs.password.value) return "Las contraseñas no coinciden.";
            return "";
        },
        edad: function(valor) {
            const num = parseInt(valor, 10);
            if (isNaN(num) || num < 18) return "Debe ser un número entero mayor o igual a 18.";
            return "";
        },
        telefono: function(valor) {
            if (!esSoloNumero(valor) || valor.length < 7) {
                return "Debe contener solo números, sin espacios ni caracteres (mínimo 7 dígitos).";
            }
            return "";
        },
        direccion: function(valor) {
            const trimmed = valor.trim();
            if (trimmed.length < 5) return "Debe tener al menos 5 caracteres.";
            if (!trimmed.includes(" ")) return "Debe contener un espacio en el medio.";
            if (!tieneLetrasYNumeros(trimmed)) return "Debe tener letras y números (ej: Calle 123).";
            return "";
        },
        ciudad: function(valor) {
            if (valor.trim().length < 3) return "Debe tener al menos 3 caracteres.";
            return "";
        },
        codigoPostal: function(valor) {
            if (valor.trim().length < 3) return "Debe tener al menos 3 caracteres.";
            return "";
        },
        dni: function(valor) {
            if (!esSoloNumero(valor) || (valor.length !== 7 && valor.length !== 8)) {
                return "Debe ser un número de 7 u 8 dígitos.";
            }
            return "";
        }
    };

    // 4. Mostrar y ocultar errores en la interfaz
    function validarCampo(nombreCampo) {
        const input = inputs[nombreCampo];
        const valor = input.value;
        const mensajeError = validaciones[nombreCampo](valor);
        const errorContainer = document.getElementById(`error-${input.id}`);
        const contenedorControl = input.parentElement;

        if (mensajeError) {
            errorContainer.textContent = mensajeError;
            contenedorControl.classList.add('error-input');
            return { valido: false, mensaje: `${nombreCampo.toUpperCase()}: ${mensajeError}` };
        } else {
            errorContainer.textContent = "";
            contenedorControl.classList.remove('error-input');
            return { valido: true, valor: valor };
        }
    }

    function limpiarError(nombreCampo) {
        const input = inputs[nombreCampo];
        const errorContainer = document.getElementById(`error-${input.id}`);
        const contenedorControl = input.parentElement;
        errorContainer.textContent = "";
        contenedorControl.classList.remove('error-input');
    }

    // 5. Asignar Eventos BLUR y FOCUS a todos los inputs
    Object.keys(inputs).forEach(key => {
        const input = inputs[key];
        
        // Al salir del campo (blur), validamos
        input.addEventListener('blur', function() {
            validarCampo(key);
        });

        // Al entrar al campo (focus), limpiamos el error
        input.addEventListener('focus', function() {
            limpiarError(key);
        });
    });

    // 6. BONUS: Saludo dinámico en tiempo real (Keydown y Focus)
    function actualizarTitulo() {
        const nombreValor = inputs.nombre.value.toUpperCase();
        if (nombreValor) {
            tituloSaludo.textContent = `HOLA ${nombreValor}`;
        } else {
            tituloSaludo.textContent = "HOLA";
        }
    }

    inputs.nombre.addEventListener('keyup', actualizarTitulo);
    inputs.nombre.addEventListener('focus', actualizarTitulo);

    // 7. Evento SUBMIT del Formulario
    formulario.addEventListener('submit', function(e) {
        e.preventDefault(); // Evitamos que la página se recargue

        let errores = [];
        let datosCargados = {};
        let hayErrores = false;

        // Validamos todos los campos uno por uno
        Object.keys(inputs).forEach(key => {
            const resultado = validarCampo(key);
            if (!resultado.valido) {
                hayErrores = true;
                errores.push(resultado.mensaje);
            } else {
                datosCargados[key] = resultado.valor;
            }
        });

        // Mostramos el cartel emergente (alert)
        if (hayErrores) {
            alert("ERROR EN LA VALIDACIÓN:\n\n" + errores.join("\n"));
        } else {
            // Formateamos los datos cargados para que el alert se vea prolijo
            let mensajeExito = "¡Suscripción exitosa!\n\nDatos registrados:\n";
            Object.keys(datosCargados).forEach(key => {
                mensajeExito += `- ${key}: ${datosCargados[key]}\n`;
            });
            alert(mensajeExito);
        }
    });
};