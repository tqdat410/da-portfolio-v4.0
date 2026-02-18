export type FinderItemKind = "file" | "folder";
export type FinderOpenMode = "new-tab" | "same-tab";

export interface FinderLaunchItem {
  id: "portfolio-exe" | "projects-folder" | "certificates-folder";
  label: string;
  kind: FinderItemKind;
  target: string;
  openMode: FinderOpenMode;
}
