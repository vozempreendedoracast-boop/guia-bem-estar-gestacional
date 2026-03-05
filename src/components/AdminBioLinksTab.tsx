import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, PencilSimple, Trash, SpinnerGap, Globe, Image, Link as LinkIcon,
  InstagramLogo, WhatsappLogo, YoutubeLogo, TiktokLogo, FacebookLogo,
  LinkedinLogo, Envelope, Phone, User, Briefcase, MapPin
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  usePageBlocks, useCreatePageBlock, useUpdatePageBlock, useDeletePageBlock,
  useCategories, type PageBlockRow, type Category,
} from "@/hooks/useSupabaseData";

const BLOCK_TYPES = [
  { value: "text_rich", label: "Texto Rico", icon: Globe, desc: "Texto com imagem, link e botão CTA" },
  { value: "button", label: "Botão / Link", icon: LinkIcon, desc: "Botão com link personalizado" },
  { value: "social_links", label: "Redes Sociais", icon: InstagramLogo, desc: "Botões de redes sociais" },
  { value: "professional", label: "Profissional", icon: Briefcase, desc: "Card de profissional com contato" },
  { value: "image", label: "Imagem", icon: Image, desc: "Imagem com link opcional" },
];

const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", icon: InstagramLogo },
  { key: "whatsapp", label: "WhatsApp", icon: WhatsappLogo },
  { key: "youtube", label: "YouTube", icon: YoutubeLogo },
  { key: "tiktok", label: "TikTok", icon: TiktokLogo },
  { key: "facebook", label: "Facebook", icon: FacebookLogo },
  { key: "linkedin", label: "LinkedIn", icon: LinkedinLogo },
  { key: "email", label: "Email", icon: Envelope },
  { key: "phone", label: "Telefone", icon: Phone },
];

const CategorySelect = ({ value, onChange, categories }: { value: string | null; onChange: (v: string | null) => void; categories: Category[] }) => (
  <div>
    <Label className="text-sm font-medium">Card/Categoria vinculada</Label>
    <select
      value={value || ""}
      onChange={e => onChange(e.target.value || null)}
      className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
    >
      <option value="">— Nenhuma —</option>
      {categories.map(c => (
        <option key={c.id} value={c.id}>{c.title}</option>
      ))}
    </select>
  </div>
);

const emptyBlock = (): Partial<PageBlockRow> => ({
  block_type: "text_rich",
  title: "",
  content: {},
  category_id: null,
  display_order: 0,
  active: true,
});

const AdminBioLinksTab = () => {
  const { data: blocks = [], isLoading } = usePageBlocks();
  const { data: categories = [] } = useCategories();
  const createBlock = useCreatePageBlock();
  const updateBlock = useUpdatePageBlock();
  const deleteBlock = useDeletePageBlock();

  const [editing, setEditing] = useState<Partial<PageBlockRow> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [typePickerOpen, setTypePickerOpen] = useState(false);

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return null;
    return categories.find(c => c.id === categoryId)?.title || null;
  };

  const openNew = (type: string) => {
    const block = emptyBlock();
    block.block_type = type;
    block.display_order = blocks.length;

    // Initialize content based on type
    if (type === "social_links") block.content = { links: [] };
    if (type === "professional") block.content = { name: "", specialty: "", photo_url: "", description: "", phone: "", email: "", instagram: "", website: "" };
    if (type === "button") block.content = { label: "", url: "", style: "primary" };
    if (type === "image") block.content = { image_url: "", link_url: "", alt: "" };
    if (type === "text_rich") block.content = { body: "", image_url: "", link_url: "", link_text: "" };

    setEditing(block);
    setTypePickerOpen(false);
    setDialogOpen(true);
  };

  const openEdit = (block: PageBlockRow) => {
    setEditing({ ...block, content: { ...block.content } });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      if (editing.id) {
        await updateBlock.mutateAsync({
          id: editing.id,
          title: editing.title,
          block_type: editing.block_type,
          content: editing.content,
          category_id: editing.category_id,
          display_order: editing.display_order,
          active: editing.active,
        });
      } else {
        await createBlock.mutateAsync({
          title: editing.title || "",
          block_type: editing.block_type || "text_rich",
          content: editing.content || {},
          category_id: editing.category_id || null,
          display_order: editing.display_order || 0,
          active: editing.active ?? true,
        });
      }
      toast.success("Bloco salvo!");
      setDialogOpen(false);
      setEditing(null);
    } catch {
      toast.error("Erro ao salvar bloco");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBlock.mutateAsync(id);
      toast.success("Bloco excluído!");
    } catch {
      toast.error("Erro ao excluir");
    }
  };

  const updateContent = (key: string, value: any) => {
    if (!editing) return;
    setEditing({ ...editing, content: { ...editing.content, [key]: value } });
  };

  const blockTypeInfo = (type: string) => BLOCK_TYPES.find(bt => bt.value === type);

  // Social links helpers
  const socialLinks = (editing?.content?.links || []) as Array<{ platform: string; url: string }>;
  const addSocialLink = () => {
    updateContent("links", [...socialLinks, { platform: "instagram", url: "" }]);
  };
  const updateSocialLink = (index: number, field: string, value: string) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    updateContent("links", updated);
  };
  const removeSocialLink = (index: number) => {
    updateContent("links", socialLinks.filter((_, i) => i !== index));
  };

  const renderBlockPreview = (block: PageBlockRow) => {
    const info = blockTypeInfo(block.block_type);
    const Icon = info?.icon || Globe;
    return (
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-primary" weight="duotone" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm text-foreground truncate">{block.title || "(sem título)"}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <Badge variant="secondary" className="text-[10px]">{info?.label || block.block_type}</Badge>
            {getCategoryName(block.category_id) && (
              <Badge variant="outline" className="text-[10px]">
                <Globe className="w-2.5 h-2.5 mr-0.5" />
                {getCategoryName(block.category_id)}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Bio Links ({blocks.length})</span>
        <Button size="sm" className="rounded-xl gradient-primary text-primary-foreground" onClick={() => setTypePickerOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Novo Bloco
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><SpinnerGap className="w-5 h-5 animate-spin text-primary" /></div>
      ) : blocks.length === 0 ? (
        <div className="p-12 text-center">
          <LinkIcon className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" weight="duotone" />
          <p className="text-muted-foreground text-sm">Nenhum bloco criado ainda.</p>
          <p className="text-xs text-muted-foreground mt-1">Crie blocos de texto, imagens, botões, redes sociais e cards de profissionais.</p>
        </div>
      ) : (
        <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
          {blocks.map(block => (
            <div key={block.id} className={`p-4 hover:bg-muted/30 transition-colors ${!block.active ? "opacity-50" : ""}`}>
              <div className="flex items-center justify-between gap-3">
                {renderBlockPreview(block)}
                <div className="flex gap-0.5 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => openEdit(block)}>
                    <PencilSimple className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" onClick={() => handleDelete(block.id)}>
                    <Trash className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Type Picker Dialog */}
      <Dialog open={typePickerOpen} onOpenChange={setTypePickerOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Escolha o tipo de bloco</DialogTitle>
            <DialogDescription>Selecione o tipo de conteúdo que deseja criar.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            {BLOCK_TYPES.map(bt => (
              <button
                key={bt.value}
                onClick={() => openNew(bt.value)}
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 hover:border-primary/30 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <bt.icon className="w-5 h-5 text-primary" weight="duotone" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{bt.label}</p>
                  <p className="text-xs text-muted-foreground">{bt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Editar" : "Criar"} Bloco — {blockTypeInfo(editing?.block_type || "")?.label}</DialogTitle>
            <DialogDescription>Configure o conteúdo do bloco.</DialogDescription>
          </DialogHeader>

          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Título do bloco</Label>
                <Input className="mt-1 rounded-xl" value={editing.title || ""} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Ex: Nossa nutricionista" />
              </div>

              <CategorySelect value={editing.category_id || null} onChange={v => setEditing({ ...editing, category_id: v })} categories={categories} />

              {/* Text Rich fields */}
              {editing.block_type === "text_rich" && (
                <>
                  <div>
                    <Label>Texto / Descrição</Label>
                    <Textarea className="mt-1 rounded-xl min-h-[100px]" value={editing.content?.body || ""} onChange={e => updateContent("body", e.target.value)} placeholder="Escreva o conteúdo aqui..." />
                  </div>
                  <div>
                    <Label>URL da Imagem (opcional)</Label>
                    <Input className="mt-1 rounded-xl" value={editing.content?.image_url || ""} onChange={e => updateContent("image_url", e.target.value)} placeholder="https://..." />
                    {editing.content?.image_url && (
                      <img src={editing.content.image_url} alt="preview" className="mt-2 rounded-xl max-h-32 object-cover" />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Texto do Link/Botão</Label>
                      <Input className="mt-1 rounded-xl" value={editing.content?.link_text || ""} onChange={e => updateContent("link_text", e.target.value)} placeholder="Saiba mais" />
                    </div>
                    <div>
                      <Label>URL do Link</Label>
                      <Input className="mt-1 rounded-xl" value={editing.content?.link_url || ""} onChange={e => updateContent("link_url", e.target.value)} placeholder="https://..." />
                    </div>
                  </div>
                </>
              )}

              {/* Button fields */}
              {editing.block_type === "button" && (
                <>
                  <div>
                    <Label>Texto do Botão</Label>
                    <Input className="mt-1 rounded-xl" value={editing.content?.label || ""} onChange={e => updateContent("label", e.target.value)} placeholder="Agendar consulta" />
                  </div>
                  <div>
                    <Label>URL do Link</Label>
                    <Input className="mt-1 rounded-xl" value={editing.content?.url || ""} onChange={e => updateContent("url", e.target.value)} placeholder="https://..." />
                  </div>
                  <div>
                    <Label>Estilo</Label>
                    <select className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm" value={editing.content?.style || "primary"} onChange={e => updateContent("style", e.target.value)}>
                      <option value="primary">Primário (destaque)</option>
                      <option value="outline">Outline (contorno)</option>
                      <option value="secondary">Secundário</option>
                    </select>
                  </div>
                </>
              )}

              {/* Image fields */}
              {editing.block_type === "image" && (
                <>
                  <div>
                    <Label>URL da Imagem</Label>
                    <Input className="mt-1 rounded-xl" value={editing.content?.image_url || ""} onChange={e => updateContent("image_url", e.target.value)} placeholder="https://..." />
                    {editing.content?.image_url && (
                      <img src={editing.content.image_url} alt="preview" className="mt-2 rounded-xl max-h-40 object-cover w-full" />
                    )}
                  </div>
                  <div>
                    <Label>Link ao clicar (opcional)</Label>
                    <Input className="mt-1 rounded-xl" value={editing.content?.link_url || ""} onChange={e => updateContent("link_url", e.target.value)} placeholder="https://..." />
                  </div>
                  <div>
                    <Label>Texto alternativo</Label>
                    <Input className="mt-1 rounded-xl" value={editing.content?.alt || ""} onChange={e => updateContent("alt", e.target.value)} placeholder="Descrição da imagem" />
                  </div>
                </>
              )}

              {/* Social Links fields */}
              {editing.block_type === "social_links" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Links de Redes Sociais</Label>
                    <Button size="sm" variant="outline" className="rounded-lg text-xs" onClick={addSocialLink}>
                      <Plus className="w-3 h-3 mr-1" /> Adicionar
                    </Button>
                  </div>
                  {socialLinks.map((link, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl">
                      <select className="h-9 rounded-lg border border-input bg-background px-2 text-xs w-28" value={link.platform} onChange={e => updateSocialLink(i, "platform", e.target.value)}>
                        {SOCIAL_PLATFORMS.map(sp => (
                          <option key={sp.key} value={sp.key}>{sp.label}</option>
                        ))}
                      </select>
                      <Input className="rounded-lg flex-1 h-9 text-xs" value={link.url} onChange={e => updateSocialLink(i, "url", e.target.value)} placeholder="Link ou número" />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive flex-shrink-0" onClick={() => removeSocialLink(i)}>
                        <Trash className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  {socialLinks.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-3">Nenhum link adicionado.</p>
                  )}
                </div>
              )}

              {/* Professional fields */}
              {editing.block_type === "professional" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Nome</Label>
                      <Input className="mt-1 rounded-xl" value={editing.content?.name || ""} onChange={e => updateContent("name", e.target.value)} placeholder="Dra. Maria Silva" />
                    </div>
                    <div>
                      <Label>Especialidade</Label>
                      <Input className="mt-1 rounded-xl" value={editing.content?.specialty || ""} onChange={e => updateContent("specialty", e.target.value)} placeholder="Nutricionista" />
                    </div>
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Textarea className="mt-1 rounded-xl" value={editing.content?.description || ""} onChange={e => updateContent("description", e.target.value)} placeholder="Breve descrição do profissional..." />
                  </div>
                  <div>
                    <Label>URL da Foto</Label>
                    <Input className="mt-1 rounded-xl" value={editing.content?.photo_url || ""} onChange={e => updateContent("photo_url", e.target.value)} placeholder="https://..." />
                    {editing.content?.photo_url && (
                      <img src={editing.content.photo_url} alt="preview" className="mt-2 rounded-full w-16 h-16 object-cover" />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Telefone</Label>
                      <Input className="mt-1 rounded-xl" value={editing.content?.phone || ""} onChange={e => updateContent("phone", e.target.value)} placeholder="(11) 99999-0000" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input className="mt-1 rounded-xl" value={editing.content?.email || ""} onChange={e => updateContent("email", e.target.value)} placeholder="email@exemplo.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Instagram</Label>
                      <Input className="mt-1 rounded-xl" value={editing.content?.instagram || ""} onChange={e => updateContent("instagram", e.target.value)} placeholder="@perfil" />
                    </div>
                    <div>
                      <Label>Website</Label>
                      <Input className="mt-1 rounded-xl" value={editing.content?.website || ""} onChange={e => updateContent("website", e.target.value)} placeholder="https://..." />
                    </div>
                  </div>
                  <div>
                    <Label>Localização</Label>
                    <Input className="mt-1 rounded-xl" value={editing.content?.location || ""} onChange={e => updateContent("location", e.target.value)} placeholder="São Paulo, SP" />
                  </div>
                </>
              )}

              {/* Common fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Ordem de exibição</Label>
                  <Input type="number" className="mt-1 rounded-xl" value={editing.display_order ?? 0} onChange={e => setEditing({ ...editing, display_order: Number(e.target.value) })} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={editing.active ?? true} onCheckedChange={v => setEditing({ ...editing, active: v })} />
                  <Label className="text-sm">Ativo</Label>
                </div>
              </div>

              <Button className="w-full rounded-xl gradient-primary text-primary-foreground" onClick={handleSave} disabled={createBlock.isPending || updateBlock.isPending}>
                {(createBlock.isPending || updateBlock.isPending) && <SpinnerGap className="w-4 h-4 mr-2 animate-spin" />}
                {editing.id ? "Salvar Alterações" : "Criar Bloco"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBioLinksTab;
