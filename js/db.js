let dataset;

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
    // dropTable(db);
    // createTable(db);
    // insertTestDB(db);
    selectAllList(db);
}

function selectAllList(db) {
    let strSql = "SELECT " 
            + "tbl_board.idx, tbl_board.content, tbl_board.regdate, tbl_member.nick " 
            + "FROM tbl_board " 
            + "INNER JOIN tbl_member " 
            + "ON tbl_board.idx = tbl_member.idx " 
            + "ORDER BY tbl_board.idx DESC";
    db.transaction(function (tx) {
        tx.executeSql(strSql, [], function (tx, result) {
            dataset = result.rows;
            let str = "";
            if (dataset.length > 0) {
                for (let i = 0, item = null; i <dataset.length; i++) {
                    item = dataset.item(i);
                    str += "<span class='item'>" + (dataset.length - i) + " : " + item['content'] + " : " + item['nick'] + " : " + item['regdate']+ "</span><br>";
                }
            } else {
                str += "리스트 내용이 없습니다.";
            }
            $("#boardlist").html(str);
        });
    });
}


    // 연속숫자. 연속문자 4자배열만들기
    function makeChainString() {
    
        let num1 = "01234567890";
        let num2 = "09876543210";
        let alphaSmall = "abcdefghijklmnopqrstuvwxyz";
        let alphaBig = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        
        let arr = [];
        let arrLen = "";
    
        for (let i = 0; i < num1.length-3; i++) {
            arr[i] = num1.substr(i, 4);
        }
    
        arrLen = arr.length;
    
        for (let i = 0; i < num2.length-3; i++) {
            arr[i+arrLen] = num2.substr(i, 4);
        }
    
        arrLen = arr.length;
    
        for (let i = 0; i < alphaSmall.length-3; i++) {
            arr[i+arrLen] = alphaSmall.substr(i, 4);
        }
    
        arrLen = arr.length;
    
        for (let i = 0; i < alphaBig.length-3; i++) {
            arr[i+arrLen] = alphaBig.substr(i, 4);
        }
    
        return arr;
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
    // let strSql = "DROP TABLE IF EXISTS tbl_member";
    // db.transaction(function (tx) {
    //     tx.executeSql(strSql, [], resultDroptable, errorHandler);
    // })

    let strSql = "DROP TABLE IF EXISTS tbl_board";
    db.transaction(function (tx) {
        tx.executeSql(strSql, [], resultDroptable, errorHandler);
    });
}

function insertMember() {
    let email = $("#email").val().trim();
    let pw1 = $("#pw1").val().trim();
    let nick = $("#nick").val().trim();
    let strSql = "INSERT INTO tbl_member(email, password, nick) VALUES (?, ?, ?)";

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
            console.log("CREATE TABLE tbl_member SUCCESS!!!");
        }, errorHandler);
    });

    let strCreateTableMember = "CREATE TABLE IF NOT EXISTS tbl_board"
        + "(idx INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
        + "member_idx INTEGER NOT NULL,"
        + "content TEXT NOT NULL,"
        + "regdate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        + "update_date TIMESTAMP)";
    db.transaction(function (tx) {
        tx.executeSql(strCreateTableMember, [], function() {
            console.log("CREATE TABLE tbl_board SUCCESS!!!");
        }, errorHandler);
    });
}

function insertTestDB(db) {
    // db.transaction(function (tx) {
    //     tx.executeSql("INSERT INTO tbl_member(email, password, nick) values('test1','비번', '1번째회원')", [], function() {
    //         console.log("INSERT TEST DB SUCCESS!!!");
    //     } ,errorHandler);

    //     tx.executeSql("INSERT INTO tbl_member(email, password, nick) values('test2','비번', '2번째회원')", [], function() {
    //         console.log("INSERT TEST DB2 SUCCESS!!!");
    //     } ,errorHandler);
    // });


        db.transaction(function (tx) {
        tx.executeSql("INSERT INTO tbl_board(member_idx, content) values('7','1번째글')", [], function() {
            console.log("INSERT TEST DB SUCCESS!!!");
        } ,errorHandler);

        tx.executeSql("INSERT INTO tbl_board(member_idx, content) values('2','2번째글')", [], function() {
            console.log("INSERT TEST DB2 SUCCESS!!!");
        } ,errorHandler);

        tx.executeSql("INSERT INTO tbl_board(member_idx, content) values('9','3번째글')", [], function() {
            console.log("INSERT TEST DB3 SUCCESS!!!");
        } ,errorHandler);

        tx.executeSql("INSERT INTO tbl_board(member_idx, content) values('5','4번째글')", [], function() {
            console.log("INSERT TEST DB4 SUCCESS!!!");
        } ,errorHandler);
    });


}

// 회원이 있는지 체크
function isMember() {
    let email = $("#email").val().trim();
    let pw1 = $("#pw1").val().trim();
    let strSql = "SELECT * FROM tbl_member WHERE email = ? AND password = ? ";
   
    systemDB.transaction(function (tx) {
        tx.executeSql(strSql, [email, pw1], function (tx, results) {

            if (results.rows.length > 0) {
                //쿠키에 이메일정보 저장(이메일넣고 로그인했을때)
                let email = "email";
                document.cookie = email + "=" + results.rows[0].email;

            }
        }, function(tx, error) {
            console.log("Error : " + error.message);
            alert("다른 이메일을 넣어주세요");
            return;
        });
    });
}


// 취소버튼 누르면 전체 인풋내용삭제
function reset() {
    // document.getElementById("login").reset();
    document.forms[0].reset();

}