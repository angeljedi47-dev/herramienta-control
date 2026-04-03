import { Injectable } from '@nestjs/common';

@Injectable()
export class DateTimeService {
    private dateOffset: number | null = null;

    /**
     * Obtiene la fecha y hora actual del servidor o la fecha simulada si está configurada
     * @returns Date - Fecha y hora actual o simulada
     */
    getCurrentDate(): Date {
        if (this.dateOffset === null) {
            return new Date();
        }

        // Aplicar el offset a la fecha actual para que siga avanzando
        const now = new Date();
        return new Date(now.getTime() + this.dateOffset);
    }

    /**
     * Obtiene el año actual del servidor o el año simulado si está configurado
     * @returns number - Año actual o simulado
     */
    getCurrentYear(): number {
        return this.getCurrentDate().getFullYear();
    }

    /**
     * Configura una fecha simulada para pruebas o simulaciones
     * La fecha seguirá avanzando normalmente a partir de la fecha configurada
     * @param date Fecha a simular
     */
    setSimulatedDate(date: Date | null): void {
        if (date === null) {
            this.dateOffset = null;
            return;
        }

        // Calcular la diferencia entre la fecha actual y la fecha simulada
        const now = new Date();
        this.dateOffset = date.getTime() - now.getTime();
    }

    /**
     * Configura un año simulado para pruebas o simulaciones
     * La fecha seguirá avanzando normalmente pero en el año configurado
     * @param year Año a simular
     */
    setSimulatedYear(year: number): void {
        const currentDate = new Date();
        const targetDate = new Date(currentDate);
        targetDate.setFullYear(year);
        this.setSimulatedDate(targetDate);
    }

    /**
     * Simula una fecha en el futuro
     * @param days Días en el futuro
     * @param months Meses en el futuro
     * @param years Años en el futuro
     */
    simulateFutureDate(days = 0, months = 0, years = 0): void {
        const currentDate = new Date();
        const targetDate = new Date(currentDate);

        if (days > 0) {
            targetDate.setDate(targetDate.getDate() + days);
        }

        if (months > 0) {
            targetDate.setMonth(targetDate.getMonth() + months);
        }

        if (years > 0) {
            targetDate.setFullYear(targetDate.getFullYear() + years);
        }

        this.setSimulatedDate(targetDate);
    }

    /**
     * Simula una fecha en el pasado
     * @param days Días en el pasado
     * @param months Meses en el pasado
     * @param years Años en el pasado
     */
    simulatePastDate(days = 0, months = 0, years = 0): void {
        const currentDate = new Date();
        const targetDate = new Date(currentDate);

        if (days > 0) {
            targetDate.setDate(targetDate.getDate() - days);
        }

        if (months > 0) {
            targetDate.setMonth(targetDate.getMonth() - months);
        }

        if (years > 0) {
            targetDate.setFullYear(targetDate.getFullYear() - years);
        }

        this.setSimulatedDate(targetDate);
    }

    /**
     * Resetea la fecha simulada para volver a usar la fecha real del servidor
     */
    resetSimulatedDate(): void {
        this.dateOffset = null;
    }
}
