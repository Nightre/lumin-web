import type { IUser } from "./stores/user";

export interface IProject {
    id: number
    name: string,
    author: IUser
}