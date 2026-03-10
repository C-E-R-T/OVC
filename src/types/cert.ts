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

export interface CertDetailParams {
  certId: number;
}

export interface CertDetail {
    name:string;
    authority: string;
    writtenFee?: number | null; // 실데이터추가해서 notnull인걸로 갱신해야됨
    practicalFee?: number | null;// 이하동문
    examTrend: string;
    acqMethod: string;
    precautions: string;
}