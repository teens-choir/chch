import { AdminLayout } from "@/components/AdminLayout";
import { useListUsers, useUpdateVoicePart, getListUsersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Members() {
  const { data: users, isLoading } = useListUsers({ query: { queryKey: getListUsersQueryKey() }});
  const updateVoicePart = useUpdateVoicePart();
  const queryClient = useQueryClient();

  const handleUpdate = (userId: number, voicePart: "Soprano" | "Alto" | "Normal") => {
    updateVoicePart.mutate({ id: userId, data: { voicePart } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
      }
    });
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold tracking-widest text-primary glow-text uppercase mb-8">Personnel Directory</h2>
      
      {isLoading ? (
        <div className="text-muted-foreground tracking-widest uppercase">Loading personnel data...</div>
      ) : (
        <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-muted-foreground uppercase tracking-wider text-xs border-b border-white/10">
              <tr>
                <th className="p-4 font-medium">Operative</th>
                <th className="p-4 font-medium">Status/Role</th>
                <th className="p-4 font-medium">Voice Designation</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users?.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white">{user.username}</td>
                  <td className="p-4 text-muted-foreground uppercase text-xs tracking-widest">{user.role}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded border text-[10px] uppercase tracking-widest font-bold
                      ${user.voicePart === 'Soprano' ? 'border-[#FF3B30] text-[#FF3B30] bg-[#FF3B30]/10' : 
                        user.voicePart === 'Alto' ? 'border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/10' : 
                        user.voicePart === 'Normal' ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10' :
                        'border-white/20 text-white/50 bg-black/40'}`}>
                      {user.voicePart || "Unassigned"}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2 justify-end">
                    <button onClick={() => handleUpdate(user.id, "Soprano")} className="px-3 py-1.5 bg-black/40 border border-white/10 hover:border-[#FF3B30] hover:text-[#FF3B30] rounded text-xs font-medium tracking-widest transition-colors">SOP</button>
                    <button onClick={() => handleUpdate(user.id, "Alto")} className="px-3 py-1.5 bg-black/40 border border-white/10 hover:border-[#8B5CF6] hover:text-[#8B5CF6] rounded text-xs font-medium tracking-widest transition-colors">ALT</button>
                    <button onClick={() => handleUpdate(user.id, "Normal")} className="px-3 py-1.5 bg-black/40 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] rounded text-xs font-medium tracking-widest transition-colors">NRM</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
