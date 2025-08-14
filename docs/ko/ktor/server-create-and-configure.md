<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="서버 생성하기"
       id="server-create-and-configure" help-id="start_server;create_server">
    <show-structure for="chapter" depth="2"/>
    <tldr>
        <p>
            <b>코드 예시</b>:
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server">embedded-server</a>,
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">engine-main</a>,
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-yaml">engine-main-yaml</a>
        </p>
    </tldr>
    <link-summary>
        애플리케이션 배포 요구 사항에 따라 서버를 생성하는 방법을 알아보세요.
    </link-summary>
    <p>
        Ktor 애플리케이션을 생성하기 전에 애플리케이션이
        <Links href="/ktor/server-deployment" summary="코드 예시:
            %example_name%">
            배포되는지
        </Links>
        고려해야 합니다:
    </p>
    <list>
        <li>
            <p>
                <control><a href="#embedded">자체 포함 패키지</a></control>로
            </p>
            <p>
                이 경우, 네트워크 요청을 처리하는 애플리케이션 <Links href="/ktor/server-engines" summary="네트워크 요청을 처리하는 엔진에 대해 알아보세요.">엔진</Links>이 애플리케이션의 일부여야 합니다.
                애플리케이션이 엔진 설정, 연결 및 SSL 옵션을 제어합니다.
            </p>
        </li>
        <li>
            <p>
                <control>
                    <a href="#servlet">서블릿</a>
                </control>으로
            </p>
            <p>
                이 경우, Ktor 애플리케이션은 서블릿 컨테이너(예: Tomcat 또는 Jetty) 내부에 배포될 수 있으며, 서블릿 컨테이너가 애플리케이션 수명 주기 및 연결 설정을 제어합니다.
            </p>
        </li>
    </list>
    <chapter title="자체 포함 패키지" id="embedded">
        <p>
            Ktor 서버 애플리케이션을 자체 포함 패키지로 제공하려면 먼저 서버를 생성해야 합니다.
            서버 구성에는 다양한 설정(Netty, Jetty 등과 같은 서버 <Links href="/ktor/server-engines" summary="네트워크 요청을 처리하는 엔진에 대해 알아보세요.">엔진</Links>), 다양한 엔진별 옵션, 호스트 및 포트 값 등이 포함될 수 있습니다.
            Ktor에서 서버를 생성하고 실행하는 두 가지 주요 접근 방식이 있습니다:
        </p>
        <list>
            <li>
                <p>
                    <code>embeddedServer</code> 함수는 <a href="#embedded-server">
                        코드에서 서버 매개변수를 구성
                    </a>하고 애플리케이션을 빠르게 실행하는 간단한 방법입니다.
                </p>
            </li>
            <li>
                <p>
                    <code>EngineMain</code>은 서버를 구성하는 데 더 많은 유연성을 제공합니다. 애플리케이션을 다시 컴파일하지 않고도 <a href="#engine-main">
                        파일에 서버 매개변수를 지정
                    </a>하고 구성을 변경할 수 있습니다. 또한, 명령줄에서 애플리케이션을 실행하고 해당 명령줄 인수를 전달하여 필요한 서버 매개변수를 재정의할 수 있습니다.
                </p>
            </li>
        </list>
        <chapter title="코드에서 구성" id="embedded-server">
            <p>
                <code>embeddedServer</code> 함수는 <Links href="/ktor/server-configuration-code" summary="코드에서 다양한 서버 매개변수를 구성하는 방법을 알아보세요.">코드</Links>에서 서버 매개변수를 구성하고 애플리케이션을 빠르게 실행하는 간단한 방법입니다. 아래 코드 스니펫에서 이 함수는 서버를 시작하기 위한 매개변수로 <Links href="/ktor/server-engines" summary="네트워크 요청을 처리하는 엔진에 대해 알아보세요.">엔진</Links>과 포트를 받습니다. 아래 예시에서는 <code>Netty</code> 엔진으로 서버를 실행하고 <code>8080</code> 포트에서 수신 대기합니다:
            </p>
            [object Promise]
            <p>
                전체 예시는 <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server">
                    embedded-server
                </a>를 참조하세요.
            </p>
        </chapter>
        <chapter title="파일에서 구성" id="engine-main">
            <p>
                <code>EngineMain</code>은 선택된 엔진으로 서버를 시작하고 <Path>resources</Path> 디렉터리에 있는 외부 <Links href="/ktor/server-configuration-file" summary="구성 파일에서 다양한 서버 매개변수를 구성하는 방법을 알아보세요.">구성 파일</Links> (<Path>application.conf</Path> 또는 <Path>application.yaml</Path>)에 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">애플리케이션 모듈</Links>을 로드합니다. 로드할 모듈 외에도 구성 파일에는 다양한 서버 매개변수(아래 예시의 <code>8080</code> 포트)가 포함될 수 있습니다.
            </p>
            <tabs>
                <tab title="Application.kt" id="application-kt">
                    [object Promise]
                </tab>
                <tab title="application.conf" id="application-conf">
                    [object Promise]
                </tab>
                <tab title="application.yaml" id="application-yaml">
                    [object Promise]
                </tab>
            </tabs>
            <p>
                전체 예시는 <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">
                    engine-main
                </a> 및
                <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-yaml">
                    engine-main-yaml
                </a>을 참조하세요.
            </p>
        </chapter>
    </chapter>
    <chapter title="서블릿" id="servlet">
        <p>
            Ktor 애플리케이션은 Tomcat 및 Jetty를 포함하는 서블릿 컨테이너 내부에서 실행하고 배포할 수 있습니다.
            서블릿 컨테이너 내부에 배포하려면 <Links href="/ktor/server-war" summary="WAR 아카이브를 사용하여 Ktor 애플리케이션을 서블릿 컨테이너 내에서 실행하고 배포하는 방법을 알아보세요.">WAR</Links> 아카이브를 생성한 다음 WAR를 지원하는 서버 또는 클라우드 서비스에 배포해야 합니다.
        </p>
    </chapter>
</topic>