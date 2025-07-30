const mongoose=require('mongoose');

const bcrypt=require('bcryptjs');

const UserSchema=new mongoose.Schema(
    {
        fullName:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
        profileImageUrl:{
            type:String,
            default:null,
        },
        // AI Budget Planner fields
        budgetPlans: [{
            totalBudget: Number,
            categories: [{
                name: String,
                allocated: Number,
                priority: String,
                description: String,
                tips: [String],
                percentage: Number
            }],
            summary: {
                totalAllocated: Number,
                remaining: Number,
                savingsRate: Number,
                keyInsights: [String]
            },
            recommendations: [String],
            createdAt: Date,
            month: String
        }],
        currentBudgetPlan: {
            totalBudget: Number,
            categories: [{
                name: String,
                allocated: Number,
                priority: String,
                description: String,
                tips: [String],
                percentage: Number
            }],
            summary: {
                totalAllocated: Number,
                remaining: Number,
                savingsRate: Number,
                keyInsights: [String]
            },
            recommendations: [String],
            createdAt: Date,
            month: String
        }
    },
        {timestamps:true}
);

UserSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
});

UserSchema.methods.comparePassword=async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
};

const User=mongoose.model('User',UserSchema);

module.exports=User;
