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

/*
    게시판 글쓰기
*/
function insertBoard() {
    let strSql = "INSERT INTO tbl_board (member_idx,content) VALUES(?,?)";
    let content = $("#content").val().trim();
    let member_idx = getCookie("idx");

    if (content === "") {
        alert("글을 적어주세요");
        $("#content").focus();
        return;
    }

    systemDB.transaction(function (tx) {
        tx.executeSql(strSql, [member_idx, content], replaceBoard, errorHandler);
    });
}

function replaceBoard() {
    location.href = "board.html";
}

function selectAllList(db) {
    let strSql = "SELECT " 
            + "tbl_board.idx, tbl_board.content, tbl_board.regdate, tbl_member.nick " 
            + "FROM tbl_board " 
            + "INNER JOIN tbl_member " 
            + "ON tbl_board.member_idx = tbl_member.idx " 
            + "ORDER BY tbl_board.idx DESC";

    db.transaction(function (tx) {
        tx.executeSql(strSql, [], function (tx, result) {
            dataset = result.rows;
            let str = "";

            if (dataset.length > 0) {
                str += "<table class='board_list'>";
                    str += "<thead>";
                        str += "<tr>";
                         str += "<th width='50'>" + "번호" + "</th>";
                         str += "<th width='500'>" + "내용" + "</th>";
                         str += "<th width='100'>" + "글쓴이" + "</th>";
                         str += "<th width='250'>" + "작성일" + "</th>";
                         str += "<th width='40'>" + "수정" + "</th>";
                         str += "<th width='40'>" + "삭제" + "</th>";
                        str += "</tr>";
                    str += "</thead>";

                for (let i = 0, item = null; i <dataset.length; i++) {
                    item = dataset.item(i);
                    
                    str += "<tr>";
                    str += "<td class='num'>" + (dataset.length - i) + "</th>";
                    str += "<td>" + item['content'] + "</th>";
                    str += "<td>" + item['nick'] + "</th>";
                    str += "<td>" + changeDate(item['regdate']) + "</th>";
                    str += "<td>" + "<span class='btn edit' onclick='getBoardOne("+item['idx']+")'> 수정 <span>" + "</th>";
                    str += "<td>" + "<span class='btn delete'> 삭제 <span>" + "</th>";
                    str += "</tr>";
                }

                str += "</table>"; 
            } else {
                str += "리스트 내용이 없습니다.";
            }

            $("#boardlist").html(str);
        });
    });
}

// 게시판글수정 (9월9일부터 시작)
function getBoardOne(idx) {
    let strSql = "SELECT "
                + "* " 
                + "FROM tbl_board "
                + "WHERE idx = ?";

    systemDB.transaction(function (tx) {
        tx.executeSql(strSql, [idx], function (tx, result) {
            // 글 내용 보내기
            $("#content").val(result.rows[0]['content']);

            // 글쓰기 버튼은 비표시, 글수정 버튼은 표시
            document.getElementById("btn_insert").style.display ="none";
            document.getElementById("btn_update").style.display ="block";
          
           // 글수정 버튼의 글번호를 부여한다.(총3가지)
            //1. 변수에 저장을한다
            boardIdx = result.rows[0]['idx'];
           
            //2. 화면에 안보이게저장을한다
            $("#board_idx").text(result.rows[0]['idx']);

            //3. 버튼에다가 번호를 부여한다
            $("#btn_update").attr("data-idx", result.rows[0]['idx']);
        }, errorHandler);
    });
}

// 글수정 버튼의 글번호를 가져와서 글내용을 저장한다.



// 2022-09-05 07:19:32 -> 2022년 09월 05일 07시 19분
function changeDate(pDate) {
    let str = "";

    let tempDates = pDate.split(' '); 
    let tempDates2 = tempDates[0].split('-');
    let tempDates3 = tempDates[1].split(':');
    str = tempDates2[0] + "년 " + tempDates2[1] + "월 " + tempDates2[2] + "일 " 
        + tempDates3[0] + "시 " + tempDates3[1] + "분 ";

    return str;
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
                document.cookie = "idx=" + results.rows[0].idx;
                document.cookie = "email=" + results.rows[0].email;
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


// 수정해서 공부하기
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
      return unescape(parts.pop()).split(';').shift();
    }
}