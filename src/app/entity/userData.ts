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
    weight : number;
    weightCategory : string;
    weightNotes : string;
    length : number;
    lengthCategory : string;
    lengthNotes: string;
    headDiameter : number;
    headDiameterCategory: string;
    headDiameterNotes: string;
    seriesWeight : number[];
    seriesLength : number[];
    seriesHeadDiameter : number[];
}

export interface GrowthDtl {
    batch: number;
    weight: number;
    length: number;
    headDiameter : number;
  }