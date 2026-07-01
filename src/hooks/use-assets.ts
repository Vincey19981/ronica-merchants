import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAssets = () =>
  useQuery({
    queryKey: ["assets"],
    queryFn: async () => [],
  });

export const useUpsertAsset = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => undefined,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assets"] }),
  });
};

export const useDeleteAsset = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => undefined,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assets"] }),
  });
};
