// ===============================================
// CONFIGURACIÓN GLOBAL, SVGs Y FAIL-SAFES
// ===============================================
const CONFIG = {
    archivos: {
        datos: "data_factchecking_debate.csv" // Conexión directa a la plantilla
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
// MOTOR DE RENDERIZADO
// ===============================================
function renderizarTarjetas(datos) {
    const contenedor = document.getElementById('fact-checking-feed');
    
    if (!datos || datos.length === 0) {
        contenedor.innerHTML = `<p style="text-align:center; color:#e53935;">⚠️ Esperando datos del debate...</p>`;
        return;
    }

    let htmlAcumulado = '';

    datos.forEach(item => {
        // Validación de seguridad por si hay una fila en blanco
        if (!item.candidato || !item.frase) return;

        const configCand = CONFIG.colores.candidatos[item.candidato.trim()] || { clase: "", borde: "#ccc", foto: "https://via.placeholder.com/55", descripcion: "Candidato a la Presidencia" };
        const keyCalificacion = (item.calificacion || "").trim().toUpperCase();
        const claseBadge = CONFIG.colores.calificaciones[keyCalificacion] || "";
        const iconoSVG = CONFIG.iconos[keyCalificacion] || "";

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
                <p class="fact-source"><strong>Fuente:</strong> ${item.fuente}</p>
            </article>
        `;
    });

    contenedor.innerHTML = htmlAcumulado;
}

// ===============================================
// CARGA DE DATOS (PAPAPARSE) Y ARRANQUE
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    Papa.parse(CONFIG.archivos.datos, {
        download: true,       // Descarga el archivo CSV
        header: true,         // Usa la primera fila como llaves del objeto
        skipEmptyLines: true, // Ignora saltos de línea vacíos al final del excel
        complete: function(results) {
            try {
                if (results.errors.length > 0 && results.data.length === 0) {
                    console.error("Errores en el parseo:", results.errors);
                    throw new Error("Formato de CSV inválido");
                }
                // Si todo sale bien, mandamos la data a renderizar
                renderizarTarjetas(results.data);
            } catch (error) {
                console.error("Error crítico procesando los datos:", error);
                document.getElementById('fact-checking-feed').innerHTML = "<p style='text-align:center;'>⚠️ Ocurrió un problema procesando las tarjetas.</p>";
            }
        },
        error: function(err) {
            console.error("Error de red o archivo no encontrado:", err);
            document.getElementById('fact-checking-feed').innerHTML = "<p style='text-align:center;'>⚠️ No se pudo cargar el archivo de datos. Verifica que el CSV esté en la carpeta correcta.</p>";
        }
    });
});