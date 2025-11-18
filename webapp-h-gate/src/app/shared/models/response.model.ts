export interface ResponseDTO<T> {
    data: T;
    message: string;
    response_code: number;
}

export interface PaginatedResponseDTO<T> {
    data: PaginatedResponseData<T>;
    message: string;
    response_code: number;
}

export interface PaginatedResponseData<T> {
    count: number;
    next: string;
    previous: string;
    results: T;
}