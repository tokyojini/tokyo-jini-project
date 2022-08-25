
function initDatabase() {
    let shortName = "Member";
        let version = "1.0";
        let displayName = "Member DB";
        let maxSize = 1024 * 64;
        let db = "";

    if (!window.openDatabase) {
        alert("현재 브라우저는 웹 SQL DB를 지원하지 않습니다.");
    } else {
        // alert("현재 브라우저는 웹 SQL DB를 지원합니다.");
        
        db = openDatabase(shortName, version, displayName, maxSize);
    }

    systemDB = db;
}


function deleteTestDB(db) {
    let strSql = "DELETE FROM tbl_member";
    db.transaction(function (tx) {
        tx.executeSql(strSql, [], function(){
            console.log("DELETE TEST DB SUCCESS!!");
        }, errorHandler);
    })
}

function addUniqueIndex(db) {
    let strSql = "CREATE UNIQUE INDEX email ON tbl_member (email ASC)";
    db.transaction(function (tx) {
        tx.executeSql(strSql, [], function(){
            console.log("CREATE UNIQUE INDEX SUCCESS!!");
        }, errorHandler);
    })
}


function dropTable(db) {
    let strSql = "DROP TABLE IF EXISTS tbl_member";
    db.transaction(function (tx) {
        tx.executeSql(strSql, [], resultDroptable, errorHandler);
    })
}

function insertDB() {
    let strSql = "INSERT INTO tbl_member(email, password, nick) VALUES (?, ?, ?)";
    let email = $("#email").val().trim();
    let pw1 = $("#pw1").val().trim();
    let nick = $("#nick").val().trim();

    if (email === "" || pw1 === "" || nick === "") {
        alert("이메일을 입력하세요.");
        $("#email").focus();
        return;
    }

    systemDB.transaction(function (tx) {
        tx.executeSql(strSql, [email, pw1, nick], loadAndReset, function(transaction, error) {
            console.log("Error : " + error.message);
            alert("다른 이메일을 넣어주세요");
            return;
        });
    });
}

function resultDroptable() {
    console.log("Drop Table SUCCESS!!");
}

function loadAndReset() {
    console.log("Insert Record SUCCESS");
    location.href = "login.html"
}

function errorHandler(transaction, error) {
    console.log("Error: " + error.message + " (Code "+error.code+")");
    console.log("Insert Record ERROR");
}

function createTable(db) {
    let strCreate = "CREATE TABLE IF NOT EXISTS tbl_member"
        + " (idx INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
        + " email TEXT NOT NULL,"
        + " password TEXT NOT NULL,"
        + " nick TEXT NOT NULL,"
        + " regdate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)";
    db.transaction(function (tx) {
        tx.executeSql(strCreate, [], function() {
            console.log("CREATE TABLE SUCCESS!!!");
        }, errorHandler);
    });
}

function insertTestDB(db) {
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO tbl_member(email, password, nick) values('test1','비번', '1번째회원')", [], function() {
            console.log("INSERT TEST DB SUCCESS!!!");
        } ,errorHandler);

        tx.executeSql("INSERT INTO tbl_member(email, password, nick) values('test2','비번', '2번째회원')", [], function() {
            console.log("INSERT TEST DB2 SUCCESS!!!");
        } ,errorHandler);
    });
}
