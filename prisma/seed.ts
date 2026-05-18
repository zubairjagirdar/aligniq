import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding ALIGNIQ demo data...')

  // Create demo users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@aligniq.com',
      name: 'Sarah Chen',
      role: 'ADMIN'
    }
  })

  const manager1 = await prisma.user.create({
    data: {
      email: 'manager@aligniq.com',
      name: 'Marcus Johnson',
      role: 'MANAGER'
    }
  })

  const employee1 = await prisma.user.create({
    data: {
      email: 'emp1@aligniq.com',
      name: 'Emily Rodriguez',
      role: 'EMPLOYEE'
    }
  })

  const employee2 = await prisma.user.create({
    data: {
      email: 'emp2@aligniq.com',
      name: 'David Kim',
      role: 'EMPLOYEE'
    }
  })

  console.log('✓ Created 4 users')

  // Create goals for employees
  const goal1 = await prisma.goal.create({
    data: {
      ownerId: employee1.id,
      title: 'Increase Q1 Revenue',
      description: 'Grow monthly recurring revenue by 25%',
      targetValue: 500,
      unit: '$K',
      weight: 30,
      type: 'MIN',
      status: 'ON_TRACK'
    }
  })

  const goal2 = await prisma.goal.create({
    data: {
      ownerId: employee1.id,
      title: 'Improve Customer NPS',
      description: 'Achieve NPS score above 60',
      targetValue: 60,
      unit: 'points',
      weight: 25,
      type: 'MIN',
      status: 'ON_TRACK'
    }
  })

  const goal3 = await prisma.goal.create({
    data: {
      ownerId: employee2.id,
      title: 'Deploy Product v2.0',
      description: 'Launch new platform by Q1 end',
      targetValue: 1,
      unit: 'release',
      weight: 40,
      type: 'TIMELINE',
      status: 'NOT_STARTED'
    }
  })

  console.log('✓ Created 3 goals')

  // Create check-ins
  await prisma.checkin.create({
    data: {
      goalId: goal1.id,
      authorId: employee1.id,
      progress: 65,
      notes: 'Closed 3 major deals this week. Pipeline strong.'
    }
  })

  await prisma.checkin.create({
    data: {
      goalId: goal2.id,
      authorId: employee1.id,
      progress: 72,
      notes: 'Net Promoter Score trending positive. Customer feedback excellent.'
    }
  })

  console.log('✓ Created 2 check-ins')

  // Create shared goal (departmental KPI)
  const sharedGoal = await prisma.sharedGoal.create({
    data: {
      title: '[SHARED] Q1 Org Revenue Target',
      targetValue: 5000,
      unit: '$K',
      owners: {
        createMany: {
          data: [
            { userId: employee1.id, weight: 50 },
            { userId: employee2.id, weight: 50 }
          ]
        }
      }
    }
  })

  console.log('✓ Created 1 shared goal')

  // Create AI insights
  await prisma.aIInsight.create({
    data: {
      goalId: goal1.id,
      type: 'risk_prediction',
      score: 25,
      payload: {
        factors: ['Strong progress velocity', 'Manager support confirmed'],
        trend: 'positive'
      }
    }
  })

  await prisma.aIInsight.create({
    data: {
      goalId: goal3.id,
      type: 'risk_prediction',
      score: 72,
      payload: {
        factors: ['No recent updates', 'Deadline in 60 days', 'No started status'],
        trend: 'critical'
      }
    }
  })

  console.log('✓ Created 2 AI insights')

  // Create audit logs
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      entityType: 'Goal',
      entityId: goal1.id,
      field: 'created',
      newValue: 'Goal: Increase Q1 Revenue'
    }
  })

  console.log('✓ Created audit logs')

  console.log('✅ Seed complete! Demo data ready.\n')
  console.log('Demo Accounts:')
  console.log('  Admin: admin@aligniq.com')
  console.log('  Manager: manager@aligniq.com')
  console.log('  Employee: emp1@aligniq.com')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
