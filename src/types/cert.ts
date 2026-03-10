export interface CertItem{
    certId: number;
    categoryId: number;
    name: string;
    authority: string;
    description :string | null;
}

export interface CertPageData {
    content: CertItem[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
    isFirst: boolean;
    isLast: boolean;
}

export interface ApiResponse<T>{
    status: number;
    message: string;
    data: T;
    path: string;
    timestamp: string;
}

export interface CertSearchParams {
    categoryIds?: number[];
    keyword?: string;
    page?: number;
    size?: number;
    sort?: string;
}