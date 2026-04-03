import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    useSidebar,
} from '@/components/ui/sidebar';
import { displayName, version, shortName } from '../../../../package.json';
import { NavSidebar } from '@/components/admin-panel/nav-sidebar';
export const AppSidebar = () => {
    const { isMobile } = useSidebar();
    return (
        <>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    {!isMobile && (
                        <div className="group-data-[state=expanded]:hidden">
                            <span className="text-white font-bold text-[12px]">
                                {shortName}
                            </span>
                        </div>
                    )}
                    <div className="group-data-[collapsible=icon]:hidden">
                        <h1 className="text-white font-bold m-2">
                            {displayName}
                        </h1>
                        <div className="flex justify-end">
                            <sup className="text-white">v{version}</sup>
                        </div>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <NavSidebar />
                </SidebarContent>
                <SidebarFooter />
            </Sidebar>
        </>
    );
};
