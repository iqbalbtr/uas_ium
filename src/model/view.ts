import { LoadingType } from "@hooks/use-loading";

export type TableView<T> = { data: T[], isLoading: LoadingType, handleFetch?: () => Promise<void> }
export type TableMutation<T> = {
    data: T,
    handleFetch?: () => Promise<void>
}
export type CreateView<T> = { data: T[], isLoading: LoadingType, handleFetch?: () => Promise<void> }