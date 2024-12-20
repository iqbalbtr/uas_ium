"use client"

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@components/ui/pagination";
import { toast } from "./use-toast";
import useLoading from "./use-loading";

type Paggination = {
    limit: number,
    page: number,
    total_item: number,
    total_page: number,
}

function useNumberPage({defaultLimit = 10, defaultPage = 1}:{defaultLimit?: number, defaultPage?: number}){
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page") ?? defaultPage);
    const limit = Number(searchParams.get("limit") ?? defaultLimit);

    return {
        getNumber: (i: number) => ((page - 1) * limit + i + 1)
    }
}

function usePagination<T>({
    handleGet,
    initialize,
    setData
}: {
    handleGet?: (pagging: Paggination, setPagination: React.Dispatch<React.SetStateAction<Paggination>>) => Promise<void>,
    initialize?: boolean,
    setData?: React.Dispatch<React.SetStateAction<T[]>>
}) {
    const searchParams = useSearchParams();
    const { isLoading, setLoading } = useLoading()

    const [pagination, setPagination] = useState({
        limit: 10,
        page: 1,
        total_item: 0,
        total_page: 0,
    });

    const nextPageGroup = (Math.ceil(pagination.page / 5) - 1) * 5;

    const currentPages = Array.from(
        { length: Math.min(5, pagination.total_page - nextPageGroup) },
        (_, index) => nextPageGroup + index + 1
    );

    const handleNext = () => {
        if (pagination.page < pagination.total_page) {
            setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const handlePrev = () => {
        if (pagination.page > 1) {
            setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
        }
    };

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, page }));
    };

    useEffect(() => {
        handleFetch()
    }, [searchParams]);

    const handleFetch = async () => {
        const page = Number(searchParams.get("page"));

        try {
            if (page) {
                setData && setData([])
                setPagination((prev) => ({ ...prev, page }));
                setLoading("loading")
                handleGet && await handleGet(pagination, setPagination)
                setLoading("success")
            } else {
                setData && setData([])
                setLoading("loading")
                initialize && handleGet && await handleGet(pagination, setPagination)
                setLoading("success")
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setLoading("idle")
        }
    }

    return {
        Paggination: () => (
            <Pagination className="my-4 mt-16">
                <PaginationContent>
                    {
                        pagination.page > 1 && (
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={handlePrev}
                                    href={`?page=${pagination.page - 1}&limit=${pagination.limit}`}
                                />
                            </PaginationItem>
                        )
                    }
                    {pagination.page > 5 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}
                    {currentPages.map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href={`?page=${page}`}
                                onClick={() => handlePageChange(page)}
                                isActive={page === pagination.page}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    {pagination.total_page > nextPageGroup + 5 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}
                    {
                        pagination.page !== pagination.total_page && (
                            <PaginationItem>
                                <PaginationNext
                                    onClick={handleNext}
                                    href={`?page=${pagination.page + 1}&limit=${pagination.limit}`}
                                />
                            </PaginationItem>
                        )
                    }
                </PaginationContent>
            </Pagination>
        ),
        setPagination,
        pagination,
        handleFetch,
        isLoading
    }
}

export {useNumberPage}

export default usePagination
