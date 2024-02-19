export type SliverHeaderBarProps = {
    fullscreen?: boolean;
    headerColor?: string;
    height?: number;
}

export type SliverHeaderBarState = {
    statusBarHeight: number;
    values: {
        margin: number;
        opacity: number;
    };
    max: number;
}