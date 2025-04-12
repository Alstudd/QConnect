"use server";
import { db } from "~/server/db";

const actions = [
  "Ask Basic MCQ",
  "Ask Conceptual MCQ",
  "Next Topic",
  "Previous Topic",
];

const difficulties = ["basic", "conceptual"] as const;

const alpha = 0.1; // Learning rate
const gamma = 0.9; // Discount factor

function getReward(
  isCorrect: boolean,
  type: string,
  timeTaken: number
): number {
  const baseReward = type === "basic" ? 5 : 10;
  const basePenalty = type === "basic" ? -1 : -3;

  const timeThreshold = type === "basic" ? 5 : 10;

  if (isCorrect) {
    if (timeTaken <= timeThreshold) return baseReward;
    return Math.max(baseReward - (timeTaken - timeThreshold) * 0.5, 1);
  } else {
    const penalty = basePenalty - (timeTaken > timeThreshold * 1.5 ? 1 : 0);
    return penalty;
  }
}

function getRandomAction(): string {
  return actions[Math.floor(Math.random() * actions.length)] as string;
}

async function getRandomState(topicId: string): Promise<string> {
  const res = await db.states.findMany({
    where: {
      topicId: topicId,
    },
  });

  const topics = res.map((t) => {
    return t.name;
  });

  return `${topics[Math.floor(Math.random() * topics.length)]}-${
    difficulties[Math.floor(Math.random() * difficulties.length)]
  }` as string;
}

async function selectAction(
  userId: string,
  topicId: string,
  state: string
): Promise<string> {
  const maxQValueEntry = await db.qTable.findFirst({
    where: {
      userId: userId,
      topicId: topicId,
      state: state,
    },
    orderBy: {
      qValue: "desc",
    },
  });

  // const epsilon = await getDynamicEpsilon(userId, topicId);
  const epsilon = 0.2;

  const chosenAction =
    Math.random() < epsilon || !maxQValueEntry
      ? getRandomAction()
      : (maxQValueEntry.action as string);

  return chosenAction;
}

async function getNextState(
  state: string,
  action: string,
  topicId: string
): Promise<string> {
  const [topic, type] = state.split("-");
  let newType;

  const res = await db.states.findMany({
    where: {
      topicId: topicId,
    },
  });

  const topics = res.map((t) => {
    return t.name;
  });
  let topicIndex = topics.indexOf(topic!);

  if (action === "Ask Basic MCQ") {
    newType = "basic";
  } else if (action === "Ask Conceptual MCQ") {
    newType = "conceptual";
  } else if (action === "Next Topic") {
    topicIndex = (topicIndex + 1) % topics.length;
  } else if (action === "Previous Topic") {
    topicIndex = (topicIndex - 1 + topics.length) % topics.length;
  }

  return `${topics[topicIndex]}-${newType}`;
}

export async function getQuestion(
  userId: string,
  topicId: string,
  state?: string,
  action?: string
): Promise<{ state: string; action?: string }> {
  if (state) {
    const a = await selectAction(userId, topicId, state);
    const nextState = await getNextState(state, a, topicId);
    return { state: nextState, action: a };
  } else {
    const nextState = await getRandomState(topicId);
    return { state: nextState };
  }
}

export async function updateQValue(
  userId: string,
  topicId: string,
  prevState: string,
  action: string,
  currentState: string,
  isCorrect: boolean,
  timeTaken: number
) {
  const qEntry = await db.qTable.findUnique({
    where: {
      userId_state_action: {
        userId,
        state: prevState,
        action: action,
      },
    },
  });

  const currQVal = qEntry ? qEntry.qValue : 0;

  const futureQVal = await db.qTable.findMany({
    where: {
      userId,
      state: currentState,
    },
    select: {
      qValue: true,
    },
  });

  const maxQVal =
    futureQVal.length > 0 ? Math.max(...futureQVal.map((q) => q.qValue)) : 0;

  const reward = getReward(
    isCorrect,
    currentState.split("-").pop() as (typeof difficulties)[number],
    timeTaken
  );

  const newQ = currQVal + alpha * (reward + gamma * maxQVal - currQVal);

  await db.qTable.upsert({
    where: {
      userId_state_action: {
        userId,
        state: prevState,
        action: action,
      },
    },
    update: {
      qValue: newQ,
    },
    create: {
      userId,
      topicId,
      state: prevState,
      action: action,
      qValue: newQ,
      nextState: currentState,
    },
  });
}
