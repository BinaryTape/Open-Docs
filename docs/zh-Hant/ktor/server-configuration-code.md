```xml
<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   title="程式碼中的設定"
   id="server-configuration-code" help-id="Configuration-code;server-configuration-in-code">
<show-structure for="chapter"/>
<link-summary>
    了解如何在程式碼中設定各種伺服器參數。
</link-summary>
<p>
    Ktor 允許您直接在程式碼中設定各種伺服器參數，包括主機位址、連接埠、<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">伺服器模組</Links>等等。設定方法取決於您建立伺服器的方式 — 使用 <Links href="/ktor/server-create-and-configure" summary="了解如何根據應用程式部署需求建立伺服器。">embeddedServer
    或 EngineMain</Links>。
</p>
<p>
    使用 <code>embeddedServer</code>，您可以透過將所需參數直接傳遞給該函式來設定伺服器。
    <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html">
        embeddedServer
    </a>
    函式接受不同的參數來設定伺服器，包括一個 <Links href="/ktor/server-engines" summary="了解處理網路請求的引擎。">伺服器引擎</Links>、伺服器監聽的主機和連接埠，以及額外的設定。
</p>
<p>
    在本節中，我們將探討幾個執行 <code>embeddedServer</code> 的不同範例，說明如何彈性設定伺服器。
</p>
<chapter title="基本設定" id="embedded-basic">
    <p>
        以下程式碼片段顯示了使用 Netty 引擎和 <code>8080</code> 連接埠的基本伺服器設定。
    </p>
    [object Promise]
    <p>
        請注意，您可以將 <code>port</code> 參數設定為 <code>0</code>，以在隨機連接埠上執行伺服器。
        <code>embeddedServer</code> 函式會返回一個引擎實例，因此您可以使用
        <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/resolved-connectors.html">
            ApplicationEngine.resolvedConnectors
        </a>
        函式在程式碼中獲取連接埠值。
    </p>
</chapter>
<chapter title="引擎設定" id="embedded-engine">
    <snippet id="embedded-engine-configuration">
        <p>
            <code>embeddedServer</code> 函式允許您使用 <code>configure</code> 參數傳遞引擎特定選項。此參數包含所有引擎通用的選項，並由
            <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html">
                ApplicationEngine.Configuration
            </a>
            類別提供。
        </p>
        <p>
            以下範例展示了如何使用 <code>Netty</code> 引擎設定伺服器。在 <code>configure</code> 區塊中，我們定義了一個 <code>connector</code> 以指定主機和連接埠，並自訂各種伺服器參數：
        </p>
        [object Promise]
        <p>
            <code>connectors.add()</code> 方法定義了一個帶有指定主機 (<code>127.0.0.1</code>)
            和連接埠 (<code>8080</code>) 的連接器。
        </p>
        <p>除了這些選項之外，您還可以設定其他引擎特定屬性。</p>
        <chapter title="Netty" id="netty-code">
            <p>
                Netty 特定選項由
                <a href="https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty-application-engine/-configuration/index.html">
                    NettyApplicationEngine.Configuration
                </a>
                類別提供。
            </p>
            [object Promise]
        </chapter>
        <chapter title="Jetty" id="jetty-code">
            <p>
                Jetty 特定選項由
                <a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/index.html">
                    JettyApplicationEngineBase.Configuration
                </a>
                類別提供。
            </p>
            <p>您可以在
                <a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/configure-server.html">
                    configureServer
                </a>
                區塊內設定 Jetty 伺服器，該區塊提供了對
                <a href="https://www.eclipse.org/jetty/javadoc/jetty-11/org/eclipse/jetty/server/Server.html">Server</a>
                實例的存取。
            </p>
            <p>
                使用 <code>idleTimeout</code> 屬性來指定連線在關閉前可以閒置的時間長度。
            </p>
            [object Promise]
        </chapter>
        <chapter title="CIO" id="cio-code">
            <p>CIO 特定選項由
                <a href="https://api.ktor.io/ktor-server/ktor-server-cio/io.ktor.server.cio/-c-i-o-application-engine/-configuration/index.html">
                    CIOApplicationEngine.Configuration
                </a>
                類別提供。
            </p>
            [object Promise]
        </chapter>
        <chapter title="Tomcat" id="tomcat-code">
            <p>如果您使用 Tomcat 作為引擎，您可以使用
                <a href="https://api.ktor.io/ktor-server/ktor-server-tomcat-jakarta/io.ktor.server.tomcat.jakarta/-tomcat-application-engine/-configuration/configure-tomcat.html">
                    configureTomcat
                </a>
                屬性來設定它，該屬性提供了對
                <a href="https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/startup/Tomcat.html">Tomcat</a>
                實例的存取。
            </p>
            [object Promise]
        </chapter>
    </snippet>
</chapter>
<chapter title="自訂環境" id="embedded-custom">
    <p>
        以下範例展示了如何使用由
        <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html">
            ApplicationEngine.Configuration
        </a>
        類別表示的自訂設定來執行帶有多個連接器端點的伺服器。
    </p>
    [object Promise]
    <p>
        如需完整範例，請參閱
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-multiple-connectors">
            embedded-server-multiple-connectors
        </a>。
    </p>
    <tip>
        <p>
            您也可以使用自訂環境來
            <a href="#embedded-server">
                提供 HTTPS 服務
            </a>。
        </p>
    </tip>
</chapter>
<chapter id="command-line" title="命令列設定">
    <p>
        Ktor 允許您使用命令列引數動態設定 <code>embeddedServer</code>。這在需要於執行時期指定連接埠、主機或逾時等設定的情況下特別有用。
    </p>
    <p>
        為此，請使用
        <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-command-line-config.html">
            CommandLineConfig
        </a>
        類別將命令列引數解析為設定物件，並在設定區塊內傳遞它：
    </p>
    [object Promise]
    <p>
        在此範例中，來自 <code>Application.Configuration</code> 的
        <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/take-from.html">
            <code>takeFrom()</code>
        </a>
        函式用於覆寫引擎設定值，例如 <code>port</code> 和 <code>host</code>。
        <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/load-common-configuration.html">
            <code>loadCommonConfiguration()</code>
        </a>
        函式從根環境載入設定，例如逾時。
    </p>
    <p>
        要執行伺服器，請透過以下方式指定引數：
    </p>
    [object Promise]
    <tip>
        對於靜態設定，您可以使用設定檔或環境變數。
        欲了解更多，請參閱
        <a href="#command-line">
            檔案中的設定
        </a>
        。
    </tip>
</chapter>