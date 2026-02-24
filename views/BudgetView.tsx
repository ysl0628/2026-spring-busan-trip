import React from 'react';
import { DaySchedule, ExtraExpense } from '../types';
import CostSummary from '../components/CostSummary';
import ExtraExpenseEditor from '../components/ExtraExpenseEditor';

type BudgetViewProps = {
  itinerary: DaySchedule[];
  extraExpenses: ExtraExpense[];
  onSaveExtraExpenses: (expenses: ExtraExpense[]) => void;
  isSaving: boolean;
  isOfflineMode?: boolean;
};

const BudgetView: React.FC<BudgetViewProps> = ({
  itinerary,
  extraExpenses,
  onSaveExtraExpenses,
  isSaving,
  isOfflineMode = false,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto mt-4 md:mt-0">
      <CostSummary itinerary={itinerary} extraExpenses={extraExpenses} memberCount={6} />
      
      <ExtraExpenseEditor
        expenses={extraExpenses}
        memberCount={6}
        onSave={onSaveExtraExpenses}
        isSaving={isSaving}
        isOfflineMode={isOfflineMode}
      />
    </div>
  );
};

export default BudgetView;
