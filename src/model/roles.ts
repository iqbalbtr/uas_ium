import { NavType } from "@components/app/app-sidebar";

export interface Role {
  id: number;
  name: string;
  access_rights?: NavType[];
}