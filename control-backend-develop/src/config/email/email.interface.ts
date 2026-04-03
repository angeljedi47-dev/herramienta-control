import { ITestEmailContext } from './examples/use-cases/test-email.context';

export interface IEmailAttachment {
    filename: string;
    content: Buffer;
    contentType?: string;
}

// Tipo genérico para las opciones de email
export interface IEmailOptions<
    T extends keyof TemplateMap = keyof TemplateMap,
> {
    to: string | string[];
    subject: string;
    template: T;
    context: TemplateMap[T];
    attachments?: IEmailAttachment[];
    cc?: string | string[];
    bcc?: string | string[];
}

// Mapa de plantillas a sus contextos
export type TemplateMap = {
    // Añadir más plantillas aquí
    'test-email': ITestEmailContext;
};
