<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="파일을 통한 설정"
       id="server-configuration-file" help-id="Configuration-file;server-configuration-in-file">
<show-structure for="chapter" depth="2"/>
<link-summary>
        설정 파일을 사용하여 다양한 서버 매개변수를 구성하는 방법을 알아보세요.
</link-summary>
<p>
        Ktor를 사용하면 호스트 주소 및 포트, <Links href="/ktor/server-modules" summary="모듈을 통해 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links> 로드 등 다양한 서버 매개변수를 구성할 수 있습니다.
        설정은 서버를 생성하는 데 사용한 방식에 따라 달라집니다 -
        <Links href="/ktor/server-create-and-configure" summary="애플리케이션 배포 요구사항에 따라 서버를 생성하는 방법을 알아보세요.">
            embeddedServer 또는 EngineMain
        </Links>
        .
</p>
<p>
        <code>EngineMain</code>의 경우, Ktor는
        <a href="https://github.com/lightbend/config/blob/master/HOCON.md">
            HOCON
        </a>
        또는 YAML 형식을 사용하는 설정 파일에서 구성을 로드합니다. 이 방식은 서버를 구성하는 데 더 많은 유연성을 제공하며, 애플리케이션을 재컴파일하지 않고도 구성을 변경할 수 있도록 합니다. 또한, 명령줄에서 애플리케이션을 실행하고 해당
        <a href="#command-line">
            명령줄
        </a>
        인수를 전달하여 필요한 서버 매개변수를 재정의할 수 있습니다.
</p>
<chapter title="개요" id="configuration-file-overview">
        <p>
            서버를 시작하기 위해
            <a href="#engine-main">
                EngineMain
            </a>
            을 사용하는 경우, Ktor는
            <Path>resources</Path>
            디렉터리에 있는
            <Path>application.*</Path>
            이라는 파일에서 설정 구성을 자동으로 로드합니다. 두 가지 구성 형식이 지원됩니다:
        </p>
        <list>
            <li>
                <p>
                    HOCON (
                    <Path>application.conf</Path>
                    )
                </p>
            </li>
            <li>
                <p>
                    YAML (
                    <Path>application.yaml</Path>
                    )
                </p>
                <note>
                    <p>
                        YAML 설정 파일을 사용하려면, <code>ktor-server-config-yaml</code>
                        <Links href="/ktor/server-dependencies" summary="기존 Gradle/Maven 프로젝트에 Ktor 서버 종속성을 추가하는 방법을 알아보세요.">
                            종속성
                        </Links>
                        을 추가해야 합니다.
                    </p>
                </note>
            </li>
        </list>
        <p>
            설정 파일에는 최소한
            <Links href="/ktor/server-modules" summary="모듈을 통해 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">
                로드할 모듈
            </Links>
            이 <code>ktor.application.modules</code> 속성을 사용하여 지정되어야 합니다. 예를 들어:
        </p>
        <tabs group="config">
            <tab title="application.conf" group-key="hocon" id="application-conf-2">
                [object Promise]
            </tab>
            <tab title="application.yaml" group-key="yaml" id="application-yaml-2">
                [object Promise]
            </tab>
        </tabs>
        <p>
            이 경우 Ktor는 아래
            <Path>Application.kt</Path>
            파일에서 <code>Application.module</code> 함수를 호출합니다:
        </p>
        [object Promise]
        <p>
            로드할 모듈 외에도,
            <a href="#predefined-properties">미리 정의된</a>
            (포트 또는 호스트, SSL 설정 등) 설정과 사용자 정의 설정을 포함한 다양한 서버 설정을 구성할 수 있습니다.
            몇 가지 예시를 살펴보겠습니다.
        </p>
        <chapter title="기본 설정" id="config-basic">
            <p>
                아래 예시에서는 <code>ktor.deployment.port</code> 속성을 사용하여 서버 수신 포트가 <code>8080</code>으로 설정됩니다.
            </p>
            <tabs group="config">
                <tab title="application.conf" group-key="hocon" id="application-conf-3">
                    [object Promise]
                </tab>
                <tab title="application.yaml" group-key="yaml" id="application-yaml-3">
                    [object Promise]
                </tab>
            </tabs>
        </chapter>
        <chapter title="엔진 설정" id="config-engine">
            <snippet id="engine-main-configuration">
                <p>
                    <code>EngineMain</code>을 사용하는 경우, <code>ktor.deployment</code> 그룹 내에서 모든 엔진에 공통적인 옵션을 지정할 수 있습니다.
                </p>
                <tabs group="config">
                    <tab title="application.conf" group-key="hocon" id="engine-main-conf">
                        [object Promise]
                    </tab>
                    <tab title="application.yaml" group-key="yaml" id="engine-main-yaml">
                        [object Promise]
                    </tab>
                </tabs>
                <chapter title="Netty" id="netty-file">
                    <p>
                        <code>ktor.deployment</code> 그룹 내의 설정 파일에서 Netty 관련 옵션을 구성할 수도 있습니다:
                    </p>
                    <tabs group="config">
                        <tab title="application.conf" group-key="hocon" id="application-conf-1">
                            [object Promise]
                        </tab>
                        <tab title="application.yaml" group-key="yaml" id="application-yaml-1">
                            [object Promise]
                        </tab>
                    </tabs>
                </chapter>
            </snippet>
        </chapter>
        <chapter title="SSL 설정" id="config-ssl">
            <p>
                아래 예시는 Ktor가 <code>8443</code> SSL 포트에서 수신하도록 허용하고, 별도의 <code>security</code> 블록에 필요한
                <Links href="/ktor/server-ssl" summary="필수 종속성: io.ktor:ktor-network-tls-certificates 코드 예시: ssl-engine-main, ssl-embedded-server">
                    SSL 설정
                </Links>
                을 지정합니다.
            </p>
            <tabs group="config">
                <tab title="application.conf" group-key="hocon" id="application-conf">
                    [object Promise]
                </tab>
                <tab title="application.yaml" group-key="yaml" id="application-yaml">
                    [object Promise]
                </tab>
            </tabs>
        </chapter>
        <chapter title="사용자 정의 설정" id="config-custom">
            <p>
                <a href="#predefined-properties">미리 정의된 속성</a>을 지정하는 것 외에도, Ktor를 사용하면 설정 파일에 사용자 정의 설정을 유지할 수 있습니다.
                아래 설정 파일에는 <a href="#jwt-settings">JWT</a> 설정을 유지하는 데 사용되는 사용자 정의 <code>jwt</code> 그룹이 포함되어 있습니다.
            </p>
            <tabs group="config">
                <tab title="application.conf" group-key="hocon" id="application-conf-4">
                    [object Promise]
                </tab>
                <tab title="application.yaml" group-key="yaml" id="application-yaml-4">
                    [object Promise]
                </tab>
            </tabs>
            <p>
                코드에서 <a href="#read-configuration-in-code">이러한 설정을 읽고 처리</a>할 수 있습니다.
            </p>
            <warning>
                <p>
                    비밀 키, 데이터베이스 연결 설정 등과 같은 민감한 데이터는 설정 파일에 일반 텍스트로 저장해서는 안 됩니다.
                    이러한 매개변수를 지정하려면
                    <a href="#environment-variables">
                        환경 변수
                    </a>
                    를 사용하는 것을 고려해 보세요.
                </p>
            </warning>
        </chapter>
    </chapter>
    <chapter title="미리 정의된 속성" id="predefined-properties">
        <p>
            아래는
            <a href="#configuration-file-overview">
                설정 파일
            </a>
            내에서 사용할 수 있는 미리 정의된 설정 목록입니다.
        </p>
        <deflist type="wide">
            <def title="ktor.deployment.host" id="ktor-deployment-host">
                <p>
                    호스트 주소.
                </p>
                <p>
                    <emphasis>예시</emphasis>
                    : <code>0.0.0.0</code>
                </p>
            </def>
            <def title="ktor.deployment.port" id="ktor-deployment-port">
                <p>
                    수신 포트. 이 속성을 <code>0</code>으로 설정하여 서버를 임의의 포트에서 실행할 수 있습니다.
                </p>
                <p>
                    <emphasis>예시</emphasis>
                    : <code>8080</code>, <code>0</code>
                </p>
            </def>
            <def title="ktor.deployment.sslPort" id="ktor-deployment-ssl-port">
                <p>
                    수신 SSL 포트. 이 속성을 <code>0</code>으로 설정하여 서버를 임의의 포트에서 실행할 수 있습니다.
                </p>
                <p>
                    <emphasis>예시</emphasis>
                    : <code>8443</code>, <code>0</code>
                </p>
                <note>
                    <p>
                        SSL에는 <a href="#ssl">아래에 나열된</a> 추가 옵션이 필요합니다.
                    </p>
                </note>
            </def>
            <def title="ktor.deployment.watch" id="ktor-deployment-watch">
                <p>
                    <a href="#watch-paths">자동 재로드</a>에 사용되는 감시 경로.
                </p>
            </def>
            <def title="ktor.deployment.rootPath" id="ktor-deployment-root-path">
                <p>
                    <Links href="/ktor/server-war" summary="WAR 아카이브를 사용하여 서블릿 컨테이너 내에서 Ktor 애플리케이션을 실행하고 배포하는 방법을 알아보세요.">서블릿</Links> 컨텍스트 경로.
                </p>
                <p>
                    <emphasis>예시</emphasis>
                    : <code>/</code>
                </p>
            </def>
            <def title="ktor.deployment.shutdown.url" id="ktor-deployment-shutdown-url">
                <p>
                    종료 URL.
                    이 옵션은 <Links href="/ktor/server-shutdown-url" summary="코드 예시: %example_name%">종료 URL</Links> 플러그인을 사용합니다.
                </p>
            </def>
            <def title="ktor.deployment.shutdownGracePeriod" id="ktor-deployment-shutdown-grace-period">
                <p>
                    서버가 새 요청 수신을 중단하는 최대 시간(밀리초).
                </p>
            </def>
            <def title="ktor.deployment.shutdownTimeout" id="ktor-deployment-shutdown-timeout">
                <p>
                    서버가 완전히 중지될 때까지 기다리는 최대 시간(밀리초).
                </p>
            </def>
            <def title="ktor.deployment.callGroupSize" id="ktor-deployment-call-group-size">
                <p>
                    애플리케이션 호출을 처리하는 데 사용되는 스레드 풀의 최소 크기.
                </p>
            </def>
            <def title="ktor.deployment.connectionGroupSize" id="ktor-deployment-connection-group-size">
                <p>
                    새 연결을 수락하고 호출 처리를 시작하는 데 사용되는 스레드 수.
                </p>
            </def>
            <def title="ktor.deployment.workerGroupSize" id="ktor-deployment-worker-group-size">
                <p>
                    연결 처리, 메시지 파싱 및 엔진의 내부 작업을 수행하기 위한 이벤트 그룹의 크기.
                </p>
            </def>
        </deflist>
        <p id="ssl">
            <code>ktor.deployment.sslPort</code>를 설정했다면, 다음
            <Links href="/ktor/server-ssl" summary="필수 종속성: io.ktor:ktor-network-tls-certificates 코드 예시: ssl-engine-main, ssl-embedded-server">
                SSL 관련
            </Links>
            속성을 지정해야 합니다:
        </p>
        <deflist type="wide">
            <def title="ktor.security.ssl.keyStore" id="ktor-security-ssl-keystore">
                <p>
                    SSL 키 저장소.
                </p>
            </def>
            <def title="ktor.security.ssl.keyAlias" id="ktor-security-ssl-key-alias">
                <p>
                    SSL 키 저장소의 별칭.
                </p>
            </def>
            <def title="ktor.security.ssl.keyStorePassword" id="ktor-security-ssl-keystore-password">
                <p>
                    SSL 키 저장소의 비밀번호.
                </p>
            </def>
            <def title="ktor.security.ssl.privateKeyPassword" id="ktor-security-ssl-private-key-password">
                <p>
                    SSL 개인 키의 비밀번호.
                </p>
            </def>
        </deflist>
    </chapter>
    <chapter title="환경 변수" id="environment-variables">
        <p>
            설정 파일에서 <code>${ENV}</code> / <code>$ENV</code> 구문을 사용하여 매개변수를 환경 변수로 대체할 수 있습니다.
            예를 들어, 다음 방식으로 <code>PORT</code> 환경 변수를 <code>ktor.deployment.port</code> 속성에 할당할 수 있습니다:
        </p>
        <tabs group="config">
            <tab title="application.conf" group-key="hocon" id="env-var-conf">
                [object Promise]
            </tab>
            <tab title="application.yaml" group-key="yaml" id="env-var-yaml">
                [object Promise]
            </tab>
        </tabs>
        <p>
            이 경우, 환경 변수 값이 수신 포트를 지정하는 데 사용됩니다.
            런타임에 <code>PORT</code> 환경 변수가 존재하지 않으면, 다음과 같이 기본 포트 값을 제공할 수 있습니다:
        </p>
        <tabs group="config">
            <tab title="application.conf" group-key="hocon" id="config-conf">
                [object Promise]
            </tab>
            <tab title="application.yaml" group-key="yaml" id="config-yaml">
                [object Promise]
            </tab>
        </tabs>
    </chapter>
    <chapter title="코드에서 설정 읽기" id="read-configuration-in-code">
        <p>
            Ktor를 사용하면 코드에서 설정 파일 내에 지정된 속성 값에 접근할 수 있습니다.
            예를 들어, <code>ktor.deployment.port</code> 속성을 지정했다면,...
        </p>
        <tabs group="config">
            <tab title="application.conf" group-key="hocon" id="config-conf-1">
                [object Promise]
            </tab>
            <tab title="application.yaml" group-key="yaml" id="config-yaml-1">
                [object Promise]
            </tab>
        </tabs>
        <p>
            ...
            <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-environment/config.html">
                ApplicationEnvironment.config
            </a>
            를 사용하여 애플리케이션의 설정에 접근하고 다음 방식으로 필요한 속성 값을 가져올 수 있습니다:
        </p>
        [object Promise]
        <p>
            이것은 <a href="#custom-property">사용자 정의 설정</a>을 설정 파일에 보관하고 해당 값에 접근해야 할 때 특히 유용합니다.
        </p>
    </chapter>
    <chapter title="명령줄" id="command-line">
        <p>
            서버를 생성하기 위해 <a href="#engine-main">EngineMain</a>을 사용하는 경우, 명령줄에서 <Links href="/ktor/server-fatjar" summary="Ktor Gradle 플러그인을 사용하여 실행 가능한 단일 JAR을 생성하고 실행하는 방법을 알아보세요.">패키징된 애플리케이션</Links>을 실행하고 해당 명령줄 인수를 전달하여 필요한 서버 매개변수를 재정의할 수 있습니다. 예를 들어, 설정 파일에 지정된 포트를 다음 방식으로 재정의할 수 있습니다:
        </p>
        [object Promise]
        <p>
            사용 가능한 명령줄 옵션은 다음과 같습니다:
        </p>
        <deflist type="narrow">
            <def title="-jar" id="jar">
                <p>
                    JAR 파일 경로.
                </p>
            </def>
            <def title="-config" id="config">
                <p>
                    리소스의
                    <Path>application.conf</Path>
                    /
                    <Path>application.yaml</Path>
                    대신 사용되는 사용자 정의 설정 파일 경로.
                </p>
                <p>
                    <emphasis>예시</emphasis>
                    : <code>java -jar sample-app.jar -config=anotherfile.conf</code>
                </p>
                <p>
                    <emphasis>참고</emphasis>
                    : 여러 값을 전달할 수 있습니다. <code>java -jar sample-app.jar -config=config-base.conf
                    -config=config-dev.conf</code>. 이 경우 모든 설정이 병합되며, 오른쪽 설정의 값이 우선순위를 가집니다.
                </p>
            </def>
            <def title="-host" id="host">
                <p>
                    호스트 주소.
                </p>
            </def>
            <def title="-port" id="port">
                <p>
                    수신 포트.
                </p>
            </def>
            <def title="-watch" id="watch">
                <p>
                    <a href="#watch-paths">자동 재로드</a>에 사용되는 감시 경로.
                </p>
            </def>
        </deflist>
        <p>
            <Links href="/ktor/server-ssl" summary="필수 종속성: io.ktor:ktor-network-tls-certificates 코드 예시: ssl-engine-main, ssl-embedded-server">SSL 관련</Links> 옵션:
        </p>
        <deflist type="narrow">
            <def title="-sslPort" id="ssl-port">
                <p>
                    수신 SSL 포트.
                </p>
            </def>
            <def title="-sslKeyStore" id="ssl-keystore">
                <p>
                    SSL 키 저장소.
                </p>
            </def>
        </deflist>
        <p>
            해당하는 명령줄 옵션이 없는 <a href="#predefined-properties">미리 정의된 속성</a>을 재정의해야 하는 경우, `-P` 플래그를 사용합니다. 예를 들어:
        </p>
        [object Promise]
        <p>
            `-P` 플래그를 사용하여 <a href="#config-custom">사용자 정의 속성</a>을 재정의할 수도 있습니다.
        </p>
    </chapter>
    <chapter title="예시: 사용자 정의 속성을 사용하여 환경 지정 방법" id="custom-property">
        <p>
            서버가 로컬에서 실행 중인지 또는 프로덕션 머신에서 실행 중인지에 따라 다른 작업을 수행하고 싶을 수 있습니다. 이를 위해
            <Path>application.conf</Path>
            /
            <Path>application.yaml</Path>
            에 사용자 정의 속성을 추가하고, 서버가 로컬에서 실행 중인지 프로덕션에서 실행 중인지에 따라 값이 달라지는 전용 <a href="#environment-variables">환경 변수</a>로 이를 초기화할 수 있습니다. 아래 예시에서는 <code>KTOR_ENV</code> 환경 변수가 사용자 정의 <code>ktor.environment</code> 속성에 할당됩니다.
        </p>
        <tabs group="config">
            <tab title="application.conf" group-key="hocon" id="application-conf-5">
                [object Promise]
            </tab>
            <tab title="application.yaml" group-key="yaml" id="application-yaml-5">
                [object Promise]
            </tab>
        </tabs>
        <p>
            런타임에 <a href="#read-configuration-in-code">코드에서 설정을 읽어</a> <code>ktor.environment</code> 값에 접근하고 필요한 작업을 수행할 수 있습니다:
        </p>
        [object Promise]
        <p>
            전체 예시는 다음에서 찾을 수 있습니다:
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-custom-environment">
                engine-main-custom-environment
            </a>.
        </p>
    </chapter>