document.addEventListener('wheel', function(e) {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  }, { passive: false });


// ========================================================
  
  // 동적으로 생성된 삭제 버튼에 대한 이벤트 위임
  document.addEventListener('click', (e) => {
    if (e.target && e.target.className === 'List_Delete_Btn') {
      var modal = document.getElementById('myModal');
    modal.style.display = 'block';
  }
});

// 동적으로 생성된 수정 버튼에 대한 이벤트 위임
document.addEventListener('click', (e) => {
  if (e.target && e.target.className === 'List_Save_Btn') {
    var modal = document.getElementById('myModal');
    modal.style.display = 'block';
  }
});

// ========================================================

// 모달의 닫기 버튼 클릭 시 모달 닫기
document.querySelector('.modal-close').addEventListener('click', () => {
  var modal = document.getElementById('myModal');
  modal.style.display = 'none';
});

// 모달 영역 외 클릭 시 모달 닫기
window.addEventListener('click', (e) => {
  var modal = document.getElementById('myModal');
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// ========================================================

// 확인 버튼 클릭 시 사용자 입력 처리
document.getElementById("confirmBtn").onclick = function() {
  var passwordInput = document.getElementById("passwordInput");
  var password = passwordInput.value;
  if (password !== "") {
    // 여기에 사용자가 입력한 비밀번호에 대한 처리를 추가할 수 있습니다.
    console.log("사용자가 입력한 비밀번호:", password);
    // 모달 창 닫기
    document.getElementById("myModal").style.display = "none";
    // 비밀번호 입력 칸 리셋
    passwordInput.value = "";
    // 메시지 숨기기
    document.getElementById("modalMessage").style.display = "none";
  } else {
    // 비밀번호를 입력하지 않은 경우 모달 창에 알림 표시
    document.getElementById("modalMessage").style.display = "block";
  }
};

// ========================================================

// 동적으로 생성된 삭제 버튼에 대한 이벤트 위임
document.addEventListener('click', (e) => {
  if (e.target && e.target.className === 'List_Delete_Btn') {
    var modal = document.getElementById('myModal');
    var listItem = e.target.closest('.main_Contents_List'); // 클릭된 버튼의 부모 요소인 .main_Contents_List 찾기
    var nickname = listItem.querySelector('#List_NickName').value.trim(); // .main_Contents_List 내의 닉네임 요소에서 닉네임 가져오기
    modal.style.display = 'block';

    // 모달 확인 버튼 클릭 시 처리
    document.getElementById("confirmBtn").onclick = function() {
      var passwordInput = document.getElementById("passwordInput");
      var password = passwordInput.value.trim(); // 공백 제거

      if (password !== "") {
        // 해당 닉네임을 가진 문서 가져오기
        db.collection("짱구")
          .doc(nickname)
          .get()
          .then((doc) => {
            if (doc.exists) {
              // 비밀번호 검증
              if (doc.data().password === password) {
                // 비밀번호 일치 시 문서 삭제
                return db.collection("짱구").doc(nickname).delete()
                  .then(() => {
                    // 비밀번호 입력 칸 리셋
                    passwordInput.value = "";
                    // 메시지02 숨기기
                    document.getElementById("modalMessage02").style.display = "none";
                    // 모달창 닫기
                    modal.style.display = "none";
                    // 내용 다시 불러오기
                    loadContents();
                  });
              } else {
                // 비밀번호 불일치 시 메시지 표시
                document.getElementById("modalMessage02").style.display = "block";
              }
            } else {
              // 해당 닉네임을 가진 문서가 없는 경우
              console.log("해당 닉네임의 문서가 존재하지 않습니다.");
            }
          })
          .catch((error) => {
            console.error("문서 삭제 오류:", error);
          });
      } else {
        // 비밀번호를 입력하지 않은 경우 모달 창에 알림 표시
        document.getElementById("modalMessage").style.display = "block";
      }
    };

    // 모달 닫기 시 처리
    document.querySelector('.modal-close').onclick = function() {
      // 비밀번호 입력 칸 초기화
      document.getElementById("passwordInput").value = "";
      // 메시지 숨기기
      document.getElementById("modalMessage").style.display = "none";
      document.getElementById("modalMessage02").style.display = "none";
      // 모달 닫기
      modal.style.display = 'none';
    };
  }
});

// ========================================================

// 동적으로 생성된 수정 버튼에 대한 이벤트 위임
document.addEventListener('click', (e) => {
  if (e.target && e.target.className === 'List_Save_Btn') {
    var modal = document.getElementById('myModal');
    var listItem = e.target.closest('.main_Contents_List'); // 클릭된 버튼의 부모 요소인 .main_Contents_List 찾기
    var nickname = listItem.querySelector('#List_NickName').value.trim(); // .main_Contents_List 내의 닉네임 요소에서 닉네임 가져오기
    var contents = listItem.querySelector('#List_contents').value.trim(); // .main_Contents_List 내의 내용 요소에서 내용 가져오기
    modal.style.display = 'block';

    // 모달 확인 버튼 클릭 시 처리
    document.getElementById("confirmBtn").onclick = function() {
      var passwordInput = document.getElementById("passwordInput");
      var password = passwordInput.value.trim(); // 공백 제거

      if (password !== "") {
        // 해당 닉네임을 가진 문서 가져오기
        db.collection("짱구")
          .doc(nickname)
          .get()
          .then((doc) => {
            if (doc.exists) {
              // 비밀번호 검증
              if (doc.data().password === password) {
                // 비밀번호 일치 시 내용 업데이트
                return db.collection("짱구").doc(nickname).update({
                    comments: contents
                  })
                  .then(() => {
                    // 비밀번호 입력 칸 리셋
                    passwordInput.value = "";
                    // 모달창 닫기
                    modal.style.display = 'none';
                    // 알림 표시
                    alert("입력하신 내용대로 수정되었습니다!");
                    // 메시지 숨기기
                    document.getElementById("modalMessage").style.display = "none";
                    // 메시지02 숨기기
                    document.getElementById("modalMessage02").style.display = "none";
                    // 내용 다시 불러오기
                    loadContents();
                  });
              } else {
                // 비밀번호 불일치 시 메시지 표시
                document.getElementById("modalMessage02").style.display = "block";
              }
            } else {
              // 해당 닉네임을 가진 문서가 없는 경우
              console.log("해당 닉네임의 문서가 존재하지 않습니다.");
            }
          })
          .catch((error) => {
            console.error("문서 수정 오류:", error);
          });
      } else {
        // 비밀번호를 입력하지 않은 경우 모달 창에 알림 표시
        document.getElementById("modalMessage").style.display = "block";
      }
    };

    // 모달 닫기 시 처리
    document.querySelector('.modal-close').onclick = function() {
      // 비밀번호 입력 칸 초기화
      document.getElementById("passwordInput").value = "";
      // 메시지 숨기기
      document.getElementById("modalMessage").style.display = "none";
      document.getElementById("modalMessage02").style.display = "none";
      // 모달 닫기
      modal.style.display = 'none';
    };
  }
});
