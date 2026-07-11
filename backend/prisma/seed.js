const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Clean existing data in correct order (children first)
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.caseNote.deleteMany();
  await prisma.timeline.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.case.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.aIAnalysis.deleteMany();
  await prisma.forecast.deleteMany();
  await prisma.liquiditySnapshot.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.physicalCash.deleteMany();
  await prisma.providerBalance.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.user.deleteMany();
  await prisma.area.deleteMany();
  await prisma.role.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // ── Roles ──────────────────────────────────────────────────────────────────
  const roleAgent = await prisma.role.create({
    data: { name: 'AGENT', description: 'Field agent responsible for cash collection and disbursement' },
  });
  const roleOperator = await prisma.role.create({
    data: { name: 'OPERATOR', description: 'Back-office operator handling alerts and case management' },
  });
  const roleManagement = await prisma.role.create({
    data: { name: 'MANAGEMENT', description: 'Management user with oversight and decision-making authority' },
  });

  // ── Areas ──────────────────────────────────────────────────────────────────
  const areaData = [
    { name: 'Dhaka', code: 'DHA', description: 'Dhaka Division' },
    { name: 'Sylhet', code: 'SYL', description: 'Sylhet Division' },
    { name: 'Rajshahi', code: 'RAJ', description: 'Rajshahi Division' },
    { name: 'Khulna', code: 'KHU', description: 'Khulna Division' },
    { name: 'Barisal', code: 'BAR', description: 'Barisal Division' },
    { name: 'Rangpur', code: 'RAN', description: 'Rangpur Division' },
    { name: 'Mymensingh', code: 'MYM', description: 'Mymensingh Division' },
    { name: 'Chattogram', code: 'CHA', description: 'Chattogram Division' },
  ];
  const areas = {};
  for (const a of areaData) {
    areas[a.code] = await prisma.area.create({ data: a });
  }

  // ── Providers ──────────────────────────────────────────────────────────────
  const providerData = [
    { name: 'bKash', code: 'BKASH', status: 'ACTIVE' },
    { name: 'Nagad', code: 'NAGAD', status: 'ACTIVE' },
    { name: 'Rocket', code: 'ROCKET', status: 'ACTIVE' },
  ];
  const providers = {};
  for (const p of providerData) {
    providers[p.code] = await prisma.provider.create({ data: p });
  }

  // ── Provider Balances ──────────────────────────────────────────────────────
  await prisma.providerBalance.create({
    data: {
      providerId: providers['BKASH'].id,
      currentBalance: 12500000,
      availableBalance: 12000000,
      reservedBalance: 500000,
    },
  });
  await prisma.providerBalance.create({
    data: {
      providerId: providers['NAGAD'].id,
      currentBalance: 8700000,
      availableBalance: 8500000,
      reservedBalance: 200000,
    },
  });
  await prisma.providerBalance.create({
    data: {
      providerId: providers['ROCKET'].id,
      currentBalance: 5400000,
      availableBalance: 5200000,
      reservedBalance: 200000,
    },
  });

  // ── Physical Cash ──────────────────────────────────────────────────────────
  await prisma.physicalCash.create({
    data: { currentBalance: 45000000 },
  });

  // ── Users ──────────────────────────────────────────────────────────────────
  const agent1 = await prisma.user.create({
    data: {
      name: 'Rahim Uddin',
      email: 'rahim.uddin@finsoc.com',
      password: hashedPassword,
      phone: '+8801711000001',
      roleId: roleAgent.id,
      areaId: areas['DHA'].id,
      status: 'ACTIVE',
    },
  });
  const agent2 = await prisma.user.create({
    data: {
      name: 'Karim Hassan',
      email: 'karim.hassan@finsoc.com',
      password: hashedPassword,
      phone: '+8801711000002',
      roleId: roleAgent.id,
      areaId: areas['SYL'].id,
      status: 'ACTIVE',
    },
  });
  const agent3 = await prisma.user.create({
    data: {
      name: 'Fatima Begum',
      email: 'fatima.begum@finsoc.com',
      password: hashedPassword,
      phone: '+8801711000003',
      roleId: roleAgent.id,
      areaId: areas['CHA'].id,
      status: 'ACTIVE',
    },
  });
  const operator1 = await prisma.user.create({
    data: {
      name: 'Hasan Mahmud',
      email: 'hasan.mahmud@finsoc.com',
      password: hashedPassword,
      phone: '+8801711000004',
      roleId: roleOperator.id,
      areaId: areas['DHA'].id,
      status: 'ACTIVE',
    },
  });
  const operator2 = await prisma.user.create({
    data: {
      name: 'Nusrat Jahan',
      email: 'nusrat.jahan@finsoc.com',
      password: hashedPassword,
      phone: '+8801711000005',
      roleId: roleOperator.id,
      areaId: areas['CHA'].id,
      status: 'ACTIVE',
    },
  });
  const management = await prisma.user.create({
    data: {
      name: 'Tahmid Rahman',
      email: 'tahmid.rahman@finsoc.com',
      password: hashedPassword,
      phone: '+8801711000006',
      roleId: roleManagement.id,
      areaId: areas['DHA'].id,
      status: 'ACTIVE',
    },
  });

  // ── Transactions ───────────────────────────────────────────────────────────
  const now = new Date();
  const day = (d) => new Date(now.getTime() - d * 86400000);

  // 5 completed cash-in
  const txn1 = await prisma.transaction.create({
    data: {
      referenceNumber: 'TXN-2026-00001',
      type: 'CASH_IN',
      amount: 500000,
      providerId: providers['BKASH'].id,
      agentId: agent1.id,
      areaId: areas['DHA'].id,
      status: 'COMPLETED',
      remarks: 'Daily collection from Gulshan branch',
      createdById: agent1.id,
      completedAt: day(1),
      createdAt: day(1),
    },
  });
  const txn2 = await prisma.transaction.create({
    data: {
      referenceNumber: 'TXN-2026-00002',
      type: 'CASH_IN',
      amount: 320000,
      providerId: providers['NAGAD'].id,
      agentId: agent2.id,
      areaId: areas['SYL'].id,
      status: 'COMPLETED',
      remarks: 'Collection from Zindabazar agents',
      createdById: agent2.id,
      completedAt: day(2),
      createdAt: day(2),
    },
  });
  const txn3 = await prisma.transaction.create({
    data: {
      referenceNumber: 'TXN-2026-00003',
      type: 'CASH_IN',
      amount: 780000,
      providerId: providers['BKASH'].id,
      agentId: agent3.id,
      areaId: areas['CHA'].id,
      status: 'COMPLETED',
      remarks: 'Weekly bulk deposit from Agrabad',
      createdById: agent3.id,
      completedAt: day(3),
      createdAt: day(3),
    },
  });
  const txn4 = await prisma.transaction.create({
    data: {
      referenceNumber: 'TXN-2026-00004',
      type: 'CASH_IN',
      amount: 150000,
      providerId: providers['ROCKET'].id,
      agentId: agent1.id,
      areaId: areas['DHA'].id,
      status: 'COMPLETED',
      remarks: 'Collection from Uttara branch',
      createdById: agent1.id,
      completedAt: day(4),
      createdAt: day(4),
    },
  });
  const txn5 = await prisma.transaction.create({
    data: {
      referenceNumber: 'TXN-2026-00005',
      type: 'CASH_IN',
      amount: 920000,
      providerId: providers['NAGAD'].id,
      agentId: agent2.id,
      areaId: areas['SYL'].id,
      status: 'COMPLETED',
      remarks: 'Large deposit from Upashahar',
      createdById: agent2.id,
      completedAt: day(5),
      createdAt: day(5),
    },
  });

  // 3 completed cash-out
  const txn6 = await prisma.transaction.create({
    data: {
      referenceNumber: 'TXN-2026-00006',
      type: 'CASH_OUT',
      amount: 200000,
      providerId: providers['BKASH'].id,
      agentId: agent3.id,
      areaId: areas['CHA'].id,
      status: 'COMPLETED',
      remarks: 'Disbursement to merchant partners',
      createdById: operator1.id,
      completedAt: day(2),
      createdAt: day(2),
    },
  });
  const txn7 = await prisma.transaction.create({
    data: {
      referenceNumber: 'TXN-2026-00007',
      type: 'CASH_OUT',
      amount: 450000,
      providerId: providers['BKASH'].id,
      agentId: agent1.id,
      areaId: areas['DHA'].id,
      status: 'COMPLETED',
      remarks: 'Withdrawal processing for corporate client',
      createdById: operator1.id,
      completedAt: day(3),
      createdAt: day(3),
    },
  });
  const txn8 = await prisma.transaction.create({
    data: {
      referenceNumber: 'TXN-2026-00008',
      type: 'CASH_OUT',
      amount: 110000,
      providerId: providers['ROCKET'].id,
      agentId: agent2.id,
      areaId: areas['SYL'].id,
      status: 'COMPLETED',
      remarks: 'Agent commission payout',
      createdById: operator2.id,
      completedAt: day(4),
      createdAt: day(4),
    },
  });

  // 1 pending cash-in
  const txn9 = await prisma.transaction.create({
    data: {
      referenceNumber: 'TXN-2026-00009',
      type: 'CASH_IN',
      amount: 650000,
      providerId: providers['NAGAD'].id,
      agentId: agent3.id,
      areaId: areas['CHA'].id,
      status: 'PENDING',
      remarks: 'Pending verification - large amount',
      createdById: agent3.id,
      createdAt: day(0),
    },
  });

  // ── AI Analysis ────────────────────────────────────────────────────────────
  const aiAnalysis1 = await prisma.aIAnalysis.create({
    data: {
      summary: 'Unusual spike in cash-in transactions detected in Chattogram',
      reason: 'Transaction volume increased 340% compared to 7-day rolling average',
      recommendation: 'Flag for manual review and verify source of funds',
      confidence: 0.87,
      uncertainty: 0.12,
      promptVersion: 'v2.1',
      modelVersion: 'finbert-large-v1',
    },
  });

  const aiAnalysis2 = await prisma.aIAnalysis.create({
    data: {
      summary: 'Liquidity forecast indicates potential shortfall in Dhaka region',
      reason: 'Current outflow rate exceeds projected inflow by 22% over next 48 hours',
      recommendation: 'Consider rebalancing provider balances from Sylhet to Dhaka',
      confidence: 0.76,
      uncertainty: 0.18,
      promptVersion: 'v2.1',
      modelVersion: 'finbert-large-v1',
    },
  });

  const aiAnalysis3 = await prisma.aIAnalysis.create({
    data: {
      summary: 'Agent Rahim Uddin showing anomalous transaction pattern',
      reason: 'Multiple high-value cash-ins within short time window outside normal business hours',
      recommendation: 'Temporarily restrict transaction limits and investigate',
      confidence: 0.93,
      uncertainty: 0.05,
      promptVersion: 'v2.1',
      modelVersion: 'finbert-large-v1',
    },
  });

  // ── Alerts ─────────────────────────────────────────────────────────────────
  const alert1 = await prisma.alert.create({
    data: {
      title: 'Unusual Transaction Volume - Chattogram',
      severity: 'HIGH',
      status: 'OPEN',
      category: 'Volume Anomaly',
      confidence: 0.87,
      description: 'Chattogram region showing 340% spike in cash-in transactions',
      transactionId: txn3.id,
      aiAnalysisId: aiAnalysis1.id,
      generatedAt: day(1),
    },
  });

  const alert2 = await prisma.alert.create({
    data: {
      title: 'Liquidity Shortfall Warning - Dhaka',
      severity: 'MEDIUM',
      status: 'OPEN',
      category: 'Liquidity',
      confidence: 0.76,
      description: 'Dhaka region projected to face liquidity shortfall within 48 hours',
      aiAnalysisId: aiAnalysis2.id,
      generatedAt: day(1),
    },
  });

  const alert3 = await prisma.alert.create({
    data: {
      title: 'Suspicious Agent Activity - Rahim Uddin',
      severity: 'CRITICAL',
      status: 'ASSIGNED',
      category: 'Suspicious Activity',
      confidence: 0.93,
      description: 'Agent Rahim Uddin conducted multiple high-value transactions outside business hours',
      transactionId: txn4.id,
      aiAnalysisId: aiAnalysis3.id,
      generatedAt: day(2),
    },
  });

  const alert4 = await prisma.alert.create({
    data: {
      title: 'Resolved: Duplicate Transaction Entry',
      severity: 'LOW',
      status: 'RESOLVED',
      category: 'Duplicate',
      confidence: 0.99,
      description: 'Duplicate transaction entry detected and resolved',
      transactionId: txn2.id,
      generatedAt: day(5),
      resolvedAt: day(4),
    },
  });

  // ── Evidence ───────────────────────────────────────────────────────────────
  await prisma.evidence.create({
    data: {
      alertId: alert1.id,
      title: 'Transaction Volume Report',
      description: 'Daily transaction volume comparison showing spike',
      source: 'Analytics Engine',
      value: '340% increase over 7-day average',
      timestamp: day(1),
    },
  });
  await prisma.evidence.create({
    data: {
      alertId: alert1.id,
      title: 'Regional Breakdown',
      description: 'Chattogram vs other regions transaction comparison',
      source: 'BI Dashboard',
      value: 'Chattogram: 780,000 BDT vs avg 180,000 BDT',
      timestamp: day(1),
    },
  });
  await prisma.evidence.create({
    data: {
      alertId: alert3.id,
      title: 'Transaction Timeline',
      description: 'List of transactions by Rahim Uddin outside business hours',
      source: 'Transaction Log',
      value: '3 transactions between 11 PM - 2 AM',
      timestamp: day(2),
    },
  });
  await prisma.evidence.create({
    data: {
      alertId: alert4.id,
      title: 'Duplicate Match Confirmation',
      description: 'System identified matching transaction hash',
      source: 'Reconciliation Engine',
      value: 'Match confidence: 99.7%',
      timestamp: day(5),
    },
  });

  // ── Cases ──────────────────────────────────────────────────────────────────
  const case1 = await prisma.case.create({
    data: {
      alertId: alert3.id,
      priority: 'CRITICAL',
      status: 'ASSIGNED',
      assignedToId: operator1.id,
    },
  });

  const case2 = await prisma.case.create({
    data: {
      alertId: alert4.id,
      priority: 'LOW',
      status: 'RESOLVED',
      assignedToId: operator2.id,
      resolvedAt: day(4),
      closedAt: day(4),
    },
  });

  // ── Assignments ────────────────────────────────────────────────────────────
  await prisma.assignment.create({
    data: {
      caseId: case1.id,
      operatorId: operator1.id,
      assignedById: management.id,
      assignedAt: day(2),
    },
  });

  await prisma.assignment.create({
    data: {
      caseId: case2.id,
      operatorId: operator2.id,
      assignedById: management.id,
      assignedAt: day(5),
      acceptedAt: day(5),
    },
  });

  // ── Timeline ───────────────────────────────────────────────────────────────
  await prisma.timeline.create({
    data: {
      caseId: case1.id,
      action: 'CASE_CREATED',
      description: 'Case created from alert: Suspicious Agent Activity',
      actorId: management.id,
      timestamp: day(2),
    },
  });
  await prisma.timeline.create({
    data: {
      caseId: case1.id,
      action: 'ASSIGNED',
      description: 'Case assigned to Hasan Mahmud',
      actorId: management.id,
      timestamp: day(2),
    },
  });
  await prisma.timeline.create({
    data: {
      caseId: case2.id,
      action: 'CASE_CREATED',
      description: 'Case created for duplicate transaction resolution',
      actorId: management.id,
      timestamp: day(5),
    },
  });
  await prisma.timeline.create({
    data: {
      caseId: case2.id,
      action: 'RESOLVED',
      description: 'Duplicate confirmed and marked as resolved',
      actorId: operator2.id,
      timestamp: day(4),
    },
  });

  // ── Case Notes ─────────────────────────────────────────────────────────────
  await prisma.caseNote.create({
    data: {
      caseId: case1.id,
      authorId: operator1.id,
      content: 'Preliminary review: Agent claims transactions were from corporate clients working late. Need to verify with client list.',
    },
  });
  await prisma.caseNote.create({
    data: {
      caseId: case1.id,
      authorId: operator1.id,
      content: 'Cross-referenced with corporate client database. Two of the three transactions match known clients. Awaiting confirmation on the third.',
    },
  });
  await prisma.caseNote.create({
    data: {
      caseId: case2.id,
      authorId: operator2.id,
      content: 'Verified as system duplicate. Original transaction TXN-2026-00002 already processed. Marking for reversal.',
    },
  });

  // ── Notifications ──────────────────────────────────────────────────────────
  await prisma.notification.create({
    data: {
      userId: operator1.id,
      title: 'New Case Assigned',
      message: 'Critical case assigned: Suspicious Agent Activity - Rahim Uddin',
      type: 'ASSIGNMENT',
      link: `/cases/${case1.id}`,
    },
  });
  await prisma.notification.create({
    data: {
      userId: operator2.id,
      title: 'New Case Assigned',
      message: 'Low priority case assigned: Duplicate Transaction Entry',
      type: 'ASSIGNMENT',
      link: `/cases/${case2.id}`,
    },
  });
  await prisma.notification.create({
    data: {
      userId: management.id,
      title: 'High Severity Alert',
      message: 'New alert: Unusual Transaction Volume in Chattogram',
      type: 'ALERT',
      link: `/alerts/${alert1.id}`,
    },
  });
  await prisma.notification.create({
    data: {
      userId: operator1.id,
      title: 'System Update',
      message: 'Scheduled maintenance tonight at 2 AM',
      type: 'SYSTEM',
      link: null,
    },
  });

  // ── Audit Logs ─────────────────────────────────────────────────────────────
  await prisma.auditLog.create({
    data: {
      userId: management.id,
      action: 'CASE_ASSIGN',
      resource: 'Case',
      resourceId: case1.id,
      oldValue: { status: 'OPEN' },
      newValue: { status: 'ASSIGNED', assignedTo: operator1.id },
      ip: '192.168.1.100',
      timestamp: day(2),
    },
  });
  await prisma.auditLog.create({
    data: {
      userId: operator1.id,
      action: 'NOTE_ADDED',
      resource: 'CaseNote',
      resourceId: case1.id,
      newValue: { content: 'Preliminary review: Agent claims...' },
      ip: '192.168.1.101',
      timestamp: day(2),
    },
  });
  await prisma.auditLog.create({
    data: {
      userId: operator2.id,
      action: 'CASE_RESOLVED',
      resource: 'Case',
      resourceId: case2.id,
      oldValue: { status: 'ASSIGNED' },
      newValue: { status: 'RESOLVED' },
      ip: '192.168.1.102',
      timestamp: day(4),
    },
  });
  await prisma.auditLog.create({
    data: {
      userId: operator1.id,
      action: 'TRANSACTION_VIEWED',
      resource: 'Transaction',
      resourceId: txn4.id,
      ip: '192.168.1.101',
      timestamp: day(2),
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
