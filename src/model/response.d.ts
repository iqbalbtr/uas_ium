export type ResponseList<T> = {
    page: number;
    limit: number;
    total_page: number;
    total_item: number;
    data: T[]
}