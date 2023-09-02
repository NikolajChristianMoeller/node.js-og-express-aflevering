import { getCharacters, createCharacter, updateCharacter, deleteCharacter } from "./rest-service.js";
import { filterByRace, sortByOption, searchByName } from "./helpers.js";

let characterList;

window.addEventListener("load", initApp);

function initApp() {
  updateCharactersGrid();
  document.querySelector("#btn-create-character").addEventListener("click", showCreateCharacterDialog);
  document.querySelector("#form-create-character").addEventListener("submit", createCharacterClicked);

  document.querySelector("#form-update-character .btn-cancel").addEventListener("click", cancelUpdate);

  document.querySelector("#form-create-character .btn-cancel").addEventListener("click", cancelCreate);

  document.querySelector("#form-update-character").addEventListener("submit", updateCharacterClicked);

  document.querySelector("#sortbyselect").addEventListener("change", event => showCharacters(sortByOption(event.target.value)));
  document.querySelector("#input-search").addEventListener("keyup", event => showCharacters(searchByName(event.target.value)));
  document.querySelector("#input-search").addEventListener("search", event => showCharacters(searchByName(event.target.value)));
  document.querySelector("#filterby").addEventListener("change", event => showCharacters(filterByRace(event.target.value)));
}

function cancelCreate(event) {
  event.preventDefault();
  document.querySelector("#dialog-create-character").close();
}

function cancelUpdate(event) {
  event.preventDefault();
  console.log("Cancel update button clicked!");
  document.querySelector("#dialog-update-character").close();
}

function updateClicked(characterObject) {
  //saves the form in as a variable so easier to use below
  const updateForm = document.querySelector("#form-update-character");

  //the following makes info from object be displayed in the ModalWindow to provide
  //Feedback to the user

  updateForm.name.value = characterObject.name;
  updateForm.race.value = characterObject.race; //sets value of the form title to that of the object.
  updateForm.image.value = characterObject.image;
  updateForm.birth.value = characterObject.birth;
  updateForm.culture.value = characterObject.culture;
  updateForm.death.value = characterObject.death;
  updateForm.gender.value = characterObject.gender;
  updateForm.realm.value = characterObject.realm;
  updateForm.title.value = characterObject.title;
  updateForm.weapon.value = characterObject.weapon;

  //sets the id of the form to the id for the specific object
  updateForm.setAttribute("data-id", characterObject.id);

  //shows the update form
  document.querySelector("#dialog-update-character").showModal();

  console.log("Update button clicked!");
}
// }

async function createCharacterClicked(event) {
  event.preventDefault();
  const form = document.querySelector("#form-create-character");
  const name = form.name.value;
  const race = form.race.value;
  const image = form.image.value;
  const birth = form.birth.value;
  const culture = form.culture.value;
  const death = form.death.value;
  const gender = form.gender.value;
  const realm = form.realm.value;
  const title = form.title.value;
  const weapon = form.weapon.value;

  const response = await createCharacter(name, race, image, birth, culture, death, gender, realm, title, weapon);
  if (response.ok) {
    document.querySelector("#dialog-create-character").close();
    updateCharactersGrid();
    form.reset();
    hideErrorMessage();
    // event.target.parentNode.close();
  } else {
    console.log(response.status, response.statusText);
    showErrorMessage("Something went wrong. Please try again");
  }
}

async function updateCharacterClicked(event) {
  event.preventDefault();
  const form = document.querySelector("#form-update-character");
  // extract the values from inputs in the form
  const name = form.name.value;
  const race = form.race.value;
  const image = form.image.value;
  const birth = form.birth.value;
  const culture = form.culture.value;
  const death = form.death.value;
  const gender = form.gender.value;
  const realm = form.realm.value;
  const title = form.title.value;
  const weapon = form.weapon.value;
  //gets the id of the post
  const id = form.getAttribute("data-id");

  //puts in data from from passes it to updateCharacter

  const response = await updateCharacter(id, name, race, image, birth, culture, death, gender, realm, title, weapon); //match the parameters in updatepost!!!
  if (response.ok) {
    document.querySelector("#dialog-update-character").close();
    updateCharactersGrid();
    console.log("Update Character button clicked!");
  } else {
    console.log(response.status, response.statusText);
    showErrorMessage("Something went wrong. Please try again");
    event.target.parentNode.close();
  }
}

function deleteCharacterClicked(characterObject) {
  console.log(characterObject);
  document.querySelector("#dialog-delete-character-title").textContent = characterObject.name;
  document.querySelector("#dialog-delete-character").showModal();
  document.querySelector("#form-delete-character").addEventListener("submit", () => deleteCharacterConfirm(characterObject));
  document.querySelector("#cancelDelete").addEventListener("click", event => cancelDeleteCharacter(event));
}

function cancelDeleteCharacter(event) {
  event.preventDefault();
  document.querySelector("#dialog-delete-character").close();
}

async function deleteCharacterConfirm(characterObject) {
  const response = await deleteCharacter(characterObject);

  if (response.ok) {
    updateCharactersGrid();
    showDeleteFeedback();
  } else {
    document.querySelector("#dialog-failed-to-update").showModal();
  }
}

function showDeleteFeedback() {
  const dialog = document.getElementById("dialog-delete-feedback");
  const dialogMessage = document.getElementById("dialog-delete-feedback-message");
  dialogMessage.textContent;
  dialog.showModal();
  setTimeout(closeDialog, 1000);

  function closeDialog() {
    dialog.close();
  }
}

function showCreateCharacterDialog() {
  document.querySelector("#dialog-create-character").showModal();
  console.log("Create New Character button clicked!");
}

async function updateCharactersGrid() {
  characterList = await getCharacters();
  showCharacters(characterList);
}

function showCharacters(characterList) {
  document.querySelector("#characters").innerHTML = "";
  if (characterList.length !== 0) {
    for (const character of characterList) {
      showCharacter(character);
    }
  } else {
    document.querySelector("#characters").insertAdjacentHTML(
      "beforeend",
      /*html*/ `
    <h2 id="search-error-msg"> No characters were found. Please try again.</h2>
    `
    );
  }
}

function showCharacter(characterObject) {
  const html = /*html*/ `
        <article class="grid-item">
        <div class="clickable">    
            <img src="${characterObject.image}" />
            <h3><b>${characterObject.name}</b></h3>
            <p>Weapon: ${characterObject.weapon}</p>
            <p>Race: ${characterObject.race}</p>
            <p>Title: ${characterObject.title}</p>
        </div>
            <div class="btns">
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>
            </div>
        </article>
    `;
  document.querySelector("#characters").insertAdjacentHTML("beforeend", html);

  const gridItem = document.querySelector("#characters article:last-child .clickable");

  gridItem.addEventListener("click", () => {
    showCharacterModal(characterObject);
  });

  document.querySelector("#characters article:last-child .btn-delete").addEventListener("click", () => deleteCharacterClicked(characterObject));
  document.querySelector("#characters article:last-child .btn-update").addEventListener("click", () => updateClicked(characterObject));
}

function showCharacterModal(characterObject) {
  const modal = document.querySelector("#character-modal");
  modal.querySelector("#character-image").src = characterObject.image;
  modal.querySelector("#character-name").textContent = characterObject.name;
  modal.querySelector("#character-birth").textContent = characterObject.birth;
  modal.querySelector("#character-culture").textContent = characterObject.culture;
  modal.querySelector("#character-death").textContent = characterObject.death;
  modal.querySelector("#character-gender").textContent = characterObject.gender;
  modal.querySelector("#character-race").textContent = characterObject.race;
  modal.querySelector("#character-realm").textContent = characterObject.realm;
  modal.querySelector("#character-title").textContent = characterObject.title;
  modal.querySelector("#character-weapon").textContent = characterObject.weapon;
  modal.showModal();
  modal.querySelector("button").addEventListener("click", () => {
    modal.close();
  });
}

function showErrorMessage(message) {
  document.querySelector(".error-message").textContent = message;
  document.querySelector(".error-message").classList.remove("hide");
}

function hideErrorMessage() {
  document.querySelector(".error-message").textContent = "";
  document.querySelector(".error-message").classList.add("hide");
}

export { characterList };
