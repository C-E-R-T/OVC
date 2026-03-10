import {useQuery} from "@tanstack/react-query";
import { getCertDetails } from "../api/certSearch";

export const useCertDetail = (certId: number | null) => {
    return useQuery({
        queryKey: ["certDetail",certId],
        queryFn: () => getCertDetails({certId: certId as number}),
        enabled: certId !== null,
    });
};