import { Button, type IButtonProps } from '@/components/ui/button';
import { Link, LinkProps } from '@tanstack/react-router';
import { ReactNode } from 'react';

interface ILinkAppProps {
    to: LinkProps['to'];
    children: ReactNode;
    size?: IButtonProps['size'];
    className?: string;
}

const LinkApp = ({ to, children, size = 'sm', className }: ILinkAppProps) => {
    return (
        <Button variant="link" asChild size={size} className={className}>
            <Link to={to}>{children}</Link>
        </Button>
    );
};

export default LinkApp;
