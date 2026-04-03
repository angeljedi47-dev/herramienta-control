import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

interface ITestCustomProps {
    title: string;
    content: string;
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333333',
    },
    content: {
        fontSize: 12,
        lineHeight: 1.5,
        marginBottom: 30,
        textAlign: 'justify',
    },
});

export const TestCustomDocument: React.FC<ITestCustomProps> = ({
    title,
    content,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.content}>{content}</Text>
        </View>
    );
};
