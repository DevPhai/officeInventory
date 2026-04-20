const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.transaction.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const stationery = await prisma.category.create({
    data: { name: 'Stationery', description: 'Office supplies like pens, paper, etc.' }
  });

  const electronics = await prisma.category.create({
    data: { name: 'Electronics', description: 'IT and electronic equipment' }
  });

  const furniture = await prisma.category.create({
    data: { name: 'Furniture', description: 'Desks, chairs, and office furniture' }
  });

  // Create equipment
  const pen = await prisma.equipment.create({
    data: {
      name: 'Black Ink Pen',
      sku: 'ST-001',
      quantity: 50,
      minQuantity: 10,
      categoryId: stationery.id
    }
  });

  const laptop = await prisma.equipment.create({
    data: {
      name: 'MacBook Pro 14"',
      sku: 'EL-001',
      quantity: 5,
      minQuantity: 2,
      categoryId: electronics.id
    }
  });

  // Create transactions
  await prisma.transaction.create({
    data: {
      equipmentId: pen.id,
      type: 'IN',
      amount: 50,
      notes: 'Initial stock'
    }
  });

  await prisma.transaction.create({
    data: {
      equipmentId: laptop.id,
      type: 'IN',
      amount: 5,
      notes: 'Initial stock'
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
