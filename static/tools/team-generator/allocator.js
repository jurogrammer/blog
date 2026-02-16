function toPositiveInteger(value, fallback = 1) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
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

function allocateByCategoryRoundRobin(categories, teamCount) {
  const groups = Array.from({ length: teamCount }, () => []);
  const sorted = [...categories].sort((left, right) => {
    if (right.members.length !== left.members.length) {
      return right.members.length - left.members.length;
    }
    return left.title.localeCompare(right.title);
  });

  let teamCursor = 0;

  sorted.forEach((category) => {
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
  return allocateByCategoryRoundRobin(filtered, teamCount);
}
