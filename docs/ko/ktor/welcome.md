---
aside: false
---
<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="환영합니다"
       id="welcome">
    <section-starting-page>
        <title>Ktor 문서</title>
        <description>
            Ktor는 비동기 서버 측 및 클라이언트 측 애플리케이션을 손쉽게 구축하기 위한 프레임워크입니다.
        </description>
        <spotlight>
            <card href="/ktor/server-create-a-new-project" summary="Ktor로 서버 애플리케이션을 생성, 실행 및 테스트하는 방법을 알아보세요.">
                Ktor 서버 시작하기
            </card>
            <card href="/ktor/client-create-new-application" summary="Ktor로 클라이언트 애플리케이션을 생성, 실행 및 테스트하는 방법을 알아보세요.">
                Ktor 클라이언트 시작하기
            </card>
        </spotlight>
        <primary>
            <title>Ktor 서버</title>
            <card href="/ktor/server-requests-and-responses" summary="작업 관리자 애플리케이션을 생성하여 Ktor에서 라우팅 및 요청이 어떻게 작동하는지 알아보세요.">
                요청 처리 및 응답 생성
            </card>
            <card href="/ktor/server-create-restful-apis" summary="Ktor로 RESTful API를 구축하는 방법을 알아보세요. 이 튜토리얼은 실제 예제를 통해 설정, 라우팅 및 테스트를 다룹니다.">RESTful API 생성</card>
            <card href="/ktor/server-create-website" summary="Ktor 및 Thymeleaf 템플릿을 사용하여 Kotlin으로 웹사이트를 구축하는 방법을 알아보세요.">웹사이트 생성</card>
            <card href="/ktor/server-create-websocket-application" summary="WebSocket의 강력한 기능을 활용하여 콘텐츠를 송수신하는 방법을 알아보세요.">
                WebSocket 애플리케이션 생성
            </card>
            <card href="/ktor/server-integrate-database" summary="Exposed SQL 라이브러리를 사용하여 Ktor 서비스를 데이터베이스 리포지토리에 연결하는 과정을 알아보세요.">데이터베이스 통합</card>
        </primary>
        <misc>
            <links narrow="true">
                <group>
                    <title>서버 구성</title>
                    <Links href="/ktor/server-create-a-new-project" summary="Ktor로 서버 애플리케이션을 열고, 실행하고, 테스트하는 방법을 알아보세요.">새 Ktor 프로젝트 생성, 열기 및 실행</Links>
                    <Links href="/ktor/server-dependencies" summary="기존 Gradle/Maven 프로젝트에 Ktor 서버 종속성을 추가하는 방법을 알아보세요.">서버 종속성 추가</Links>
                    <Links href="/ktor/server-create-and-configure" summary="애플리케이션 배포 요구사항에 따라 서버를 생성하는 방법을 알아보세요.">서버 생성</Links>
                    <Links href="/ktor/server-configuration-code" summary="코드에서 다양한 서버 매개변수를 구성하는 방법을 알아보세요.">코드에서 구성</Links>
                    <Links href="/ktor/server-configuration-file" summary="구성 파일에서 다양한 서버 매개변수를 구성하는 방법을 알아보세요.">파일에서 구성</Links>
                    <Links href="/ktor/server-plugins" summary="플러그인은 직렬화, 콘텐츠 인코딩, 압축 등과 같은 일반적인 기능을 제공합니다.">서버 플러그인</Links>
                </group>
                <group>
                    <title>라우팅</title>
                    <Links href="/ktor/server-routing" summary="라우팅은 서버 애플리케이션에서 수신 요청을 처리하기 위한 핵심 플러그인입니다.">라우팅</Links>
                    <Links href="/ktor/server-resources" summary="Resources 플러그인을 사용하면 타입-안전 라우팅을 구현할 수 있습니다.">타입-안전 라우팅</Links>
                    <Links href="/ktor/server-application-structure" summary="애플리케이션이 성장함에 따라 유지 관리할 수 있도록 애플리케이션을 구성하는 방법을 알아보세요.">애플리케이션 구조</Links>
                    <Links href="/ktor/server-requests" summary="경로 핸들러 내에서 수신 요청을 처리하는 방법을 알아보세요.">요청 처리</Links>
                    <Links href="/ktor/server-responses" summary="다양한 유형의 응답을 보내는 방법을 알아보세요.">응답 전송</Links>
                    <Links href="/ktor/server-static-content" summary="스타일시트, 스크립트, 이미지 등과 같은 정적 콘텐츠를 제공하는 방법을 알아보세요.">정적 콘텐츠 제공</Links>
                </group>
                <group>
                    <title>플러그인</title>
                    <Links href="/ktor/server-serialization" summary="ContentNegotiation 플러그인은 두 가지 주요 목적을 가집니다: 클라이언트와 서버 간의 미디어 타입 협상 및 특정 형식으로 콘텐츠 직렬화/역직렬화.">Ktor 서버의 콘텐츠 협상 및 직렬화</Links>
                    <Links href="/ktor/server-templating" summary="HTML/CSS 또는 JVM 템플릿 엔진으로 빌드된 뷰를 사용하는 방법을 알아보세요.">템플릿</Links>
                    <Links href="/ktor/server-auth" summary="Authentication 플러그인은 Ktor에서 인증 및 권한 부여를 처리합니다.">Ktor 서버의 인증 및 권한 부여</Links>
                    <Links href="/ktor/server-sessions" summary="Sessions 플러그인은 다른 HTTP 요청 간에 데이터를 유지하는 메커니즘을 제공합니다.">세션</Links>
                    <Links href="/ktor/server-websockets" summary="Websockets 플러그인을 사용하면 서버와 클라이언트 간에 다방향 통신 세션을 생성할 수 있습니다.">Ktor 서버의 WebSocket</Links>
                    <Links href="/ktor/server-server-sent-events" summary="SSE 플러그인을 사용하면 서버가 HTTP 연결을 통해 클라이언트에 이벤트 기반 업데이트를 보낼 수 있습니다.">Ktor 서버의 Server-Sent Events</Links>
                    <Links href="/ktor/server-swagger-ui" summary="SwaggerUI 플러그인을 사용하면 프로젝트에 대한 Swagger UI를 생성할 수 있습니다.">Swagger UI</Links> / <Links href="/ktor/server-openapi" summary="OpenAPI 플러그인을 사용하면 프로젝트에 대한 OpenAPI 문서를 생성할 수 있습니다.">OpenAPI</Links>
                    <Links href="/ktor/server-custom-plugins" summary="사용자 지정 플러그인을 생성하는 방법을 알아보세요.">사용자 지정 서버 플러그인</Links>
                </group>
                <group>
                    <title>실행, 디버그 및 테스트</title>
                    <Links href="/ktor/server-run" summary="서버 Ktor 애플리케이션을 실행하는 방법을 알아보세요.">실행</Links>
                    <Links href="/ktor/server-auto-reload" summary="코드 변경 시 애플리케이션 클래스를 다시 로드하는 자동 새로고침을 사용하는 방법을 알아보세요.">자동 새로고침</Links>
                    <Links href="/ktor/server-testing" summary="특수 테스트 엔진을 사용하여 서버 애플리케이션을 테스트하는 방법을 알아보세요.">Ktor 서버 테스트</Links>
                </group>
                <group>
                    <title>배포</title>
                    <Links href="/ktor/server-fatjar" summary="Ktor Gradle 플러그인을 사용하여 실행 가능한 Fat JAR를 생성하고 실행하는 방법을 알아보세요.">Fat JAR 생성</Links>
                    <Links href="/ktor/server-war" summary="WAR 아카이브를 사용하여 서블릿 컨테이너 내에서 Ktor 애플리케이션을 실행하고 배포하는 방법을 알아보세요.">WAR</Links>
                    <Links href="/ktor/graalvm" summary="다양한 플랫폼에서 네이티브 이미지에 GraalVM을 사용하는 방법을 알아보세요.">GraalVM</Links>
                    <Links href="/ktor/docker" summary="애플리케이션을 Docker 컨테이너에 배포하는 방법을 알아보세요.">Docker</Links>
                    <Links href="/ktor/google-app-engine" summary="Google App Engine 표준 환경에 프로젝트를 배포하는 방법을 알아보세요.">Google App Engine</Links>
                    <Links href="/ktor/heroku" summary="Ktor 애플리케이션을 Heroku에 준비하고 배포하는 방법을 알아보세요.">Heroku</Links>
                </group>
            </links>
            <cards>
                <title>Ktor 클라이언트</title>
                <card href="/ktor/client-create-new-application" summary="Ktor로 클라이언트 애플리케이션을 생성합니다.">
                    클라이언트 애플리케이션 생성
                </card>
                <card href="/ktor/client-create-multiplatform-application" summary="Kotlin Multiplatform Mobile 애플리케이션을 생성하고 Ktor 클라이언트를 사용하여 요청하고 응답을 받는 방법을 알아보세요.">
                    크로스 플랫폼 모바일 애플리케이션 생성
                </card>
            </cards>
            <links narrow="true">
                <group>
                    <title>클라이언트 설정</title>
                    <Links href="/ktor/client-create-new-application" summary="첫 번째 클라이언트 애플리케이션을 생성하여 요청을 보내고 응답을 받으세요.">클라이언트 애플리케이션 생성</Links>
                    <Links href="/ktor/client-dependencies" summary="기존 프로젝트에 클라이언트 종속성을 추가하는 방법을 알아보세요.">클라이언트 종속성 추가</Links>
                    <Links href="/ktor/client-create-and-configure" summary="Ktor 클라이언트를 생성하고 구성하는 방법을 알아보세요.">클라이언트 생성 및 구성</Links>
                    <Links href="/ktor/client-engines" summary="네트워크 요청을 처리하는 엔진에 대해 알아보세요.">클라이언트 엔진</Links>
                    <Links href="/ktor/client-plugins" summary="로깅, 직렬화, 권한 부여 등과 같은 일반적인 기능을 제공하는 플러그인에 대해 알아보세요.">클라이언트 플러그인</Links>
                </group>
                <group>
                    <title>요청</title>
                    <Links href="/ktor/client-requests" summary="요청을 만들고 다양한 요청 매개변수(요청 URL, HTTP 메서드, 헤더 및 요청 본문)를 지정하는 방법을 알아보세요.">요청 보내기</Links>
                    <Links href="/ktor/client-resources" summary="Resources 플러그인을 사용하여 타입-안전 요청을 만드는 방법을 알아보세요.">타입-안전 요청</Links>
                    <Links href="/ktor/client-default-request" summary="DefaultRequest 플러그인을 사용하면 모든 요청에 대한 기본 매개변수를 구성할 수 있습니다.">기본 요청</Links>
                    <Links href="/ktor/client-request-retry" summary="HttpRequestRetry 플러그인을 사용하면 실패한 요청에 대한 재시도 정책을 구성할 수 있습니다.">실패한 요청 재시도</Links>
                </group>
                <group>
                    <title>응답</title>
                    <Links href="/ktor/client-responses" summary="응답을 받고, 응답 본문을 가져오고, 응답 매개변수를 얻는 방법을 알아보세요.">응답 수신</Links>
                    <Links href="/ktor/client-response-validation" summary="상태 코드에 따라 응답의 유효성을 검사하는 방법을 알아보세요.">응답 유효성 검사</Links>
                </group>
                <group>
                    <title>플러그인</title>
                    <Links href="/ktor/client-auth" summary="Auth 플러그인은 클라이언트 애플리케이션에서 인증 및 권한 부여를 처리합니다.">Ktor 클라이언트의 인증 및 권한 부여</Links>
                    <Links href="/ktor/client-cookies" summary="HttpCookies 플러그인은 쿠키를 자동으로 처리하고 저장소에서 호출 간에 쿠키를 유지합니다.">쿠키</Links>
                    <Links href="/ktor/client-content-encoding" summary="ContentEncoding 플러그인을 사용하면 지정된 압축 알고리즘(예: 'gzip' 및 'deflate')을 활성화하고 해당 설정을 구성할 수 있습니다.">콘텐츠 인코딩</Links>
                    <Links href="/ktor/client-bom-remover" summary="BOMRemover 플러그인을 사용하면 응답 본문에서 BOM(Byte Order Mark)을 제거할 수 있습니다.">BOM 제거</Links>
                    <Links href="/ktor/client-caching" summary="HttpCache 플러그인을 사용하면 이전에 가져온 리소스를 메모리 또는 영구 캐시에 저장할 수 있습니다.">캐싱</Links>
                    <Links href="/ktor/client-websockets" summary="Websockets 플러그인을 사용하면 서버와 클라이언트 간에 다방향 통신 세션을 생성할 수 있습니다.">Ktor 클라이언트의 WebSocket</Links>
                    <Links href="/ktor/client-server-sent-events" summary="SSE 플러그인을 사용하면 클라이언트가 HTTP 연결을 통해 서버로부터 이벤트 기반 업데이트를 받을 수 있습니다.">Ktor 클라이언트의 Server-Sent Events</Links>
                    <Links href="/ktor/client-custom-plugins" summary="사용자 지정 클라이언트 플러그인을 생성하는 방법을 알아보세요.">사용자 지정 클라이언트 플러그인</Links>
                </group>
                <group>
                    <title>테스트</title>
                    <Links href="/ktor/client-testing" summary="MockEngine을 사용하여 HTTP 호출을 시뮬레이션함으로써 클라이언트를 테스트하는 방법을 알아보세요.">Ktor 클라이언트 테스트</Links>
                </group>
            </links>
            <cards>
                <title>통합</title>
                <card href="/ktor//ktor/full-stack-development-with-kotlin-multiplatform" summary="Kotlin 및 Ktor로 크로스 플랫폼 풀스택 애플리케이션을 개발하는 방법을 알아보세요.">Kotlin Multiplatform로 풀스택 애플리케이션 구축</card>
                <card href="/ktor//ktor/tutorial-first-steps-with-kotlin-rpc" summary="Kotlin RPC 및 Ktor로 첫 번째 애플리케이션을 생성하는 방법을 알아보세요.">Kotlin RPC 시작하기</card>
            </cards>
        </misc>
    </section-starting-page>
</topic>