// src/components/instances/InstanceHeader.tsx
import React, { useState } from "react";
import { Tooltip } from "antd";
import { Grid3X3, List, RefreshCw, Search, Plus } from "lucide-react";
import { ViewMode, Instance } from "@/libs/types";
import { useTheme } from "@/contexts/ThemeContext";
import { Segmented } from "@/components/ui";
import { CreateInstanceModal } from "../CreateInstanceModal/CreateInstanceModal";
import {
  HeaderContainer,
  ContentWrapper,
  LeftSection,
  SearchContainer,
  SearchInput,
  SearchIcon,
  ClearButton,
  Spacer,
  RightSection,
  StyledButton,
  GradientButton
} from "./InstanceHeader.styles";

interface InstanceHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onCreateInstance: (
    instance: Omit<Instance, "id" | "createdAt">
  ) => Promise<void>;
  onRefresh: () => void;
  loading?: boolean;
}

export const InstanceHeader: React.FC<InstanceHeaderProps> = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onCreateInstance,
  onRefresh,
  loading = false
}) => {
  const { isDark } = useTheme();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (
    <>
      <HeaderContainer $isDark={isDark}>
        <ContentWrapper>
          <LeftSection>
            <GradientButton
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => setIsCreateModalOpen(true)}
              loading={loading}
            >
              Nova Instância
            </GradientButton>

            <SearchContainer $isDark={isDark}>
              <SearchIcon $isDark={isDark}>
                <Search size={16} />
              </SearchIcon>
              <SearchInput
                $isDark={isDark}
                placeholder="Buscar instâncias..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <ClearButton
                $isDark={isDark}
                $visible={!!searchTerm}
                onClick={handleClearSearch}
                type="button"
              >
                ×
              </ClearButton>
            </SearchContainer>
          </LeftSection>

          <Spacer />

          <RightSection>
            <Tooltip title="Atualizar lista">
              <StyledButton
                $isDark={isDark}
                icon={<RefreshCw size={16} />}
                onClick={onRefresh}
                loading={loading}
              />
            </Tooltip>
            <Segmented
              value={viewMode}
              onChange={(value) => onViewModeChange(value as ViewMode)}
              options={[
                {
                  label: "Cards",
                  value: "cards",
                  icon: <Grid3X3 size={16} />
                },
                {
                  label: "Lista",
                  value: "list",
                  icon: <List size={16} />
                }
              ]}
            />
          </RightSection>
        </ContentWrapper>
      </HeaderContainer>

      <CreateInstanceModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onCreateInstance={onCreateInstance}
      />
    </>
  );
};