// File: /prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // First, let's create some sample content if it doesn't exist
  const content = await prisma.content.upsert({
    where: { id: 'seed-content-1' },
    update: {},
    create: {
      id: 'seed-content-1',
      title: 'Introduction to Machine Learning',
      description: 'Learn the basics of machine learning algorithms and concepts',
      url: '/materials/intro-ml.pdf',
      fileType: 'pdf',
      classId: 'your-classroom-id', // Replace with an actual classroom ID
    },
  });

  console.log(`Created or found content: ${content.title}`);

  // Now let's create some questions
  const questions = [
    {
      questionText: 'What is machine learning?',
      options: JSON.stringify([
        'A type of computer hardware',
        'The ability of a machine to learn without being explicitly programmed',
        'A programming language for AI',
        'A database management system'
      ]),
      correctOption: 'The ability of a machine to learn without being explicitly programmed',
      contentId: content.id,
    },
    {
      questionText: 'Which of the following is NOT a type of machine learning?',
      options: JSON.stringify([
        'Supervised learning',
        'Unsupervised learning',
        'Reinforcement learning',
        'Mechanical learning'
      ]),
      correctOption: 'Mechanical learning',
      contentId: content.id,
    },
    {
      questionText: 'What is Q-learning primarily used for?',
      options: JSON.stringify([
        'Natural language processing',
        'Image recognition',
        'Reinforcement learning problems',
        'Database optimization'
      ]),
      correctOption: 'Reinforcement learning problems',
      contentId: content.id,
    },
    {
      questionText: 'Which algorithm is used for classification problems?',
      options: JSON.stringify([
        'K-means',
        'Linear regression',
        'Decision trees',
        'Principal Component Analysis'
      ]),
      correctOption: 'Decision trees',
      contentId: content.id,
    },
    {
      questionText: 'What does the "Q" in Q-learning stand for?',
      options: JSON.stringify([
        'Quantity',
        'Quality',
        'Query',
        'Quotient'
      ]),
      correctOption: 'Quality',
      contentId: content.id,
    },
    {
      questionText: 'Which of the following is an example of unsupervised learning?',
      options: JSON.stringify([
        'Linear regression',
        'Support vector machines',
        'Clustering',
        'Decision trees'
      ]),
      correctOption: 'Clustering',
      contentId: content.id,
    },
    {
      questionText: 'What is the main difference between supervised and unsupervised learning?',
      options: JSON.stringify([
        'Supervised learning requires labeled data',
        'Unsupervised learning is faster',
        'Supervised learning works only with images',
        'Unsupervised learning requires more computing power'
      ]),
      correctOption: 'Supervised learning requires labeled data',
      contentId: content.id,
    },
    {
      questionText: 'In reinforcement learning, what is an "agent"?',
      options: JSON.stringify([
        'The developer who writes the algorithm',
        'The decision-making entity that learns from the environment',
        'The database that stores training data',
        'The hardware that runs the machine learning model'
      ]),
      correctOption: 'The decision-making entity that learns from the environment',
      contentId: content.id,
    },
    {
      questionText: 'What is a reward function in Q-learning?',
      options: JSON.stringify([
        'A function that provides monetary rewards to developers',
        'A mechanism that gives feedback to the agent about its actions',
        'A function that calculates the processing time of an algorithm',
        'The final output of the learning process'
      ]),
      correctOption: 'A mechanism that gives feedback to the agent about its actions',
      contentId: content.id,
    },
    {
      questionText: 'Which of these is a common application of Q-learning?',
      options: JSON.stringify([
        'Weather prediction',
        'Face recognition',
        'Game playing strategies',
        'Speech recognition'
      ]),
      correctOption: 'Game playing strategies',
      contentId: content.id,
    },
  ];

  // Create each question
  for (const question of questions) {
    const createdQuestion = await prisma.question.upsert({
      where: {
        id: `seed-question-${questions.indexOf(question) + 1}`,
      },
      update: question,
      create: {
        id: `seed-question-${questions.indexOf(question) + 1}`,
        ...question,
      },
    });
    console.log(`Created question: ${createdQuestion.questionText.substring(0, 30)}...`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });