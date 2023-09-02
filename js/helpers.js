import { characterList } from "./script.js";

function searchByName(searchValue) {
  searchValue = searchValue.toLowerCase().trim();
  return characterList.filter(checkNames);

  function checkNames(character) {
    return character.name.toLowerCase().includes(searchValue);
  }
}

function sortByOption(sortValue) {
  if (sortValue === "name") {
    return characterList.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === "title") {
    return characterList.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === "race") {
    return characterList.sort((a, b) => a.race.localeCompare(b.race));
  }
}

function filterByRace(inputValue) {
  inputValue = inputValue.toLowerCase();
  if (inputValue !== "filterall") {
    let filteredList = characterList.filter(character => character.race.toLowerCase().includes(inputValue));
    if (filteredList.length !== 0) {
      return filteredList;
    } else {
      return (filteredList = []);
    }
  } else {
    return characterList;
  }
}

function prepareData(dataObject) {
  const characterArray = [];
  for (const key in dataObject) {
    const characterObject = dataObject[key];
    characterObject.id = key;
    characterArray.push(characterObject);
  }
  console.log(characterArray);
  return characterArray;
}

export { prepareData, filterByRace, sortByOption, searchByName };
