import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useListMusic, useCreateMusic, useDeleteMusic, getListMusicQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Music, FileText, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MusicManager() {
  const { data: musicFiles, isLoading } = useListMusic({ query: { queryKey: getListMusicQueryKey() }});
  const createMusic = useCreateMusic();
  const deleteMusic = useDeleteMusic();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [fileType, setFileType] = useState<"pdf" | "mp3" | "other">("pdf");
  const [target, setTarget] = useState<string>("all");

  const handleAdd = () => {
    if (!title || !url) return;
    createMusic.mutate({ data: { title, url, fileType, targetVoicePart: target === "all" ? null : target } }, {
      onSuccess: () => {
        setTitle(""); setUrl("");
        queryClient.invalidateQueries({ queryKey: getListMusicQueryKey() });
      }
    });
  };

  const handleDelete = (id: number) => {
    deleteMusic.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListMusicQueryKey() })
    });
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold tracking-widest text-primary glow-text uppercase mb-8">Music Database</h2>

      <div className="glass-panel p-6 rounded-xl border border-white/10 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="lg:col-span-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Title</label>
          <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-black/40 border-white/10 h-10 text-white" placeholder="Agnus Dei" />
        </div>
        <div className="lg:col-span-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">URL</label>
          <Input value={url} onChange={e => setUrl(e.target.value)} className="bg-black/40 border-white/10 h-10 text-white" placeholder="https://..." />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Type</label>
          <Select value={fileType} onValueChange={(val: any) => setFileType(val)}>
            <SelectTrigger className="bg-black/40 border-white/10 h-10 text-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">Sheet Music (PDF)</SelectItem>
              <SelectItem value="mp3">Audio (MP3)</SelectItem>
              <SelectItem value="other">Other Link</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Target Group</label>
          <Select value={target} onValueChange={setTarget}>
            <SelectTrigger className="bg-black/40 border-white/10 h-10 text-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL</SelectItem>
              <SelectItem value="Soprano">SOPRANO</SelectItem>
              <SelectItem value="Alto">ALTO</SelectItem>
              <SelectItem value="Normal">NORMAL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAdd} disabled={createMusic.isPending} className="bg-primary text-primary-foreground tracking-widest uppercase font-bold h-10 hover:bg-primary/80">
          <Plus size={16} className="mr-2" /> Inject
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? <div className="text-muted-foreground tracking-widest uppercase text-sm">Scanning archives...</div> : 
         musicFiles?.map(file => (
           <div key={file.id} className="glass-panel p-5 rounded-xl border border-white/10 flex flex-col group hover:border-primary/50 transition-colors">
             <div className="flex justify-between items-start mb-4">
               <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:glow-border transition-all">
                 {file.fileType === 'pdf' ? <FileText size={24} /> : file.fileType === 'mp3' ? <Music size={24} /> : <LinkIcon size={24} />}
               </div>
               <button onClick={() => handleDelete(file.id)} className="text-muted-foreground hover:text-destructive transition-colors p-2 -mr-2 -mt-2">
                 <Trash2 size={18} />
               </button>
             </div>
             <h3 className="text-lg font-bold text-white mb-2 truncate">{file.title}</h3>
             <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/5">
               <div className="flex flex-col gap-1">
                 <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Target: {file.targetVoicePart || "ALL"}</span>
                 <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Type: {file.fileType}</span>
               </div>
               <a href={file.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:text-primary-foreground hover:bg-primary px-3 py-1.5 rounded transition-colors uppercase tracking-widest border border-primary/50">Access</a>
             </div>
           </div>
         ))}
      </div>
    </AdminLayout>
  );
}
