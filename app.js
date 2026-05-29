// ===============================================
// CONFIGURACIÓN GLOBAL Y FAIL-SAFES
// ===============================================
const CONFIG = {
    archivos: {
        datos: "fact_checking_debate.csv" // Para la fase de producción
    },
    colores: {
        candidatos: {
            "Keiko Fujimori": { clase: "author-keiko", borde: "#f57c00" },
            "Roberto Sánchez": { clase: "author-sanchez", borde: "#2e7d32" }
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
        frase: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. El gobierno actual ha reducido la inversión en seguridad en un 40%.",
        calificacion: "FALSO",
        explicacion: "Los datos oficiales del Ministerio de Economía muestran que el presupuesto de seguridad ciudadana aumentó un 12% en el último año fiscal. La afirmación no se sustenta en la evidencia pública."
    },
    {
        candidato: "Roberto Sánchez",
        frase: "Suspendimos temporalmente el peaje porque la concesionaria incumplió con el 80% de las obras prometidas en el contrato original.",
        calificacion: "ENGAÑOSO",
        explicacion: "Si bien hubo un incumplimiento de obras que motivó arbitrajes, el porcentaje real documentado por la Contraloría es del 35%, no del 80%. La cifra fue exagerada durante su gestión."
    },
    {
        candidato: "Keiko Fujimori",
        frase: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        calificacion: "VERDADERO",
        explicacion: "Esta afirmación coincide exactamente con los reportes emitidos por el Banco Central de Reserva en su informe trimestral de inflación."
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
        // Obtenemos estilos configurados
        const configCand = CONFIG.colores.candidatos[item.candidato] || { clase: "", borde: "#ccc" };
        const claseBadge = CONFIG.colores.calificaciones[item.calificacion.toUpperCase()] || "";

        htmlAcumulado += `
            <article class="fact-card" style="border-top-color: ${configCand.borde};">
                <div class="fact-header">
                    <span class="fact-author ${configCand.clase}">${item.candidato}</span>
                    <span class="fact-badge ${claseBadge}">${item.calificacion}</span>
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