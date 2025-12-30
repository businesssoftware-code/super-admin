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
  expectedDate: string;
  actualDate: string;
  completedStages: TypeOfStagesInOnboardedOutletsResponse[];
  pendingStages: TypeOfStagesInOnboardedOutletsResponse[];

}