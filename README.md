기존 torun 프로젝트
-> 런닝,하이킹,트레일러닝,라이딩등 각종운동을 여러사람들과 함께 모여 하자는 취지의
-> 커뮤니티 플랫폼

회원가입을 받아 아이디,비밀번호를 입력하여 로그인 하던 기존 방식에서(jwt토큰만을 사용 , redux를 이용함) >> (Oauth 카카오로그인을 통한 로그인 방식으로 바꾸기위해 처음부터 다시시작)

firstcommit > 카카오 로그인 API를 이용하여 access_token 발급 까지 완료

icandoit > 몽고DB연결(atlas) , 유저모델 생성, access_token활용하여 카카오계정정보 받아왔음
