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

function allocateByShuffleAndSwap(categories, teamCount, random) {
  const tagged = categories.flatMap((category) =>
    category.members.map((member) => ({ name: member, catId: category.id }))
  );

  const shuffled = shuffleCopy(tagged, random);

  const groups = Array.from({ length: teamCount }, () => []);
  shuffled.forEach((member, index) => {
    groups[index % teamCount].push(member);
  });

  const MAX_PASSES = 50;
  for (let pass = 0; pass < MAX_PASSES; pass += 1) {
    let swapped = false;

    for (let gi = 0; gi < groups.length; gi += 1) {
      const group = groups[gi];
      const catCounts = {};
      for (const member of group) {
        catCounts[member.catId] = (catCounts[member.catId] || 0) + 1;
      }

      const duplicate = Object.entries(catCounts).find(([, count]) => count > 1);
      if (!duplicate) {
        continue;
      }

      const dupCatId = Number(duplicate[0]);
      const swapOutIdx = group.findLastIndex((member) => member.catId === dupCatId);
      const swapOut = group[swapOutIdx];

      const otherIndices = shuffleCopy(
        Array.from({ length: teamCount }, (_, i) => i).filter((i) => i !== gi),
        random
      );

      let didSwap = false;
      for (const gj of otherIndices) {
        const otherGroup = groups[gj];
        if (otherGroup.some((member) => member.catId === dupCatId)) {
          continue;
        }

        const candidates = shuffleCopy(
          Array.from({ length: otherGroup.length }, (_, i) => i),
          random
        );

        for (const ci of candidates) {
          const swapIn = otherGroup[ci];

          const wouldConflictInGroup = group.some(
            (member, idx) => idx !== swapOutIdx && member.catId === swapIn.catId
          );
          if (wouldConflictInGroup) {
            continue;
          }

          const wouldConflictInOther = otherGroup.some(
            (member, idx) => idx !== ci && member.catId === swapOut.catId
          );
          if (wouldConflictInOther) {
            continue;
          }

          group[swapOutIdx] = swapIn;
          otherGroup[ci] = swapOut;
          didSwap = true;
          swapped = true;
          break;
        }

        if (didSwap) {
          break;
        }
      }
    }

    if (!swapped) {
      break;
    }
  }

  return groups.map((group) => group.map((member) => member.name));
}

export function allocateTeams(categories, settings) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return [];
  }

  const filtered = categories.filter(
    (category) => Array.isArray(category.members) && category.members.length > 0
  );
  const totalParticipants = countParticipants(filtered);

  if (totalParticipants === 0) {
    return [];
  }

  const teamCount = resolveTeamCount(totalParticipants, settings);
  const random = resolveRandom(settings);
  return allocateByShuffleAndSwap(filtered, teamCount, random);
}
