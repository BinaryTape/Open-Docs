<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="코드 내 설정"
       id="server-configuration-code" help-id="Configuration-code;server-configuration-in-code">
<show-structure for="chapter"/>
<link-summary>
    코드에서 다양한 서버 파라미터를 설정하는 방법을 알아보세요.
</link-summary>
<p>
    Ktor를 사용하면 호스트 주소, 포트, <Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">서버 모듈</Links>, 등을 포함한 다양한 서버 파라미터를 코드 내에서 직접 구성할 수 있습니다. 설정 방법은 서버를 설정하는 방식에 따라 달라집니다. <Links href="/ktor/server-create-and-configure" summary="Learn how to create a server depending on your application deployment needs."><code>embeddedServer</code> 또는 <code>EngineMain</code></Links>을 사용하는지에 따라 달라집니다.
</p>
<p>
    <code>embeddedServer</code>를 사용하면 원하는 파라미터를 함수에 직접 전달하여 서버를 구성할 수 있습니다.
    <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html">
        <code>embeddedServer</code>
    </a>
    함수는 서버 구성을 위한 다양한 파라미터를 허용하며, 여기에는 <Links href="/ktor/server-engines" summary="Learn about engines that process network requests.">서버 엔진</Links>, 서버가 수신할 호스트 및 포트, 그리고 추가 설정 등이 포함됩니다.
</p>
<p>
    이 섹션에서는 <code>embeddedServer</code>를 실행하는 여러 가지 예시를 살펴보고, 서버를 효과적으로 구성하는 방법을 설명합니다.
</p>
<chapter title="기본 설정" id="embedded-basic">
    <p>
        아래 코드 스니펫은 Netty 엔진과 <code>8080</code> 포트를 사용하는 기본적인 서버 설정을 보여줍니다.
    </p>
    [object Promise]
    <p>
        <code>port</code> 파라미터를 <code>0</code>으로 설정하면 서버를 임의의 포트에서 실행할 수 있습니다.
        <code>embeddedServer</code> 함수는 엔진 인스턴스를 반환하므로, 코드에서 포트 값을 가져오려면
        <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/resolved-connectors.html">
            <code>ApplicationEngine.resolvedConnectors</code>
        </a>
        함수를 사용할 수 있습니다.
    </p>
</chapter>
<chapter title="엔진 설정" id="embedded-engine">
    <snippet id="embedded-engine-configuration">
        <p>
            <code>embeddedServer</code> 함수를 사용하면 <code>configure</code> 파라미터를 통해 엔진별 옵션을 전달할 수 있습니다. 이 파라미터에는 모든 엔진에 공통적이며
            <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html">
                <code>ApplicationEngine.Configuration</code>
            </a>
            클래스에 의해 노출되는 옵션이 포함됩니다.
        </p>
        <p>
            아래 예시는 <code>Netty</code> 엔진을 사용하여 서버를 구성하는 방법을 보여줍니다. <code>configure</code> 블록 내에서 <code>connector</code>를 정의하여 호스트와 포트를 지정하고, 다양한 서버 파라미터를 커스터마이징합니다:
        </p>
        [object Promise]
        <p>
            <code>connectors.add()</code> 메서드는 지정된 호스트 (<code>127.0.0.1</code>)
            와 포트 (<code>8080</code>)를 가진 커넥터를 정의합니다.
        </p>
        <p>이러한 옵션 외에도 다른 엔진별 속성을 구성할 수 있습니다.</p>
        <chapter title="Netty" id="netty-code">
            <p>
                Netty 전용 옵션은
                <a href="https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty-application-engine/-configuration/index.html">
                    <code>NettyApplicationEngine.Configuration</code>
                </a>
                클래스에 의해 노출됩니다.
            </p>
            [object Promise]
        </chapter>
        <chapter title="Jetty" id="jetty-code">
            <p>
                Jetty 전용 옵션은
                <a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/index.html">
                    <code>JettyApplicationEngineBase.Configuration</code>
                </a>
                클래스에 의해 노출됩니다.
            </p>
            <p>Jetty 서버는
                <a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/configure-server.html">
                    <code>configureServer</code>
                </a>
                블록 내부에서 구성할 수 있으며, 이 블록은
                <a href="https://www.eclipse.org/jetty/javadoc/jetty-11/org/eclipse/jetty/server/Server.html"><code>Server</code></a>
                인스턴스에 대한 접근을 제공합니다.
            </p>
            <p>
                <code>idleTimeout</code> 속성을 사용하여 연결이 닫히기 전에 유휴 상태로 있을 수 있는 시간을 지정합니다.
            </p>
            [object Promise]
        </chapter>
        <chapter title="CIO" id="cio-code">
            <p>CIO 전용 옵션은
                <a href="https://api.ktor.io/ktor-server/ktor-server-cio/io.ktor.server.cio/-c-i-o-application-engine/-configuration/index.html">
                    <code>CIOApplicationEngine.Configuration</code>
                </a>
                클래스에 의해 노출됩니다.
            </p>
            [object Promise]
        </chapter>
        <chapter title="Tomcat" id="tomcat-code">
            <p>Tomcat을 엔진으로 사용하는 경우,
                <a href="https://api.ktor.io/ktor-server/ktor-server-tomcat-jakarta/io.ktor.server.tomcat.jakarta/-tomcat-application-engine/-configuration/configure-tomcat.html">
                    <code>configureTomcat</code>
                </a>
                속성을 사용하여 구성할 수 있으며, 이 속성은
                <a href="https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/startup/Tomcat.html"><code>Tomcat</code></a>
                인스턴스에 대한 접근을 제공합니다.
            </p>
            [object Promise]
        </chapter>
    </snippet>
</chapter>
<chapter title="사용자 지정 환경" id="embedded-custom">
    <p>
        아래 예시는 <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html">
            <code>ApplicationEngine.Configuration</code>
        </a> 클래스로 표현되는 사용자 지정 설정을 사용하여 여러 커넥터 엔드포인트를 가진 서버를 실행하는 방법을 보여줍니다.
    </p>
    [object Promise]
    <p>
        전체 예시는 다음을 참조하세요:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-multiple-connectors">
            <code>embedded-server-multiple-connectors</code>
        </a>.
    </p>
    <tip>
        <p>
            사용자 지정 환경을 사용하여
            <a href="#embedded-server">
                HTTPS를 제공할 수도 있습니다
            </a>.
        </p>
    </tip>
</chapter>
<chapter id="command-line" title="명령줄 설정">
    <p>
        Ktor를 사용하면 명령줄 인수를 사용하여 <code>embeddedServer</code>를 동적으로 구성할 수 있습니다. 이는 포트, 호스트 또는 타임아웃과 같은 설정이 런타임에 지정되어야 하는 경우에 특히 유용할 수 있습니다.
    </p>
    <p>
        이를 위해
        <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-command-line-config.html">
            <code>CommandLineConfig</code>
        </a>
        클래스를 사용하여 명령줄 인수를 설정 객체로 구문 분석하고 설정 블록 내에서 전달합니다:
    </p>
    [object Promise]
    <p>
        이 예시에서는
        <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/take-from.html">
            <code>takeFrom()</code>
        </a>
        함수(<code>Application.Configuration</code>에 속함)가 <code>port</code> 및 <code>host</code>와 같은 엔진 설정 값을 재정의하는 데 사용됩니다.
        <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/load-common-configuration.html">
            <code>loadCommonConfiguration()</code>
        </a>
        함수는 타임아웃과 같은 루트 환경에서 설정을 로드합니다.
    </p>
    <p>
        서버를 실행하려면 다음과 같이 인수를 지정합니다:
    </p>
    [object Promise]
    <tip>
        정적 설정의 경우, 설정 파일 또는 환경 변수를 사용할 수 있습니다.
        자세한 내용은 다음을 참조하세요:
        <a href="#command-line">
            파일 내 설정
        </a>
        .
    </tip>
</chapter>
</topic>