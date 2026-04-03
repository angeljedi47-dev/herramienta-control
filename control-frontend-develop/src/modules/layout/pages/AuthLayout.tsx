import { displayName } from '../../../../package.json';
import { Outlet } from '@tanstack/react-router';

const AuthLayout = () => {
    return (
        <div className="flex h-screen">
            <div className="relative flex-1 justify-center items-center hidden md:block">
                <img
                    className="w-full h-full object-cover filter brightness-[40%]"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAG_z0KPlb-NdzXvDy6QrtzXhkUd_Bzek_ww&s"
                    alt="Login"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h1 className="text-white text-4xl font-bold text-center">
                        {displayName}
                    </h1>
                </div>
            </div>
            <div className="flex-1 md:flex md:justify-center md:items-center">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
