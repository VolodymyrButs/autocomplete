import throttle from "lodash.throttle";
export const createAutocomplete = (
  container: HTMLElement | null,
  countLetter: number = 1,
  delay: number = 500,
  sourceArray: { name: string }[] = [],
  Placeholder: string = ""
) => {
  if (!container) {
    return;
  }

  var activeListItemIndex = 0;

  // input

  const inputWrapper = document.createElement("div");
  inputWrapper.classList.add("inputWrapper");
  const loadingSpinner = document.createElement("div");
  const input: HTMLInputElement = document.createElement("input");
  input.classList.add("input");
  input.setAttribute("type", "text");
  Placeholder && (input.placeholder = Placeholder);
  inputWrapper.appendChild(input);
  inputWrapper.appendChild(loadingSpinner);
  let inputValue = "";

  const handleInput: (Event) => void = (e: Event) => {
    inputValue = input.value;
    if (inputValue && inputValue.length >= countLetter) {
      loadingSpinner.classList.add("loading");
      activeListItemIndex = 0;
      showFilteredListThrottled();
    } else if (container.children[1] && inputValue.length <= countLetter - 1) {
      activeListItemIndex = 0;
      container.removeChild(list);
    }
  };

  input.addEventListener("input", handleInput);

  //select

  const handleSelect: (KeyboardEvent) => void = (e: KeyboardEvent) => {
    let filteredArray = getFiltered();
    if (e.code === "ArrowDown" && filteredArray) {
      delete filteredArray[activeListItemIndex].isActive;
      if (activeListItemIndex === filteredArray.length - 1) {
        activeListItemIndex = 0;
      } else {
        activeListItemIndex = activeListItemIndex + 1;
      }
      filteredArray && (filteredArray[activeListItemIndex].isActive = true);
      showFilteredList();
    } else if (e.code === "ArrowUp" && filteredArray) {
      delete filteredArray[activeListItemIndex].isActive;
      if (activeListItemIndex === 0) {
        activeListItemIndex = filteredArray.length - 1;
      } else {
        activeListItemIndex = activeListItemIndex - 1;
      }
      filteredArray && (filteredArray[activeListItemIndex].isActive = true);
      showFilteredList();
    } else if (e.code === "Enter" && filteredArray) {
      input.value = filteredArray[activeListItemIndex].name;
      container.removeChild(list);
      activeListItemIndex = 0;
      return;
    } else return;
  };

  input.addEventListener(
    "keydown",
    throttle(handleSelect, 100, { leading: false })
  );

  // list

  const getFiltered: () => {
    name: string;
    isActive?: boolean;
  }[] = () => {
    if (inputValue.length >= countLetter) {
      return sourceArray.filter((fiteredItem) => {
        return (
          fiteredItem.name.substr(0, inputValue.length).toUpperCase() ===
          inputValue.toUpperCase()
        );
      });
    }
  };

  const list: HTMLUListElement = document.createElement("ul");
  list.classList.add("list");
  const showFilteredList = () => {
    loadingSpinner.classList.remove("loading");
    list.innerHTML = "";
    let filteredArray = getFiltered();
    console.log(filteredArray);
    if (filteredArray && filteredArray.length !== 0) {
      filteredArray.forEach((item) => {
        item.isActive = false;
      });
      filteredArray[activeListItemIndex].isActive = true;

      filteredArray.forEach((listItem) => {
        const li = document.createElement("li");
        li.innerHTML = listItem.name;
        listItem.isActive === true && li.classList.add("isActive");
        list.appendChild(li);
      });
      container.appendChild(list);
    }
  };

  const showFilteredListThrottled = throttle(showFilteredList, delay, {
    leading: false,
  });
  container.appendChild(inputWrapper);
};
