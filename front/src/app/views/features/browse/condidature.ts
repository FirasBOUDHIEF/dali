export interface Candidature {
  id?: number;
  taskid: number;
  freelanceid: number;
  motivation: string;
  confirmed: boolean;
  cvFilename: string;
  createdDate?: Date;
}
