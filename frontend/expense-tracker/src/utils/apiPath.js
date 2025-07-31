export const BASE_URL = import.meta.env.VITE_API_URL || 'https://financify-xnc2.onrender.com';

const API_PATHS = {
    AUTH: {
        LOGIN: '/api/v1/auth/login',
        SIGNUP: '/api/v1/auth/register',
    },
    DASHBOARD:{
        GET_DATA:"/api/v1/dashboard",
        DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
        DOWNLOAD_INCOME: '/api/v1/income/downloadexcel',
    },
    INCOME:{
        GET_ALL: '/api/v1/income/get',
        ADD: '/api/v1/income/add',
        DELETE: (id) => `/api/v1/income/${id}`,
        DOWNLOAD: '/api/v1/income/downloadexcel',
    },
    EXPENSE:{
        ADD_EXPENSE:"/api/v1/expense/add",
        GET_ALL_EXPENSE:"/api/v1/expense/get",
        DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
        DOWNLOAD_EXPENSE:"/api/v1/expense/downloadexcel",
    },
    IMAGE:{
        UPLOAD_IMAGE:"/api/v1/auth/upload-image",
    },
    AI_BUDGET_PLANNER: {
        GENERATE_PLAN: '/api/v1/ai-budget-planner/generate',
        GET_CURRENT_PLAN: '/api/v1/ai-budget-planner/current',
        GET_HISTORY: '/api/v1/ai-budget-planner/history',
        COMPARE_SPENDING: '/api/v1/ai-budget-planner/compare',
        GET_INSIGHTS: '/api/v1/ai-budget-planner/insights',
    }
};

export default API_PATHS;