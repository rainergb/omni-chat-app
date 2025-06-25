import { type ClassValue, clsx } from "clsx";
import { getStatusColor, getStatusText, getStatusBadgeColor } from "./theme";

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

export { getStatusColor, getStatusText, getStatusBadgeColor };

export function getPlatformIcon(type: string): string {
  const icons = {
    whatsapp: "whatsapp",
    instagram: "instagram",
    facebook: "facebook",
    telegram: "telegram"
  };
  return icons[type as keyof typeof icons] || "whatsapp";
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
