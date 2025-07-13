import React from 'react';
import { motion } from 'framer-motion';

interface SidebarItem {
  id: string;
  name: string;
  icon: string;
}

interface ProfileSidebarProps {
  items: SidebarItem[];
  active: string;
  onSelect: (id: string) => void;
}

/**
 * ProfileSidebar
 * Responsive vertical navigation (shows on md+). On small screens this is hidden
 * in favour of the horizontal pill nav rendered by the parent component.
 */
const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ items, active, onSelect }) => {
  return (
    <aside className="hidden md:block w-64 bg-theme-surface border border-theme rounded-xl p-4 shadow-sm h-max sticky top-24">
      <nav className="space-y-2">
        {items.map(item => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(item.id)}
            className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 text-left text-sm
            ${active === item.id ? 'bg-theme-primary text-white shadow' : 'text-theme-muted hover:bg-theme-background hover:text-theme-primary'}`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </motion.button>
        ))}
      </nav>
    </aside>
  );
};

export default ProfileSidebar; 