// ===============================================
// CONFIGURACIÓN GLOBAL, SVGs Y FAIL-SAFES
// ===============================================
const CONFIG = {
    archivos: {
        datos: "fact_checking_debate.csv" 
    },
    iconos: {
        "VERDADERO": `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
        "FALSO": `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.59 13.59L15.17 17 12 13.83 8.83 17 7.41 15.59 10.59 12 7.41 8.41 8.83 7 12 10.17 15.17 7l1.41 1.41L13.41 12l3.18 3.59z"/></svg>`,
        "ENGAÑOSO": `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`
    },
    colores: {
        candidatos: {
            "Keiko Fujimori": { 
                clase: "author-keiko", 
                borde: "#f57c00",
                foto: "fotos/keiko_derecha.png",
                descripcion: "Candidata de Fuerza Popular"
            },
            "Roberto Sánchez": { 
                clase: "author-sanchez", 
                borde: "#2e7d32",
                foto: "fotos/sanchez_izquierda.png",
                descripcion: "Candidato de Juntos por el Perú"
            }
        },
        calificaciones: {
            "VERDADERO": "badge-verdadero",
            "FALSO": "badge-falso",
            "ENGAÑOSO": "badge-enganoso"
        }
    }
};

// ===============================================
// DATOS HARDCODEADOS PARA EL BOCETO
// ===============================================
const datosPrueba = [
    {
        candidato: "Keiko Fujimori",
        frase: "Durante mi gestión, la pobreza se redujo del 30% al 20% en todo el país.",
        calificacion: "VERDADERO",
        explicacion: "De acuerdo con los datos del Instituto Nacional de Estadística e Informática (INEI), la pobreza monetaria total a nivel nacional se redujo de 30,1% a 20,2%. Esta disminución equivale a 9,9 puntos porcentuales."
    },
    {
        candidato: "Roberto Sánchez",
        frase: "Suspendimos temporalmente el peaje porque la concesionaria incumplió con el 80% de las obras prometidas en el contrato original.",
        calificacion: "ENGAÑOSO",
        explicacion: "Si bien hubo un incumplimiento de obras que motivó arbitrajes, el porcentaje real documentado por la Contraloría es del 35%, no del 80%. La cifra fue exagerada durante su gestión."
    },
    {
        candidato: "Keiko Fujimori",
        frase: "El gobierno actual ha reducido la inversión en seguridad en un 40% durante los últimos dos años.",
        calificacion: "FALSO",
        explicacion: "Los datos oficiales del Ministerio de Economía muestran que el presupuesto de seguridad ciudadana aumentó un 12% en el último año fiscal. La afirmación no se sustenta en la evidencia pública."
    }
];

// ===============================================
// MOTOR DE RENDERIZADO
// ===============================================
function renderizarTarjetas(datos) {
    const contenedor = document.getElementById('fact-checking-feed');
    
    if (!datos || datos.length === 0) {
        contenedor.innerHTML = `<p style="text-align:center; color:#e53935;">⚠️ Error: No hay datos disponibles para mostrar.</p>`;
        return;
    }

    let htmlAcumulado = '';

    datos.forEach(item => {
        // Obtenemos configuración, evitando errores si el nombre está mal escrito
        const configCand = CONFIG.colores.candidatos[item.candidato] || { clase: "", borde: "#ccc", foto: "https://via.placeholder.com/55", descripcion: "Candidato a la Presidencia" };
        const keyCalificacion = item.calificacion.toUpperCase();
        const claseBadge = CONFIG.colores.calificaciones[keyCalificacion] || "";
        const iconoSVG = CONFIG.iconos[keyCalificacion] || "";

        // Maquetación de la tarjeta con imagen de burbuja
        htmlAcumulado += `
            <article class="fact-card" style="border-top-color: ${configCand.borde};">
                <div class="fact-header">
                    <div class="fact-author-wrapper">
                        <img src="${configCand.foto}" alt="${item.candidato}" class="fact-author-img" onerror="this.src='https://via.placeholder.com/55?text=Foto'">
                        <div class="fact-author-text">
                            <span class="fact-author-name ${configCand.clase}">${item.candidato}</span>
                            <p class="fact-author-desc">${configCand.descripcion}</p>
                        </div>
                    </div>
                    
                    <span class="fact-badge ${claseBadge}">
                        ${iconoSVG} ${item.calificacion}
                    </span>
                </div>
                <p class="fact-quote">${item.frase}</p>
                <p class="fact-explanation"><strong>Explicación:</strong> ${item.explicacion}</p>
            </article>
        `;
    });

    contenedor.innerHTML = htmlAcumulado;
}

// Inicializamos el boceto
document.addEventListener('DOMContentLoaded', () => {
    try {
        renderizarTarjetas(datosPrueba);
    } catch (error) {
        console.error("Error crítico cargando las tarjetas:", error);
        document.getElementById('fact-checking-feed').innerHTML = "⚠️ Ocurrió un problema al cargar el panel de fact-checking.";
    }
});