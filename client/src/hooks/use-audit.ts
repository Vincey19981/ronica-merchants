import { useQuery } from "@tanstack/react-query";

export const useAuditLog = (_filters?: { resource_type?: string; action?: string }) =>
  useQuery({
    queryKey: ["audit", _filters ?? {}],
    queryFn: async () => [],
  });
