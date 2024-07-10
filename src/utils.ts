import { WebsiteListItem } from "./types";

function createItem(webName: string, webUrl: string): WebsiteListItem {
  return { id: Date.now(), name: webName, href: webUrl };
}

function createButton(textContent: string, classes: string[], id: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.textContent = textContent;
  button.setAttribute("class", classes.join(" "));
  button.setAttribute("id", id);

  return button;
}

function updateStorage(lists: WebsiteListItem[]) {
  localStorage.setItem("items", JSON.stringify(lists));
}

function getStorageItems(): WebsiteListItem[] | [] {
  const storedLists = localStorage.getItem("items");

  return storedLists ? JSON.parse(storedLists) : [];
}

export { createItem, createButton, updateStorage, getStorageItems };
