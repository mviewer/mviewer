export function xmlToJson(xml) {
  // Si on reçoit une chaîne de caractères, on la parse d'abord
  if (typeof xml === "string") {
    const parser = new DOMParser();
    xml = parser.parseFromString(xml, "text/xml");
  }

  function parseNode(node) {
    const obj = {};

    // Attributs mis directement à plat dans l'objet
    if (node.attributes && node.attributes.length > 0) {
      for (const attr of node.attributes) {
        obj[attr.name] = attr.value;
      }
    }

    const children = Array.from(node.childNodes);

    // Texte pur (pas d'éléments enfants)
    const hasElementChild = children.some((c) => c.nodeType === 1);
    if (!hasElementChild) {
      const text = node.textContent.trim();
      if (text) {
        if (Object.keys(obj).length === 0) {
          return text; // Élément simple avec juste du texte, sans attributs
        }
        obj["#text"] = text;
      }
      return obj;
    }

    // Parcours des enfants éléments
    for (const child of children) {
      if (child.nodeType !== 1) continue; // ignore texte/commentaires
      const childName = child.nodeName;
      const parsedChild = parseNode(child);

      if (obj[childName] === undefined) {
        obj[childName] = parsedChild;
      } else {
        // Si la clé existe déjà, on transforme en tableau
        if (!Array.isArray(obj[childName])) {
          obj[childName] = [obj[childName]];
        }
        obj[childName].push(parsedChild);
      }
    }

    return obj;
  }

  const root = xml.documentElement;
  return { [root.nodeName]: parseNode(root) };
}
