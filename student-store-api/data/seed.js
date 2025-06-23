const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
// const products= require("./products.json")

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname,"./products.json");
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const products = JSON.parse(rawData);
    console.log(products)
  for (const product of products.products) {
    try {
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          image_url: product.image_url,
          category: product.category
        }
      });
      console.log(`✅ Created product: ${product.name}`);
    } catch (error) {
      console.error(`❌ Error creating product ${product.name}:`, error.message);
    }
  }

  console.log('🌱 Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
