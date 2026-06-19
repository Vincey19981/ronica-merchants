import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAssets = () =>
  useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assets").select("*, organizations(name)").order("asset_tag");
      if (error) throw error;
      return data ?? [];
    },
  });

export const useUpsertAsset = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (asset: any) => {
      const { error } = asset.id
        ? await supabase.from("assets").update(asset).eq("id", asset.id)
        : await supabase.from("assets").insert(asset);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assets"] }),
  });
};

export const useDeleteAsset = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("assets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assets"] }),
  });
};