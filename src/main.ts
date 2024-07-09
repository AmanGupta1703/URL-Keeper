import "./style.css";

const formAddUrlEl = document.querySelector<HTMLFormElement>(".form--add-url")!;
const formInputWebNameEl = document.querySelector<HTMLInputElement>(".form__input--web-name")!;
const formInputWebUrlEl = document.querySelector<HTMLInputElement>(".form__input--web-url")!;

const searchFormItemEl = document.querySelector<HTMLFormElement>(".form--search-item")!;
const formInputSearchEl = document.querySelector<HTMLInputElement>(".form__input--search")!;
const searchItemBoxEl = document.querySelector<HTMLDivElement>(".search-item-box")!;

const listEl = document.querySelector<HTMLUListElement>(".list")!;

let index: number = 1;

type WebsiteListItem = {
  id: number;
  name: string;
  href: string;
};

const lists: WebsiteListItem[] = getStorageItems();

lists.forEach((item) => render(item));

function createItem(webName: string, webUrl: string): WebsiteListItem {
  return { id: Date.now(), name: webName, href: webUrl };
}

function addItemToList(websiteListItem: WebsiteListItem) {
  lists.push(websiteListItem);
}

function render(item: WebsiteListItem) {
  const li = document.createElement("li");
  li.setAttribute("class", "list__item");
  li.setAttribute("id", item.id.toString());

  // Link to the url
  const a = document.createElement("a");
  a.textContent = `${index}. ${item.name}`;
  a.setAttribute("href", item.href);
  a.setAttribute("id", item.id.toString());
  a.setAttribute("class", "list__link");
  a.setAttribute("target", "_blank");

  // Button to delete the item
  const button = document.createElement("button");
  button.textContent = "X";
  button.setAttribute("class", "btn btn--delete");
  button.setAttribute("id", item.id.toString());

  li.appendChild(a);
  li.appendChild(button);

  listEl.appendChild(li);

  index++;
}

function updateStorage() {
  localStorage.setItem("items", JSON.stringify(lists));
}

function getStorageItems(): WebsiteListItem[] | [] {
  const storedLists = localStorage.getItem("items");

  return storedLists ? JSON.parse(storedLists) : [];
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

  const newListItem = createItem(webName, webUrl);

  addItemToList(newListItem);

  render(newListItem);

  updateStorage();

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
    updateStorage();
  }
}

formAddUrlEl.addEventListener("submit", handleSubmit);
searchFormItemEl.addEventListener("submit", handleSearchFormSubmit);

document.addEventListener("click", handleDeleteItem);
