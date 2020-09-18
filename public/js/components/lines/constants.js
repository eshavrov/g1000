import { lineBase } from "./funcs/base.js";
import { lineRESTRICTED } from "./funcs/lineRESTRICTED.js";
import { lineOTHER } from "./funcs/lineOTHER.js";
import { lineZone } from "./funcs/zone.js";

const TYPES = {
  ACTIVE_FPL: "ACTIVE_FPL", // Active Flight Plan Leg (ACTIVE FPL)
  NON_ACTIVE_FPL: "NON_ACTIVE_FPL", // Non-active Flight Plan Leg (ACTIVE FPL)
  CLASS_B: "CLASS_B", // Class B Airspace/TMA (CLASS B/TMA)
  TMA: "TMA", // Class B Airspace/TMA (CLASS B/TMA)
  CLASS_C: "CLASS_C", // Class C Airspace/TCA (CLASS C/TCA)
  TCA: "TCA", // Class C Airspace/TCA (CLASS C/TCA)
  CLASS_D: "CLASS_D", // Class D Airspace (CLASS D)
  RESTRICTED: "RESTRICTED", // Restricted Area (RESTRICTED)
  MOA: "MOA", // Military Operations Area [MOA(MILITARY)]
  MILITARY: "MILITARY", // Military Operations Area [MOA(MILITARY)]
  OTHER: "OTHER", // Other/Air Defense Interdiction Zone (OTHER/ADIZ)
  ADIZ: "ADIZ", // Other/Air Defense Interdiction Zone (OTHER/ADIZ)
  TFR: "TFR", // Temporary Flight Restriction (TFR)
  ZONE: "ZONE", // добавил для зон
};

const FUNCTION_LINE = {
  [TYPES.ACTIVE_FPL]: lineBase,
  [TYPES.NON_ACTIVE_FPL]: lineBase,
  [TYPES.CLASS_B]: lineBase,
  [TYPES.TMA]: lineBase,
  [TYPES.CLASS_C]: lineBase,
  [TYPES.TCA]: lineBase,
  [TYPES.CLASS_D]: lineBase,
  [TYPES.RESTRICTED]: lineRESTRICTED,
  [TYPES.MOA]: lineRESTRICTED,
  [TYPES.MILITARY]: lineRESTRICTED,
  [TYPES.OTHER]: lineOTHER,
  [TYPES.ADIZ]: lineOTHER,
  [TYPES.TFR]: lineBase,
  [TYPES.ZONE]: lineZone,
};

const OPTIONS_LINE = {
  [TYPES.ACTIVE_FPL]: lineBase,
  [TYPES.NON_ACTIVE_FPL]: lineBase,
  [TYPES.CLASS_B]: lineBase,
  [TYPES.TMA]: lineBase,
  [TYPES.CLASS_C]: lineBase,
  [TYPES.TCA]: lineBase,
  [TYPES.CLASS_D]: lineBase,
  [TYPES.RESTRICTED]: lineRESTRICTED,
  [TYPES.MOA]: lineRESTRICTED,
  [TYPES.MILITARY]: lineRESTRICTED,
  [TYPES.OTHER]: lineOTHER,
  [TYPES.ADIZ]: lineOTHER,
  [TYPES.TFR]: lineBase,
};

function setLineStyles(context, type = TYPES.OTHER) {
  switch (type) {
    case TYPES.ACTIVE_FPL: {
      context.strokeStyle = "#ed008c";
      context.lineWidth = 3;
      break;
    }
    case TYPES.NON_ACTIVE_FPL: {
      context.strokeStyle = "#ffffff";
      context.lineWidth = 4;
      break;
    }
    case TYPES.CLASS_B:
    case TYPES.TMA: {
      context.strokeStyle = "#497cbf";
      context.lineWidth = 1;

      break;
    }
    case TYPES.CLASS_C:
    case TYPES.TCA: {
      context.strokeStyle = "#7f3892";
      context.lineWidth = 1;

      break;
    }
    case TYPES.CLASS_D: {
      context.strokeStyle = "#497cbf";
      context.setLineDash([3, 3]);

      context.lineWidth = 1;

      break;
    }
    case TYPES.RESTRICTED: {
      context.strokeStyle = "#497cc0";
      context.lineWidth = 1;

      break;
    }
    case TYPES.MOA:
    case TYPES.MILITARY: {
      context.strokeStyle = "#7f3892";
      context.lineWidth = 1;

      break;
    }
    case TYPES.OTHER:
    case TYPES.ADIZ: {
      context.strokeStyle = "#7f3892";
      context.lineWidth = 1;

      break;
    }
    case TYPES.TFR: {
      context.strokeStyle = "#fff103";
      context.lineWidth = 2;

      break;
    }
  }
}

export { TYPES, FUNCTION_LINE, OPTIONS_LINE, setLineStyles };
