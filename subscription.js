window.onload = function() {

    const formulario = document.getElementById('form-suscripcion');
    const tituloSaludo = document.getElementById('titulo-saludo');
    const modal = document.getElementById('mi-modal');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalMensaje = document.getElementById('modal-mensaje');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');

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


    const datosGuardados = localStorage.getItem('datosSuscripcion');
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        Object.keys(inputs).forEach(key => {
            if (datos[key] && key !== 'password' && key !== 'repetirPassword') {
                inputs[key].value = datos[key];
            }
        });

        if (datos.nombre) {
            tituloSaludo.textContent = `HOLA ${datos.nombre.toUpperCase()}`;
        }
    }


    function esEmailValido(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function esSoloNumero(str) {
        return /^[0-9]+$/.test(str);
    }
    function tieneLetrasYNumeros(str) {
        return /[a-zA-Z]/.test(str) && /[0-9]/.test(str);
    }


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
            if (!esSoloNumero(valor) || valor.length < 7) return "Mínimo 7 dígitos numéricos, sin espacios ni símbolos.";
            return "";
        },
        direccion: function(valor) {
            const trimmed = valor.trim();
            if (trimmed.length < 5) return "Debe tener al menos 5 caracteres.";
            if (!trimmed.includes(" ")) return "Debe contener un espacio en el medio.";
            if (!tieneLetrasYNumeros(trimmed)) return "Debe tener letras y números.";
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
            if (!esSoloNumero(valor) || (valor.length !== 7 && valor.length !== 8)) return "Debe ser un número de 7 u 8 dígitos.";
            return "";
        }
    };


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


    Object.keys(inputs).forEach(key => {
        inputs[key].addEventListener('blur', () => validarCampo(key));
        inputs[key].addEventListener('focus', () => limpiarError(key));
    });


    function actualizarTitulo() {
        const nombreValor = inputs.nombre.value.toUpperCase();
        tituloSaludo.textContent = nombreValor ? `HOLA ${nombreValor}` : "HOLA";
    }
    inputs.nombre.addEventListener('keyup', actualizarTitulo);
    inputs.nombre.addEventListener('focus', actualizarTitulo);


    function abrirModal(titulo, htmlContenido, esExito) {
        modalTitulo.textContent = titulo;
        modalTitulo.className = esExito ? "exito-color" : "error-color";
        modalMensaje.innerHTML = htmlContenido;
        modal.classList.remove('modal-oculto');
    }

    btnCerrarModal.addEventListener('click', () => {
        modal.classList.add('modal-oculto');
    });


    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('modal-oculto');
        }
    });


    formulario.addEventListener('submit', function(e) {
        e.preventDefault();

        let errores = [];
        let datosCargados = {};
        let hayErrores = false;


        Object.keys(inputs).forEach(key => {
            const resultado = validarCampo(key);
            if (!resultado.valido) {
                hayErrores = true;
                errores.push(resultado.mensaje);
            } else {
                datosCargados[key] = resultado.valor;
            }
        });

        if (hayErrores) {

            let htmlErrores = "<p>Por favor corregí los siguientes campos antes de enviar:</p><ul>";
            errores.forEach(err => htmlErrores += `<li>${err}</li>`);
            htmlErrores += "</ul>";
            abrirModal("Error en el Formulario", htmlErrores, false);
            return;
        }

   
        const queryParams = new URLSearchParams(datosCargados).toString();
        const urlDestino = `https://jsonplaceholder.typicode.com/posts?${queryParams}`;


        fetch(urlDestino, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Código de estado HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

            localStorage.setItem('datosSuscripcion', JSON.stringify(datosCargados));

            let htmlExito = `
                <p><strong>¡Suscripción al newsletter completada de forma exitosa!</strong></p>
                <p>Respuesta recibida del servidor:</p>
                <div class="datos-respuesta">${JSON.stringify(data, null, 2)}</div>
            `;
            abrirModal("Suscripción Exitosa :)", htmlExito, true);
        })
        .catch(error => {
   
            let htmlErrorServidor = `
                <p>Hubo un problema al procesar tu solicitud en el servidor remoto.</p>
                <p><strong>Detalles:</strong> ${error.message}</p>
            `;
            abrirModal("Error de Servidor / Red", htmlErrorServidor, false);
        });
    });
};