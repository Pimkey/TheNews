var db;

function addList(name) {

    var list = {
        "name": name,
        "sources": []
    }

    var transaction = db.transaction(["lists"], "readwrite");
    var store = transaction.objectStore("lists");
    var request = store.add(list);
    request.onerror = function (e) {
        console.log("Error saving list " + name, e.target.error.name);
    }
    request.onsuccess = function (e) {
        console.log("List " + name + " successfully saved");
    }

    addToListView('lists_listview', list)
}

function openDB() {
    var openRequest = window.indexedDB.open("TheNewsDB", 1);

    openRequest.onupgradeneeded = function (e) {
        console.log("db object was updated");
        var thisDb = e.target.result;
        if (!thisDb.objectStoreNames.contains("lists")) {
            thisDb.createObjectStore("lists", {
                keyPath: "name"
            });
        }
    }
    openRequest.onsuccess = function (e) {
        console.log("TheNewsDB has been opened");
        db = e.target.result;
    }
    openRequest.onerror = function (e) {
        console.log("TheNewsDB can't be opened");
    }
}
