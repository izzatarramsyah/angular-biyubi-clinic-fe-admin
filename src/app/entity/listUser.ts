export interface ListUser {
    id : number;
    fullname : string;
    listChild : ListChild[];
 }

 export interface ListChild {
    id : number;
    fullname: string;
}
