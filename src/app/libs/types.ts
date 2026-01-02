export type ApiErrorResponse = {
  statusCode: number;
  timestamp: string;
  path: string;
  message?: string | string[];
  error?: string;
};

export type TypeOfStagesInOnboardedOutletsResponse = {

  id: number;
  name: string;
  completionPercentage: number | null;
  isCompleted?: boolean;
}

export type TypeOfOnboardedOutletsResponse = {

  id: number;
  name: string;
  address: string;
  isDraft: boolean;
  expectedDate: string;
  actualDate: string;
  completedStages: TypeOfStagesInOnboardedOutletsResponse[];
  pendingStages: TypeOfStagesInOnboardedOutletsResponse[];

}

// ----------------------
// API response types
// ----------------------
export interface ApiStage {
  stageId: number;
  stageName: string;
  completedTasks: number;
  totalTasks: number;
  completionPercentage: number;
  isCompleted: boolean;
}

export interface ApiOutlet {
  outletId: number;
  outletName: string;
  address: string;
  city: string;
  expectedDate: string;
  actualDate: string | null;
  isDraft: boolean;
  completedStagesCount: number;
  pendingStagesCount: number;
  completionPercentage: number;
  nextPendingStage: string;

  stages: ApiStage[];
}

export type NsoStages={
  completedTasks:number;
  completionPercentage:number;
  endDate:string|null;
  stageId:number;
  stageName:string;
  startDate:string;
  totalTasks:number;
  tasks:NsoTask[];
}

export type NsoTask = {
  actualDate: string | null;
  id: number;
  owner: string | null;
  status: "pending" | "not-started" | "completed" | string;
  title: string;
  document:{
    fileUrl:string;
    id:number;
  }
  };
export type NsoProject={
  acutalOpeningDate:string|null;
  expectedOpeningDate:string;
  id:number;
  status:"notStarted"|"inProgress"|"completed"|string;
}

export type NsoOutletDetail={
  completedStagesCount:number;
  completionPercentage:number;
  nextPendingStage:string;
  outlet:{
    areaName:string;
    id:number;
    name:string;
    warehouseName:string;
  };
  stages:NsoStages[];
  project: NsoProject
}

