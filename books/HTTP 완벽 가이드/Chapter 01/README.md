# HTTP 개관

## 웹 클라이언트와 서버

전 세계의 웹브라우저, 서버, 웹 애플리케이션은 모두 HTTP를 통해 대화한다. 여기서 클라이언트와 서버로 나뉘게 되는데 클라이언트는 서버에게 HTTP 요청을 보내고 서버는 요청받은 데이터를 HTTP 응답으로 돌려준다. 이것이 월드 와이드 웹의 기본 요소.

## 리소스

서버가 클라이언트에게 응답으로 제공하는 리소스가 웹 콘텐츠의 원천인데 웹 리소스는 가장 간단한 정적파일인 텍스트, HTML, 워드 파일 등부터 주식 거래, 실시간 스트리밍 등 요청에 따라 콘텐츠를 생산하는 프로그램이 될 수도 있다.

HTTP에서는 수많은 데이터 타입을 다루기 때문에 웹에서 전송되는 객체에 MIME(Multipurpose Internet Mail Extensions, 다목적 인터넷 메일 확장) 타입을 붙인다. 원래 이메일을 위해 설계되었지만 HTTP에서도 멀티미디어 콘텐츠를 기술하고 라벨을 붙이기 위해 채택되었다.

웹 서버는 모든 HTTP 객체 데이터에 MIME 타입을 붙이는데 브라우저는 MIME 타입을 통해 응답받은 객체가 다룰 수 있는 객체인지 확인한다. 다룰 수 있는 타입인 경우 이미지 파일을 보여주거나 HTML을 랜더링하고 오디오 파일을 재생하는 작업을 한다.

**MIME 타입 예시**

```
Content-type: image/jpeg
Content-length: 12984
```

MIME는 `주타입/부타입`으로 구성되는데 예를들면 아래와 같다.

-   HTML로 작성된 텍스트 문서 **text/html**
-   plain ASCII 텍스트 문서 **text/plain**
-   JPEG 이미지 **image/jpeg**
-   GIF 이미지 **image/gif**

## URI

웹 서버에서 리소스 각자는 이름을 갖고 있다. 따라서 클라이언트는 원하는 리소스를 선택할 수 있다. 서버 리소스 이름은 URI(uniform resource identifier, 통합 자원 식별자)로 불린다.

> **예시**  
> 죠의 컴퓨터 가게 서버에 있는 GIF 형식의 그림 리소스에 대한 URI  
> `http://www.joes-hardware.com/specials/saw-blade.gif`

1. HTTP 프로토콜을 사용하라.
2. www.joes-hardware.com으로 이동하라.
3. /specials/saw-blade.gif 리소스를 가져와라.

이 URI는 URL, URN으로 나뉘는데 URL은 URI의 가장 흔한 형태로 리소스가 정확히 어디에 있고 어떻게 접근할 수 있는지 분명하게 알려준다.

> 예시  
> | URL | 설명|
> |---|---|
> | http://www.oreilly.com/index.html| 오라일리 출판사 홈페이지 URL
> |http://www.yahoo.com/images/logo.gif | 야후! 웹 사이트로고 URL
> |http://www.joes-hardware.com/inventory-check.cgi?item=12732 | 물품 #12732의 재고가 있는지 확인하는 프로그램에 대한 URL
> |ftp://joe:tools4u@ftp.jose-hardware.com/locking-pliers.gif | 비밀번호로 보호되는 FTP를 통해 locking-pliers.gif 이미지 파일에 접근하는 URL

오늘날 대부분의 URI는 URL이다.

URN은 콘텐츠를 이루는 한 리소스에 대해 그 리소스의 위치와 상관 없이 독립적인 URN으로 접근할 수 있는 유일한 이름이다.

```
urn:ietf:rfc:2141
```

위 URN은 인터넷 표준 문서 `RFC 2141`이 어디에 있거나 상관 없이(여러 군데에 복사된 게 있어도) 정확히 지칭할 수 있다.

URN은 아직 실험단계에 있으며 보통 URI와 URL의 같은 뜻으로 쓴다.

## 트랜잭션

HTTP 트랜잭션은 요청 명령과 응답 결과로 이루어져 있다.

### 메서드

HTTP는 HTTP 메서드라고 불리는 여러 요청 명령을 지원한느데 모든 HTTP 요청 메시지는 한 개의 메서드를 갖는다.

> **HTTP 메서드 예시**
> | HTTP 메서드 | 설명 |
> | ----------- | -------------------------------------------------------------------- |
> | GET | 서버에서 클라이언트로 지정한 리소스를 보내라. |
> | PUT | 클라이언트에서 서버로 보낸 데이터를 지정한 이름의 리소스로 저장하라. |
> | DELETE | 지정한 리소스를 서버에서 삭제하라. |
> | POST | 클라이언트 데이터를 서버 게이트웨이 애플리케이션으로 보내라. |
> | HEAD | 지정한 리소스에 대한 응답에서, HTTP 헤더 부분만 보내라. |

### 상태 코드

모든 HTTP 응답 메시지는 상태 코드와 함께 반환된다. 이는 클라이언트에게 요청 성공 혹은 추가 조치가 필요한지 알려주는 세 자리 숫자다.

> **HTTP 상태 코드 예시**
> | HTTP 상태코드| 설명|
> |-|-|
> |200|좋다. 문서가 바르게 반환되었다.
> |302| 다시 보내라. 다른 곳에 가서 리소스를 가져가라.
> |404|없음. 리소스를 찾을 수 없다.

## 웹 페이지는 여러 객체로 이루어질 수 있다.

웹 페이지는 보통 여러 HTTP 트랜잭션을 수행하는데 웹 페이지의 뼈대인 HTML을 한 번의 트랜잭션으로 가져온 여러 이미지, JS, CSS 파일 등을 가져오기 위해 추가로 HTTP 트랜잭션을 수행한다.

## 메시지

HTTP 요청과 응답 메시지는 사람이 읽고 쓰기 쉬운 일반 텍스트로 쓰인다.

> HTTP 메시지 예시
> |요청 메시지 | | 응답 메시지|
> | -| -| -|
> |GET /test/hi/there.txt HTTP/1.0 | 시작줄 |HTTP/1.0 200 OK |
> |Accept: text/\*<br>Accept-Language: en,fr | 헤더 | Content-type: text/plain<br>Contetn-length: 19 <br><br> |
> || 본문| Hi! I'm a message!

-   **시작줄**  
    요청이라면 무엇을 해야 하는지 응답이라면 무슨 일이 일어났는지 나타낸다.

-   **헤더**  
     헤더에는 0개 이상의 헤더 필드가 들어가는데 각 필드는 `:`로 구분되는 키, 값 쌍으로 구성된다. 헤더 마지막은 빈 줄로 끝난다.

-   **본문**  
    어떤 종류의 데이터든 들어갈 수 있다. 요청의 본문은 웹 서버로 데이터를 실어보내며 응답의 본문은 클라이언트로 데이터를 반환한다. 본문은 이진 데이터(이미지, 비디오, 오디오 등)가 들어갈 수 있고 일반 텍스트도 들어갈 수 있다.

## TCP 커넥션

HTTP 메시지는 어떻게 한 곳에서 다른 한 곳으로 올겨갈까?

### TCP/IP

HTTP는 네트워크 통신의 핵심적인 세부사항에 대해서 신경쓰지 않고 TCP/IP에게 맡긴다. 여기서 TCP는 다음을 제공한다.

-   오류 없는 데이터 전송
-   순서에 맞는 전달
-   조각나지 않는 데이터 스트림

사실 인터넷 자체가 전 세계의 컴퓨터와 네트워크 장치 사이에 대중적으로 사용되는 TCP/IP에 기초하고 있다.

### 접속, IP주소 그리고 포트번호

HTTP 클라이언트가 서버에 메시지를 전송하려면 IP 주소, 포트번호를 사용해 서버와 TCP/IP 커넥션을 맺어야 한다. IP 주소와 포트번호를 어떻게 알 수 있을까?

```
http://207.200.83.29:80/index.html
http://www.netscape:80/index.html
http://www.netscape/index.html
```

위 세 주소는 똑같은 서버로 HTTP 요청을 보낸다. 도메인은 DNS를 통해 IP 주소로 변환한다. 또한 포트 번호의 경우 생략하면 기본값 80으로 된다. 따라서 우리는 이해하기 쉬운 도메인으로 서버로 HTTP 메시지를 보낼 수 있는 것.

## 프로토콜 버전

**HTTP/0.9**  
이 프로토콜은 심각한 결함이 있으며 오직 GET 메서드만 지원한다. 원래는 간단한 HTML 객체를 받기 위해 만들어진 것. 금방 HTTP/1.0으로 대체되었다.

**HTTP/1.0**  
HTTP 헤더, 추가 메서드, 멀티미디어 객체 처리를 추가했다. 그러나 아직 잘 정의된 명세가 아니다.

**HTTP/1.0+**  
월드 와이드 웹이 급격하게 팽장함에 따라 수요에 맞춰 keep-alive 커넥션, 가상 호스팅 지원, 프락시 연결 지원 등 많은 기능을 추가했다.

**HTTP/1.1**  
구조적 결함 교정, 성능 최적화, 잘못된 기능이 제거된 버전. 이것이 지금 현재 쓰이고 있는 버전

**HTTP/2.0**
2015년에 발표된 버전으로 중복 헤더 제거, 헤더 압축 등의 기능이 추가되었다.

**HTTP/3.0**
2022년에 발표된 버전으로 Zero RTT(Round Trip Time), 패킷 손실에 대한 빠른 대응, 바뀌는 사용자 IP에 대한 대응이 추가되었다.

## 웹의 구성요소

### 프락시

클라이언트와 서버 사이에 위치하여 클라이언트의 모든 HTTP 요청을 받아 서버로 전달한다. 이때 프락시는 주로 보안을 위해 사용되고 요청과 응답을 필터링 하기도 한다. 예를들면 초등학교 학생들에게서 성인 콘텐츠를 차단하는 등.

### 캐시

웹캐시와 캐시 프락시는 자신을 거쳐가는 문서 중 자주 찾는 것의 복사본을 저장해두고 다음에 같은 요청이 오면 캐시가 갖고 있는 복사본을 받을 수 있게 해준다. 따라서 더 빨리 문서를 받을 수 있다.

### 게이트웨이

HTTP 트래픽을 다른 프로토콜로 변환하기 위해 사용된다. 예를 들어 HTTP/FTP 게이트웨이는 클라이언트로부터 HTTP 요청을 받은 후 FTP를 이용해 문서를 가져올 수 있다.

### 터널

두 커넥션 사이에서 raw 데이터를 열지 않고 그대로 전달해주는 HTTP 애플리케이션. 주로 비 HTTP 데이터를 하나 이상의 HTTP 연결을 통해 그대로 전송해주기 위해 사용한다.

### 에이전트

사용자를 위해 HTTP 요청을 만들어주는 클라이언트 프로그램으로 기본적으로 우리가 쓰는 웹브라우저가 있다. 그 외에도 스파이더, 웹로봇, 웹크롤러로 불리는 자동화 에이전트도 있다.
