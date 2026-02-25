import React, { useMemo, useState } from 'react';
import { Plane, Building, Shield, Ticket, CreditCard, MoreHorizontal, Plus, Trash2, Edit2, Filter, X, Check } from 'lucide-react';
import { ExtraExpense, ExtraExpenseCategory } from '../types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type ExtraExpenseEditorProps = {
  expenses: ExtraExpense[];
  memberCount: number;
  onSave: (expenses: ExtraExpense[]) => void | Promise<void>;
  isSaving: boolean;
  isOfflineMode?: boolean;
};

const CATEGORY_CONFIG: Record<ExtraExpenseCategory, { label: string; icon: React.ReactNode; color: string }> = {
  flight: { label: '機票', icon: <Plane className="w-4 h-4" />, color: 'orange' },
  hotel: { label: '住宿', icon: <Building className="w-4 h-4" />, color: 'pink' },
  insurance: { label: '保險', icon: <Shield className="w-4 h-4" />, color: 'green' },
  pass: { label: '票券', icon: <Ticket className="w-4 h-4" />, color: 'purple' },
  prepaid: { label: '預付', icon: <CreditCard className="w-4 h-4" />, color: 'blue' },
  other: { label: '其他', icon: <MoreHorizontal className="w-4 h-4" />, color: 'slate' },
};

const getCategoryIcon = (category: ExtraExpenseCategory) => CATEGORY_CONFIG[category]?.icon || CATEGORY_CONFIG.other.icon;
const getCategoryLabel = (category: ExtraExpenseCategory) => CATEGORY_CONFIG[category]?.label || '其他';
const getCategoryColor = (category: ExtraExpenseCategory) => CATEGORY_CONFIG[category]?.color || 'slate';

const MEMBERS = ['庭瑜', 'Yang', '宏翔', '小藍'] as const;

const ExtraExpenseEditor: React.FC<ExtraExpenseEditorProps> = ({
  expenses,
  memberCount,
  onSave,
  isSaving,
  isOfflineMode = false,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExtraExpense | null>(null);
  const [formData, setFormData] = useState<Partial<ExtraExpense>>({});
  const [isLocalSaving, setIsLocalSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  
  // 篩選狀態
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPaidBy, setFilterPaidBy] = useState<string>('all');
  const [filterRecordedBy, setFilterRecordedBy] = useState<string>('all');

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      if (filterCategory !== 'all' && expense.category !== filterCategory) return false;
      if (filterPaidBy !== 'all' && expense.paidBy !== filterPaidBy) return false;
      if (filterRecordedBy !== 'all' && expense.recordedBy !== filterRecordedBy) return false;
      return true;
    });
  }, [expenses, filterCategory, filterPaidBy, filterRecordedBy]);

  const hasActiveFilter = filterCategory !== 'all' || filterPaidBy !== 'all' || filterRecordedBy !== 'all';

  const clearFilters = () => {
    setFilterCategory('all');
    setFilterPaidBy('all');
    setFilterRecordedBy('all');
  };

  const openAddDialog = () => {
    setEditingExpense(null);
    setFormData({
      title: '',
      description: '',
      category: 'other',
      cost: 0,
      currency: 'TWD',
      splitCount: memberCount,
      paidBy: '',
      date: '',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (expense: ExtraExpense) => {
    setEditingExpense(expense);
    setFormData({ ...expense });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.cost) return;

    const newExpense: ExtraExpense = {
      id: editingExpense?.id || `extra-${Date.now()}`,
      title: formData.title || '',
      description: formData.description,
      category: formData.category as ExtraExpenseCategory || 'other',
      cost: formData.cost || 0,
      currency: formData.currency as 'KRW' | 'TWD' || 'TWD',
      splitCount: formData.splitCount,
      paidBy: formData.paidBy,
      date: formData.date,
      recordedBy: formData.recordedBy,
    };

    setIsLocalSaving(true);
    try {
      if (editingExpense) {
        await onSave(expenses.map(e => e.id === editingExpense.id ? newExpense : e));
      } else {
        await onSave([...expenses, newExpense]);
      }
      setIsDialogOpen(false);
      setEditingExpense(null);
      setFormData({});
    } finally {
      setIsLocalSaving(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTarget(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsLocalSaving(true);
    try {
      await onSave(expenses.filter(e => e.id !== deleteTarget));
      setDeleteTarget(null);
    } finally {
      setIsLocalSaving(false);
    }
  };

  const formatCost = (expense: ExtraExpense) => {
    const symbol = expense.currency === 'KRW' ? '₩' : 'NT$';
    return `${symbol}${expense.cost.toLocaleString()}`;
  };

  const getSplitText = (expense: ExtraExpense) => {
    const split = expense.splitCount ?? memberCount;
    if (split === memberCount) return '';
    if (split === 1) return '(個人)';
    return `(${split}人分)`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">額外費用</h3>
            <p className="text-xs text-slate-400">機票、住宿、保險等事前支出</p>
          </div>
        </div>
        {!isOfflineMode && (
          <button
            type="button"
            onClick={openAddDialog}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-50 w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">新增</span>
          </button>
        )}
      </div>

      {/* 篩選列 */}
      {expenses.length > 0 && (
        <div className="px-4 sm:px-6 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">類別</span>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-7 px-2 w-[60px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="flight">機票</SelectItem>
                  <SelectItem value="hotel">住宿</SelectItem>
                  <SelectItem value="insurance">保險</SelectItem>
                  <SelectItem value="pass">票券</SelectItem>
                  <SelectItem value="prepaid">預付</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">付款</span>
              <Select value={filterPaidBy} onValueChange={setFilterPaidBy}>
                <SelectTrigger className="h-7 px-2 w-[60px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {MEMBERS.map((member) => (
                    <SelectItem key={member} value={member}>{member}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">記錄</span>
              <Select value={filterRecordedBy} onValueChange={setFilterRecordedBy}>
                <SelectTrigger className="h-7 px-2 w-[60px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {MEMBERS.map((member) => (
                    <SelectItem key={member} value={member}>{member}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                清除
              </button>
            )}
            <span className="text-xs text-slate-400 ml-auto shrink-0">
              {filteredExpenses.length}/{expenses.length}
            </span>
          </div>
        </div>
      )}

      {expenses.length === 0 ? (
        <div className="px-6 py-8 text-center text-sm text-slate-400">
          尚未新增任何額外費用
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="px-6 py-8 text-center text-sm text-slate-400">
          沒有符合篩選條件的費用
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filteredExpenses.map((expense) => {
            const color = getCategoryColor(expense.category);
            const dateDisplay = expense.date ? expense.date.replace(/^\d{4}-/, '').replace('-', '/') : '';
            
            return (
              <div key={expense.id} className="p-4 hover:bg-slate-50/50 transition-colors group">
                {/* Mobile */}
                <div className="sm:hidden">
                  <div className="flex items-start gap-3">
                    {/* 日期區塊 */}
                    <div className="w-10 shrink-0 text-center">
                      {expense.date ? (
                        <div className="text-xs font-medium text-slate-500">{dateDisplay}</div>
                      ) : (
                        <div className="text-xs text-slate-300">--</div>
                      )}
                    </div>
                    
                    {/* 內容區 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-slate-800 break-words">{expense.title}</span>
                        <span className={`text-[11px] px-1.5 py-0.5 rounded bg-${color}-50 text-${color}-600`}>
                          {getCategoryLabel(expense.category)}
                        </span>
                        {expense.splitCount && expense.splitCount !== memberCount && (
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                            {expense.splitCount}人分
                          </span>
                        )}
                      </div>
                      {expense.description && (
                        <p className="text-xs text-slate-400 mt-0.5">{expense.description}</p>
                      )}
                      {/* 付款/記錄 */}
                      {(expense.paidBy || expense.recordedBy) && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          {expense.paidBy && (
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600">
                              💰 {expense.paidBy}
                            </span>
                          )}
                          {expense.recordedBy && (
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-600">
                              ✏️ {expense.recordedBy}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* 金額+操作 */}
                    <div className="shrink-0 text-right">
                      <div className="font-bold text-slate-800">{formatCost(expense)}</div>
                      {!isOfflineMode && (
                        <div className="flex items-center justify-end gap-0.5 mt-1">
                          <button
                            type="button"
                            onClick={() => openEditDialog(expense)}
                            className="p-1 rounded text-slate-400"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(expense.id)}
                            className="p-1 rounded text-slate-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop */}
                <div className="hidden sm:flex items-start gap-4">
                  {/* 日期區塊 */}
                  <div className="w-14 shrink-0 text-center pt-0.5">
                    {expense.date ? (
                      <div className="text-sm font-medium text-slate-500">{dateDisplay}</div>
                    ) : (
                      <div className="text-sm text-slate-300">--</div>
                    )}
                  </div>
                  
                  {/* 內容區 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800">{expense.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-${color}-50 text-${color}-600`}>
                        {getCategoryLabel(expense.category)}
                      </span>
                      {expense.splitCount && expense.splitCount !== memberCount && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                          {expense.splitCount}人分
                        </span>
                      )}
                    </div>
                    {(expense.paidBy || expense.recordedBy) && (
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        {expense.paidBy && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs">
                            💰 {expense.paidBy}
                          </span>
                        )}
                        {expense.recordedBy && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-xs">
                            ✏️ {expense.recordedBy}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* 金額+備註+操作 */}
                  <div className="shrink-0 flex items-start gap-2">
                    <div className="text-right">
                      <span className="font-bold text-slate-800 text-lg">{formatCost(expense)}</span>
                      {expense.description && (
                        <p className="text-xs text-slate-400 mt-0.5 max-w-[150px] truncate">{expense.description}</p>
                      )}
                    </div>
                    {!isOfflineMode && (
                      <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openEditDialog(expense)}
                          className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(expense.id)}
                          className="p-1 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={(open) => !isSaving && !isLocalSaving && setIsDialogOpen(open)}>
        <DialogContent className="flex flex-col w-full h-full sm:h-fit sm:max-h-[90vh] sm:max-w-md overflow-hidden rounded-none sm:rounded-3xl sm:top-1/2 sm:-translate-y-1/2 top-0 bottom-0 translate-y-0 p-0">
          {/* Mobile Header with actions */}
          <DialogHeader className="shrink-0 flex flex-row items-center justify-between border-b border-slate-100 px-4 py-3 sm:hidden">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving || isLocalSaving}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-700 disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
            <DialogTitle className="text-base font-bold">
              {editingExpense ? '編輯費用' : '新增額外費用'}
            </DialogTitle>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isLocalSaving || !formData.title || !formData.cost}
              className="p-2 -mr-2 text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
            >
              {isLocalSaving ? (
                <span className="text-sm font-bold">...</span>
              ) : (
                <Check className="w-6 h-6" />
              )}
            </button>
          </DialogHeader>

          {/* Desktop Header */}
          <DialogHeader className="hidden sm:block shrink-0 border-b border-slate-100 px-6 py-4">
            <DialogTitle>{editingExpense ? '編輯費用' : '新增額外費用'}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">名稱 *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="例：機票、住宿訂金"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-sm text-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">類別</label>
                <Select
                  value={formData.category || 'other'}
                  onValueChange={(value) => setFormData({ ...formData, category: value as ExtraExpenseCategory })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="類別" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flight">機票</SelectItem>
                    <SelectItem value="hotel">住宿</SelectItem>
                    <SelectItem value="insurance">保險</SelectItem>
                    <SelectItem value="pass">票券</SelectItem>
                    <SelectItem value="prepaid">預付</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">幣別</label>
                <Select
                  value={formData.currency || 'TWD'}
                  onValueChange={(value) => setFormData({ ...formData, currency: value as 'KRW' | 'TWD' })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="幣別" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TWD">台幣 NT$</SelectItem>
                    <SelectItem value="KRW">韓元 ₩</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">金額 *</label>
                <input
                  type="number"
                  value={formData.cost || ''}
                  onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value, 10) || 0 })}
                  onFocus={(e) => e.target.select()}
                  placeholder="0"
                  min="0"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-sm text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">分攤人數</label>
                <input
                  type="number"
                  value={formData.splitCount ?? memberCount}
                  onChange={(e) => setFormData({ ...formData, splitCount: parseInt(e.target.value, 10) || memberCount })}
                  onFocus={(e) => e.target.select()}
                  min="1"
                  max={memberCount}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-sm text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">日期</label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-sm text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">誰先付</label>
                <Select
                  value={formData.paidBy || ''}
                  onValueChange={(value) => setFormData({ ...formData, paidBy: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="選填" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEMBERS.map((member) => (
                      <SelectItem key={member} value={member}>{member}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">記錄者</label>
                <Select
                  value={formData.recordedBy || ''}
                  onValueChange={(value) => setFormData({ ...formData, recordedBy: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="選填" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEMBERS.map((member) => (
                      <SelectItem key={member} value={member}>{member}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">備註</label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="選填"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base sm:text-sm text-slate-700"
              />
            </div>
          </div>

          {/* Desktop Footer */}
          <DialogFooter className="hidden sm:flex shrink-0 border-t border-slate-100 px-6 py-4">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving || isLocalSaving}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-60"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isLocalSaving || !formData.title || !formData.cost}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
            >
              {isLocalSaving ? '儲存中...' : '儲存'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !isLocalSaving && !open && setDeleteTarget(null)}>
        <DialogContent className="w-[90%] max-w-sm h-fit overflow-hidden rounded-3xl top-1/2 -translate-y-1/2 p-0">
          <DialogHeader className="px-6 py-4">
            <DialogTitle>確認刪除</DialogTitle>
          </DialogHeader>
          <p className="px-6 pb-4 text-sm text-slate-600">
            確定要刪除這筆費用嗎？此操作無法復原。
          </p>
          <DialogFooter className="border-t border-slate-100 px-6 py-4">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={isLocalSaving}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-60"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={isLocalSaving}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
            >
              {isLocalSaving ? '刪除中...' : '刪除'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExtraExpenseEditor;
