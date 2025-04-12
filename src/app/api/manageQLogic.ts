"use server";
import { db } from "~/server/db";
import type { State, Action } from "types/ql";

const actions: Action[] = [
  "increase_difficulty",
  "decrease_difficulty",
  "stay_same",
];

const topics = ["addition", "subtraction"] as const;

const difficulties = ["easy", "medium", "hard"] as const;

const alpha = 0.1; // Learning rate
const gamma = 0.9; // Discount factor

async function getDynamicEpsilon(userId: string): Promise<number> {
  const totalEntries = topics.length * actions.length * difficulties.length;
  const userEntries = await db.qTable.count({ where: { userId } });

  const fillPercentage = userEntries / totalEntries;

  return Math.max(0.2, 1 - fillPercentage);
}

function getReward(
  isCorrect: boolean,
  difficulty: (typeof difficulties)[number],
  timeTaken: number
) {
  // Base rewards and penalties
  const baseReward =
    difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15;
  const basePenalty =
    difficulty === "easy" ? -1 : difficulty === "medium" ? -2 : -3;

  // Time thresholds per difficulty
  const timeThreshold =
    difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15;

  if (isCorrect) {
    if (timeTaken <= timeThreshold) return baseReward;
    return Math.max(baseReward - (timeTaken - timeThreshold) * 0.5, 0);
  } else {
    return basePenalty - (timeTaken > timeThreshold * 1.5 ? 1 : 0);
  }
}

function getRandomAction(): Action {
  return actions[Math.floor(Math.random() * actions.length)] as Action;
}

function getRandomState(): State {
  return `${topics[Math.floor(Math.random() * topics.length)]}-${
    difficulties[Math.floor(Math.random() * difficulties.length)]
  }` as State;
}

async function selectAction(userId: string, state: State): Promise<Action> {
  const maxQValueEntry = await db.qTable.findFirst({
    where: { id: userId, state: state },
    orderBy: { qValue: "desc" },
  });

  const epsilon = await getDynamicEpsilon(userId);

  const chosenAction =
    Math.random() < epsilon || !maxQValueEntry
      ? getRandomAction()
      : (maxQValueEntry.action as Action);

  return chosenAction;
}

function getNextState(state: State, action: Action): State {
  if (action == "stay_same") {
    return state;
  }

  const [topic, difficulty] = state.split("-") as [string, string];

  const topicIndex = topics.indexOf(topic as any);
  const difficultyIndex = difficulties.indexOf(difficulty as any);

  let newTopic: (typeof topics)[number] =
    topicIndex !== -1 ? topics[topicIndex]! : "addition";

  let newDifficulty: (typeof difficulties)[number] =
    difficultyIndex !== -1 ? difficulties[difficultyIndex]! : "easy";

  if (difficultyIndex !== -1) {
    if (action === "increase_difficulty") {
      newDifficulty =
        difficulties[Math.min(difficultyIndex + 1, difficulties.length - 1)]!;
    } else if (action === "decrease_difficulty") {
      newDifficulty = difficulties[Math.max(difficultyIndex - 1, 0)]!;
    } else if (action === "change_topic") {
      newTopic = topics[(topicIndex + 1) % topics.length]!;
    }
  } else {
    newTopic = "addition";
    newDifficulty = "easy";
  }

  return `${newTopic}-${newDifficulty}` as State;
}

export async function getQuestion(
  userId: string,
  state?: State,
  action?: Action
): Promise<{ state: State; action?: Action }> {
  if (state) {
    const a = await selectAction(userId, state);
    const nextState = getNextState(state, a);
    return { state: nextState, action: a };
  } else {
    const nextState = getRandomState();
    return { state: nextState };
  }
}

export async function updateQValue(
  userId: string,
  prevState: State,
  action: Action,
  currentState: State,
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
      state: prevState,
      action: action,
      qValue: newQ,
      nextState: currentState,
    },
  });
}
