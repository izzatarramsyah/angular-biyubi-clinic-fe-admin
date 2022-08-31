import { Child } from "./child";

export interface User {
	id : number;
	username : string;
	fullname : string;
	address : string;
	email : string;
	phone_no : string;
	status : string;
	joinDate : string;
	lastActivity : string;
	child : Child [];
}
