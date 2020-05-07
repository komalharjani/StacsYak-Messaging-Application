/**
 * Constants and Global Variables
 */
const api = "https://cs5003-api.host.cs.st-andrews.ac.uk/api/yaks?key=6e5eb561-0840-461a-9cf6-1ee19ed52bd1"; //API URL
const apiUsername = "https://cs5003-api.host.cs.st-andrews.ac.uk/api/user?key=6e5eb561-0840-461a-9cf6-1ee19ed52bd1"; //API URL for posting Nicknames
const defaultNick = document.getElementById("nickname").defaultValue = "pheonix"; //Default Nickname for this key
let parsedObject;

/**
 * Asynchronous Function to post Yaks to Server
 */
async function postYak() {
    let postYakValue = document.getElementById('yakPost'); //pull yak from form
    let content = postYakValue.value;
    await fetch(api, {
        method: 'POST',
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content, //convert yak to JSON Object
        }),
    }).then((response) => response.json())
        .then((content) => {
            console.log('Success:', content);
        }).catch(function (error) {
            console.log(error);
        });
    document.getElementById("yakPost").value = "";
    reloadPage(); //call function to reload without refreshing
};

/**
 * Event Listener to call function once user wants to change nickname
 */
document.getElementById('nicknameSubmit').addEventListener("click", function () {
    postNickname();
});

async function postNickname() {
    let nickname = document.getElementById("nickname").value; //pull new nickname value from form
    if (nickname.charAt(0) == '') { //if it is empty - use default nickname
        nickname = defaultNick;
    }
    nickname = "{\"userNick\": \"" + nickname + "\"}" //hardcoded nickname to be posted to server
    await fetch(apiUsername, {
        method: 'POST',
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        },
        body: nickname,
    }).then((response) => response.json())
        .then((nickname) => {
            console.log('Success:', nickname);
        }).catch(function (error) {
            console.log(error);
        });
    reloadPage(); //call reload function
};
/**
 * Vote Up
 */
//reference URL here CURL one
async function voteUpFunction(yakid) {
    let apiNew = api.substring(0, api.indexOf("yaks") + 4) + "/" + yakid + "/vote" + api.substring(api.lastIndexOf("?")); //extract yakID from URL
    let direction = "{\"direction\": \"up\" }"; //hardcode message for body
    await fetch(apiNew, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: direction
    }).then(function (response) {
        return response.json();
    })
        .then(function (direction) {
            console.log(direction);
        }).catch(function (error) {
            console.log(error);
        });
    reloadPage();
};

/**
 * Vote Down
 */
async function voteDownFunction(yakid) {
    let apiNew = api.substring(0, api.indexOf("yaks") + 4) + "/" + yakid + "/vote" + api.substring(api.lastIndexOf("?"));
    let direction = "{\"direction\": \"down\" }";
    await fetch(apiNew, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: direction
    }).then(function (response) {
        return response.json();
    })
        .then(function (direction) {
            console.log(direction);
        }).catch(function (error) {
            console.log(error);
        });
    reloadPage();
};

/**
 * Delete Row
 */
async function deleteRow(yakid) {
    let apiDelete = api.substring(0, api.indexOf("yaks") + 4) + "/" + yakid + api.substring(api.lastIndexOf("?")); //extract yakID to delete row
    await fetch(apiDelete, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
    }).then(function (response) {
        return response.json();
    }).catch(function (error) {
        console.log(error);
    });
    reloadPage();
};

/**
 * Submit Function 
 */
function onSubmit() { //links to submit button when posting yak 
    postYak();
}

/**
 * Change Nickname
 */
function changeNickname() { //links to submit button when changing nickname
    postNickname();
}

/**
 * Get Yak from Server to Page without reloading
 * SOURCE: https://www.w3schools.com/xml/ajax_xmlhttprequest_response.asp
 */
function reloadPage() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            responseHandler(this);
        }
    };
    xmlhttp.open("GET", api, true);
    xmlhttp.send();
}

/**
 * Response Handler for Form to Create Table
 * @param {*} xhttp 
 */
function responseHandler(xhttp) {
    let jsonObject = xhttp.responseText; //get response text from server
    parsedObject = '{ \"pulledResponse\" :' + jsonObject + "}";
    parsedObject = JSON.parse(parsedObject); //convert parsed response to JSON
    document.getElementById("pulledResponse").innerHTML = parsedObject.pulledResponse[0].content; //place in a hidden tag to display on page
    createTable(parsedObject.pulledResponse); //create table with the data pulled from server
}

/**
 * GENERATE TABLE
 * @param {*} parsedObject //the entire json (array of objects)
 * https://www.encodedna.com/javascript/dynamically-create-html-elements-using-createElement-method.htm
 */
function createTable(tableData) {
    if (tableData.length == 0)
        tableData = parsedObject.pulledResponse; //if no data use default server data
    let table = document.createElement("table");
    let col = [];
    for (let i = 0; i < tableData.length; i++) {
        for (let key in tableData[i]) {
            if (col.indexOf(key) === -1) { //assign keys to col
                col.push(key);
            }
        }
    }

    //assign headers from keys
    let row = table.insertRow(-1); //place oldest elements on last row
    for (var h = 0; h < col.length; h++) {
        var header = document.createElement('th');
        header.innerHTML = col[h];
        row.appendChild(header);
    }

    header = document.createElement("th");
    header.innerHTML = "vote/delete"; //create new column for buttons
    row.appendChild(header);

    //fill out table
    for (let i = 0; i < tableData.length; i++) {
        row = table.insertRow(-1);
        for (let j = 0; j < col.length; j++) {
            let tabCell = row.insertCell(-1);
            tabCell.innerHTML = tableData[i][col[j]];
        }

        let yakid = row.cells[2].innerHTML;  //identify column of yakid

        //Create VoteUp Button
        let voteUp = document.createElement("button");
        voteUp.innerHTML = 'Vote Up';
        voteUp.style.textAlign = "center";
        voteUp.addEventListener("click", function () {
            voteUpFunction(yakid); //call function when voted up is pressed
        });

        //same as voteUp but to votedown
        let voteDown = document.createElement("button");
        voteDown.innerHTML = 'Vote Down';
        voteDown.style.textAlign = "center";
        voteDown.addEventListener("click", function () {
            voteDownFunction(yakid);
        });

        //Delete Button
        let deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = 'Delete';
        deleteBtn.style.textAlign = "center";
        deleteBtn.addEventListener("click", function () {
            deleteRow(yakid); //call function to delete row
        });

        row.appendChild(voteUp);
        row.appendChild(voteDown);
        row.appendChild(deleteBtn);

    }
    //insert into div and display
    let divContainer = document.getElementById("tableDiv");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}


/**
 * Sorting Algorithm to sort data and swap rows
 * @param {*} text //labels of Buttons
 * @param {*} source //source of sort request
 */
function sortTable(text, source) {
    let dataForSort = parsedObject.pulledResponse; //reassign server data to another variable
    for (let i = 0; i < dataForSort.length - 1; i++) { //loop through first row 
        for (let j = i + 1; j < dataForSort.length; j++) { //and the next row
            let iVal = source.indexOf("descending") != -1 ? dataForSort[i].votes : dataForSort[i].timestamp; //ternary condition to sort by votes or timestamp depending on event listener
            let jVal = source.indexOf("descending") != -1 ? dataForSort[j].votes : dataForSort[j].timestamp;

            //sort in ascending or descending depending on condition above
            if (
                (text.indexOf("descending") != -1 && iVal < jVal) || 
                (text.indexOf("ascending") != -1 && iVal > jVal)
            ) {
                let temp = dataForSort[j];
                dataForSort[j] = dataForSort[i];
                dataForSort[i] = temp;
            }
        }
    }

    createTable(dataForSort); //recreate values in tables from sorted array of data
}

/**
* Sort Table by Votes Event Listener
*/
document.getElementById('sortVotes').addEventListener("click", function () {
    let element = document.getElementById('sortVotes');
    let text = element.innerText;
    switch (element.innerText) { //switch between ascending and descending depending what is in the text currently
        case "ascending":
            element.innerText = "descending";
            break;
        case "descending":
            element.innerText = "ascending";
            break;
    }
    sortTable(text, "descending");
});

/**
* Sort Table by TimeStamp Event Listener
*/
document.getElementById('sortTime').addEventListener("click", function () {
    let element = document.getElementById('sortTime');
    let text = element.innerText;
    switch (element.innerText) {
        case "ascending":
            element.innerText = "descending";
            break;
        case "descending":
            element.innerText = "ascending";
            break;
    }
    sortTable(text, "t");
});

/**
 * Filter Function
 */
function filterFunction(source) {
    let finalData = [];
    let dataForFilter = parsedObject.pulledResponse; //reassign
    let nickFilter = document.getElementById("nicknameFilter").value; //pull value from inputted text
    let hashFilter = document.getElementById("hashtagFilter").value; //pull value from inputted text
    let k = source.indexOf("n") != -1 ? nickFilter : hashFilter; //ternary condition to switch between inputted texts
    if (!k == "") {
        for (let i = 0; i < dataForFilter.length; i++) {
            let t = source.indexOf("n") != -1 ? dataForFilter[i].userNick : dataForFilter[i].content; //ternary condition to switch between matching usernames or yaks from server
            if (t == undefined)
                continue;
            if (t.indexOf(k) != -1) {
                finalData.push(dataForFilter[i]); //push data into temp
            }
        }
    }
    createTable(finalData);
}

/**
* Filter Table by Nickname Event Listener
*/
document.getElementById('nicknameFilter').addEventListener("keyup", function () {
    filterFunction("n");
});

/**
* Filter Table by Hashtags Event Listener
*/
document.getElementById('hashtagFilter').addEventListener("keyup", function () {
    filterFunction("h");
});

