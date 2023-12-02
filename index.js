/* 
  다음에 할 것 정리:
  서버에 datas를 날려서 그대로 저장해주고
  랜더링 할 때 order 순서대로 정렬해서 랜더링
*/
function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function dragEnter(ev) {
  ev.preventDefault();
  console.log(ev.target);
  ev.target.style.backgroundColor = "#aa0000";
  ev.target.style.color = "#fff";
}

function dragLeave(ev) {
  ev.preventDefault();
  ev.target.style.backgroundColor = "rgba(57, 206, 180, 1)";
  ev.target.style.color = "black";
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  ev.target.style.backgroundColor = "#33cc33";
  ev.target.style.color = "white";
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  const draggable_item = document.getElementById(data);
  ev.target.childNodes.forEach((item) => {
    if (item.nodeName === "OL") {
      item.appendChild(draggable_item);
    }
  });
  document.getElementById(data).style.backgroundColor = "rgba(57, 206, 180, 1)";
  document.getElementById(data).style.color = "black";
  console.log("alsjdflaksdjflaksjd;flka");
  calculateNewOrderAndDate();
  displayDatas();
}

function insertAfter(referenceNode, newNode) {
  if (!!referenceNode.nextSibling) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  } else {
    referenceNode.parentNode.appendChild(newNode);
  }
}

function drop_list(ev) {
  //여기서 만약 같은 요일에 있다면 - parent가 같다면 insertBefore
  ev.preventDefault();
  ev.stopPropagation();
  var data = ev.dataTransfer.getData("text");
  const draggable_item = document.getElementById(data);

  // console.log(ev.target.parentNode);
  ev.target.style.backgroundColor = "rgba(57, 206, 180, 1)";
  ev.target.style.color = "black";

  console.log(ev.target.parentNode);
  console.log(draggable_item.parentNode);

  if (ev.target.parentNode === draggable_item.parentNode) {
    ev.target.parentNode.insertBefore(draggable_item, ev.target);
  } else {
    insertAfter(ev.target, draggable_item);
  }

  calculateNewOrderAndDate();
  console.log("datas: ", datas);
  displayDatas();
}

const allList = document.querySelector(".all_list");

const dateFields = document.querySelectorAll(".date th");
const contentFields = document.querySelectorAll(".content td");

// 생성 부분 변수들
const createModal = document.querySelector(".create");
const createCancelBtn = document.querySelector("#create-cancel");
const createStoreBtn = document.querySelector("#create-store");
const cTitle = document.querySelector("#create-title");
const cContent = document.querySelector("#create-description");
const cFile = document.querySelector("input[name=file]");

const cSelectItem = document.querySelector("#create-select");
let cSelected = "todo";

//update 관련
const updateModal = document.querySelector(".update");
const updateCancelBtn = document.querySelector("#update-cancel");

//수정버튼 -> store로 이름 유지
const updateStoreBtn = document.querySelector("#update-store");
const uTitle = document.querySelector("#update-title");
const uContent = document.querySelector("#update-description");
const uSelectItem = document.querySelector("#update-select");
const uFile = document.querySelector("#update-file");
const updateSubmitBtn = document.querySelector("#update-submit");
let uId;

// 배열로 일지 데이터 관리
let datas = [];
let otherMonDatas = [];

function calculateNewOrderAndDate() {
  contentFields.forEach((td) => {
    td.childNodes.forEach((ol) => {
      if (ol.nodeName === "OL") {
        let order = 1;
        ol.childNodes.forEach((li) => {
          // li.dataset.order = `${order++}`;
          datas.forEach((data) => {
            if (data.id === li.dataset.id) {
              data.order = `${order++}`;
              data.date = `2023-${getMonNumber(mon)}-${
                li.parentNode.parentNode.dataset.date
              }`;
            }
          });
        });
      }
    });
  });

  $.ajax({
    url: "./updateOrderDate.php",
    type: "get",
    data: {
      datas: JSON.stringify(datas.concat(otherMonDatas)),
    },
  }).done(function (data) {});
}

function createSelect(select_obj) {
  const selected_index = select_obj.selectedIndex;
  cSelected = select_obj.options[selected_index].value;
}

createCancelBtn.addEventListener("click", (e) => {
  createModal.classList.add("d-none");
});

updateCancelBtn.addEventListener("click", (e) => {
  updateModal.classList.add("d-none");
  updateSubmitBtn.classList.add("d-none");
  updateStoreBtn.classList.remove("d-none");
});

updateStoreBtn.addEventListener("click", (e) => {
  updateSubmitBtn.classList.remove("d-none");
  updateStoreBtn.classList.add("d-none");

  uTitle.disabled = false;
  uContent.disabled = false;
  uSelectItem.disabled = false;
  uFile.disabled = false;
});

updateSubmitBtn.addEventListener("click", (e) => {
  update();
});

function update() {
  $.ajax({
    url: "./update.php",
    type: "get",
    data: {
      id: uId,
      title: uTitle.value,
      content: uContent.value,
      category: uSelectItem.value,
      file_name: uFile.files.item(0).name,
    },
  }).done(function (data) {
    updateModal.classList.add("d-none");

    // uTitle.value = "";
    // uContent.value = "";
    // uFile.value = "";
    // uSelectItem.value = "todo";
    updateSubmitBtn.classList.add("d-none");
    updateStoreBtn.classList.remove("d-none");

    getDatas();
  });
}

createStoreBtn.addEventListener("click", (e) => {
  if (cTitle === "" || cContent === "" || cFile === "") {
    return;
  }

  alert("저장되었습니다.");

  console.log(
    cTitle.value,
    cContent.value,
    cSelected,
    cFile.files.item(0).name
  );

  getList();

  // setTimeout(() => {
  //   getDatas();
  // }, 0);

  cTitle.value = "";
  cContent.value = "";
  cFile.value = "";
  cSelected = "todo";
  cSelectItem.value = "todo";
  createModal.classList.add("d-none");
});

console.log(dateFields);
// 다이어리 부분 변수들

const monSelect = document.querySelector(".mon-select");
let mon = "January";
let date;
const date_data = {
  January: {
    startDay: 0,
    day: 31,
  },
  Faburary: {
    startDay: 3,
    day: 28,
  },
  March: {
    startDay: 3,
    day: 31,
  },
  April: {
    startDay: 6,
    day: 30,
  },
  May: {
    startDay: 1,
    day: 31,
  },
  June: {
    startDay: 4,
    day: 30,
  },
  July: {
    startDay: 6,
    day: 31,
  },
  August: {
    startDay: 2,
    day: 31,
  },
  September: {
    startDay: 5,
    day: 30,
  },
  October: {
    startDay: 0,
    day: 31,
  },
  November: {
    startDay: 3,
    day: 30,
  },
  December: {
    startDay: 5,
    day: 31,
  },
};

function getMonNumber(mon) {
  switch (mon) {
    case "January":
      return 1;
    case "Faburary":
      return 2;
    case "March":
      return 3;
    case "April":
      return 4;
    case "May":
      return 5;
    case "June":
      return 6;
    case "July":
      return 7;
    case "August":
      return 8;
    case "September":
      return 9;
    case "October":
      return 10;
    case "November":
      return 11;
    case "December":
      return 12;
  }
}

//month가 선택되었을때 달력을 새롭게 그려줌.
function fillDate(mon) {
  console.log(mon);
  console.log(date_data["December"]);
  let count = 1;

  for (let i = 0; i < dateFields.length; i++) {
    dateFields[i].style.backgroundColor = "white";
    contentFields[i].style.backgroundColor = "white";
    dateFields[i].textContent = "";
    contentFields[i].classList = [];
    contentFields[i].dataset.date = "";
  }

  for (
    let i = date_data[`${mon}`].startDay;
    i < date_data[`${mon}`].startDay + date_data[`${mon}`].day;
    i++
  ) {
    dateFields[i].textContent = `${count}`;
    contentFields[i].classList.add(`d${count}`);
    contentFields[i].dataset.date = `${count++}`;
  }

  for (let i = 0; i < dateFields.length; i++) {
    if (dateFields[i].textContent === "") {
      dateFields[i].style.backgroundColor = " rgba(255, 178, 178, 0.4)";
      contentFields[i].style.backgroundColor = " rgba(255, 178, 178, 0.4)";
    }
  }
}

function getList() {
  console.log("getList!!");
  const id = generateRandomString(10);
  const dateBox = document.querySelector(`.d${date}`);
  let order = dateBox.childNodes[0].childNodes.length;
  let mon_number = getMonNumber(mon);

  $.ajax({
    url: "./create.php",
    type: "get",
    data: {
      id: id,
      date: `2023-${mon_number}-${date}`,
      order: order + 1,
      title: cTitle.value,
      description: cContent.value,
      category: cSelected,
      file_name: cFile.files.item(0).name,
    },
  }).done(function (data) {
    getDatas();
  });
}

function getDatas() {
  $.ajax({
    url: "./getData.php",
    type: "get",
  }).done(function (data) {
    contentFields.forEach((item) => {
      // item.childNodes[0].textContent = "";
      item.childNodes.forEach((item2) => {
        item2.textContent = "";
      });
    });

    allList.textContent = "";

    //월이 바뀔 때마다 getDatas가 호출됨
    //datas를 비워줌.
    datas = [];
    otherMonDatas = [];
    console.log(data);
    data.forEach((item) => {
      if (item == null) return;

      if (item.date?.split("-")[1] == getMonNumber(mon)) {
        datas.push(item);
      } else {
        otherMonDatas.push(item);
      }
    });

    displayDatas();
    console.log(datas);
  });
}

function displayDatas() {
  datas.forEach((data) => {});

  contentFields.forEach((item) => {
    // item.childNodes[0].textContent = "";
    item.childNodes.forEach((item2) => {
      item2.textContent = "";
    });
  });
  allList.textContent = "";

  console.log(datas);
  datas.forEach((item) => {
    const date = item.date.split("-")[2];
    const title = item.title;
    const description = item.description;
    const file_name = item.file_name;
    const id = item.id;
    const category = item.category;
    const order = item.order;

    const dateBox = document.querySelector(`.d${date}`);
    const li = document.createElement("li");

    li.classList.add("item");
    li.textContent = title;
    li.dataset.description = description;
    li.dataset.file_name = file_name;
    li.dataset.id = id;
    li.id = id;
    li.dataset.order = order;
    li.dataset.category = category;

    li.ondrop = drop_list;
    li.ondragover = allowDrop;
    li.ondragenter = dragEnter;
    li.ondragleave = dragLeave;
    li.draggable = true;
    li.ondragstart = drag;

    li.style.userSelect = "none";

    li.addEventListener("click", (e) => {
      e.stopPropagation();

      uTitle.value = e.target.textContent;
      uContent.value = e.target.dataset.description;
      uSelectItem.value = e.target.dataset.category;
      uId = e.target.dataset.id;
      uFile.value = "";

      uTitle.disabled = true;
      uContent.disabled = true;
      uSelectItem.disabled = true;
      uFile.disabled = true;
      updateModal.classList.remove("d-none");
    });

    dateBox.childNodes.forEach((node) => {
      if (node.nodeName === "OL") {
        node.appendChild(li);
      }
    });

    const li2 = document.createElement("li");

    li2.classList.add("item");
    li2.textContent = title;
    li2.dataset.description = description;
    li2.dataset.file_name = file_name;
    li2.dataset.id = id;
    li2.dataset.category = category;
    allList.appendChild(li2);
  });

  orderData();
}

function orderData() {
  contentFields.forEach((contentField) => {
    let temp;
    let targetNode;
    contentField.childNodes.forEach((node) => {
      if (node.nodeName === "OL" && node.childNodes.length > 1) {
        targetNode = node;
        temp = node.childNodes;
      }
    });

    if (temp === undefined) return;
    console.log("temp1:", temp);

    const temp_arr = Array.prototype.slice.call(temp);
    temp_arr.sort((a, b) => {
      return +a.dataset.order - +b.dataset.order;
    });

    targetNode.textContent = "";

    temp_arr.forEach((item) => {
      targetNode.appendChild(item);
    });
    console.log("temp2:", temp_arr);
  });
}

monSelect.addEventListener("change", (e) => {
  mon = e.target.value;
  fillDate(e.target.value);
  setTimeout(() => {
    getDatas();
  }, 0);
});

window.addEventListener("load", (e) => {
  fillDate("January");
  getDatas();
  for (let i = 0; i < dateFields.length; i++) {
    dateFields[i].addEventListener("click", (e) => {
      e.stopPropagation();
      if (dateFields[i].style.backgroundColor !== "white") {
        return;
      }
      createModal.classList.remove("d-none");
      date = dateFields[i].textContent;
      console.log(date);
    });

    contentFields[i].addEventListener("click", (e) => {
      e.preventDefault();
      if (contentFields[i].style.backgroundColor !== "white") {
        return;
      }
      createModal.classList.remove("d-none");
      date = contentFields[i].dataset.date;
      console.log(date);
    });
  }
});
