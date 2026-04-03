export class FileSizeUtil {
    private static readonly BYTES_IN_KB = 1024;
    public static readonly BYTES_IN_MB = 1024 * 1024;
    private static readonly BYTES_IN_GB = 1024 * 1024 * 1024;

    /**
     * Convierte y formatea un tamaño en bytes a su unidad más apropiada
     * @param bytes - Tamaño en bytes
     * @returns string formateado con la unidad correspondiente
     */
    static formatFileSize(bytes: number): string {
        if (bytes < this.BYTES_IN_KB) {
            return `${bytes} bytes`;
        } else if (bytes < this.BYTES_IN_MB) {
            return `${(bytes / this.BYTES_IN_KB).toFixed(2)} KB`;
        } else if (bytes < this.BYTES_IN_GB) {
            return `${(bytes / this.BYTES_IN_MB).toFixed(2)} MB`;
        } else {
            return `${(bytes / this.BYTES_IN_GB).toFixed(2)} GB`;
        }
    }

    /**
     * Convierte una cantidad de bytes a la unidad especificada
     * @param bytes - Tamaño en bytes
     * @param unit - Unidad deseada ('KB', 'MB', 'GB')
     */
    static convertBytes(bytes: number, unit: 'KB' | 'MB' | 'GB'): number {
        switch (unit) {
            case 'KB':
                return bytes / this.BYTES_IN_KB;
            case 'MB':
                return bytes / this.BYTES_IN_MB;
            case 'GB':
                return bytes / this.BYTES_IN_GB;
            default:
                return bytes;
        }
    }
}
