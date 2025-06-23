import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInHours = (now.getTime() - targetDate.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInHours * 60);
    return `${diffInMinutes}m atrás`;
  }

  if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h atrás`;
  }

  if (diffInHours < 24 * 7) {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  }

  return targetDate.toLocaleDateString("pt-BR");
}

export function getStatusColor(status: string): string {
  const colors = {
    connected: "#52c41a",
    disconnected: "#f5222d",
    connecting: "#faad14",
    error: "#ff4d4f"
  };
  return colors[status as keyof typeof colors] || "#d9d9d9";
}

export function getStatusText(status: string): string {
  const texts = {
    connected: "Conectado",
    disconnected: "Desconectado",
    connecting: "Conectando...",
    error: "Erro"
  };
  return texts[status as keyof typeof texts] || "Desconhecido";
}

export function getPlatformIcon(type: string): string {
  const icons = {
    whatsapp: "💬",
    instagram: "📷",
    facebook: "📘",
    telegram: "✈️"
  };
  return icons[type as keyof typeof icons] || "📱";
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
