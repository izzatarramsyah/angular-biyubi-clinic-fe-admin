export interface UserData {
    id : number;
    fullname : string;
    childData : ChildData;
 }

 export interface ChildData {
    id : number;
    fullname: string;
    birthDate: string;
    age: number;
    gender: string;
    weightCategory : string;
    weightNotes : string;
    lengthCategory : string;
    lengthNotes: string;
    headDiameterCategory: string;
    headDiameterNotes: string;
    growthDetail : GrowthDtl[];
}

export interface GrowthDtl {
    mstCode : string;
    description: string;
    batch: number;
    weight: number;
    length: number;
    headDiameter : number;
  }