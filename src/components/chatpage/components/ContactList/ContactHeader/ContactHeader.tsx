// src/components/chatpage/components/ContactList/ContactHeader.tsx
import React, { useState } from "react";
import { Button, Dropdown, Tooltip } from "antd";
import { Search, Filter, MessageCircle, MoreVertical, X } from "lucide-react";
import type { MenuProps } from "antd";
import { useTheme } from "@/contexts/ThemeContext";
import { useChat } from "@/hooks/useChat";
import {
  HeaderContainer,
  HeaderTop,
  Title,
  ActionsContainer,
  SearchContainer,
  SearchInput,
  SearchIcon,
  ClearButton,
  FilterSection
} from "./ContactHeader.styles";

export const ContactHeader: React.FC = () => {
  const { isDark } = useTheme();
  const {
    search,
    filter,
    toggleUnreadFilter,
    selectedInstance,
    availableInstances,
    selectInstance
  } = useChat();

  const [searchValue, setSearchValue] = useState(filter.searchTerm || "");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    search(value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    search("");
  };

  // Menu do dropdown de instâncias
  const instanceMenuItems: MenuProps["items"] = availableInstances.map(
    (instance) => ({
      key: instance.id,
      label: (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>{instance.name}</span>
          <span className="text-xs text-gray-400">({instance.type})</span>
        </div>
      ),
      onClick: () => selectInstance(instance.id)
    })
  );

  // Menu de filtros
  const filterMenuItems: MenuProps["items"] = [
    {
      key: "unread",
      label: (
        <div className="flex items-center justify-between w-full">
          <span>Apenas não lidas</span>
          {filter.unreadOnly && (
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
        </div>
      ),
      onClick: toggleUnreadFilter
    },
    {
      type: "divider"
    },
    {
      key: "all",
      label: "Todas as conversas",
      onClick: () => {
        if (filter.unreadOnly) toggleUnreadFilter();
        if (searchValue) {
          setSearchValue("");
          search("");
        }
      }
    }
  ];

  const currentInstance = availableInstances.find(
    (i) => i.id === selectedInstance
  );

  return (
    <HeaderContainer $isDark={isDark}>
      {/* Header top com título e ações */}
      <HeaderTop>
        <Title $isDark={isDark}>
          <MessageCircle size={20} />
          Messagens
        </Title>

        <ActionsContainer>
          {/* Seletor de instância */}
          {availableInstances.length > 1 && (
            <Tooltip title="Trocar instância">
              <Dropdown
                menu={{ items: instanceMenuItems }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button
                  type="text"
                  size="small"
                  className={`text-xs ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {currentInstance?.name.slice(0, 8)}...
                </Button>
              </Dropdown>
            </Tooltip>
          )}

          {/* Filtros */}
          <Tooltip title="Filtros">
            <Dropdown
              menu={{ items: filterMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button
                type="text"
                icon={<Filter size={16} />}
                size="small"
                className={`${
                  isDark
                    ? "text-gray-300 hover:text-gray-100 hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                } ${filter.unreadOnly ? "text-blue-500" : ""}`}
              />
            </Dropdown>
          </Tooltip>

          {/* Menu adicional */}
          <Tooltip title="Mais opções">
            <Button
              type="text"
              icon={<MoreVertical size={16} />}
              size="small"
              className={
                isDark
                  ? "text-gray-300 hover:text-gray-100 hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }
            />
          </Tooltip>
        </ActionsContainer>
      </HeaderTop>

      {/* Seção de busca */}
      <SearchContainer $isDark={isDark}>
        <SearchIcon $isDark={isDark}>
          <Search size={16} />
        </SearchIcon>
        <SearchInput
          $isDark={isDark}
          type="text"
          placeholder="Search......"
          value={searchValue}
          onChange={handleSearchChange}
        />
        {searchValue && (
          <ClearButton $isDark={isDark} onClick={handleClearSearch}>
            <X size={14} />
          </ClearButton>
        )}
      </SearchContainer>

      {/* Filtros ativos */}
      {(filter.unreadOnly || filter.searchTerm) && (
        <FilterSection $isDark={isDark}>
          {filter.unreadOnly && (
            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
              Não lidas apenas
            </span>
          )}
          {filter.searchTerm && (
            <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded-full">
              Busca: {filter.searchTerm}
            </span>
          )}
        </FilterSection>
      )}
    </HeaderContainer>
  );
};