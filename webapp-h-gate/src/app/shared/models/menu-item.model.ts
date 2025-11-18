export interface MenuItem {
  title: string;
  icon?: string;
  content?: string;
  link?: string;
  url?: string;
  permission?: string[];
  tooltip?: string;
}

export interface MenuSection {
  title?: string;
  permission?: string[];
  items: MenuItem[];
}