import pleca from '@/assets/images/pleca.svg';
export const FooterAdmin = () => {
    return (
        <footer className="flex flex-col justify-between bg-primary">
            <div
                className="h-[51.41px] w-full"
                style={{ backgroundImage: `url(${pleca})` }}
            ></div>
        </footer>
    );
};
