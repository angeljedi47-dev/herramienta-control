interface IProps {
    title: string;
}
export const MainTitle = ({ title }: IProps) => {
    return (
        <div className="relative">
            <h2 className="text-2xl font-bold">{title}</h2>
            <hr className="border-t border-[#DCE0E0] mb-8 before:content-[''] before:w-9 before:h-1 before:bg-secondary before:absolute before:bottom-[-4px] before:left-0" />
        </div>
    );
};
