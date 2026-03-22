import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing dummy video URLs in the live database...');

  // Update ALL videos to point to a perfectly working FREE CrashCourse Physics video
  const result = await prisma.video.updateMany({
    data: {
      videoUrl: 'https://www.youtube.com/embed/bJzb-RuUcMU',
    },
  });

  console.log(`✅ Successfully updated ${result.count} dummy videos to a working YouTube embed link!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
