export interface VaccineMaster {
	vaccineCode : string;
	vaccineName : string;
	vaccineType : string;
	expDays: number;
	notes : string;
	status : string;
	detail : VaccineMasterDtl [];
}

export interface VaccineMasterDtl {
	vaccineCode : string;
	batch : number;
}

