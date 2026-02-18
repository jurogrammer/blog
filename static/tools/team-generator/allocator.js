function toPositiveInteger(value, fallback = 1) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
}

function shuffleCopy(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function orderCategoriesForAllocation(categories, random) {
  const bucketsBySize = new Map();

  categories.forEach((category) => {
    const size = category.members.length;
    if (!bucketsBySize.has(size)) {
      bucketsBySize.set(size, []);
    }
    bucketsBySize.get(size).push(category);
  });

  return [...bucketsBySize.entries()]
    .sort((left, right) => right[0] - left[0])
    .flatMap(([, bucket]) => shuffleCopy(bucket, random));
}

function resolveRandom(settings) {
  return typeof settings?.random === "function" ? settings.random : Math.random;
}

function countParticipants(categories) {
  if (!Array.isArray(categories)) {
    return 0;
  }

  return categories.reduce((total, category) => total + category.members.length, 0);
}

function resolveTeamCount(totalParticipants, settings) {
  const mode = settings?.mode === "team-size" ? "team-size" : "team-count";

  if (mode === "team-size") {
    const teamSize = toPositiveInteger(settings?.teamSize, 1);
    return Math.max(1, Math.ceil(totalParticipants / teamSize));
  }

  const requestedCount = toPositiveInteger(settings?.teamCount, 1);
  return Math.min(requestedCount, totalParticipants);
}

function allocateByCategoryRoundRobin(categories, teamCount, random) {
  const groups = Array.from({ length: teamCount }, () => []);
  const ordered = orderCategoriesForAllocation(categories, random);
  let teamCursor = Math.floor(random() * teamCount);

  ordered.forEach((category) => {
    category.members.forEach((member) => {
      groups[teamCursor % teamCount].push(member);
      teamCursor += 1;
    });
  });

  return groups;
}

export function allocateTeams(categories, settings) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return [];
  }

  const filtered = categories.filter((category) => Array.isArray(category.members) && category.members.length > 0);
  const totalParticipants = countParticipants(filtered);

  if (totalParticipants === 0) {
    return [];
  }

  const teamCount = resolveTeamCount(totalParticipants, settings);
  const random = resolveRandom(settings);
  return allocateByCategoryRoundRobin(filtered, teamCount, random);
}
