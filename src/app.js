class Tasks {
  constructor() {
    // doms
    this.tasks = [];
    this.init();
  }

  init() {
    const contentsList = document.querySelector(".contents-list");
    contentsList.innerHTML = "";
    fetch("/getTasks")
      .then((response) => response.json())
      .then((data) => {
        data.tasks.forEach((element) => {
          const tasks = `<div class="contents" id="${element.id}contents">
            <div>
              <h3 class="titolo1">${element.title}</h3>
              <h4 class="titoloDataStato">${element.date}</h4>
              <div class="titoloDataStato"><div class="chips-background">
                  <p>${element.state}</p></div>
              </div></div><hr/> <p class="descrizione">${element.description}</p>
            <div class="bottoni">
              <button class="button1" id="modifica" onclick="modifica(${element.id})">Modifica</button>
              <button class="button1" id="elimina" onclick="cancella(${element.id})">Elimina</button></div>
             </div>`;
          contentsList.innerHTML += tasks;
          console.log("ciao");
        });
      })
      .catch((err) => console.log(err));
  }

  async delete(id) {
    console.log("DELETE -->");
    await fetch("/deleteTask/" + id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((err) => console.log(err));
    console.log("DELETE -->");
  }

  async save() {
    let data = {
      newPost: {
        id: Math.floor(Math.random() * 1000) + 1,
        title: document.getElementById("titolo").value,
        description: document.getElementById("descrizione").value,
        date: document.getElementById("datepicker").value,
        state: document.getElementById("statusSelect").value,
      },
    };

    const contentsList = document.querySelector(".contents-list");
    const tasks = `<div class="contents" id="${data.newPost.id}contents">
            <div>
              <h3 class="titolo1">${data.newPost.title}</h3>
              <h4 class="titoloDataStato">${data.newPost.date}</h4>
              <div class="titoloDataStato"><div class="chips-background">
                  <p>${data.newPost.state}</p></div>
              </div></div><hr/> <p class="descrizione">${data.newPost.description}</p>
            <div class="bottoni">
              <button class="button1" id="modifica" onclick="modifica(${data.newPost.id})">Modifica</button>
              <button class="button1" id="elimina" onclick="cancella(${data.newPost.id})">Elimina</button></div>
             </div>`;

    contentsList.innerHTML += tasks;
    console.log("SAVE -->" + JSON.stringify(data));

    await fetch("/setTask", {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((err) => console.log(err));
  }

  async modifica(id) {
    let prova = "javascript: upd(" + id + ");";
    document.getElementById(id + "contents").style.background = "#FFF2DB";
    document.getElementById("aggiungi").setAttribute("onClick", prova);
    document.getElementById("aggiungi").style.background = "#fca311";
    document.getElementById("aggiungi").textContent = "Modifica";

    fetch("/getTask/" + id)
      .then((response) => response.json())
      .then((data) => {
        document.getElementsByName("titolo")[0].value = data.title;
        document.getElementsByName("descrizione")[0].value = data.description;
        document.getElementById("datepicker").value = data.date;
        changeSelectedOption(data.state);
      })
      .catch((err) => console.log(err));
  }

  async update(id) {
    let data1 = {
      newPost: {
        id: id,
        title: document.getElementById("titolo").value,
        description: document.getElementById("descrizione").value,
        date: document.getElementById("datepicker").value,
        state: document.getElementById("statusSelect").value,
      },
    };

    console.log("update -->" + JSON.stringify(data1));

    await fetch("/update/" + id, {
      method: "PUT",
      body: JSON.stringify(data1),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  }
}

let task = new Tasks();

async function myFunction() {
  await task.save();
  document.getElementsByName("titolo")[0].value = "";
  document.getElementsByName("descrizione")[0].value = "";
}

async function cancella(id) {
  await task.delete(id);
  await task.init();
}
async function upd(id) {
  console.log("upd " + id);
  await task.update(id);

  await task.init();
  changeButton();
  val = false;
}

function changeButton() {
  document
    .getElementById("aggiungi")
    .setAttribute("onClick", "javascript: myFunction();");
  document.getElementById("aggiungi").style.background = "#ee6c4d";
  document.getElementById("aggiungi").textContent = "Aggiungi";
  document.getElementsByName("titolo")[0].value = "";
  document.getElementsByName("descrizione")[0].value = "";
}

let val = false;

async function modifica(id) {
  if (!val) {
    val = true;
    console.log("fffff");
    await task.modifica(id);
  } else {
    console.log("fefefefef");
    val = false;
    changeButton();
    document.getElementById(id + "contents").style.background = "#4048d913";
  }
}

async function modifica1(id) {}

function changeSelectedOption(value) {
  const select = document.getElementById("statusSelect");
  const options = select.options;
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === value) {
      console.log("rrrr" + value);
      options[i].selected = true;
    } else {
      options[i].selected = false;
    }
  }
}
