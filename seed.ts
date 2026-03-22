import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old placeholder data...');
  // We don't wipe users so you can keep testing your accounts
  
  // 1. Create a dummy Batch
  const batch1 = await prisma.batch.create({
    data: {
      name: 'Class 11th Physics - Motion & Mechanics',
      description: 'Master the fundamentals of Physics with deep dives into kinematics, Newton\'s laws, and energy.',
      price: 0, 
    }
  });

  const batch2 = await prisma.batch.create({
    data: {
      name: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, and Next.js from scratch.',
      price: 0,
    }
  });

  // 2. Add Dummy YouTube Videos
  await prisma.video.createMany({
    data: [
      {
        title: 'Physics 01: Introduction & Dimensional Analysis',
        description: 'First lecture covering units, dimensions, and basic conversions.',
        videoUrl: 'https://www.youtube.com/embed/8GEebx72-qs', // Random educational placeholder
        batchId: batch1.id,
      },
      {
        title: 'Physics 02: Kinematics 1D',
        description: 'Speed, velocity, acceleration, and equations of motion.',
        videoUrl: 'https://www.youtube.com/embed/b1tSGzJJUzQ',
        batchId: batch1.id,
      },
      {
        title: 'Web Dev: Setup Your Environment',
        description: 'Installing VS Code, Node.js, and browser extensions.',
        videoUrl: 'https://www.youtube.com/embed/8_X0nSrzXAw',
        batchId: batch2.id,
      },
      {
        title: 'Web Dev: HTML Crash Course',
        description: 'Semantic tags, forms, and structure.',
        videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE',
        batchId: batch2.id,
      }
    ]
  });

  // Automatically enroll all existing students in Batch 1 so they see it immediately!
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' }
  });

  for (const student of students) {
    try {
      await prisma.enrollment.create({
        data: {
          userId: student.id,
          batchId: batch1.id
        }
      });
    } catch (e) {
      // Ignore if already enrolled
    }
  }

  console.log('✅ Seed completed successfully! Added 2 dummy courses and 4 YouTube videos.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
