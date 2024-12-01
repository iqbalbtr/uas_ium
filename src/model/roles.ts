export interface Role {
  id: number;
  name: string;
  access_rights?: any;
}


export interface AccessRights {
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  items: Item[];
}
export interface Item {
  title: string;
  url: string;
}