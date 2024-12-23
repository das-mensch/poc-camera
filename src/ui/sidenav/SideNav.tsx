import React, { useState } from 'react';
import './SideNav.css';

export type MenuItem = {
  key: string;
  title: string;
  icon: React.ReactNode;
};

type SideNavProps = {
  items: MenuItem[];
  onChange?: (key: string) => void;
};

const SideNav: React.FC<SideNavProps> = ({ items, onChange }) => {
  const [selectedKey, setSelectedKey] = useState<string>(items[0].key);

  return (
    <nav className="sidenav">
      {items.map((item) => (
        <div
          key={item.key}
          className={`sidenav-item sidenav-item-${item.key} ${item.key === selectedKey && 'sidenav-item-selected'}`}
          onClick={(e) => {
            if (item.key === selectedKey) return;
            const ripple = document.createElement('span');
            ripple.classList.add('sidenav-item-ripple');

            const button = document.querySelector(`.sidenav-item-${item.key}`);
            if (!button) return;

            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size * 2}px`;

            const x = e.clientX - rect.left - size;
            const y = e.clientY - rect.top - size;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 500);

            setSelectedKey(item.key);
            onChange && onChange(item.key);
          }}
        >
          {item.icon}
          <p className="sidenav-item-title">{item.title}</p>
        </div>
      ))}
    </nav>
  );
};

export default SideNav;
