import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import tripService from '../services/tripService';
import budgetService from '../services/budgetService';
import { DollarSign, PieChart, Plus, Trash2, Edit3, ArrowLeft, Loader2, AlertCircle, Check, Filter, Calendar, Tag, CreditCard, AlertTriangle } from 'lucide-react';

const CATEGORY_COLORS = {
  transport: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', bar: 'bg-blue-600' },
  accommodation: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', bar: 'bg-indigo-600' },
  activities: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', bar: 'bg-purple-600' },
  meals: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', bar: 'bg-amber-500' },
  other: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', bar: 'bg-slate-500' },
};

export default function TripBudget() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stopFilter, setStopFilter] = useState('');

  // Add / Edit Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Form state
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('transport');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [tripStopId, setTripStopId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteExpId, setDeleteExpId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, [tripId]);

  useEffect(() => {
    if (tripId) {
      fetchExpenses();
    }
  }, [categoryFilter, stopFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const tripData = await tripService.getTrip(tripId);
      setTrip(tripData);

      const stopsRes = await tripService.getStops(tripId);
      if (stopsRes && stopsRes.data) {
        setStops(stopsRes.data);
      }

      await refreshSummary();
      await fetchExpenses();
    } catch (err) {
      setError(err.message || 'Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const refreshSummary = async () => {
    try {
      const summaryRes = await budgetService.getBudgetSummary(tripId);
      if (summaryRes && summaryRes.data) {
        setSummary(summaryRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await budgetService.getExpenses(tripId, {
        category: categoryFilter || undefined,
        tripStopId: stopFilter || undefined,
      });
      if (res && res.data) {
        setExpenses(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingExpense(null);
    setAmount('');
    setCategory('transport');
    setDescription('');
    setExpenseDate(trip?.start_date || '');
    setTripStopId('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExpense(exp);
    setAmount(exp.amount.toString());
    setCategory(exp.category);
    setDescription(exp.description || '');
    setExpenseDate(exp.expense_date || '');
    setTripStopId(exp.trip_stop_id || '');
    setIsAddModalOpen(true);
  };

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Expense amount must be strictly greater than zero');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccessMsg('');

      const payload = {
        trip_id: tripId,
        category,
        description,
        amount: parseFloat(amount),
        currency: trip.currency,
        expense_date: expenseDate || null,
        trip_stop_id: tripStopId || null,
      };

      if (editingExpense) {
        await budgetService.updateExpense(editingExpense.id, payload);
        setSuccessMsg('Expense updated successfully');
      } else {
        await budgetService.createExpense(payload);
        setSuccessMsg('Expense logged successfully');
      }

      setIsAddModalOpen(false);
      await refreshSummary();
      await fetchExpenses();
    } catch (err) {
      setError(err.message || 'Failed to save expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (!deleteExpId) return;
    try {
      setIsDeleting(true);
      await budgetService.deleteExpense(deleteExpId);
      setDeleteExpId(null);
      await refreshSummary();
      await fetchExpenses();
    } catch (err) {
      alert(err.message || 'Failed to delete expense');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-12 text-center text-slate-500 flex items-center justify-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span>Loading Budget & Expense Tracker...</span>
        </div>
      </div>
    );
  }

  const utilizationPct = summary?.utilization_percentage;
  const isOverBudget = summary?.remaining_budget !== null && summary?.remaining_budget !== undefined && parseFloat(summary.remaining_budget) < 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(`/trips/${tripId}`)}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Trip Details</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(`/trips/${tripId}/itinerary`)}
              className="px-3.5 py-2 bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              Itinerary Builder
            </button>
            <button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Log Expense</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center space-x-3 text-sm">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl flex items-center space-x-3 text-sm">
            <Check className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Budget Summary Section */}
        {summary && (
          <div className="space-y-6 mb-8">
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Budget Limit */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Budget Limit</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-extrabold text-slate-900">
                    {summary.budget_limit !== null ? `${summary.currency} ${parseFloat(summary.budget_limit).toLocaleString()}` : 'No Limit Set'}
                  </span>
                </div>
              </div>

              {/* Card 2: Total Spent */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Total Spent</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-extrabold text-blue-600">
                    {summary.currency} {parseFloat(summary.total_spent).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Card 3: Remaining Budget */}
              <div className={`p-6 rounded-3xl border shadow-sm ${
                isOverBudget ? 'bg-red-50 border-red-200 text-red-900' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <span className="text-xs font-semibold text-slate-500 block mb-1">Remaining Budget</span>
                <div className="flex items-baseline space-x-1">
                  <span className={`text-2xl font-extrabold ${isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}>
                    {summary.remaining_budget !== null
                      ? `${summary.currency} ${parseFloat(summary.remaining_budget).toLocaleString()}`
                      : 'Unlimited'}
                  </span>
                </div>
              </div>

              {/* Card 4: Utilization Percentage */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Budget Utilization</span>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-extrabold text-slate-900">
                    {utilizationPct !== null ? `${utilizationPct}%` : 'N/A'}
                  </span>
                  {utilizationPct !== null && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      utilizationPct > 100 ? 'bg-red-100 text-red-700' : utilizationPct > 80 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {utilizationPct > 100 ? 'Over Budget' : utilizationPct > 80 ? 'Near Budget' : 'Within Budget'}
                    </span>
                  )}
                </div>
                {utilizationPct !== null && (
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 transition-all duration-500 ${
                        utilizationPct > 100 ? 'bg-red-500' : utilizationPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(utilizationPct, 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            {/* Category Breakdown Progress Bars */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <PieChart className="w-4 h-4 text-blue-600" />
                <span>Category Breakdown</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(summary.category_breakdown).map(([catKey, catAmount]) => {
                  const amt = parseFloat(catAmount);
                  const total = parseFloat(summary.total_spent);
                  const pct = total > 0 ? ((amt / total) * 100).toFixed(1) : '0.0';
                  const style = CATEGORY_COLORS[catKey] || CATEGORY_COLORS.other;

                  return (
                    <div key={catKey} className={`p-4 rounded-2xl border ${style.bg} ${style.border}`}>
                      <span className="text-xs font-bold capitalize text-slate-700 block mb-1">{catKey}</span>
                      <span className={`text-base font-extrabold ${style.text} block mb-2`}>
                        {summary.currency} {amt.toLocaleString()}
                      </span>
                      <div className="w-full bg-white/60 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-1.5 ${style.bar}`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block text-right">{pct}% of total</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Expenses List & Filters */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Expenses Log</h3>
              <p className="text-xs text-slate-500 mt-0.5">Filter and manage all logged trip expenses</p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="transport">Transport</option>
                <option value="accommodation">Accommodation</option>
                <option value="activities">Activities</option>
                <option value="meals">Meals</option>
                <option value="other">Other</option>
              </select>

              <select
                value={stopFilter}
                onChange={(e) => setStopFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">All Destination Stops</option>
                {stops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.city ? s.city.name : `Stop ${s.stop_order}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {expenses.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
              No expenses logged for this trip yet matching the filters. Click "Log Expense" above to add your first expense.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {expenses.map((exp) => {
                const style = CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.other;
                const associatedStop = stops.find((s) => s.id === exp.trip_stop_id);

                return (
                  <div key={exp.id} className="py-4 flex items-center justify-between hover:bg-slate-50/50 px-2 rounded-xl transition">
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${style.bg} ${style.text} ${style.border}`}>
                        {exp.category}
                      </span>

                      <div>
                        <h4 className="font-bold text-sm text-slate-900">
                          {exp.description || `${exp.category} Expense`}
                        </h4>
                        <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5">
                          {exp.expense_date && <span>📅 {exp.expense_date}</span>}
                          {associatedStop && (
                            <span>📍 Stop: {associatedStop.city ? associatedStop.city.name : `Stop #${associatedStop.stop_order}`}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="font-extrabold text-sm text-slate-900">
                        {exp.currency} {parseFloat(exp.amount).toLocaleString()}
                      </span>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => openEditModal(exp)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
                          title="Edit Expense"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteExpId(exp.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingExpense ? 'Edit Expense' : 'Log New Expense'}
            </h3>

            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount ({trip?.currency}) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 150.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none capitalize"
                >
                  <option value="transport">Transport</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="activities">Activities</option>
                  <option value="meals">Meals</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Train ticket to Paris"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Associate Stop</label>
                  <select
                    value={tripStopId}
                    onChange={(e) => setTripStopId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  >
                    <option value="">(Whole Trip)</option>
                    {stops.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.city ? s.city.name : `Stop ${s.stop_order}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-3 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition flex items-center space-x-2 shadow"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingExpense ? 'Save Changes' : 'Add Expense'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteExpId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Expense?</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete this expense? This action will update your total spent and remaining budget calculations.
            </p>
            <div className="flex items-center space-x-3 justify-end">
              <button
                onClick={() => setDeleteExpId(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteExpense}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition flex items-center space-x-2 shadow"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Expense</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
