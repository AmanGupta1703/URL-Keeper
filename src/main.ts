import "./style.css";

const formAddUrlEl = document.querySelector<HTMLFormElement>(".form--add-url")!;
const formInputWebNameEl = document.querySelector<HTMLInputElement>(".form__input--web-name")!;
const formInputWebUrlEl = document.querySelector<HTMLInputElement>(".form__input--web-url")!;

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

  const a = document.createElement("a");
  a.textContent = `${index}. ${item.name}`;
  a.setAttribute("href", item.href);
  a.setAttribute("id", item.id.toString());
  a.setAttribute("class", "list__link");
  a.setAttribute("target", "_blank");

  li.appendChild(a);

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

function handleSubmit(event: SubmitEvent) {
  event.preventDefault();

  const webName = formInputWebNameEl.value;
  const webUrl = formInputWebUrlEl.value;

  if (!webName || !webUrl) return alert("make sure  to provide the required data...");

  const newListItem = createItem(webName, webUrl);

  addItemToList(newListItem);

  render(newListItem);

  updateStorage();

  formInputWebNameEl.value = "";
  formInputWebUrlEl.value = "";
}

formAddUrlEl.addEventListener("submit", handleSubmit);
