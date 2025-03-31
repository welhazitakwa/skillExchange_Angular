import { Badge } from "./Badge";
import { Banned } from "./Banned";
import { Role } from "./Role";

export class User {

    id!: number;
    name!: string;
    email!: string;
    role!: Role;
    verified!: boolean;
    image!: string;
    balance!: number;
    signature!: string;
    ban!: Banned | null;
    bio!: string;
    facebook!: string;
    github!: string;
    linkedin!: string;
    badges!: Badge[];
  
}
