// Unified ERP API client covering inventory, suppliers, expenses, assets, payroll, commissions, HR
import client from './client';
import type { ApiResponse } from '@/types';

// ─── Inventory ───────────────────────────────────────────────────────────────
export const inventoryApi = {
  listCategories:  () => client.get<ApiResponse<unknown[]>>('/inventory/categories'),
  listItems:       (params?: object) => client.get<ApiResponse<unknown[]>>('/inventory/items', { params }),
  getLowStock:     () => client.get<ApiResponse<{ lowStock: unknown[]; outOfStock: unknown[] }>>('/inventory/items/low-stock'),
  createItem:      (data: object) => client.post('/inventory/items', data),
  updateItem:      (id: string, data: object) => client.patch(`/inventory/items/${id}`, data),
  recordTxn:       (data: object) => client.post('/inventory/transactions', data),
  listTxns:        (params?: object) => client.get<ApiResponse<unknown[]>>('/inventory/transactions', { params }),
};

// ─── Suppliers & Purchase Orders ──────────────────────────────────────────────
export const suppliersApi = {
  list:            (params?: object) => client.get<ApiResponse<unknown[]>>('/suppliers', { params }),
  get:             (id: string) => client.get<ApiResponse<unknown>>(`/suppliers/${id}`),
  create:          (data: object) => client.post('/suppliers', data),
  update:          (id: string, data: object) => client.patch(`/suppliers/${id}`, data),
  listPOs:         (params?: object) => client.get<ApiResponse<unknown[]>>('/suppliers/purchase-orders', { params }),
  getPO:           (id: string) => client.get<ApiResponse<unknown>>(`/suppliers/purchase-orders/${id}`),
  createPO:        (data: object) => client.post('/suppliers/purchase-orders', data),
  receivePO:       (id: string, data: object) => client.post(`/suppliers/purchase-orders/${id}/receive`, data),
  sendPO:          (id: string) => client.post(`/suppliers/purchase-orders/${id}/send`),
  cancelPO:        (id: string) => client.post(`/suppliers/purchase-orders/${id}/cancel`),
};

// ─── Expenses ─────────────────────────────────────────────────────────────────
export const expensesApi = {
  listCategories:  () => client.get<ApiResponse<unknown[]>>('/expenses/categories'),
  list:            (params?: object) => client.get<ApiResponse<unknown[]>>('/expenses', { params }),
  get:             (id: string) => client.get<ApiResponse<unknown>>(`/expenses/${id}`),
  create:          (data: object) => client.post('/expenses', data),
  update:          (id: string, data: object) => client.patch(`/expenses/${id}`, data),
  approve:         (id: string) => client.post(`/expenses/${id}/approve`),
  remove:          (id: string) => client.delete(`/expenses/${id}`),
  summary:         (params?: object) => client.get<ApiResponse<unknown>>('/expenses/summary', { params }),
};

// ─── Assets ───────────────────────────────────────────────────────────────────
export const assetsApi = {
  list:            (params?: object) => client.get<ApiResponse<unknown[]>>('/assets', { params }),
  get:             (id: string) => client.get<ApiResponse<unknown>>(`/assets/${id}`),
  create:          (data: object) => client.post('/assets', data),
  update:          (id: string, data: object) => client.patch(`/assets/${id}`, data),
  listMaintenance: (id: string) => client.get<ApiResponse<unknown[]>>(`/assets/${id}/maintenance`),
  addMaintenance:  (id: string, data: object) => client.post(`/assets/${id}/maintenance`, data),
  depreciation:    (id: string) => client.get<ApiResponse<unknown>>(`/assets/${id}/depreciation`),
};

// ─── Payroll ──────────────────────────────────────────────────────────────────
export const payrollApi = {
  listRuns:        (params?: object) => client.get<ApiResponse<unknown[]>>('/payroll/runs', { params }),
  getRun:          (id: string) => client.get<ApiResponse<unknown>>(`/payroll/runs/${id}`),
  createRun:       (data: object) => client.post('/payroll/runs', data),
  calculate:       (id: string) => client.post(`/payroll/runs/${id}/calculate`),
  approve:         (id: string) => client.post(`/payroll/runs/${id}/approve`),
  pay:             (id: string) => client.post(`/payroll/runs/${id}/pay`),
  myPayslips:      (params?: object) => client.get<ApiResponse<unknown[]>>('/payroll/my-payslips', { params }),
};

// ─── Commissions ──────────────────────────────────────────────────────────────
export const commissionsApi = {
  listRules:       () => client.get<ApiResponse<unknown[]>>('/commissions/rules'),
  createRule:      (data: object) => client.post('/commissions/rules', data),
  updateRule:      (id: string, data: object) => client.patch(`/commissions/rules/${id}`, data),
  deleteRule:      (id: string) => client.delete(`/commissions/rules/${id}`),
  listEarnings:    (params?: object) => client.get<ApiResponse<unknown[]>>('/commissions/earnings', { params }),
  earningsSummary: (params?: object) => client.get<ApiResponse<unknown[]>>('/commissions/earnings/summary', { params }),
};

// ─── HR ───────────────────────────────────────────────────────────────────────
export const hrAdminApi = {
  listShifts:      (params?: object) => client.get<ApiResponse<unknown[]>>('/hr/shifts', { params }),
  createShift:     (data: object) => client.post('/hr/shifts', data),
  deleteShift:     (id: string) => client.delete(`/hr/shifts/${id}`),
  listLeaves:      (params?: object) => client.get<ApiResponse<unknown[]>>('/hr/leaves', { params }),
  approveLeave:    (id: string, data: object) => client.patch(`/hr/leaves/${id}/approve`, data),
  listAttendance:  (params?: object) => client.get<ApiResponse<unknown[]>>('/hr/attendance', { params }),
  adminClockIn:    (data: object) => client.post('/hr/attendance/admin-clock-in', data),
  adminClockOut:   (data: object) => client.post('/hr/attendance/admin-clock-out', data),
};

// ─── Client Notes ─────────────────────────────────────────────────────────────
export const clientNotesApi = {
  listAll:         (params?: object) => client.get<ApiResponse<unknown[]>>('/client-notes', { params }),
  listForClient:   (clientId: string, params?: object) => client.get<ApiResponse<unknown[]>>(`/client-notes/client/${clientId}`, { params }),
  create:          (data: object) => client.post('/client-notes', data),
  update:          (id: string, data: object) => client.patch(`/client-notes/${id}`, data),
  remove:          (id: string) => client.delete(`/client-notes/${id}`),
};

// ─── Branches ─────────────────────────────────────────────────────────────────
export const branchesApi = {
  list:    () => client.get<ApiResponse<unknown[]>>('/branches'),
  create:  (data: object) => client.post('/branches', data),
  update:  (id: string, data: object) => client.patch(`/branches/${id}`, data),
  remove:  (id: string) => client.delete(`/branches/${id}`),
};
