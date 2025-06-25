export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  error: string;

  background: string;
  surface: string;
  surfaceHover: string;

  border: string;
  borderHover: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  richBlack: string;
  oxfordBlue: string;
  gunmetal: string;
  lightSeaGreen: string; // #00B9AE
  cornellRed: string; // #BA1A1A
  antiFlashWhite: string; // #F0F0F0
}

// Tema claro
export const lightTheme: ThemeColors = {
  // Cores primárias
  primary: "#00B9AE", // Light sea green
  secondary: "#0F172A", // Oxford Blue
  accent: "#1F2937", // Gunmetal
  success: "#00B9AE", // Light sea green
  error: "#BA1A1A", // Cornell red

  // Cores de fundo
  background: "#F0F0F0", // Anti-flash white
  surface: "#FFFFFF", // White (para cards)
  surfaceHover: "#E5E5E5", // Variação mais escura do anti-flash white

  // Cores de borda
  border: "#D0D0D0", // Variação do anti-flash white
  borderHover: "#1F2937", // Gunmetal

  // Cores de texto
  textPrimary: "#030712", // Rich black
  textSecondary: "#0F172A", // Oxford Blue
  textMuted: "#1F2937", // Gunmetal

  // Cores específicas da paleta
  richBlack: "#030712",
  oxfordBlue: "#0F172A",
  gunmetal: "#1F2937",
  lightSeaGreen: "#00B9AE",
  cornellRed: "#BA1A1A",
  antiFlashWhite: "#F0F0F0"
};

// Tema escuro
export const darkTheme: ThemeColors = {
  // Cores primárias
  primary: "#00B9AE", // Light sea green
  secondary: "#F0F0F0", // Anti-flash white
  accent: "#1F2937", // Gunmetal
  success: "#00B9AE", // Light sea green
  error: "#BA1A1A", // Cornell red

  // Cores de fundo
  background: "#030712", // Rich black
  surface: "#0F172A", // Oxford Blue
  surfaceHover: "#1F2937", // Gunmetal

  // Cores de borda
  border: "#1F2937", // Gunmetal
  borderHover: "#00B9AE", // Light sea green

  // Cores de texto
  textPrimary: "#F0F0F0", // Anti-flash white
  textSecondary: "#00B9AE", // Light sea green
  textMuted: "#1F2937", // Gunmetal (mais claro no dark)

  // Cores específicas da paleta
  richBlack: "#030712",
  oxfordBlue: "#0F172A",
  gunmetal: "#1F2937",
  lightSeaGreen: "#00B9AE",
  cornellRed: "#BA1A1A",
  antiFlashWhite: "#F0F0F0"
};

// Hook para obter as cores baseado no tema
export const getThemeColors = (isDark: boolean): ThemeColors => {
  return isDark ? darkTheme : lightTheme;
};

// Cores específicas para status (usando a nova paleta)
export const statusColors = {
  connected: "#00B9AE", // Light sea green
  connecting: "#1F2937", // Gunmetal
  disconnected: "#BA1A1A", // Cornell red
  error: "#BA1A1A", // Cornell red
  default: "#0F172A" // Oxford Blue
} as const;

// Função helper para obter cor de status
export const getStatusColor = (status: string): string => {
  return (
    statusColors[status as keyof typeof statusColors] || statusColors.default
  );
};

// Função helper para obter texto de status
export const getStatusText = (status: string): string => {
  const texts = {
    connected: "Conectado",
    disconnected: "Desconectado",
    connecting: "Conectando...",
    error: "Erro"
  };
  return texts[status as keyof typeof texts] || "Desconhecido";
};

// Badge colors para status
export const getStatusBadgeColor = (status: string): string => {
  const colors = {
    connected: "green", // Manteremos verde para compatibilidade com Ant Design
    connecting: "orange",
    disconnected: "red",
    error: "red"
  };
  return colors[status as keyof typeof colors] || "default";
};
