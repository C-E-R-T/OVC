import type { Certificate } from "../types/exam";
import { apiClient } from "./apiClient";

export async function getCertificates(cert_id: number): Promise<Certificate> {
    try {
        const res = await apiClient.get(`/certs/${cert_id}`);
        return res.data.data;
    } catch (error) {
        console.error("certificate 조회 실패", error);
        throw error;
    }
}