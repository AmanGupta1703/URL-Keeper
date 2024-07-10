import "./style.css";

import { createItem, createButton, updateStorage, getStorageItems } from "./utils";

const formAddUrlEl = document.querySelector<HTMLFormElement>(".form--add-url")!;
const formInputWebNameEl = document.querySelector<HTMLInputElement>(".form__input--web-name")!;
const formInputWebUrlEl = document.querySelector<HTMLInputElement>(".form__input--web-url")!;

const searchFormItemEl = document.querySelector<HTMLFormElement>(".form--search-item")!;
const formInputSearchEl = document.querySelector<HTMLInputElement>(".form__input--search")!;
const searchItemBoxEl = document.querySelector<HTMLDivElement>(".search-item-box")!;

const listEl = document.querySelector<HTMLOListElement>(".list")!;

let editMode: boolean = false;
let editItemId: number | null;

type WebsiteListItem = {
  id: number;
  name: string;
  href: string;
};

const lists: WebsiteListItem[] = getStorageItems();

lists.forEach((item) => render(item));

function addItemToList(websiteListItem: WebsiteListItem) {
  lists.push(websiteListItem);
}

function render(item: WebsiteListItem) {
  const li = document.createElement("li");
  li.setAttribute("class", "list__item");
  li.setAttribute("id", item.id.toString());

  // Link to the url
  const a = document.createElement("a");
  a.textContent = `${item.name}`;
  a.setAttribute("href", item.href);
  a.setAttribute("id", item.id.toString());
  a.setAttribute("class", "list__link");
  a.setAttribute("target", "_blank");

  // Delete + edit btn in a div
  const buttonBoxEl = document.createElement("div");
  buttonBoxEl.setAttribute("class", "button-box");

  // Button to delete the item
  const deleteButtonEl = createButton("X", ["btn", "btn--delete"], item.id.toString());

  // Button to edit a item
  const editButtonEl = createButton("Edit", ["btn", "btn--edit"], item.id.toString());

  buttonBoxEl.appendChild(deleteButtonEl);
  buttonBoxEl.appendChild(editButtonEl);

  li.appendChild(a);
  li.appendChild(buttonBoxEl);

  listEl.appendChild(li);
}

function displaySearchResult(item: WebsiteListItem) {
  searchItemBoxEl.classList.remove("hidden");
  listEl.classList.add("hidden");
  searchItemBoxEl.innerHTML = "";

  const p = document.createElement("p");
  p.setAttribute("class", "search__item");

  const a = document.createElement("a");
  a.textContent = `1 ${item.name}`;
  a.setAttribute("href", item.href);
  a.setAttribute("id", item.id.toString());
  a.setAttribute("class", "search__link");
  a.setAttribute("target", "_blank");

  p.appendChild(a);
  searchItemBoxEl.appendChild(p);

  a.addEventListener("click", () => {
    setTimeout(resetSearchResult, 3000);
  });
}

function resetSearchResult() {
  searchItemBoxEl.classList.add("hidden");
  listEl.classList.remove("hidden");
  searchItemBoxEl.innerHTML = "";
}

function handleSubmit(event: SubmitEvent) {
  event.preventDefault();

  const webName = formInputWebNameEl.value;
  const webUrl = formInputWebUrlEl.value;

  if (!webName || !webUrl) return alert("make sure  to provide the required data...");

  searchItemBoxEl.classList.add("hidden");
  listEl.classList.remove("hidden");

  if (editMode && editItemId) {
    const itemToEdit = lists.find((el) => el.id === editItemId);

    if (itemToEdit) {
      itemToEdit.name = webName;
      itemToEdit.href = webUrl;
      render(itemToEdit);
      updateStorage(lists);
    }

    editMode = false;
    editItemId = null;

    return;
  }

  const newListItem = createItem(webName, webUrl);

  addItemToList(newListItem);

  render(newListItem);

  updateStorage(lists);

  formInputWebNameEl.value = "";
  formInputWebUrlEl.value = "";
}

function handleSearchFormSubmit(event: SubmitEvent) {
  event.preventDefault();

  const searchInputValue = formInputSearchEl.value.toLowerCase();
  if (!searchInputValue) return;

  const item = lists.find((el) => el.name.toLowerCase().includes(searchInputValue));

  if (item) {
    displaySearchResult(item);
  } else {
    resetSearchResult();
  }
}

function handleDeleteItem(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.classList.contains("btn--delete")) {
    const id = parseInt(target.id);
    const itemIndex = lists.findIndex((el) => el.id === id);
    lists.splice(itemIndex, 1);
    document.getElementById(`${id}`)?.remove();
    updateStorage(lists);
  }
}

function handleEditItem(event: MouseEvent) {
  const listItemEl = (event.target as HTMLElement).closest(".list__item");

  const id = listItemEl?.getAttribute("id") ?? null;

  const itemToEdit = lists.find((el) => el.id === Number(id));

  if (itemToEdit) {
    editMode = true;
    editItemId = parseInt(id ?? "");

    formInputWebNameEl.value = itemToEdit.name;
    formInputWebUrlEl.value = itemToEdit.href;

    document.getElementById(`${id}`)?.remove();
  }
}

formAddUrlEl.addEventListener("submit", handleSubmit);
searchFormItemEl.addEventListener("submit", handleSearchFormSubmit);

document.addEventListener("click", (event) => {
  if ((event.target as HTMLElement).classList.contains("btn--delete"))
    return handleDeleteItem(event);

  if ((event.target as HTMLElement).classList.contains("btn--edit")) return handleEditItem(event);
});
