function createElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (typeof text === "string") {
    node.textContent = text;
  }
  return node;
}

export function renderError(errorNode, message) {
  if (!message) {
    errorNode.hidden = true;
    errorNode.textContent = "";
    return;
  }

  errorNode.hidden = false;
  errorNode.textContent = message;
}

export function renderGroups(container, groups) {
  container.replaceChildren();

  if (!Array.isArray(groups) || groups.length === 0) {
    const empty = createElement("div", "tg-group-cell");
    const wrap = createElement("div", "tg-group-wrap");
    const title = createElement("div", "tg-group-title", "No groups yet");
    const list = createElement("div", "tg-group-items");
    const item = createElement("div", "tg-group-item tg-group-item--empty", "Generate teams to see results.");
    item.setAttribute("role", "listitem");
    list.setAttribute("role", "list");
    list.appendChild(item);
    wrap.append(title, list);
    empty.appendChild(wrap);
    empty.setAttribute("role", "listitem");
    container.appendChild(empty);
    return;
  }

  groups.forEach((members, groupIndex) => {
    const cell = createElement("div", "tg-group-cell");
    cell.setAttribute("role", "listitem");

    const wrap = createElement("div", "tg-group-wrap");
    const title = createElement("div", "tg-group-title", `Group ${groupIndex + 1}`);
    const list = createElement("div", "tg-group-items");
    list.setAttribute("role", "list");

    members.forEach((member) => {
      const item = createElement("div", "tg-group-item", member);
      item.setAttribute("role", "listitem");
      list.appendChild(item);
    });

    wrap.append(title, list);
    cell.appendChild(wrap);
    container.appendChild(cell);
  });
}

export function groupsToPlainText(groups) {
  if (!Array.isArray(groups) || groups.length === 0) {
    return "";
  }

  return groups
    .map((members, index) => {
      const header = `Group ${index + 1}`;
      const lines = members.map((member, memberIndex) => `${memberIndex + 1}. ${member}`);
      return [header, ...lines].join("\n");
    })
    .join("\n\n");
}
