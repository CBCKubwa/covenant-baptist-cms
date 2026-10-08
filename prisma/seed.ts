import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // We swapped this to your custom password
  const hashedPassword = await bcrypt.hash('WeareHittingbeyond24/7byHisdoing', 10);
  
  await prisma.admin.upsert({
    // We swapped this to your custom username
    where: { username: 'covenantsadmin' },
    update: {},
    create: {
      username: 'covenantsadmin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });
  console.log("Admin seeded successfully with covenantsadmin.");
}

main()
  .catch((e) => { 
    console.error(e); 
    process.exit(1); 
  })
  .finally(async () => { 
    await prisma.$disconnect(); 
  });