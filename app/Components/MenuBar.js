"use client";
import { Button, ConfigProvider, Dropdown, Menu } from "antd";
import Column from "antd/es/table/Column";
import Link from "antd/es/typography/Link";
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const MenuBar = ({menu,menuBtns}) => {


  return (
    <div className="menu-bar">
      {Object.keys(menu).map((category) => {
        const items = menu[category].map(item => ({
          key: item.key,
          label: item.label,
          onClick: item.onClick
        }));

        return (
          <Dropdown  key={category} menu={{ items }}>
            <Link href="#" style={{ color: "black" }}>
              {category}
            </Link>
          </Dropdown>
        );
      })}
      {
        menuBtns.map((btn) => {
          return (
            <Button key={btn.key} variant="text" onClick={btn.onClick} color="default">
              {btn.label}
            </Button>
          );
        })
      }
    </div>
  );
};

export default MenuBar;
