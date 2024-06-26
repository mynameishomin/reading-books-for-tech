# 커넥션 관리

* HTTP는 어떻게 TCP 커넥션을 사용하는가
* TCP 커넥션의 지연, 병목, 막힘
* 병렬 커넥션, kepp-alive 커넥션, 커넥션 파이프라인을 활용한 HTTP의 최적화
* 커넥션 관리를 위해 따라야 할 규칙들

## TCP 커넥션

지구상의 모든 클라이언트와 서버 애플리케이션은 TCP/IP 커넥션을 맺을 수 있다. 커넥션이 맺어지면 서로 주고받는 메시지는 손실, 손상 없이 그리고 순서가 바뀌지 않고 안전하게 전달된다.

**커넥션 수행 단계**

요청 주소: http://www.joes-hardware.com:80/power-tools.html

1. 브라우저가 www.joes-hardware.com라는 호스트명을 추출한다.
2. 브라우저가 이 호스트명에 대한 IP 주소를 찾는다.
3. 브라우저가 포트 번호를 얻는다.
4. 브라우저가 얻은 IP:PORT 로 TCP 커넥션을 생성한다.
5. 브라우저가 서버로 HTTP GET 요청 메시지를 보낸다.
6. 브라우저가 서버에서 온 HTTP 응답 메시지를 읽는다.
7. 브라우저가 커넥션을 끊는다.