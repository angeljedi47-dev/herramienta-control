interface ICharacterCounterProps {
    currentLength: number;
    minLength?: number;
    maxLength?: number;
}

export const CharacterCounter = ({
    currentLength,
    minLength,
    maxLength,
}: ICharacterCounterProps) => {
    const isInvalid =
        currentLength < (minLength || 0) ||
        currentLength > (maxLength || Infinity);

    return (
        <span
            className={`text-sm shrink-0 ${
                isInvalid ? 'text-destructive' : 'text-muted-foreground'
            }`}
        >
            Caracteres: {currentLength}
            {maxLength && `/${maxLength}`}
        </span>
    );
};
