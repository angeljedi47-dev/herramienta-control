import { TiraDigitos } from './TiraDigitos';

interface IProps {
    value: number;
    digitHeight?: number;
}

export const OdometerCounter = ({ value, digitHeight = 10 }: IProps) => {
    const digitos = value.toString().split('').map(Number);
    return (
        <div
            style={{
                display: 'flex',
                height: `${digitHeight}px`,
                overflow: 'hidden',
            }}
        >
            {digitos.map((digit, index) => (
                <TiraDigitos
                    key={index}
                    digit={digit}
                    digitHeight={digitHeight}
                />
            ))}
        </div>
    );
};
