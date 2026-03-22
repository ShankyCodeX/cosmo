import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Generating 8 additional dummy courses...');
  
  const courses = [
    { name: 'Class 12th Chemistry - Organic Crash Course', desc: 'Master all organic name reactions, mechanisms, and isomers.', price: 0 },
    { name: 'Advanced Mathematics - Calculus & Vectors', desc: 'Deep dive into integration, differentiation, and 3D geometry.', price: 0 },
    { name: 'NEET Fastrack Biology', desc: 'Complete human physiology and plant genetics for NEET aspirants.', price: 0 },
    { name: 'Data Structures & Algorithms in Python', desc: 'Trees, Graphs, Dynamic Programming, and technical interview prep.', price: 0 },
    { name: 'Macroeconomics for Boards', desc: 'National income, money & banking, and government budget explained.', price: 0 },
    { name: 'Artificial Intelligence & Machine Learning', desc: 'Introduction to neural networks, TensorFlow, and basic ML models.', price: 0 },
    { name: 'Indian History & Constitution', desc: 'Comprehensive coverage of modern Indian history and constitutional law.', price: 0 },
    { name: 'Business Studies & Entrepreneurship', desc: 'Principles of management, financial markets, and starting a startup.', price: 0 }
  ];

  for (const c of courses) {
    const batch = await prisma.batch.create({
      data: {
        name: c.name,
        description: c.desc,
        price: c.price,
      }
    });

    // Add a corresponding YouTube embed video placeholder
    await prisma.video.create({
      data: {
        title: `${c.name} - Lecture 01`,
        description: 'Introduction and syllabus overview for the course.',
        videoUrl: 'https://www.youtube.com/embed/8GEebx72-qs', // Random educational placeholder
        batchId: batch.id,
      }
    });
  }

  // Give all existing students access to all batches immediately so they aren't empty!
  const students = await prisma.user.findMany({ where: { role: 'STUDENT' } });
  const allBatches = await prisma.batch.findMany();

  for (const student of students) {
    for (const batch of allBatches) {
      try {
        await prisma.enrollment.create({
          data: { userId: student.id, batchId: batch.id }
        });
      } catch (e) {
        // Will throw an error if already enrolled, which is perfectly fine to ignore
      }
    }
  }

  console.log('✅ Seed completed successfully! Added 8 more dummy courses.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
