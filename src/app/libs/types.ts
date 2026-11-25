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
};

export type TypeOfOnboardedOutletsResponse = {
  id: number;
  name: string;
  address: string;
  outletStatus: "draft" | "approved" | "rejected";
  expectedDate: string;
  actualDate: string;
  completedStages: TypeOfStagesInOnboardedOutletsResponse[];
  pendingStages: TypeOfStagesInOnboardedOutletsResponse[];
};

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

export type TypeOfStageIndicators = {
  stageName: string;
  status: string;
  progress: number;
};

export type TypeOfOutletPotentialBusiness = {
  outletId: number;
  expectedFootfall: number;
  presentBrands: number;
  beveragesBrands: number;
  healthyBrands: number;
  brandsNames: string;
  expectedRevenuePerMonth: number;
  dailySalesOfOtherBrands: number;
};

export type TypeOfOutletAgreement = {
  outletId: number;
  agreementTenureMonths: number;
  securityDepositMonths: number;
  lockInPeriodMonths: number;
  noticePeriodMonths: number;
  escalationPercentage: number;
  fitOutPeriodDays: number;
};
export interface ApiOutlet {
  outletId: number;
  outletName: string;
  address: string;
  weeklyOff: string;
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
  camCharges: number;
  revShareOnDeliveryPercent: number;
  rentModel: string;
  outletPotentialBusiness: TypeOfOutletPotentialBusiness | null;
  outletAgreement: TypeOfOutletAgreement | null;
}

export type NsoStages = {
  completedTasks: number;
  completionPercentage: number;
  endDate: string | null;
  stageId: number;
  stageName: string;
  startDate: string;
  totalTasks: number;
  tasks: NsoTask[];
};

export type NsoTask = {
  actualDate: string | null;
  id: number;
  owner: string | null;
  status: "pending" | "not-started" | "completed" | string;
  title: string;
  document: {
    fileUrl: string;
    id: number;
  };
};
export type NsoProject = {
  acutalOpeningDate: string | null;
  expectedOpeningDate: string;
  id: number;
  status: "notStarted" | "inProgress" | "completed" | string;
};

export type NsoOutletDetail = {
  completedStagesCount: number;
  completionPercentage: number;
  nextPendingStage: string;
  outlet: {
    areaName: string;
    id: number;
    name: string;
    warehouseName: string;
    outletStatus: "draft" | "approved" | "rejected";
  };
  stages: NsoStages[];
  project: NsoProject;
};

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
};

export type TypeOfOutletDashboardTabs = {
  pending: number;
  approved: number;
  rejected: number;
};

export type TypeOfOutletDashboard = {
  stats: TypeOfStatsOfOutletDashboard;
  tabs: TypeOfOutletDashboardTabs;
  immediateApprovals: [];
};

export interface StaffTrainee {
  id: number;
  name: string;
  email: string;
  trainingCertification: "trainee" | string;
  userType: "staff" | string;
  profilePic: string | null;
  trainingLevel: string;
  empId: string;
  batch: Batch;
  assignedDate: string; // ISO date
  outlet: Outlet;
  shift: Shift;
  status: string;
  percentage: number;
  baseLocation: { name: string };
}

export interface Batch {
  name: string;
  startDate: string; // ISO date string
}

export interface Outlet {
  id: number;
  name: string;
}

export interface Shift {
  id: number;
  name: string;
  startMinutes: string; // e.g. '09:30'
  endMinutes: string; // e.g. '21:30'
}

export type TypeOfOptions = {
  id: number;
  label: string;
  value: number | string;
  specificId?: number[];
  startingTime?: number;
  endingTime?: number;
  type?: string;
  off?: string;
  specificSingleId?: number;
};

export type TypeOfOptions2 = {
  id: number;
  label: string;
  value: number | string;
  specificId?: number[];
  startingTime?: number;
  type?: string;
  off?: string;
};

export interface ChecklistQuestion {
  id: number;
  sectionId: number;
  subSectionId: number | null;
  text: string;
  description: string | null;
  imageUrl: string | null;
  questionType: string;
  answerType:
    | "boolean"
    | "multipleCorrect"
    | "subjective"
    | "singleCorrect"
    | "rating";
  options: string[] | null;
  correctAnswers: (string | boolean)[];
  weightage: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistSubSection {
  id: number;
  name: string;
  sectionId: number;
  createdAt: string;
  updatedAt: string;
  ChecklistQuestion: ChecklistQuestion[];
  EvaluationQuestion: ChecklistQuestion[];
}

export interface ChecklistSection {
  id: number;
  name: string;
  checklistId: number;
  createdAt: string;
  updatedAt: string;
  ChecklistSubSection: ChecklistSubSection[];
  EvaluationSubSection: ChecklistSubSection[];
  ChecklistQuestion: ChecklistQuestion[];
  EvaluationQuestion: ChecklistQuestion[];
}

export interface ChecklistApiResponse {
  id: number;
  name: string;
  dayLabel: string;
  trainingType: string;
  filledBy: string;
  createdAt: string;
  updatedAt: string;
  ChecklistSection: ChecklistSection[];
  EvaluationSection: ChecklistSection[];
}
