import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../api/category";

export const useCategory = () => {
    return useQuery({
        queryKey: ["category"],
        queryFn: getCategory,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000* 60*10,
    });
};