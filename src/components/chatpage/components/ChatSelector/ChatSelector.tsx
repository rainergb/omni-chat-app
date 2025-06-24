// src/components/chatpage/components/ChatSelector/ChatSelector.tsx
import React from "react";
import { Button } from "antd";
import { MessageCircle, Settings, Power } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { useInstanceStore } from "@/store/instanceStore";
import {
  SelectorContainer,
  SelectorContent,
  SelectorIcon,
  SelectorTitle,
  SelectorDescription,
  InstancesList,
  InstanceItem,
  InstanceInfo,
  InstanceName,
  InstanceStatus,
  ActionButtons
} from "./ChatSelector.styles";

interface ChatSelectorProps {
  onSelectInstance: (instanceId: string) => void;
}

export const ChatSelector: React.FC<ChatSelectorProps> = ({
  onSelectInstance
}) => {
  const { isDark } = useTheme();
  const { setActiveTab } = useNavigation();
  const { instances } = useInstanceStore();

  const disconnectedInstances = instances.filter(
    (instance) =>
      instance.status === "disconnected" || instance.status === "error"
  );

  const handleGoToInstances = () => {
    setActiveTab("instances");
  };

  const handleConnectInstance = (instanceId: string) => {
    // Por enquanto apenas simula a seleção
    onSelectInstance(instanceId);
  };

  if (instances.length === 0) {
    return (
      <SelectorContainer $isDark={isDark}>
        <SelectorContent>
          <SelectorIcon $isDark={isDark}>
            <MessageCircle size={64} />
          </SelectorIcon>

          <SelectorTitle $isDark={isDark}>
            Nenhuma instância encontrada
          </SelectorTitle>

          <SelectorDescription $isDark={isDark}>
            Você precisa criar pelo menos uma instância para usar o chat. Vá
            para a seção de instâncias para criar e configurar suas conexões.
          </SelectorDescription>

          <ActionButtons>
            <Button
              type="primary"
              size="large"
              icon={<Settings size={18} />}
              onClick={handleGoToInstances}
              className="bg-gradient-to-r from-teal-500 to-slate-800"
            >
              Gerenciar Instâncias
            </Button>
          </ActionButtons>
        </SelectorContent>
      </SelectorContainer>
    );
  }

  return (
    <SelectorContainer $isDark={isDark}>
      <SelectorContent>
        <SelectorIcon $isDark={isDark}>
          <MessageCircle size={64} />
        </SelectorIcon>

        <SelectorTitle $isDark={isDark}>
          Nenhuma instância conectada
        </SelectorTitle>

        <SelectorDescription $isDark={isDark}>
          Para usar o chat, você precisa ter pelo menos uma instância conectada.
          Conecte uma das instâncias abaixo ou gerencie suas instâncias.
        </SelectorDescription>

        {disconnectedInstances.length > 0 && (
          <InstancesList $isDark={isDark}>
            {disconnectedInstances.map((instance) => (
              <InstanceItem key={instance.id} $isDark={isDark}>
                <InstanceInfo>
                  <InstanceName $isDark={isDark}>{instance.name}</InstanceName>
                  <InstanceStatus $isDark={isDark} $status={instance.status}>
                    {instance.status === "disconnected"
                      ? "Desconectado"
                      : "Erro"}
                  </InstanceStatus>
                </InstanceInfo>

                <Button
                  type="default"
                  size="small"
                  icon={<Power size={14} />}
                  onClick={() => handleConnectInstance(instance.id)}
                >
                  Conectar
                </Button>
              </InstanceItem>
            ))}
          </InstancesList>
        )}

        <ActionButtons>
          <Button
            type="primary"
            size="large"
            icon={<Settings size={18} />}
            onClick={handleGoToInstances}
            className="bg-gradient-to-r from-teal-500 to-slate-800"
          >
            Gerenciar Instâncias
          </Button>
        </ActionButtons>
      </SelectorContent>
    </SelectorContainer>
  );
};
