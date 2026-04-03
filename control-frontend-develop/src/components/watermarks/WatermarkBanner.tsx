interface IProps {
    text: string | null;
}
export function WatermarkBanner({ text }: IProps) {
    if (!text) {
        return null;
    }

    const watermarkSpans = Array(24)
        .fill(null)
        .map((_, i) => <span key={i}>{text}</span>);

    return <div className="warning-banner">{watermarkSpans}</div>;
}
