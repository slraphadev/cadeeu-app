/**
 * Tokens do design system do CadêEu?.
 * Gerado por scripts/gerar-tokens.mjs. Não edite à mão: rode `npm run tokens`.
 */

export const primitivos = {
  "brand/black": "#06110B",
  "brand/deep-forest": "#0A2416",
  "brand/deep-pine": "#0F3D25",
  "brand/emerald": "#0C8543",
  "brand/electric": "#22DD70",
  "brand/cream": "#FFFBD6",
  "green/50": "#EDFFF4",
  "green/100": "#CCFBDF",
  "green/200": "#99F6BE",
  "green/300": "#5FEE99",
  "green/400": "#3AE584",
  "green/500": "#22DD70",
  "green/600": "#14B057",
  "green/700": "#0C8543",
  "green/800": "#0A6B38",
  "neutral/50": "#F4F7F5",
  "neutral/100": "#E8EEEA",
  "neutral/200": "#D3DCD6",
  "neutral/300": "#B3C0B8",
  "neutral/400": "#8A9C92",
  "neutral/500": "#65786D",
  "neutral/600": "#495A50",
  "neutral/700": "#2E3D34",
  "neutral/800": "#1C2820",
  "neutral/900": "#0F1712",
  "danger/100": "#FCE8EC",
  "danger/300": "#F59AAE",
  "danger/500": "#D02F4F",
  "danger/700": "#9A1F3A",
  "warning/100": "#FFF3D0",
  "warning/400": "#FFCB47",
  "warning/800": "#7A5A10",
  "white": "#FFFFFF"
} as const;

export const cores = {
  "light": {
    "bg": {
      "default": "#F4F7F5",
      "surface": "#FFFFFF",
      "surface2": "#E8EEEA",
      "inverse": "#06110B"
    },
    "text": {
      "primary": "#06110B",
      "secondary": "#495A50",
      "disabled": "#8A9C92",
      "inverse": "#FFFBD6",
      "onBrand": "#06110B",
      "brand": "#0A6B38"
    },
    "border": {
      "default": "#D3DCD6",
      "strong": "#B3C0B8",
      "focus": "#14B057"
    },
    "brand": {
      "default": "#22DD70",
      "hover": "#14B057",
      "deep": "#0C8543",
      "soft": "#EDFFF4"
    },
    "feedback": {
      "danger": "#D02F4F",
      "dangerSoft": "#FCE8EC",
      "warning": "#FFCB47",
      "warningSoft": "#FFF3D0",
      "onWarning": "#7A5A10",
      "success": "#14B057",
      "successSoft": "#CCFBDF"
    },
    "status": {
      "now": "#22DD70",
      "nowFg": "#06110B",
      "next": "#0A6B38",
      "nextFg": "#FFFBD6",
      "changed": "#D02F4F",
      "changedFg": "#FFFFFF",
      "free": "#E8EEEA",
      "freeFg": "#495A50"
    }
  },
  "dark": {
    "bg": {
      "default": "#06110B",
      "surface": "#0A2416",
      "surface2": "#0F3D25",
      "inverse": "#FFFBD6"
    },
    "text": {
      "primary": "#FFFBD6",
      "secondary": "#B3C0B8",
      "disabled": "#65786D",
      "inverse": "#06110B",
      "onBrand": "#06110B",
      "brand": "#5FEE99"
    },
    "border": {
      "default": "#0F3D25",
      "strong": "#14B057",
      "focus": "#22DD70"
    },
    "brand": {
      "default": "#22DD70",
      "hover": "#3AE584",
      "deep": "#0C8543",
      "soft": "#0F3D25"
    },
    "feedback": {
      "danger": "#F59AAE",
      "dangerSoft": "#9A1F3A",
      "warning": "#FFCB47",
      "warningSoft": "#7A5A10",
      "onWarning": "#FFF3D0",
      "success": "#5FEE99",
      "successSoft": "#0F3D25"
    },
    "status": {
      "now": "#22DD70",
      "nowFg": "#06110B",
      "next": "#0A6B38",
      "nextFg": "#FFFBD6",
      "changed": "#F59AAE",
      "changedFg": "#06110B",
      "free": "#0F3D25",
      "freeFg": "#B3C0B8"
    }
  }
} as const;

export const espaco = {
  "0": 0,
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "5": 20,
  "6": 24,
  "8": 32,
  "10": 40,
  "12": 48,
  "16": 64,
  "0.5": 2
} as const;

export const raio = {
  "none": 0,
  "sm": 4,
  "md": 8,
  "lg": 12,
  "xl": 16,
  "widget": 24,
  "full": 9999
} as const;

export const tamanho = {
  "touch": 48
} as const;

export const opacidade = {
  "faded": 0.45,
  "disabled": 0.38
} as const;

export const texto = {
  "displayL": {
    "familia": "brand",
    "fontSize": 40,
    "lineHeight": 44,
    "fontWeight": "700"
  },
  "displayM": {
    "familia": "brand",
    "fontSize": 32,
    "lineHeight": 35,
    "fontWeight": "700"
  },
  "headingH1": {
    "familia": "ui",
    "fontSize": 28,
    "lineHeight": 34,
    "fontWeight": "700"
  },
  "headingH2": {
    "familia": "ui",
    "fontSize": 22,
    "lineHeight": 28,
    "fontWeight": "700"
  },
  "headingH3": {
    "familia": "ui",
    "fontSize": 18,
    "lineHeight": 23,
    "fontWeight": "500"
  },
  "headingH4": {
    "familia": "ui",
    "fontSize": 16,
    "lineHeight": 22,
    "fontWeight": "500"
  },
  "bodyL": {
    "familia": "ui",
    "fontSize": 16,
    "lineHeight": 25,
    "fontWeight": "400"
  },
  "bodyM": {
    "familia": "ui",
    "fontSize": 14,
    "lineHeight": 21,
    "fontWeight": "400"
  },
  "bodyS": {
    "familia": "ui",
    "fontSize": 13,
    "lineHeight": 19,
    "fontWeight": "400"
  },
  "labelM": {
    "familia": "ui",
    "fontSize": 14,
    "lineHeight": 20,
    "fontWeight": "500"
  },
  "labelS": {
    "familia": "ui",
    "fontSize": 12,
    "lineHeight": 16,
    "fontWeight": "500"
  },
  "caption": {
    "familia": "ui",
    "fontSize": 12,
    "lineHeight": 17,
    "fontWeight": "400"
  },
  "overline": {
    "familia": "ui",
    "fontSize": 11,
    "lineHeight": 14,
    "fontWeight": "700",
    "letterSpacing": 0.66,
    "textTransform": "uppercase"
  },
  "widgetRoom": {
    "familia": "widget",
    "fontSize": 28,
    "lineHeight": 31,
    "fontWeight": "700"
  },
  "widgetRoomS": {
    "familia": "widget",
    "fontSize": 20,
    "lineHeight": 22,
    "fontWeight": "700"
  },
  "widgetTitle": {
    "familia": "widget",
    "fontSize": 14,
    "lineHeight": 18,
    "fontWeight": "500"
  },
  "widgetMeta": {
    "familia": "widget",
    "fontSize": 12,
    "lineHeight": 16,
    "fontWeight": "400"
  },
  "widgetBadge": {
    "familia": "widget",
    "fontSize": 11,
    "lineHeight": 13,
    "fontWeight": "700",
    "textTransform": "uppercase"
  }
} as const;

/** Sombras valem só no modo Light. No Dark a elevação vem da superfície e da borda. */
export const sombra = {
  "sm": {
    "offsetX": 0,
    "offsetY": 2,
    "blur": 4,
    "spread": 0,
    "color": "#06110B",
    "opacity": 0.06
  },
  "md": {
    "offsetX": 0,
    "offsetY": 4,
    "blur": 12,
    "spread": 0,
    "color": "#06110B",
    "opacity": 0.1
  },
  "lg": {
    "offsetX": 0,
    "offsetY": 8,
    "blur": 24,
    "spread": 0,
    "color": "#06110B",
    "opacity": 0.14
  }
} as const;
