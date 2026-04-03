import { SidebarGroup, SidebarMenu } from '@/components/ui/sidebar';
import { NavMenuItem } from './NavMenuItem';
import { navOptions } from './nav-items';

export const NavSidebar = () => {
    return (
        <SidebarGroup>
            <SidebarMenu className="list-none">
                {navOptions.map((navOption) => (
                    <NavMenuItem key={navOption.id} item={navOption} />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
};
