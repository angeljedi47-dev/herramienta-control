import { LinkOptions } from '@tanstack/react-router';
import { LucideIcon } from 'lucide-react';

export interface INavSidebarItem {
    id: number;
    name: string;
    url?: LinkOptions['to'];
    icon: LucideIcon;
    id_db?: number | number[];
    children?: INavSidebarItem[];
}

export interface INavMenuItemProps {
    item: INavSidebarItem;
    level?: number;
}
