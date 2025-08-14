<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="檔案中的配置"
       id="server-configuration-file" help-id="Configuration-file;server-configuration-in-file">
    <show-structure for="chapter" depth="2"/>
    <link-summary>
        瞭解如何在配置檔案中配置各種伺服器參數。
    </link-summary>
    <p>
        Ktor 允許您配置各種伺服器參數，例如主機位址和埠、
        <Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">要載入的模組</Links>
        等。
        配置取決於您用來建立伺服器的方式 —
        <Links href="/ktor/server-create-and-configure" summary="瞭解如何根據應用程式部署需求建立伺服器。">
            embeddedServer 或 EngineMain
        </Links>
        。
    </p>
    <p>
        對於 <code>EngineMain</code>，Ktor 從使用
        <a href="https://github.com/lightbend/config/blob/master/HOCON.md">
            HOCON
        </a>
        或 YAML 格式的配置檔案中載入其配置。這種方式為配置伺服器提供了更大的靈活性，並允許您在不重新編譯應用程式的情況下更改配置。此外，您可以從命令列執行應用程式，並透過傳遞相應的
        <a href="#command-line">
            命令列
        </a>
        引數來覆寫所需的伺服器參數。
    </p>
    <chapter title="概述" id="configuration-file-overview">
        <p>
            如果您使用
            <a href="#engine-main">
                EngineMain
            </a>
            來啟動伺服器，Ktor 會自動從
            <Path>resources</Path>
            目錄中名為
            <Path>application.*</Path>
            的檔案載入配置設定。支援兩種配置格式：
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
                        要使用 YAML 配置檔案，您需要添加 <code>ktor-server-config-yaml</code>
                        <Links href="/ktor/server-dependencies" summary="瞭解如何將 Ktor Server 相依性添加到現有的 Gradle/Maven 專案中。">
                            相依性
                        </Links>
                        。
                    </p>
                </note>
            </li>
        </list>
        <p>
            配置檔案應至少包含使用 <code>ktor.application.modules</code> 屬性指定的
            <Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">
                要載入的模組
            </Links>
            ，例如：
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
            在這種情況下，Ktor 會呼叫下方
            <Path>Application.kt</Path>
            檔案中的 <code>Application.module</code> 函數：
        </p>
        [object Promise]
        <p>
            除了要載入的模組，您還可以配置各種伺服器設定，包括
            <a href="#predefined-properties">預定義的</a>
            （例如埠或主機、SSL 設定等）和自訂設定。
            讓我們看看幾個範例。
        </p>
        <chapter title="基本配置" id="config-basic">
            <p>
                在以下範例中，伺服器監聽埠使用 <code>ktor.deployment.port</code> 屬性設定為 <code>8080</code>。
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
        <chapter title="引擎配置" id="config-engine">
            <snippet id="engine-main-configuration">
                <p>
                    如果您使用 <code>EngineMain</code>，您可以在 <code>ktor.deployment</code> 組中指定所有引擎通用的選項。
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
                        您還可以在配置檔案中的 <code>ktor.deployment</code> 組中配置 Netty 特定的選項：
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
        <chapter title="SSL 配置" id="config-ssl">
            <p>
                以下範例使 Ktor 能夠在 <code>8443</code> SSL 埠上監聽，並在單獨的 <code>security</code> 區塊中指定所需的
                <Links href="/ktor/server-ssl" summary="所需相依性：io.ktor:ktor-network-tls-certificates&#xA;程式碼範例：&#xA;ssl-engine-main,&#xA;ssl-embedded-server">
                    SSL 設定
                </Links>
                。
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
        <chapter title="自訂配置" id="config-custom">
            <p>
                除了指定<a href="#predefined-properties">預定義屬性</a>外，
                Ktor 還允許您在配置檔案中保留自訂設定。
                以下配置檔案包含一個用於保留
                <a href="#jwt-settings">JWT</a>
                設定的自訂 <code>jwt</code> 組。
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
                您可以在程式碼中<a href="#read-configuration-in-code">讀取並處理此類設定</a>。
            </p>
            <warning>
                <p>
                    請注意，敏感資料（如密鑰、資料庫連線設定等）不應以純文字形式儲存在配置檔案中。請考慮使用
                    <a href="#environment-variables">
                        環境變數
                    </a>
                    來指定此類參數。
                </p>
            </warning>
        </chapter>
    </chapter>
    <chapter title="預定義屬性" id="predefined-properties">
        <p>
            以下是您可以在
            <a href="#configuration-file-overview">
                配置檔案
            </a>中使用的預定義設定列表。
        </p>
        <deflist type="wide">
            <def title="ktor.deployment.host" id="ktor-deployment-host">
                <p>
                    主機位址。
                </p>
                <p>
                    <emphasis>範例</emphasis>
                    : <code>0.0.0.0</code>
                </p>
            </def>
            <def title="ktor.deployment.port" id="ktor-deployment-port">
                <p>
                    監聽埠。您可以將此屬性設定為 <code>0</code>，讓伺服器在隨機埠上執行。
                </p>
                <p>
                    <emphasis>範例</emphasis>
                    : <code>8080</code>, <code>0</code>
                </p>
            </def>
            <def title="ktor.deployment.sslPort" id="ktor-deployment-ssl-port">
                <p>
                    監聽 SSL 埠。您可以將此屬性設定為 <code>0</code>，讓伺服器在隨機埠上執行。
                </p>
                <p>
                    <emphasis>範例</emphasis>
                    : <code>8443</code>, <code>0</code>
                </p>
                <note>
                    <p>
                        請注意，SSL 需要下方<a href="#ssl">列出的</a>額外選項。
                    </p>
                </note>
            </def>
            <def title="ktor.deployment.watch" id="ktor-deployment-watch">
                <p>
                    用於 <a href="#watch-paths">自動重新載入</a> 的監看路徑。
                </p>
            </def>
            <def title="ktor.deployment.rootPath" id="ktor-deployment-root-path">
                <p>
                    <Links href="/ktor/server-war" summary="瞭解如何在 Servlet 容器中使用 WAR 歸檔執行和部署 Ktor 應用程式。">servlet</Links> 上下文路徑。
                </p>
                <p>
                    <emphasis>範例</emphasis>
                    : <code>/</code>
                </p>
            </def>
            <def title="ktor.deployment.shutdown.url" id="ktor-deployment-shutdown-url">
                <p>
                    關機 URL。
                    請注意，此選項使用 <Links href="/ktor/server-shutdown-url" summary="程式碼範例：&#xA;%example_name%">關機 URL</Links> 外掛程式。
                </p>
            </def>
            <def title="ktor.deployment.shutdownGracePeriod" id="ktor-deployment-shutdown-grace-period">
                <p>
                    伺服器停止接受新請求的最大毫秒數。
                </p>
            </def>
            <def title="ktor.deployment.shutdownTimeout" id="ktor-deployment-shutdown-timeout">
                <p>
                    等待伺服器完全停止的最大毫秒數。
                </p>
            </def>
            <def title="ktor.deployment.callGroupSize" id="ktor-deployment-call-group-size">
                <p>
                    用於處理應用程式呼叫的執行緒池的最小大小。
                </p>
            </def>
            <def title="ktor.deployment.connectionGroupSize" id="ktor-deployment-connection-group-size">
                <p>
                    用於接受新連接並開始呼叫處理的執行緒數量。
                </p>
            </def>
            <def title="ktor.deployment.workerGroupSize" id="ktor-deployment-worker-group-size">
                <p>
                    用於處理連接、解析訊息以及執行引擎內部工作的事件組大小。
                </p>
            </def>
        </deflist>
        <p id="ssl">
            如果您已設定 <code>ktor.deployment.sslPort</code>，您需要指定以下
            <Links href="/ktor/server-ssl" summary="所需相依性：io.ktor:ktor-network-tls-certificates&#xA;程式碼範例：&#xA;ssl-engine-main,&#xA;ssl-embedded-server">
                SSL 特定的
            </Links>
            屬性：
        </p>
        <deflist type="wide">
            <def title="ktor.security.ssl.keyStore" id="ktor-security-ssl-keystore">
                <p>
                    SSL 金鑰儲存庫。
                </p>
            </def>
            <def title="ktor.security.ssl.keyAlias" id="ktor-security-ssl-key-alias">
                <p>
                    SSL 金鑰儲存庫的別名。
                </p>
            </def>
            <def title="ktor.security.ssl.keyStorePassword" id="ktor-security-ssl-keystore-password">
                <p>
                    SSL 金鑰儲存庫的密碼。
                </p>
            </def>
            <def title="ktor.security.ssl.privateKeyPassword" id="ktor-security-ssl-private-key-password">
                <p>
                    SSL 私鑰的密碼。
                </p>
            </def>
        </deflist>
    </chapter>
    <chapter title="環境變數" id="environment-variables">
        <p>
            在配置檔案中，您可以使用 <code>${ENV}</code> / <code>$ENV</code> 語法將參數替換為環境變數。
            例如，您可以透過以下方式將 <code>PORT</code> 環境變數指派給 <code>ktor.deployment.port</code> 屬性：
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
            在這種情況下，將使用環境變數的值來指定監聽埠。
            如果 <code>PORT</code> 環境變數在執行時不存在，您可以提供一個預設埠值，如下所示：
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
    <chapter title="在程式碼中讀取配置" id="read-configuration-in-code">
        <p>
            Ktor 允許您在程式碼中訪問配置檔案中指定的屬性值。
            例如，如果您已指定 <code>ktor.deployment.port</code> 屬性，...
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
            ... 您可以使用
            <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-environment/config.html">
                ApplicationEnvironment.config
            </a>
            訪問應用程式的配置，並透過以下方式獲取所需的屬性值：
        </p>
        [object Promise]
        <p>
            當您在配置檔案中保留<a href="#custom-property">自訂設定</a>並需要訪問其值時，這尤其有用。
        </p>
    </chapter>
    <chapter title="命令列" id="command-line">
        <p>
            如果您使用 <a href="#engine-main">EngineMain</a> 建立伺服器，您可以從命令列執行
            <Links href="/ktor/server-fatjar" summary="瞭解如何使用 Ktor Gradle 外掛程式建立和執行可執行的大 JAR。">打包應用程式</Links>，
            並透過傳遞相應的命令列引數來覆寫所需的伺服器參數。例如，您可以透過以下方式覆寫配置檔案中指定的埠：
        </p>
        [object Promise]
        <p>
            可用的命令列選項列在下方：
        </p>
        <deflist type="narrow">
            <def title="-jar" id="jar">
                <p>
                    JAR 檔案的路徑。
                </p>
            </def>
            <def title="-config" id="config">
                <p>
                    自訂配置檔案的路徑，用於替代資源中的
                    <Path>application.conf</Path>
                    /
                    <Path>application.yaml</Path>
                    。
                </p>
                <p>
                    <emphasis>範例</emphasis>
                    : <code>java -jar sample-app.jar -config=anotherfile.conf</code>
                </p>
                <p>
                    <emphasis>注意</emphasis>
                    : 您可以傳遞多個值。<code>java -jar sample-app.jar -config=config-base.conf
                    -config=config-dev.conf</code>。在這種情況下，所有配置將合併，右側配置中的值將具有優先權。
                </p>
            </def>
            <def title="-host" id="host">
                <p>
                    主機位址。
                </p>
            </def>
            <def title="-port" id="port">
                <p>
                    監聽埠。
                </p>
            </def>
            <def title="-watch" id="watch">
                <p>
                    用於 <a href="#watch-paths">自動重新載入</a> 的監看路徑。
                </p>
            </def>
        </deflist>
        <p>
            <Links href="/ktor/server-ssl" summary="所需相依性：io.ktor:ktor-network-tls-certificates&#xA;程式碼範例：&#xA;ssl-engine-main,&#xA;ssl-embedded-server">SSL 特定的</Links> 選項：
        </p>
        <deflist type="narrow">
            <def title="-sslPort" id="ssl-port">
                <p>
                    監聽 SSL 埠。
                </p>
            </def>
            <def title="-sslKeyStore" id="ssl-keystore">
                <p>
                    SSL 金鑰儲存庫。
                </p>
            </def>
        </deflist>
        <p>
            如果您需要覆寫一個沒有相應命令列選項的<a href="#predefined-properties">預定義屬性</a>，請使用 <code>-P</code> 標誌，例如：
        </p>
        [object Promise]
        <p>
            您也可以使用 <code>-P</code> 標誌來覆寫<a href="#config-custom">自訂屬性</a>。
        </p>
    </chapter>
    <chapter title="範例：如何使用自訂屬性指定環境" id="custom-property">
        <p>
            您可能希望根據伺服器是在本機運行還是在生產機器上運行來執行不同的操作。為此，您可以在
            <Path>application.conf</Path>
            /
            <Path>application.yaml</Path>
            中添加一個自訂屬性，並使用一個專用的<a href="#environment-variables">環境變數</a>來初始化它，該變數的值取決於伺服器是在本機運行還是在生產環境中運行。在以下範例中，<code>KTOR_ENV</code> 環境變數被指派給自訂的 <code>ktor.environment</code> 屬性。
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
            您可以在執行時透過<a href="#read-configuration-in-code">在程式碼中讀取配置</a>來訪問 <code>ktor.environment</code> 值並執行所需的操作：
        </p>
        [object Promise]
        <p>
            您可以在此處找到完整範例：
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-custom-environment">
                engine-main-custom-environment
            </a>。
        </p>
    </chapter>
</topic>