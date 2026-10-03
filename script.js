document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. CONEXIÓN CON SUPABASE
    // ==========================================

    const SUPABASE_URL = "https://xhdexnanmhjztrgeveax.supabase.co";
    const SUPABASE_KEY = "sb_publishable_CeHMU7LjrhLZoczJt7Qa_Q_YWEhXKRB";

    const db = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


    // ==========================================
    // 2. AUDIO DE LA INVITACIÓN
    // ==========================================

    const musicaInicio = new Audio("audio/musica_inicio.mp3");
    const efectoRisas = new Audio("audio/efecto_risas.mp3");
    const musicaPrincipal = new Audio("audio/one_way_or_another.mp3");

    musicaInicio.volume = 0.45;
    efectoRisas.volume = 0.75;
    musicaPrincipal.volume = 0.45;

    musicaInicio.loop = true;
    musicaPrincipal.loop = true;

    let sonidoActivo = true;


    // ==========================================
    // 3. PANTALLAS Y BOTÓN DE SONIDO
    // ==========================================

    const pantallaSobre =
        document.getElementById("pantallaSobre");

    const btnSobre =
        document.getElementById("btnSobre");

    const btnAbrir =
        document.getElementById("btnAbrir");

    const entrada =
        document.getElementById("entrada");

    const invitacion =
        document.getElementById("invitacion");


    const botonSonido =
        document.createElement("button");

    botonSonido.type = "button";
    botonSonido.id = "botonSonido";
    botonSonido.innerHTML = "🔊";
    botonSonido.title = "Activar o silenciar sonido";

    botonSonido.setAttribute(
        "aria-label",
        "Activar o silenciar sonido"
    );

    Object.assign(botonSonido.style, {
        position: "fixed",
        right: "20px",
        bottom: "20px",
        zIndex: "9999",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        border: "1px solid rgba(255,122,33,.7)",
        background: "rgba(20,5,30,.88)",
        color: "#ff7a21",
        fontSize: "20px",
        cursor: "pointer",
        boxShadow: "0 0 18px rgba(153,51,255,.45)",
        display: "none"
    });

    document.body.appendChild(botonSonido);


    // ==========================================
    // ACTIVAR / SILENCIAR SONIDO
    // ==========================================

    botonSonido.addEventListener("click", function () {

        sonidoActivo = !sonidoActivo;

        musicaInicio.muted = !sonidoActivo;
        efectoRisas.muted = !sonidoActivo;
        musicaPrincipal.muted = !sonidoActivo;

        botonSonido.innerHTML =
            sonidoActivo ? "🔊" : "🔇";

    });


    // ==========================================
    // 4. TOCAR SOBRE -> MOSTRAR PORTADA
    // ==========================================

    btnSobre.addEventListener("click", function () {

        pantallaSobre.style.display = "none";

        entrada.style.display = "flex";

        botonSonido.style.display = "block";

        window.scrollTo(0, 0);


        musicaInicio.currentTime = 0;
        efectoRisas.currentTime = 0;


        musicaInicio.play().catch(function (error) {

            console.log(
                "No se pudo reproducir la música de inicio:",
                error
            );

        });


        efectoRisas.play().catch(function (error) {

            console.log(
                "No se pudo reproducir el efecto de risas:",
                error
            );

        });

    });


    // ==========================================
    // 5. ABRIR INVITACIÓN -> CANCIÓN PRINCIPAL
    // ==========================================

    btnAbrir.addEventListener("click", function () {

        musicaInicio.pause();
        efectoRisas.pause();

        musicaInicio.currentTime = 0;
        efectoRisas.currentTime = 0;


        entrada.style.display = "none";

        invitacion.style.display = "block";

        window.scrollTo(0, 0);


        musicaPrincipal.currentTime = 0;

        musicaPrincipal.muted = !sonidoActivo;


        musicaPrincipal.play().catch(function (error) {

            console.log(
                "No se pudo reproducir la canción principal:",
                error
            );

        });

    });


    // ==========================================
    // 6. FORMULARIO RSVP
    // ==========================================

    const asistencia =
        document.getElementById("asistencia");

    const personas =
        document.getElementById("personas");

    const btnMenos =
        document.getElementById("btnMenos");

    const btnMas =
        document.getElementById("btnMas");

    const formRSVP =
        document.getElementById("formRSVP");

    const nombre =
        document.getElementById("nombre");


    // ==========================================
    // 7. CONTADOR DE PERSONAS
    // ==========================================

    let totalPersonas = 1;


    function actualizarContador() {

        personas.value = totalPersonas;

        btnMenos.disabled =
            asistencia.value !== "si" ||
            totalPersonas <= 1;

        btnMas.disabled =
            asistencia.value !== "si" ||
            totalPersonas >= 5;
    }


    // Al cargar la página el contador está bloqueado

    personas.value = 1;

    btnMenos.disabled = true;
    btnMas.disabled = true;


    // ==========================================
    // BOTÓN MENOS
    // ==========================================

    btnMenos.addEventListener("click", function () {

        if (
            asistencia.value === "si" &&
            totalPersonas > 1
        ) {

            totalPersonas--;

            actualizarContador();
        }

    });


    // ==========================================
    // BOTÓN MÁS
    // ==========================================

    btnMas.addEventListener("click", function () {

        if (
            asistencia.value === "si" &&
            totalPersonas < 5
        ) {

            totalPersonas++;

            actualizarContador();
        }

    });


    // ==========================================
    // 8. CONTROL SÍ / NO
    // ==========================================

    asistencia.addEventListener("change", function () {

        if (asistencia.value === "si") {

            totalPersonas = 1;

            personas.value = 1;

            actualizarContador();

        } else {

            totalPersonas = 1;

            personas.value = 1;

            btnMenos.disabled = true;
            btnMas.disabled = true;

        }

    });


    // ==========================================
    // 9. ENVIAR CONFIRMACIÓN A SUPABASE
    // ==========================================

    formRSVP.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ======================================
            // OBTENER DATOS
            // ======================================

            const nombreInvitado =
                nombre.value.trim();

            const asistira =
                asistencia.value === "si";

            const numeroPersonas =
                asistira
                    ? totalPersonas
                    : 0;


            // ======================================
            // VALIDAR NOMBRE
            // ======================================

            if (nombreInvitado === "") {

                alert(
                    "Por favor escribe tu nombre."
                );

                return;
            }


            // ======================================
            // VALIDAR ASISTENCIA
            // ======================================

            if (
                asistencia.value !== "si" &&
                asistencia.value !== "no"
            ) {

                alert(
                    "Indica si asistirás."
                );

                return;
            }


            // ======================================
            // VALIDAR NÚMERO DE PERSONAS
            // ======================================

            if (
                asistira &&
                (
                    numeroPersonas < 1 ||
                    numeroPersonas > 5
                )
            ) {

                alert(
                    "El número de personas debe ser entre 1 y 5."
                );

                return;
            }


            // ======================================
            // 10. GUARDAR EN SUPABASE
            // ======================================

            const { error } = await db
                .from("confirmaciones_halloween")
                .insert([
                    {
                        nombre: nombreInvitado,
                        asistencia: asistira,
                        personas: numeroPersonas
                    }
                ]);


            // ======================================
            // 11. COMPROBAR RESULTADO
            // ======================================

            if (error) {

                console.error(
                    "Error de Supabase:",
                    error
                );

                alert(
                    "No pudimos registrar tu confirmación. Intenta nuevamente."
                );

                return;
            }


            // ======================================
            // 12. PANTALLA FINAL
            // ======================================

            const pantallaRespuesta =
                document.getElementById(
                    "pantallaRespuesta"
                );

            const respuestaIcono =
                document.getElementById(
                    "respuestaIcono"
                );

            const respuestaTitulo =
                document.getElementById(
                    "respuestaTitulo"
                );

            const respuestaMensaje =
                document.getElementById(
                    "respuestaMensaje"
                );

            const respuestaDespedida =
                document.getElementById(
                    "respuestaDespedida"
                );


            if (
                !pantallaRespuesta ||
                !respuestaIcono ||
                !respuestaTitulo ||
                !respuestaMensaje ||
                !respuestaDespedida
            ) {

                console.error(
                    "Falta algún elemento de la pantalla final en index.html"
                );

                return;
            }


            // ======================================
            // 13. MENSAJE SEGÚN RESPUESTA
            // ======================================

            if (asistira) {

                respuestaIcono.textContent = "🎃";

                respuestaTitulo.textContent =
                    `¡GRACIAS, ${nombreInvitado.toUpperCase()}!`;

                respuestaMensaje.innerHTML =
                    `Tu asistencia ha sido confirmada para
                    <strong>
                        ${numeroPersonas}
                        ${
                            numeroPersonas === 1
                                ? "persona"
                                : "personas"
                        }.
                    </strong>`;

                respuestaDespedida.innerHTML =
                    `👻 ¡Nos dará mucho gusto verte!<br>
                    <span>
                        Prepárate para una noche de terror...
                    </span>`;

            } else {

                respuestaIcono.textContent = "🖤";

                respuestaTitulo.textContent =
                    `¡GRACIAS, ${nombreInvitado.toUpperCase()}!`;

                respuestaMensaje.textContent =
                    "Lamentamos que no puedas acompañarnos esta vez.";

                respuestaDespedida.innerHTML =
                    `Tu respuesta ha sido registrada correctamente.
                    <br><br>
                    🎃
                    <strong>
                        ¡Esperamos verte en una próxima ocasión!
                    </strong>`;

            }


            // ======================================
            // 14. MOSTRAR RESPUESTA FINAL
            // ======================================

            invitacion.style.display = "none";

            entrada.style.display = "none";

            pantallaRespuesta.style.display = "flex";

            window.scrollTo(0, 0);

        }
    );

});