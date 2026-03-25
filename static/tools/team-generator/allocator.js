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

function makePairKey(a, b) {
  return a < b ? a + "::" + b : b + "::" + a;
}

function pairCost(history, a, b) {
  if (!history) {
    return 0;
  }
  return history[makePairKey(a, b)] || 0;
}

function groupCost(history, group) {
  let cost = 0;
  for (let i = 0; i < group.length; i += 1) {
    for (let j = i + 1; j < group.length; j += 1) {
      cost += pairCost(history, group[i].name, group[j].name);
    }
  }
  return cost;
}

function allocateByShuffleAndSwap(categories, teamCount, random, history) {
  const tagged = categories.flatMap((category) =>
    category.members.map((member) => ({ name: member, catId: category.id }))
  );

  const shuffled = shuffleCopy(tagged, random);

  const groups = Array.from({ length: teamCount }, () => []);
  shuffled.forEach((member, index) => {
    groups[index % teamCount].push(member);
  });

  // Phase 1: fix same-category collisions
  const MAX_CAT_PASSES = 50;
  for (let pass = 0; pass < MAX_CAT_PASSES; pass += 1) {
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

  // Phase 2: reduce history-heavy pairs by swapping (only when history exists)
  if (history) {
    const MAX_HIST_PASSES = 30;
    for (let pass = 0; pass < MAX_HIST_PASSES; pass += 1) {
      let improved = false;

      for (let gi = 0; gi < groups.length; gi += 1) {
        const group = groups[gi];
        if (group.length < 2) {
          continue;
        }

        if (groupCost(history, group) === 0) {
          continue;
        }

        for (let mi = 0; mi < group.length; mi += 1) {
          const member = group[mi];

          const otherIndices = shuffleCopy(
            Array.from({ length: teamCount }, (_, i) => i).filter((i) => i !== gi),
            random
          );

          let didSwap = false;
          for (const gj of otherIndices) {
            const otherGroup = groups[gj];

            for (let oi = 0; oi < otherGroup.length; oi += 1) {
              const otherMember = otherGroup[oi];

              // Check category constraints
              const memberInOther = otherGroup.some(
                (m, idx) => idx !== oi && m.catId === member.catId
              );
              if (memberInOther) {
                continue;
              }

              const otherInGroup = group.some(
                (m, idx) => idx !== mi && m.catId === otherMember.catId
              );
              if (otherInGroup) {
                continue;
              }

              // Calculate cost change
              let oldCost = 0;
              let newCost = 0;
              for (let k = 0; k < group.length; k += 1) {
                if (k === mi) {
                  continue;
                }
                oldCost += pairCost(history, member.name, group[k].name);
                newCost += pairCost(history, otherMember.name, group[k].name);
              }
              for (let k = 0; k < otherGroup.length; k += 1) {
                if (k === oi) {
                  continue;
                }
                oldCost += pairCost(history, otherMember.name, otherGroup[k].name);
                newCost += pairCost(history, member.name, otherGroup[k].name);
              }

              if (newCost < oldCost) {
                group[mi] = otherMember;
                otherGroup[oi] = member;
                didSwap = true;
                improved = true;
                break;
              }
            }

            if (didSwap) {
              break;
            }
          }

          if (didSwap) {
            break;
          }
        }
      }

      if (!improved) {
        break;
      }
    }
  }

  return groups.map((group) => group.map((member) => member.name));
}

export function recordMatchHistory(groups, existingHistory) {
  const history = { ...(existingHistory || {}) };

  for (const group of groups) {
    for (let i = 0; i < group.length; i += 1) {
      for (let j = i + 1; j < group.length; j += 1) {
        const key = makePairKey(group[i], group[j]);
        history[key] = (history[key] || 0) + 1;
      }
    }
  }

  return history;
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
  const history = settings?.matchHistory || null;
  return allocateByShuffleAndSwap(filtered, teamCount, random, history);
}
