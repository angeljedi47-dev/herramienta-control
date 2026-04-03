import { Injectable } from '@nestjs/common';
import { EnvsService } from './config/env/services/envs.service';
import { DateTimeService } from './config/date-time/date-time.service';
import { NODE_ENVIROMENTS } from './config/env/interfaces/envs.interface';

@Injectable()
export class AppService {
    constructor(
        private configService: EnvsService,
        private dateTimeService: DateTimeService,
    ) {}

    getHello(): string {
        const server = this.configService.getGroup('SERVER');
        return server.ENVIRONMENT;
    }

    getCurrentDate(): Date {
        return this.dateTimeService.getCurrentDate();
    }

    getCurrentYear(): number {
        return this.dateTimeService.getCurrentYear();
    }

    setSimulatedDate(date: Date | null): void {
        if (
            this.configService.getGroup('SERVER').ENVIRONMENT ===
            NODE_ENVIROMENTS.DEVELOPMENT
        ) {
            this.dateTimeService.setSimulatedDate(date);
        }
    }

    setSimulatedYear(year: number): void {
        if (
            this.configService.getGroup('SERVER').ENVIRONMENT ===
            NODE_ENVIROMENTS.DEVELOPMENT
        ) {
            this.dateTimeService.setSimulatedYear(year);
        }
    }

    resetSimulatedDate(): void {
        if (
            this.configService.getGroup('SERVER').ENVIRONMENT ===
            NODE_ENVIROMENTS.DEVELOPMENT
        ) {
            this.dateTimeService.resetSimulatedDate();
        }
    }
}
