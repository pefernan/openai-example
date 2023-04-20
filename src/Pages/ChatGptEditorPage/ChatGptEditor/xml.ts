import uuid from "react-uuid";

export function getDiagramXML(content: string): string {
  console.log("Trying to convert response string to a valid Diagram XML...");

  const start = content.indexOf("<");
  const end = content.lastIndexOf(">");

  if (start === -1 && end === -1) {
    console.error("Content isn't a valid XML!");
    throw Error("Content isn't a valid XML!");
  }

  const xml = content.substring(start, end + 1);

  // Checking if the content is at least XML :)
  const xmlDoc: Document = new DOMParser().parseFromString(xml, "text/xml");
  if (xmlDoc && xmlDoc.querySelector("parsererror")) {
    console.error("The content cannot be parsed to XML :S");
    throw new Error("XML not valid... try again");
  }

  const definitionsNode = xmlDoc.children[0];
  if (!definitionsNode.getAttribute("id")) {
    definitionsNode.setAttribute("id", uuid());
  }

  return new XMLSerializer().serializeToString(xmlDoc);
}

export function couldBeADiagram(content: string): boolean {
  try {
    getDiagramXML(content);
  } catch (err) {
    return false;
  }
  return true;
}
