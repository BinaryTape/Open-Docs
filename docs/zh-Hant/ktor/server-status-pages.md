[//]: # (title: 狀態頁面)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="StatusPages"/>
<var name="package_name" value="io.ktor.server.plugins.statuspages"/>
<var name="artifact_name" value="ktor-server-status-pages"/>

<tldr>
<p>
<b>所需相依性</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="status-pages"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在不額外執行時或虛擬機器下執行伺服器。">原生伺服器</Links> 支援</b>: ✅
    </p>
    
</tldr>

<link-summary>
%plugin_name% 允許 Ktor 應用程式根據拋出的例外或狀態碼，對任何失敗狀態做出適當的回應。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-status-pages/io.ktor.server.plugins.statuspages/-status-pages.html) 插件允許 Ktor 應用程式根據拋出的例外或狀態碼，對任何失敗狀態做出適當的[回應](server-responses.md)。

## 新增相依性 {id="add_dependencies"}

    <p>
        若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
    </p>
    

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## 安裝 %plugin_name% {id="install_plugin"}

    <p>
        若要將 <code>%plugin_name%</code> 插件<a href="#install">安裝</a>到應用程式，
        請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函數。
        下面的程式碼片段顯示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，該模組是 <code>Application</code> 類的擴展函數。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

## 設定 %plugin_name% {id="configure"}

<code>%plugin_name%</code> 插件提供了三個主要設定選項：

- [exceptions](#exceptions)：根據映射的例外類別設定回應
- [status](#status)：根據狀態碼值設定回應
- [statusFile](#status-file)：從類路徑設定檔案回應

### 例外 {id="exceptions"}

<code>exception</code> 處理器允許您處理導致 <code>Throwable</code> 例外的呼叫。在最基本的情況下，可以為任何例外設定 <code>500</code> HTTP 狀態碼：

```kotlin
install(StatusPages) {
    exception<Throwable> { call, cause ->
        call.respondText(text = "500: $cause" , status = HttpStatusCode.InternalServerError)
    }
}
```

您也可以檢查特定例外並回應所需的內容：

[object Promise]

### 狀態 {id="status"}

<code>status</code> 處理器提供了根據狀態碼回應特定內容的功能。以下範例顯示了如果伺服器上缺少資源（<code>404</code> 狀態碼）時如何回應請求：

[object Promise]

### 狀態檔案 {id="status-file"}

<code>statusFile</code> 處理器允許您根據狀態碼提供 HTML 頁面。假設您的專案的 <code>resources</code> 資料夾中包含 <code>error401.html</code> 和 <code>error402.html</code> HTML 頁面。在此情況下，您可以像這樣使用 <code>statusFile</code> 處理 <code>401</code> 和 <code>402</code> 狀態碼：
[object Promise]

<code>statusFile</code> 處理器會將已設定狀態列表中的任何 `#` 字元替換為狀態碼的值。

> 您可以在此處找到完整範例：[status-pages](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/status-pages)。