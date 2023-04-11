export const auth = 'auth/login';
export const authRecover = 'auth/recover';
export const authRecoverSubmit = 'auth/recover-submit';
export const mainInit = 'main/init';
export const systemMain = 'system/main';

export const userChangeAvatar = 'user/change-avatar';
export const userChangePassword = 'user/change-password';

// will remove in the future
export const homeFacts = '';

// ----------appointment-------------
export const appointmentRequestIndex = 'appointment/request/index';
export const appointmentRequestSubmit = 'appointment/request/submit';
export const appointmentRequestEdit = 'appointment/request/edit';

// ----------doctor-------------
export const doctorDashboardIndex = 'doctor/dashboard/index';
export const doctorDashboardDetails = 'doctor/dashboard/details';

export const doctorMedicineIndex = 'doctor/medicine/index';
export const doctorMedicineSubmit = 'doctor/medicine/submit';
export const doctorMedicineEdit = 'doctor/medicine/edit';
export const doctorMedicineDelete = 'doctor/medicine/delete';
export const doctorMedicineSetActive = 'doctor/medicine/set-active';
export const doctorMedicineSetInactive = 'doctor/medicine/set-inactive';

export const doctorInspectionIndex = 'doctor/inspection/index';
export const doctorInspectionInit = 'doctor/inspection/init';
export const doctorInspectionClassInit = 'doctor/inspection/class-init';
export const doctorInspectionStudentInit = 'doctor/inspection/student-init';
export const doctorInspectionStudentSearchName = 'doctor/inspection/student-search-name';
export const doctorInspectionStudentSearchCode = 'doctor/inspection/student-search-code';
export const doctorInspectionUserSearchName = 'doctor/inspection/user-search-name';
export const doctorInspectionUserSearchCode = 'doctor/inspection/user-search-code';
export const doctorInspectionSubmit = 'doctor/inspection/submit';

// ----------survey category-------------
const tmpApiUrl = 'https://survey.eschool.mn/'; // after backend merged then remove it.
export const surveyCategoryIndex = tmpApiUrl + 'survey/category/list';
export const surveyCategoryCreate = tmpApiUrl + 'survey/category/create';
export const surveyCategoryEdit = tmpApiUrl + 'survey/category/create';
