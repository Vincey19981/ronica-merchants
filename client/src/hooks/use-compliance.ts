import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "@/lib/api/client";
import { complianceApi, type ComplianceDocument } from "@/lib/api/compliance";

export type { ComplianceDocument };

export const useComplianceDocs = () =>
  useQuery({
    queryKey: ["compliance"],
    queryFn: complianceApi.list,
  });

export const useUploadCompliance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: complianceApi.upload,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["compliance"] }),
  });
};

export const useReviewCompliance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; status: ComplianceDocument["status"]; notes?: string }) =>
      complianceApi.review(args.id, args.status, args.notes),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["compliance"] }),
  });
};

export const getComplianceSignedUrl = async (downloadPath: string) => apiUrl(downloadPath);
