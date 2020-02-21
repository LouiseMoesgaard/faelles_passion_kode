      const endpoint = ("https://spreadsheets.google.com/feeds/list/1EPQEGSn4g9fSiCGiW62cp3_moiUAF533HuA7MhzKYCA/od6/public/values?alt=json");

      let menuData = [];
      let filter = "all";
      const detalje = document.querySelector("#popUp");

      document.addEventListener("DOMContentLoaded", start);

      function start() {
          fetchData();
          setButtonEvent();
      }


      async function fetchData() {
          const response = await fetch(endpoint);
          menuData = await response.json();
          renderMenuItems();
      };


      function renderMenuItems() {

          const container = document.querySelector(".data-container");
          const oversigtTemplate = document.querySelector("template");

          container.innerHTML = ""; //sletter alle klonede dom elemener i container-elementer (for at skjule tidligere filtrede data i HTML)

          let filteredMenu = null; //filteredMenu sættes til ingenting, for at nulstille den filtrede dat efter hvert clickevent.


          if (filter == "all") {
              filteredMenu = menuData.feed.entry;
          } else {
              filteredMenu = menuData.feed.entry.filter(elm => {
                  return elm.gsx$categori.$t == filter; //filtrerer alle elementer væk, som ikke overholder det boolske udtryk.

              });
          }

          filteredMenu.forEach(food => {
              let klon = oversigtTemplate.cloneNode(true).content; //kloner dom-element.
              klon.querySelector("h3").textContent = food.gsx$name.$t;
              klon.querySelector(".description").textContent = food.gsx$description.$t;
              klon.querySelector("img").src = `imgs/round/${food.gsx$pictures.$t}.png`;
              klon.querySelector("article").addEventListener("click", () => {
                  showDetails(food);
              });
              container.appendChild(klon); //klonede domelement sættes ind i HTML-dom.
          })

      }

      function showDetails(food) {
          console.log(`showDetails`);

          detalje.classList.remove("hide");
          detalje.querySelector("div").addEventListener("click", () => detalje.classList.add("hide"));
          detalje.querySelector("h3").textContent = food.gsx$name.$t;
          detalje.querySelector(".description").textContent = food.gsx$description.$t;
          detalje.querySelector("img").src = `imgs/square/${food.gsx$pictures.$t}.jpg`;
      }


      function setButtonEvent() {
          let buttons = document.querySelectorAll(".button").forEach(elm => {
              elm.addEventListener("click", filtering);

          })
      }

      function filtering() {
          document.querySelectorAll(".button").forEach(elm => {
              elm.classList.remove("button_active");
          })
          filter = this.dataset.filter; //sætter filter-variablet til filter-atributten på knappen (derfor SKAL data-filter have samme navn som kategorierne i datasættet)
          renderMenuItems();

          this.classList.add("button_active");

          document.querySelector("h2").textContent = this.textContent;

      }
