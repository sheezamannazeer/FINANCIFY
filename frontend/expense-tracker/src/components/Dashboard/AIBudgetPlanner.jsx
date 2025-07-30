import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPath';

const AIBudgetPlanner = () => {
    const [budgetPlan, setBudgetPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [totalBudget, setTotalBudget] = useState('');
    const [requirements, setRequirements] = useState('');

    // Budget comparison
    const [comparison, setComparison] = useState(null);
    const [insights, setInsights] = useState(null);

    useEffect(() => {
        fetchCurrentBudgetPlan();
        fetchBudgetInsights();
    }, []);

    const fetchCurrentBudgetPlan = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_PATHS.AI_BUDGET_PLANNER.GET_CURRENT_PLAN);
            setBudgetPlan(response.data.data);
        } catch (err) {
            console.error('Error fetching budget plan:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBudgetInsights = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.AI_BUDGET_PLANNER.GET_INSIGHTS);
            setInsights(response.data.data);
        } catch (err) {
            console.error('Error fetching budget insights:', err);
        }
    };

    const generateBudgetPlan = async (e) => {
        e.preventDefault();
        
        if (!totalBudget || !requirements) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setGenerating(true);
            setError('');
            setSuccess('');

            const response = await axiosInstance.post(API_PATHS.AI_BUDGET_PLANNER.GENERATE_PLAN, {
                totalBudget: Number(totalBudget),
                requirements
            });

            setBudgetPlan(response.data.data);
            setSuccess('AI Budget Plan generated successfully!');
            
            // Clear form
            setTotalBudget('');
            setRequirements('');
            
            // Refresh insights
            fetchBudgetInsights();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate budget plan');
            console.error('Error generating budget plan:', err);
        } finally {
            setGenerating(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#e53935';
            case 'medium': return '#ff9800';
            case 'low': return '#4caf50';
            default: return '#875cf5';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'over': return '#e53935';
            case 'warning': return '#ff9800';
            case 'good': return '#4caf50';
            default: return '#875cf5';
        }
    };

    if (loading) {
        return (
            <div style={{
                background: '#fff',
                borderRadius: 18,
                boxShadow: '0 2px 16px rgba(135,92,245,0.10)',
                padding: 32,
                textAlign: 'center'
            }}>
                <div>🤖 Loading your budget plan...</div>
            </div>
        );
    }

    return (
        <div style={{
            width: '100%',
            maxWidth: '100%',
        }}>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                marginBottom: 24,
                fontWeight: 700,
                fontSize: 22
            }}>
                <span>🎯</span>
                <span>AI Budget Planner</span>
            </div>

            {error && (
                <div style={{
                    padding: 12,
                    background: '#ffebee',
                    color: '#e53935',
                    borderRadius: 8,
                    marginBottom: 16
                }}>
                    {error}
                </div>
            )}

            {success && (
                <div style={{
                    padding: 12,
                    background: '#e8f5e8',
                    color: '#4caf50',
                    borderRadius: 8,
                    marginBottom: 16
                }}>
                    {success}
                </div>
            )}

            {/* Generate New Budget Plan */}
            {!budgetPlan && (
                <div style={{ marginBottom: 32 }}>
                    <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Generate AI Budget Plan</h3>
                    <form onSubmit={generateBudgetPlan}>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                Total Monthly Budget (₹)
                            </label>
                            <input
                                type="number"
                                value={totalBudget}
                                onChange={(e) => setTotalBudget(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: 12,
                                    borderRadius: 8,
                                    border: '1px solid #ddd',
                                    fontSize: 16
                                }}
                                placeholder="e.g., 50000"
                                required
                            />
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                Your Requirements & Priorities
                            </label>
                            <textarea
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: 12,
                                    borderRadius: 8,
                                    border: '1px solid #ddd',
                                    fontSize: 16,
                                    minHeight: 100,
                                    resize: 'vertical'
                                }}
                                placeholder="e.g., I need to pay rent of ₹15000, food expenses, transportation, and want to save for vacation. I also have some entertainment expenses."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={generating}
                            style={{
                                background: '#875cf5',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                padding: '12px 24px',
                                fontWeight: 600,
                                cursor: generating ? 'not-allowed' : 'pointer',
                                fontSize: 16,
                                width: '100%',
                                opacity: generating ? 0.7 : 1
                            }}
                        >
                            {generating ? '🤖 Generating AI Budget Plan...' : '🎯 Generate AI Budget Plan'}
                        </button>
                    </form>
                </div>
            )}

            {/* Current Budget Plan */}
            {budgetPlan && (
                <div style={{ marginBottom: 32 }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: 16 
                    }}>
                        <h3 style={{ fontWeight: 600 }}>Your AI Budget Plan</h3>
                        <button
                            onClick={() => setBudgetPlan(null)}
                            style={{
                                background: 'none',
                                border: '1px solid #875cf5',
                                color: '#875cf5',
                                borderRadius: 6,
                                padding: '6px 12px',
                                fontSize: 12,
                                cursor: 'pointer'
                            }}
                        >
                            Generate New
                        </button>
                    </div>

                    {/* Budget Summary */}
                    <div style={{
                        background: '#f8f9fa',
                        padding: 16,
                        borderRadius: 12,
                        marginBottom: 20
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontWeight: 600 }}>Total Budget</span>
                            <span style={{ fontWeight: 600, color: '#875cf5' }}>
                                ₹{budgetPlan.summary?.totalAllocated?.toLocaleString()}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span>Savings Rate</span>
                            <span style={{ color: '#4caf50' }}>
                                {budgetPlan.summary?.savingsRate}%
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Remaining</span>
                            <span style={{ color: '#875cf5' }}>
                                ₹{budgetPlan.summary?.remaining?.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Budget Categories */}
                    <div style={{ marginBottom: 20 }}>
                        <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Budget Categories</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {budgetPlan.categories?.map((category, index) => (
                                <div key={index} style={{
                                    border: `2px solid ${getPriorityColor(category.priority)}`,
                                    borderRadius: 12,
                                    padding: 16,
                                    background: `${getPriorityColor(category.priority)}10`
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        marginBottom: 8 
                                    }}>
                                        <span style={{ fontWeight: 600 }}>{category.name}</span>
                                        <span style={{ 
                                            fontWeight: 600, 
                                            color: getPriorityColor(category.priority) 
                                        }}>
                                            ₹{category.allocated?.toLocaleString()} ({category.percentage}%)
                                        </span>
                                    </div>
                                    <div style={{ 
                                        color: '#666', 
                                        fontSize: 14, 
                                        marginBottom: 8 
                                    }}>
                                        {category.description}
                                    </div>
                                    {category.tips && category.tips.length > 0 && (
                                        <div style={{ fontSize: 12, color: '#875cf5' }}>
                                            💡 {category.tips[0]}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Key Insights */}
                    {budgetPlan.summary?.keyInsights && budgetPlan.summary.keyInsights.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                            <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Key Insights</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {budgetPlan.summary.keyInsights.map((insight, index) => (
                                    <div key={index} style={{
                                        padding: 12,
                                        background: '#f8f9fa',
                                        borderRadius: 8,
                                        fontSize: 14
                                    }}>
                                        💡 {insight}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommendations */}
                    {budgetPlan.recommendations && budgetPlan.recommendations.length > 0 && (
                        <div>
                            <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Recommendations</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {budgetPlan.recommendations.map((rec, index) => (
                                    <div key={index} style={{
                                        padding: 12,
                                        background: '#e8f5e8',
                                        borderRadius: 8,
                                        fontSize: 14,
                                        color: '#2e7d32'
                                    }}>
                                        ✅ {rec}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Budget Insights */}
            {insights && (insights.insights?.length > 0 || insights.recommendations?.length > 0) && (
                <div>
                    <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Budget Performance Insights</h3>
                    
                    {insights.insights?.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                            <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Insights</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {insights.insights.map((insight, index) => (
                                    <div key={index} style={{
                                        padding: 12,
                                        background: insight.severity === 'high' ? '#ffebee' : 
                                                  insight.severity === 'medium' ? '#fff3e0' : '#e8f5e8',
                                        color: insight.severity === 'high' ? '#e53935' : 
                                              insight.severity === 'medium' ? '#ff9800' : '#4caf50',
                                        borderRadius: 8,
                                        fontSize: 14
                                    }}>
                                        {insight.category
                                            ? insight.message.replace(/this category|undefined/g, insight.category)
                                            : insight.message}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {insights.recommendations?.length > 0 && (
                        <div>
                            <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Recommendations</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {insights.recommendations.map((rec, index) => (
                                    <div key={index} style={{
                                        padding: 12,
                                        background: rec.priority === 'high' ? '#ffebee' : 
                                                  rec.priority === 'medium' ? '#fff3e0' : '#e8f5e8',
                                        color: rec.priority === 'high' ? '#e53935' : 
                                              rec.priority === 'medium' ? '#ff9800' : '#4caf50',
                                        borderRadius: 8,
                                        fontSize: 14
                                    }}>
                                        💡 {rec.message}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AIBudgetPlanner; 