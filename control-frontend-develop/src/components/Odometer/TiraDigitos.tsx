import { motion } from 'framer-motion';

interface IProps {
    digit: number;
    digitHeight: number;
}

export const TiraDigitos = ({ digit, digitHeight }: IProps) => {
    return (
        <div style={{ height: `${digitHeight}px`, overflow: 'hidden' }}>
            <motion.div
                // Esta es la "tira" de números que se mueve verticalmente
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
                // Mover la tira hacia arriba según el dígito actual, por ejemplo si es 3, mover 3 veces la altura del dígito hacia arriba
                animate={{ y: -(digitHeight * digit) }}
                // Podemos añadir una transición para que sea suave
                transition={{
                    duration: 1.3,
                    ease: 'easeInOut',
                    stiffness: 100,
                }}
            >
                {/* Renderizamos todos los números del 0 al 9 apilados */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <span
                        key={num}
                        className="text-center flex items-center justify-center "
                        style={{
                            height: `${digitHeight}px`,
                        }}
                    >
                        {num}
                    </span>
                ))}
            </motion.div>
        </div>
    );
};
