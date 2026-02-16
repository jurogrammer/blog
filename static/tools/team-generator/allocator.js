function toPositiveInteger(value, fallback = 1) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
}

function allocateByTeamCount(participants, teamCountInput) {
  const teamCount = Math.min(toPositiveInteger(teamCountInput, 1), participants.length);
  const groups = Array.from({ length: teamCount }, () => []);

  participants.forEach((name, index) => {
    groups[index % teamCount].push(name);
  });

  return groups;
}

function allocateByTeamSize(participants, teamSizeInput) {
  const teamSize = toPositiveInteger(teamSizeInput, 1);
  const teamCount = Math.ceil(participants.length / teamSize);
  const groups = Array.from({ length: teamCount }, () => []);

  participants.forEach((name, index) => {
    const teamIndex = Math.floor(index / teamSize);
    groups[teamIndex].push(name);
  });

  return groups;
}

export function allocateTeams(participants, settings) {
  if (!Array.isArray(participants) || participants.length === 0) {
    return [];
  }

  const mode = settings?.mode === "team-size" ? "team-size" : "team-count";

  if (mode === "team-size") {
    return allocateByTeamSize(participants, settings.teamSize);
  }

  return allocateByTeamCount(participants, settings.teamCount);
}
