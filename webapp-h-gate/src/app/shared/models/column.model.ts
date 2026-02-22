export interface Column {
    title: string;
    attributeName: string;
    columnDef?: string;
    class?: string;
    pipeArgs?: string | ((args: any) => any);
    computeField?: string | ((args: any) => any);
    badge?: boolean;
    icon?: string;
    detail?: boolean;
    sticky?: boolean;
    minWidth?: string;
    maxWidth?: string;
}