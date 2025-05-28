[//]: # (title: 狀態頁面)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="StatusPages"/>
<var name="package_name" value="io.ktor.server.plugins.statuspages"/>
<var name="artifact_name" value="ktor-server-status-pages"/>

<tldr>
<p>
<b>必要的依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="status-pages"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name% 允許 Ktor 應用程式根據拋出的例外或狀態碼，適當地回應任何失敗狀態。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-status-pages/io.ktor.server.plugins.statuspages/-status-pages.html) 外掛程式允許 Ktor 應用程式根據拋出的例外或狀態碼，適當地[回應](server-responses.md)任何失敗狀態。

## 新增依賴 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 設定 %plugin_name% {id="configure"}

`%plugin_name%` 外掛程式提供了三個主要的設定選項：

- [例外](#exceptions)：根據已映射的例外類別設定回應
- [狀態](#status)：根據狀態碼值設定回應
- [狀態檔案](#status-file)：從類別路徑設定檔案回應

### 例外 {id="exceptions"}

`exception` 處理程式允許您處理導致 `Throwable` 例外的呼叫。在最基本的情況下，可以為任何例外設定 `500` HTTP 狀態碼：

```kotlin
install(StatusPages) {
    exception<Throwable> { call, cause ->
        call.respondText(text = "500: $cause" , status = HttpStatusCode.InternalServerError)
    }
}
```

您也可以檢查特定的例外並以所需的內容回應：

```kotlin
```
{src="snippets/status-pages/src/main/kotlin/com/example/Application.kt" include-lines="12-19,24"}

### 狀態 {id="status"}

`status` 處理程式提供了根據狀態碼回應特定內容的功能。下面的範例展示了如果伺服器上缺少資源（`404` 狀態碼）時如何回應請求：

```kotlin
```
{src="snippets/status-pages/src/main/kotlin/com/example/Application.kt" include-lines="12,20-22,24"}

### 狀態檔案 {id="status-file"}

`statusFile` 處理程式允許您根據狀態碼提供 HTML 頁面。假設您的專案在 `resources` 資料夾中包含 `error401.html` 和 `error402.html` HTML 頁面。在這種情況下，您可以按如下方式使用 `statusFile` 處理 `401` 和 `402` 狀態碼：
```kotlin
```
{src="snippets/status-pages/src/main/kotlin/com/example/Application.kt" include-lines="12,23-24"}

`statusFile` 處理程式會將已設定狀態列表中的任何 `#` 字元替換為狀態碼的值。

> 您可以在此處找到完整範例：[status-pages](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/status-pages)。