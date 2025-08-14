<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="建立伺服器"
       id="server-create-and-configure" help-id="start_server;create_server">
<show-structure for="chapter" depth="2"/>
<tldr>
    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server">embedded-server</a>,
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">engine-main</a>,
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-yaml">engine-main-yaml</a>
    </p>
</tldr>
<link-summary>
    瞭解如何根據您的應用程式部署需求建立伺服器。
</link-summary>
<p>
    在建立 Ktor 應用程式之前，您需要考慮應用程式將如何
    <Links href="/ktor/server-deployment" summary="程式碼範例：%example_name%">
        部署
    </Links>
    ：
</p>
<list>
    <li>
        <p>
            作為一個
            <control><a href="#embedded">獨立套件</a></control>
        </p>
        <p>
            在這種情況下，用於處理網路請求的應用程式
            <Links href="/ktor/server-engines" summary="瞭解處理網路請求的引擎。">引擎</Links>
            應該是應用程式的一部分。
            您的應用程式可以控制引擎設定、連線和 SSL 選項。
        </p>
    </li>
    <li>
        <p>
            作為一個
            <control>
                <a href="#servlet">servlet</a>
            </control>
        </p>
        <p>
            在這種情況下，Ktor 應用程式可以部署在 servlet 容器（例如 Tomcat 或 Jetty）內，
            該容器控制應用程式生命週期和連線設定。
        </p>
    </li>
</list>
<chapter title="獨立套件" id="embedded">
    <p>
        若要將 Ktor 伺服器應用程式作為獨立套件交付，您需要先建立一個伺服器。
        伺服器配置可以包含不同的設定：
        一個伺服器<Links href="/ktor/server-engines" summary="瞭解處理網路請求的引擎。">引擎</Links>（例如 Netty、Jetty 等）、
        各種引擎特定選項、主機和連接埠值等等。
        在 Ktor 中有兩種主要的建立和執行伺服器的方法：
    </p>
    <list>
        <li>
            <p>
                <code>embeddedServer</code> 函式是一種簡單的方式，用於
                <a href="#embedded-server">
                    在程式碼中配置伺服器參數
                </a>
                並快速執行應用程式。
            </p>
        </li>
        <li>
            <p>
                <code>EngineMain</code> 提供了更大的靈活性來配置伺服器。您可以
                <a href="#engine-main">
                    在檔案中指定伺服器參數
                </a>
                並在不重新編譯應用程式的情況下變更配置。此外，您可以從命令列執行應用程式，並透過傳遞對應的命令列引數來覆寫所需的伺服器參數。
            </p>
        </li>
    </list>
    <chapter title="在程式碼中配置" id="embedded-server">
        <p>
            <code>embeddedServer</code> 函式是一種簡單的方式，用於在
            <Links href="/ktor/server-configuration-code" summary="瞭解如何在程式碼中配置各種伺服器參數。">程式碼</Links>
            中配置伺服器參數並快速執行應用程式。在下面的程式碼片段中，它接受一個
            <Links href="/ktor/server-engines" summary="瞭解處理網路請求的引擎。">引擎</Links>
            和連接埠作為參數來啟動伺服器。在下面的範例中，我們使用
            <code>Netty</code> 引擎執行伺服器並監聽 <code>8080</code> 連接埠：
        </p>
        [object Promise]
        <p>
            有關完整範例，請參閱
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server">
                embedded-server
            </a>
            。
        </p>
    </chapter>
    <chapter title="在檔案中配置" id="engine-main">
        <p>
            <code>EngineMain</code> 使用所選的引擎啟動伺服器，並載入放置在
            <Path>resources</Path>
            目錄中的外部
            <Links href="/ktor/server-configuration-file" summary="瞭解如何在配置檔案中配置各種伺服器參數。">配置檔案</Links>
            （<Path>application.conf</Path> 或 <Path>application.yaml</Path>）中指定的
            <Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">應用程式模組</Links>
            。
            除了要載入的模組之外，配置檔案還可以包含各種伺服器參數（以下範例中的
            <code>8080</code> 連接埠）。
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
            有關完整範例，請參閱
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">
                engine-main
            </a>
            和
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-yaml">
                engine-main-yaml
            </a>
            。
        </p>
    </chapter>
</chapter>
<chapter title="Servlet" id="servlet">
    <p>
        Ktor 應用程式可以在包含 Tomcat 和 Jetty 的 servlet 容器內執行和部署。
        若要在 servlet 容器內部署，您需要產生一個
        <Links href="/ktor/server-war" summary="瞭解如何使用 WAR 歸檔在 servlet 容器內執行和部署 Ktor 應用程式。">WAR</Links>
        歸檔，然後將其部署到支援 WAR 的伺服器或雲端服務。
    </p>
</chapter>