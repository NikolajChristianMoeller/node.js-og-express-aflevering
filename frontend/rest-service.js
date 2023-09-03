import { prepareData } from "./helpers.js";

const endpoint = "https://lotr-crud-default-rtdb.europe-west1.firebasedatabase.app/";

async function getCharacters() {
  const response = await fetch(`${endpoint}/characters.json`);
  const data = await response.json();
  return prepareData(data);
}

async function createCharacter(name, race, image, birth, culture, death, gender, realm, title, weapon) {
  const newCharacter = {
    name: name,
    race: race,
    image: image,
    birth: birth,
    culture: culture,
    death: death,
    gender: gender,
    realm: realm,
    title: title,
    weapon: weapon,
  };
  console.log(newCharacter);
  const json = JSON.stringify(newCharacter);
  const response = await fetch(`${endpoint}/characters.json`, {
    method: "POST",
    body: json,
  });
  return response;
}

//  Updates an existing character
async function updateCharacter(id, name, race, image, birth, culture, death, gender, realm, title, weapon) {
  // Character object we update
  const characterToUpdate = {
    name: name,
    race: race,
    image: image,
    birth: birth,
    culture: culture,
    death: death,
    gender: gender,
    realm: realm,
    title: title,
    weapon: weapon,
  };
  // Converts the JS object to JSON string
  const json = JSON.stringify(characterToUpdate);
  // PUT fetch request with JSON in the body. Calls the specific element in resource
  const response = await fetch(`${endpoint}/characters/${id}.json`, {
    method: "PUT",
    body: json,
  });
  // Checks if response is ok - if the response is successful
  return response;
}

async function deleteCharacter(characterObject) {
  const id = characterObject.id;
  const response = await fetch(`${endpoint}/characters/${id}.json`, {
    method: "DELETE",
  });
  return response;
}

export { getCharacters, createCharacter, updateCharacter, deleteCharacter };
