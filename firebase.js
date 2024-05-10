// Firebase 초기화
var firebaseConfig = {
    // 여기에 Firebase 설정을 추가하세요.
    apiKey: "AIzaSyC6sk4CMWG17SKPjMM-95_ZTWQcVxjDYEI",
    authDomain: "birthday-message-53bb7.firebaseapp.com",
    projectId: "birthday-message-53bb7",
    storageBucket: "birthday-message-53bb7.appspot.com",
    messagingSenderId: "503390505524",
    appId: "1:503390505524:web:a158ae5fb99a3fde9cd861",
    measurementId: "G-GW0HD3845F"
};
firebase.initializeApp(firebaseConfig);

// Firestore 데이터베이스 인스턴스 생성
var db = firebase.firestore();

// 저장 버튼 클릭 이벤트 핸들러
document.getElementById('saveBtn').addEventListener('click', () => {
    const contents = document.getElementById('contents').value; // 입력된 메세지 가져오기
    const password = document.getElementById('password').value; // 입력된 비밀번호 가져오기
    const relation = document.getElementById('relation_Bottom').value; // 입력된 관계 가져오기
    const nickname = document.getElementById('nickname_Bottom').value; // 입력된 닉네임 가져오기

    // 짱구 컬렉션에 nickname 문서 가져오기
    const contentsDocRef = db.collection('짱구').doc(nickname);

    // 클릭한 시점의 시간대 가져오기
    const now = new Date();
    const RegTime = `${now.getFullYear()}.${now.getMonth()+1}.${now.getDate()}/ ${now.getHours()}: ${now.getMinutes()}`;

    // nickname 문서 가져오기
    contentsDocRef.get()
    .then((doc) => {
        if (doc.exists) {
            // 문서가 존재하는 경우, 필드를 업데이트
            return contentsDocRef.update({
                comments: contents,
                password: password,
                relation: relation,
                nickname: nickname,
                RegTime: RegTime // 시간대 필드 추가
            });
        } else {
            // 문서가 존재하지 않는 경우, 새로운 문서를 생성하고 필드를 추가
            return contentsDocRef.set({
                comments: contents,
                password: password,
                relation: relation,
                nickname: nickname,
                RegTime: RegTime // 시간대 필드 추가
            });
        }
    })
    .then(() => {
        console.log('문서가 성공적으로 업데이트되었습니다.');
        // 입력 칸 초기화
        document.getElementById('contents').value = '';
        document.getElementById('password').value = '';
        document.getElementById('relation_Bottom').value = '';
        document.getElementById('nickname_Bottom').value = '';
        // .List 재조회
        loadContents();
    })
    .catch((error) => {
        console.error('문서 업데이트 오류:', error);
    });
});

// 페이지 로딩 또는 Reset_Btn 클릭 시 DB 내용 조회
window.onload = function() {
    document.getElementById('Reset_Btn').addEventListener('click', loadContents);
    loadContents();
}

// 내용 로딩 함수
function loadContents() {
    // List 클래스 내의 모든 항목 초기화
    document.querySelector('.List').innerHTML = '';
    db.collection('짱구').orderBy('RegTime', 'desc').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // 문서 내용을 List DIV에 추가
            addContentToDiv(doc.data());
        });
    });
}

// 내용을 DIV에 추가하는 함수
function addContentToDiv(data) {
    var div = document.createElement('div');
    div.className = 'main_Contents_List';
    div.innerHTML = `
        <div class="main_Contents_Relation">
            <span id="span_List_Relation">짱구와는</span>
            <input type="text" id="List_Relation" value="${data.relation}" maxlength="6" spellcheck="false" readonly>
            <span id="span_List_Relation2">관계,</span>
            <input type="text" id="List_NickName" value="${data.nickname}" maxlength="10" spellcheck="false" readonly>
            <input type="text" id="List_Time" value="${data.RegTime}" maxlength="11" spellcheck="false" readonly>
            <span id="span_List_Time">작성</span>
        </div>
        <div class="main_Contents_Top">
            <textarea id="List_contents" spellcheck="false">${data.comments}</textarea>
        </div>
        <div class="main_Contents_Btn">
            <button class="List_Delete_Btn">삭제하기</button>
            <button class="List_Save_Btn">수정하기</button>
        </div>
    `;
    document.querySelector('.List').appendChild(div);
}

// 최신 버튼 클릭 시 최신 순으로 정렬
document.getElementById('Latest_Btn').addEventListener('click', () => {
    sortContents('desc');
});

// 오래된 버튼 클릭 시 오래된 순으로 정렬
document.getElementById('Old_Btn').addEventListener('click', () => {
    sortContents('asc');
});

// 내용 정렬 함수
function sortContents(order) {
    // List 클래스 내의 모든 항목 초기화
    document.querySelector('.List').innerHTML = '';
    db.collection('짱구').orderBy('RegTime', order).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // 정렬된 문서 내용을 List DIV에 추가
            addContentToDiv(doc.data());
        });
    });
}
