import React from 'react';
import { Document, Page, StyleSheet, Image, Font } from '@react-pdf/renderer';
import * as fs from 'fs';
import * as path from 'path';

process.setMaxListeners(0);

// Registrar fuentes
Font.registerHyphenationCallback((word: string) => [word]);
Font.register({
    family: 'NotoSans',
    fonts: [
        {
            src: path.join(
                __dirname,
                '../../../../public/statics/fonts/NotoSans-Regular.ttf',
            ),
        },
        {
            src: path.join(
                __dirname,
                '../../../../public/statics/fonts/NotoSans-Bold.ttf',
            ),
            fontWeight: 'bold',
        },
    ],
});

// Cargar imagen de fondo
const bg = fs.readFileSync(
    path.join(
        __dirname,
        '../../../../public/statics/img/pdf_bg_actual_year.jpg',
    ),
);

interface IPdfBaseDocumentProps {
    children: React.ReactNode;
    orientation?: 'portrait' | 'landscape';
    size?: 'LETTER' | 'A4';
}

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        fontFamily: 'NotoSans',
        fontSize: 10,
        backgroundColor: '#ffffff',
        paddingTop: 100,
        paddingBottom: 90,
        paddingHorizontal: 35,
        marginTop: 0,
        marginBottom: 20,
    },
    bg: {
        position: 'absolute',
        left: '0px',
        right: '0px',
        bottom: '0px',
        top: '0px',
    },
});

export const PdfBaseDocument: React.FC<IPdfBaseDocumentProps> = ({
    children,
    orientation = 'portrait',
    size = 'LETTER',
}) => {
    return (
        <Document>
            <Page
                size={size}
                orientation={orientation}
                style={styles.page}
                minPresenceAhead={20}
            >
                <Image src={bg} style={styles.bg} fixed />
                {children}
            </Page>
        </Document>
    );
};
