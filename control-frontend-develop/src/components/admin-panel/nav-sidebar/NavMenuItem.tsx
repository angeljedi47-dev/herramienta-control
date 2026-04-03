import { useState, useEffect } from 'react';
import { Link, useMatches } from '@tanstack/react-router';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import {
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
} from '@/components/ui/sidebar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { INavSidebarItem } from './types';
import { useCan } from '@/hooks/auth/useCan';

export const NavMenuItem = ({
    item,
    level = 0,
}: {
    item: INavSidebarItem;
    level?: number;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [hasActiveChild, setHasActiveChild] = useState(false);
    const { state } = useSidebar();
    const matches = useMatches();

    const hasPermission =
        !item.id_db ||
        (Array.isArray(item.id_db) &&
            useCan({ operation: item.id_db, tipo: 'modulos', all: false }));
    const hasChildren = item.children && item.children.length > 0;
    const isCollapsed = state === 'collapsed';
    const isDeepLevel = level > 1;

    useEffect(() => {
        const checkActiveState = (items?: INavSidebarItem[]): boolean => {
            if (!items) return false;
            return items.some(
                (child) =>
                    matches.some((match) => match.pathname === child.url) ||
                    checkActiveState(child.children),
            );
        };

        const isChildActive = checkActiveState(item.children);
        setHasActiveChild(isChildActive);

        if (isChildActive && !isOpen) {
            const isInitialMount = !isOpen;
            if (isInitialMount) {
                setIsOpen(true);
            }
        }
    }, [matches, item.children]);

    if (!hasPermission) return null;

    if (hasChildren && item.children) {
        const childContent = item.children.map((child) => (
            <NavMenuItem key={child.id} item={child} level={level + 1} />
        ));

        if (isCollapsed) {
            return (
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                className={cn(
                                    'w-full justify-between',
                                    hasActiveChild &&
                                        'bg-primary-foreground !text-primary',
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </div>
                                <ChevronRight className="h-4 w-4" />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </PopoverTrigger>
                    <PopoverContent
                        side="right"
                        className="w-48 p-2 bg-sidebar border-sidebar-border"
                        align="start"
                        sideOffset={12}
                    >
                        <div className="flex flex-col gap-1 list-none">
                            {childContent}
                        </div>
                    </PopoverContent>
                </Popover>
            );
        }

        return (
            <SidebarMenuItem className="list-none">
                <SidebarMenuButton
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        'justify-between group',
                        hasActiveChild && 'bg-primary-foreground !text-primary',
                        isDeepLevel && ' text-sm hover:bg-sidebar-accent/50',
                    )}
                    title={isDeepLevel ? item.name : undefined}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.name}</span>
                    </div>
                    <ChevronDown
                        className={`h-4 w-4 transition-transform shrink-0 ${
                            isOpen ? 'rotate-180' : ''
                        }`}
                    />
                </SidebarMenuButton>
                {isOpen && (
                    <SidebarMenuSub
                        className={cn(
                            'list-none',
                            isDeepLevel &&
                                'ml-2 text-sm border-l-sidebar-accent/50',
                        )}
                    >
                        {childContent}
                    </SidebarMenuSub>
                )}
            </SidebarMenuItem>
        );
    }

    return (
        <SidebarMenuItem className="list-none">
            <SidebarMenuButton
                asChild
                className={cn(
                    isDeepLevel && 'text-sm hover:bg-sidebar-accent/50',
                )}
                title={isDeepLevel ? item.name : undefined}
            >
                <Link
                    to={item.url!}
                    activeProps={{
                        className: 'bg-primary-foreground !text-primary',
                    }}
                    activeOptions={{ exact: true }}
                >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.name}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
};
