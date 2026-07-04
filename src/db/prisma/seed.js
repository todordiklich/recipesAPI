import { hashPassword } from '../../utils/password.js';
import { prisma } from '../prisma/client.js';

async function main() {
  console.log('Seeding database...');

  // CLEAN DATABASE
  await prisma.favoriteRecipe.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.mealPlan.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.user.deleteMany();

  // USERS
  const passwordHash = await hashPassword('Test123!');

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@example.com',
        name: 'alice',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob@example.com',
        name: 'bob',
        passwordHash,
      },
    }),
  ]);

  const alice = users[0];
  const bob = users[1];

  // RECIPES
  const recipes = await Promise.all([
    prisma.recipe.create({
      data: {
        title: 'Spaghetti Bolognese',
        description: 'Classic Italian pasta dish',
        cookingTime: 45,
        difficulty: 'MEDIUM',
        imageUrl:
          'https://www.tasteofhome.com/wp-content/uploads/2025/02/Stamp-of-Approval-Spaghetti-Sauce_EXPS_TOHD25_39564_ChristineMa_2.jpg',
        authorId: alice.id,

        ingredients: {
          create: [
            { name: 'Spaghetti', quantity: '200g' },
            { name: 'Minced Beef', quantity: '300g' },
            { name: 'Tomato Sauce', quantity: '1 cup' },
          ],
        },
      },
    }),

    prisma.recipe.create({
      data: {
        title: 'Pancakes',
        description: 'Fluffy breakfast pancakes',
        cookingTime: 20,
        difficulty: 'EASY',
        imageUrl:
          'https://www.foodandwine.com/thmb/HVbJsZlSG7BQF1mif2Z5tZICM8g=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Buttermilk-Pancakes-FT-RECIPE1222-5589088e52c94e6f8a610b4393196fbb.jpg',
        authorId: bob.id,

        ingredients: {
          create: [
            { name: 'Flour', quantity: '1 cup' },
            { name: 'Milk', quantity: '1 cup' },
            { name: 'Egg', quantity: '1' },
          ],
        },
      },
    }),
  ]);

  const spaghetti = recipes[0];
  const pancakes = recipes[1];

  // FAVORITES
  await prisma.favoriteRecipe.create({
    data: {
      userId: alice.id,
      recipeId: pancakes.id,
    },
  });

  await prisma.favoriteRecipe.create({
    data: {
      userId: bob.id,
      recipeId: spaghetti.id,
    },
  });

  // COMMENTS
  await prisma.comment.createMany({
    data: [
      {
        content: 'Looks delicious!',
        authorId: bob.id,
        recipeId: spaghetti.id,
      },
      {
        content: 'Can’t wait to try this!',
        authorId: alice.id,
        recipeId: pancakes.id,
      },
    ],
  });

  // MEAL PLANS
  await prisma.mealPlan.createMany({
    data: [
      {
        userId: alice.id,
        recipeId: spaghetti.id,
        date: new Date('2026-07-05'),
      },
      {
        userId: bob.id,
        recipeId: pancakes.id,
        date: new Date('2026-07-06'),
      },
    ],
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
