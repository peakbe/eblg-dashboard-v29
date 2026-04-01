// ======================================================
// METAR
// ======================================================

import { ENDPOINTS } from "./config.js";
import { fetchJSON, updateStatusPanel } from "./helpers.js";
import { getRunwayFromWind, computeCrosswind } from "./runways.js";
import { updateHeatmap, sonometers } from "./sonometers.js";
import { drawRunway, drawCorridor, RUNWAYS } from "./runways.js";

/**
 * Charge le METAR depuis le proxy.
 */
export async function loadMetar() {
    const data = await fetchJSON(ENDPOINTS.metar);
    updateMetarUI(data);
    updateStatusPanel("METAR", data);
}

/**
 * Met à jour l’UI METAR + piste + sonomètres.
 * @param {object} data
 */
export function updateMetarUI(data) {
    const el = document.getElementById("metar");
    if (!el) return;

    if (!data || !data.raw) {
        el.innerText = "METAR indisponible";
        drawRunway("UNKNOWN");
        drawCorridor("UNKNOWN");
        return;
    }

    el.innerText = data.raw;

    const windDir = data.wind_direction?.value;
    const windSpeed = data.wind_speed?.value;

    const runway = getRunwayFromWind(windDir);
    const r = RUNWAYS[runway];

    drawRunway(runway, window.runwayLayer);
    drawCorridor(runway, window.corridorLayer);

    updateHeatmap(window.map);
}
