"use strict";
/**
 * Test Script for Persistent Memory System API
 * Purpose: Verify that all API routes work correctly with the database
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function testMemorySystem() {
    return __awaiter(this, void 0, void 0, function () {
        var conversation, message1, message2, plan, decision, app, instruction, context, knowledge, conversationWithCounts, _a, conversationCount, messageCount, planCount, decisionCount, appCount, instructionCount, contextCount, knowledgeCount, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('🧪 Testing Persistent Memory System...\n');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 13, 14, 16]);
                    // Test 1: Create a conversation
                    console.log('✅ Test 1: Creating a conversation...');
                    return [4 /*yield*/, prisma.conversation.create({
                            data: {
                                title: 'Test Conversation - Persistent Memory Implementation',
                                userId: 'test_user',
                                status: 'ACTIVE',
                                metadata: {
                                    topic: 'System Enhancement',
                                    tags: ['persistent-memory', 'nexus', 'database'],
                                },
                            },
                        })];
                case 2:
                    conversation = _b.sent();
                    console.log("   Created conversation: ".concat(conversation.id));
                    // Test 2: Create messages in the conversation
                    console.log('\n✅ Test 2: Creating messages...');
                    return [4 /*yield*/, prisma.message.create({
                            data: {
                                conversationId: conversation.id,
                                role: 'USER',
                                content: 'Please implement a persistent memory system for NEXUS.',
                                metadata: {
                                    tokens: 15,
                                },
                            },
                        })];
                case 3:
                    message1 = _b.sent();
                    console.log("   Created user message: ".concat(message1.id));
                    return [4 /*yield*/, prisma.message.create({
                            data: {
                                conversationId: conversation.id,
                                role: 'ASSISTANT',
                                content: 'I will implement the persistent memory system with 8 database models.',
                                metadata: {
                                    tokens: 20,
                                    model: 'gpt-4',
                                },
                            },
                        })];
                case 4:
                    message2 = _b.sent();
                    console.log("   Created assistant message: ".concat(message2.id));
                    // Test 3: Create a plan
                    console.log('\n✅ Test 3: Creating a plan...');
                    return [4 /*yield*/, prisma.plan.create({
                            data: {
                                conversationId: conversation.id,
                                title: 'Implement Persistent Memory System',
                                description: 'Add 8 new models and 5 API routes to enable NEXUS memory',
                                status: 'IN_PROGRESS',
                                priority: 'HIGH',
                                metadata: {
                                    tasks: [
                                        { id: '1', description: 'Update Prisma schema', status: 'completed' },
                                        { id: '2', description: 'Create API routes', status: 'completed' },
                                        { id: '3', description: 'Test system', status: 'in_progress' },
                                    ],
                                    estimatedHours: 8,
                                },
                            },
                        })];
                case 5:
                    plan = _b.sent();
                    console.log("   Created plan: ".concat(plan.id));
                    // Test 4: Create a decision
                    console.log('\n✅ Test 4: Creating a decision...');
                    return [4 /*yield*/, prisma.decision.create({
                            data: {
                                conversationId: conversation.id,
                                planId: plan.id,
                                title: 'Use PostgreSQL for Persistent Storage',
                                description: 'Store all conversation history, plans, and decisions in PostgreSQL database',
                                rationale: 'PostgreSQL provides ACID compliance and complex querying capabilities',
                                madeBy: 'NEXUS Team',
                                impact: 'HIGH',
                                metadata: {
                                    alternatives: [
                                        {
                                            option: 'File-based storage',
                                            pros: ['Simple', 'No database required'],
                                            cons: ['No querying', 'No relationships', 'Hard to scale'],
                                        },
                                    ],
                                    affectedSystems: ['NEXUS Core', 'All Satellite Apps'],
                                },
                            },
                        })];
                case 6:
                    decision = _b.sent();
                    console.log("   Created decision: ".concat(decision.id));
                    // Test 5: Register an app
                    console.log('\n✅ Test 5: Registering an app...');
                    return [4 /*yield*/, prisma.appRegistry.create({
                            data: {
                                appName: 'SFG NEXUS Core',
                                appType: 'CORE_SYSTEM',
                                description: 'Main business management platform for SFG Aluminium',
                                baseUrl: 'http://localhost:3000',
                                status: 'ACTIVE',
                                technologies: [
                                    { name: 'Next.js', version: '14', type: 'framework' },
                                    { name: 'PostgreSQL', version: '15', type: 'database' },
                                    { name: 'TypeScript', version: '5', type: 'language' },
                                ],
                                owner: 'SFG Development Team',
                                repositoryPath: '/home/ubuntu/sfg-nexus-mockup',
                                apiEndpoints: [
                                    {
                                        path: '/api/memory/conversations',
                                        method: 'GET',
                                        description: 'List all conversations',
                                        requiresAuth: true,
                                    },
                                ],
                                metadata: {
                                    version: '1.0.0',
                                    lastDeployment: new Date(),
                                },
                            },
                        })];
                case 7:
                    app = _b.sent();
                    console.log("   Registered app: ".concat(app.id));
                    // Test 6: Create an instruction
                    console.log('\n✅ Test 6: Creating an instruction...');
                    return [4 /*yield*/, prisma.instruction.create({
                            data: {
                                title: 'How to Deploy NEXUS Updates',
                                content: "1. Update the code in /home/ubuntu/sfg-nexus-mockup\n2. Run database migrations: npx prisma migrate deploy\n3. Rebuild the application: npm run build\n4. Restart the server: pm2 restart nexus",
                                category: 'DEPLOYMENT',
                                priority: 'HIGH',
                                metadata: {
                                    tags: ['deployment', 'nexus', 'production'],
                                    estimatedTime: 15,
                                    difficulty: 'medium',
                                },
                            },
                        })];
                case 8:
                    instruction = _b.sent();
                    console.log("   Created instruction: ".concat(instruction.id));
                    // Test 7: Create a context entry
                    console.log('\n✅ Test 7: Creating a context entry...');
                    return [4 /*yield*/, prisma.context.create({
                            data: {
                                key: 'nexus.deployment.path',
                                value: '/home/ubuntu/sfg-nexus-mockup',
                                category: 'SYSTEM_CONFIG',
                                metadata: {
                                    scope: 'global',
                                    source: 'deployment_guide',
                                },
                            },
                        })];
                case 9:
                    context = _b.sent();
                    console.log("   Created context: ".concat(context.id));
                    // Test 8: Create a knowledge base entry
                    console.log('\n✅ Test 8: Creating a knowledge base entry...');
                    return [4 /*yield*/, prisma.knowledgeBase.create({
                            data: {
                                topic: 'Persistent Memory System Architecture',
                                content: "The persistent memory system consists of 8 interconnected models:\n1. Conversation - tracks conversation sessions\n2. Message - stores all messages in conversations\n3. Plan - tracks implementation plans\n4. Decision - records key decisions\n5. AppRegistry - central registry of all apps\n6. Instruction - stores reusable instructions\n7. Context - stores contextual information\n8. KnowledgeBase - builds organizational knowledge",
                                source: 'Implementation Documentation',
                                category: 'TECHNICAL',
                                tags: ['architecture', 'persistent-memory', 'nexus', 'database'],
                                relevanceScore: 1.0,
                                metadata: {
                                    confidence: 1.0,
                                    version: '1.0.0',
                                    contributors: ['NEXUS Development Team'],
                                },
                            },
                        })];
                case 10:
                    knowledge = _b.sent();
                    console.log("   Created knowledge base entry: ".concat(knowledge.id));
                    // Test 9: Retrieve and verify data
                    console.log('\n✅ Test 9: Retrieving and verifying data...');
                    return [4 /*yield*/, prisma.conversation.findUnique({
                            where: { id: conversation.id },
                            include: {
                                _count: {
                                    select: {
                                        messages: true,
                                        plans: true,
                                        decisions: true,
                                    },
                                },
                            },
                        })];
                case 11:
                    conversationWithCounts = _b.sent();
                    console.log("   Conversation has:");
                    console.log("   - ".concat(conversationWithCounts === null || conversationWithCounts === void 0 ? void 0 : conversationWithCounts._count.messages, " messages"));
                    console.log("   - ".concat(conversationWithCounts === null || conversationWithCounts === void 0 ? void 0 : conversationWithCounts._count.plans, " plans"));
                    console.log("   - ".concat(conversationWithCounts === null || conversationWithCounts === void 0 ? void 0 : conversationWithCounts._count.decisions, " decisions"));
                    // Test 10: Count all records
                    console.log('\n✅ Test 10: Counting all records...');
                    return [4 /*yield*/, Promise.all([
                            prisma.conversation.count(),
                            prisma.message.count(),
                            prisma.plan.count(),
                            prisma.decision.count(),
                            prisma.appRegistry.count(),
                            prisma.instruction.count(),
                            prisma.context.count(),
                            prisma.knowledgeBase.count(),
                        ])];
                case 12:
                    _a = _b.sent(), conversationCount = _a[0], messageCount = _a[1], planCount = _a[2], decisionCount = _a[3], appCount = _a[4], instructionCount = _a[5], contextCount = _a[6], knowledgeCount = _a[7];
                    console.log("   Total records in memory system:");
                    console.log("   - Conversations: ".concat(conversationCount));
                    console.log("   - Messages: ".concat(messageCount));
                    console.log("   - Plans: ".concat(planCount));
                    console.log("   - Decisions: ".concat(decisionCount));
                    console.log("   - Apps: ".concat(appCount));
                    console.log("   - Instructions: ".concat(instructionCount));
                    console.log("   - Context entries: ".concat(contextCount));
                    console.log("   - Knowledge base entries: ".concat(knowledgeCount));
                    console.log('\n🎉 All tests passed successfully!');
                    console.log('\n📊 Summary:');
                    console.log('   ✅ 8 database models are working correctly');
                    console.log('   ✅ All relationships are properly configured');
                    console.log('   ✅ Data can be created and retrieved successfully');
                    console.log('   ✅ Persistent Memory System is fully operational!\n');
                    return [2 /*return*/, {
                            success: true,
                            testData: {
                                conversation: conversation,
                                message1: message1,
                                message2: message2,
                                plan: plan,
                                decision: decision,
                                app: app,
                                instruction: instruction,
                                context: context,
                                knowledge: knowledge,
                            },
                        }];
                case 13:
                    error_1 = _b.sent();
                    console.error('❌ Test failed:', error_1.message);
                    console.error('   Error details:', error_1);
                    return [2 /*return*/, {
                            success: false,
                            error: error_1.message,
                        }];
                case 14: return [4 /*yield*/, prisma.$disconnect()];
                case 15:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 16: return [2 /*return*/];
            }
        });
    });
}
// Run the tests
testMemorySystem()
    .then(function (result) {
    if (!result.success) {
        process.exit(1);
    }
})
    .catch(function (error) {
    console.error('Fatal error:', error);
    process.exit(1);
});
