import throttle from "lodash.throttle";
export const createAutocomplete = (
  container: HTMLElement | null,
  countLetter: number,
  delay: number,
  getSource: () => { name: string; isActive?: boolean }[] = () => []
) => {
  if (!container) {
    return;
  }
  const sourceArray = getSource();
  var activeListItemIndex = 0;
  // input
  const input = document.createElement("input");
  let inputValue = "";
  const handleInput = (e: Event) => {
    inputValue = input.value;
    if (inputValue && inputValue.length >= countLetter) {
      activeListItemIndex = 0;
      showFilteredList();
    } else if (container.children[1] && inputValue.length <= countLetter - 1) {
      activeListItemIndex = 0;
      deleteList();
    }
  };

  const handleSelect = (e: KeyboardEvent) => {
    let filteredArray = getFiltered();
    if (e.code == "ArrowDown" && filteredArray) {
      delete filteredArray[activeListItemIndex].isActive;
      if (activeListItemIndex === filteredArray.length - 1) {
        activeListItemIndex = 0;
      } else {
        activeListItemIndex = activeListItemIndex + 1;
      }
      filteredArray
        ? (filteredArray[activeListItemIndex].isActive = true)
        : null;
    } else if (e.code == "ArrowUp" && filteredArray) {
      delete filteredArray[activeListItemIndex].isActive;
      if (activeListItemIndex === 0) {
        activeListItemIndex = filteredArray.length - 1;
      } else {
        activeListItemIndex = activeListItemIndex - 1;
      }
      filteredArray
        ? (filteredArray[activeListItemIndex].isActive = true)
        : null;
    } else if (e.code == "Enter" && filteredArray) {
      input.value = filteredArray[activeListItemIndex].name;
      showFilteredList();
      activeListItemIndex = 0;
      return;
    } else return;
    showFilteredList();
  };
  //   const handleInputThrottled = throttle(handleInput, 2000, {
  //     leading: false
  //   });

  input.addEventListener(
    "input",
    throttle(handleInput, delay, { leading: false })
  );
  input.addEventListener(
    "keydown",
    throttle(handleSelect, 100, { leading: false })
  );
  // list
  const deleteList = () => {
    container.removeChild(list);
  };
  const getFiltered = () => {
    if (inputValue.length >= countLetter) {
      return sourceArray.filter((fiteredItem) => {
        return (
          fiteredItem.name.substr(0, inputValue.length).toUpperCase() ===
          inputValue.toUpperCase()
        );
      });
    }
  };
  console.log;
  const list = document.createElement("ul");

  const showFilteredList = () => {
    list.innerHTML = "";
    // find all existing list items
    // remove all listeners
    // or
    // use event delegation
    // put all lisneters on the 'list'
    let filteredArray = getFiltered();
    if (
      filteredArray &&
      filteredArray.some((listItem) => {
        return input.value === listItem.name;
      })
    ) {
      container.removeChild(list);
      return;
    } else {
      filteredArray[activeListItemIndex].isActive = true;
      container.appendChild(list);
      filteredArray &&
        filteredArray.forEach((listItem) => {
          const li = document.createElement("li");
          li.innerHTML = listItem.name;
          listItem.isActive === true && li.classList.add("isActive");
          list.appendChild(li);
        });
    }
  };

  container.appendChild(input);
};
