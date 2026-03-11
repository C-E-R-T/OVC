export type ApiResponse<T>= {
    status: number;
    message: string;
    data: T;
    timestamp: string;
    path: string;
};