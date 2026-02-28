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
  outletStatus: "draft" | "approved" | "rejected";
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


export type TypeOfStageIndicators =  {
    stageName: string;
    status: string;
    progress: number;
}


export interface ApiOutlet {
  
  outletId: number;
  outletName: string;
  address: string;
  city: string;
  expectedDate: string;
  actualDate: string | null;
  outletStatus: string;
  status: string;
  fixedRentAmount: number;
  sdAmount: number;
  stages: ApiStage[];
  daysPendingForLOIApproval: number;
  stageIndicators: TypeOfStageIndicators[];
  overallProgress: number;
  approvedDate: string;
  rejectionReason: string;
  loiDocument: string;
  createdAt: string;
  areaManager: string;
  revSharePercent: number;
  rentModel: string;
  

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
    outletStatus:"draft" | "approved" | "rejected";

  };
  stages:NsoStages[];
  project: NsoProject
}

export interface Asset {
  id: string;
  name: string;
  url?: string;
}

export interface Category {
  id: string;
  name: string;
  assets: Asset[];
}

export interface AddAssetFormData {
  name: string;
  url?: string;
  categoryId?: string;
  newCategoryName?: string;
}


export type TypeOfStatsOfOutletDashboard = {
    pendingApprovals: number;
    urgent: number;
    approvedToday: number;
    rejectedToday: number;
    liveOutlets: number;
}

export type TypeOfOutletDashboardTabs = {
  pending: number;
  approved: number;
  rejected: number;
}

export type TypeOfOutletDashboard = {
  stats: TypeOfStatsOfOutletDashboard;
  tabs: TypeOfOutletDashboardTabs;
  immediateApprovals: [];
}
