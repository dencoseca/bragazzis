export interface OptimizedPictureImg {
    src: string;
    w: number;
    h: number;
}

export interface OptimizedPicture {
    sources: Record<string, string>;
    img: OptimizedPictureImg;
}
