```xml
<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   title="自動重新載入"
   id="server-auto-reload" help-id="Auto_reload">
<tldr>
    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/autoreload-engine-main">autoreload-engine-main</a>,
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/autoreload-embedded-server">autoreload-embedded-server</a>
    </p>
</tldr>
<link-summary>
    了解如何使用 Auto-reload 在程式碼變更時重新載入應用程式類別。
</link-summary>
<p>
    <Links href="/ktor/server-run" summary="了解如何執行伺服器 Ktor 應用程式。">重新啟動</Links>伺服器在開發期間可能需要一些時間。
    Ktor 允許您透過使用 <emphasis>Auto-reload</emphasis> 來克服此限制，它會在程式碼變更時重新載入應用程式類別並提供快速的回饋循環。
    若要使用 Auto-reload，請依照以下步驟操作：
</p>
<list style="decimal">
    <li>
        <p>
            <a href="#enable">啟用開發模式</a>
        </p>
    </li>
    <li>
        <p>
            (選填) <a href="#watch-paths">配置監看路徑</a>
        </p>
    </li>
    <li>
        <p>
            <a href="#recompile">啟用變更時的重新編譯</a>
        </p>
    </li>
</list>
<chapter title="啟用開發模式" id="enable">
    <p>
        若要使用 Auto-reload，您需要先啟用
        <a href="#enable">開發模式</a>。
        這取決於您 <Links href="/ktor/server-create-and-configure" summary="了解如何根據您的應用程式部署需求建立伺服器。">建立和執行伺服器</Links> 的方式：
    </p>
    <list>
        <li>
            <p>
                如果您使用 <code>EngineMain</code> 來執行伺服器，請在 <a href="#application-conf">配置檔</a> 中啟用開發模式。
            </p>
        </li>
        <li>
            <p>
                如果您使用 <code>embeddedServer</code> 執行伺服器，您可以使用
                <a href="#system-property">io.ktor.development</a>
                系統屬性。
            </p>
        </li>
    </list>
    <p>
        當開發模式啟用時，Ktor 將會自動監看工作目錄中的輸出檔案。
        如有需要，您可以透過指定
        <a href="#watch-paths">監看路徑</a> 來縮小監看資料夾的範圍。
    </p>
</chapter>
<chapter title="配置監看路徑" id="watch-paths">
    <p>
        當您 <a href="#enable">啟用</a> 開發模式時，
        Ktor 會開始監看工作目錄中的輸出檔案。
        例如，對於使用 Gradle 建置的 <Path>ktor-sample</Path> 專案，將會監看以下資料夾：
    </p>
    [object Promise]
    <p>
        監看路徑允許您縮小監看資料夾的範圍。
        若要執行此操作，您可以指定監看路徑的一部分。
        例如，若要監控 <Path>ktor-sample/build/classes</Path> 子資料夾中的變更，
        請將 <code>classes</code> 作為監看路徑傳遞。
        根據您執行伺服器的方式，您可以透過以下方式指定監看路徑：
    </p>
    <list>
        <li>
            <p>
                在 <Path>application.conf</Path> 或 <Path>application.yaml</Path> 檔案中，指定 <code>watch</code> 選項：
            </p>
            <tabs group="config">
                <tab title="application.conf" group-key="hocon">
                    [object Promise]
                </tab>
                <tab title="application.yaml" group-key="yaml">
                    [object Promise]
                </tab>
            </tabs>
            <p>
                您也可以指定多個監看路徑，例如：
            </p>
            <tabs group="config">
                <tab title="application.conf" group-key="hocon">
                    [object Promise]
                </tab>
                <tab title="application.yaml" group-key="yaml">
                    [object Promise]
                </tab>
            </tabs>
            <p>
                您可以在此處找到完整範例： <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/autoreload-engine-main">autoreload-engine-main</a>。
            </p>
        </li>
        <li>
            <p>
                如果您正在使用 <code>embeddedServer</code>，請將監看路徑作為 <code>watchPaths</code>
                參數傳遞：
            </p>
            [object Promise]
            <p>
                如需完整範例，請參閱
                <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/autoreload-embedded-server">
                    autoreload-embedded-server
                </a>
                。
            </p>
        </li>
    </list>
</chapter>
<chapter title="變更時重新編譯" id="recompile">
    <p>
        由於 Auto-reload 會偵測輸出檔案中的變更，
        因此您需要重建專案。
        您可以在 IntelliJ IDEA 中手動執行此操作，或
        使用 <code>-t</code> 命令列選項在 Gradle 中啟用持續建置執行。
    </p>
    <list>
        <li>
            <p>
                若要在 IntelliJ IDEA 中手動重建專案，請從主選單中選取
                <ui-path>Build | Rebuild Project</ui-path>。
            </p>
        </li>
        <li>
            <p>
                若要使用 Gradle 自動重建專案，
                您可以在終端機中執行帶有 <code>-t</code> 選項的 <code>build</code> 任務：
            </p>
            [object Promise]
            <tip>
                <p>
                    若要在重新載入專案時跳過執行測試，您可以將 <code>-x</code> 選項傳遞給 <code>build</code> 任務：
                </p>
                [object Promise]
            </tip>
        </li>
    </list>
</chapter>