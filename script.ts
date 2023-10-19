import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
  await prisma.user.create({
    data: {
        name: "user.3",
        email: "user.3@local.com",
        posts: {
            create: {
                title: 'Hello World'
            }
        }
    }
  });
  const users = await prisma.user.findMany({
    include: {
        posts: true
    }
  });
  console.dir(users, {depth: null});
//   const posts = await prisma.post.findMany();
//   console.log(posts);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })