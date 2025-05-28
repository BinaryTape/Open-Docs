[//]: # (title: 預設請求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-default-request"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
DefaultRequest 插件允許您為所有請求配置預設參數。
</link-summary>

[DefaultRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-default-request/index.html) 插件允許您為所有[請求](client-requests.md)配置預設參數：指定一個基礎 URL、添加標頭、配置查詢參數等等。

## 添加依賴 {id="add_dependencies"}

`DefaultRequest` 僅需要 [ktor-client-core](client-dependencies.md) 構件，並且不需要任何特定的依賴。

## 安裝 DefaultRequest {id="install_plugin"}

要安裝 `DefaultRequest`，請將其傳遞給 [客戶端配置區塊](client-create-and-configure.md#configure-client) 中的 `install` 函數...
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(DefaultRequest)
}
```

... 或呼叫 `defaultRequest` 函數並[配置](#configure)所需的請求參數：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    defaultRequest {
        // this: DefaultRequestBuilder
    }
}
```

## 配置 DefaultRequest {id="configure"}

### 基礎 URL {id="url"}

`DefaultRequest` 允許您配置 URL 的基礎部分，該部分將與[請求 URL](client-requests.md#url) 合併。
例如，下方的 `url` 函數為所有請求指定了一個基礎 URL：

```kotlin
defaultRequest {
    url("https://ktor.io/docs/")
}
```

如果您使用帶有上述配置的客戶端發出以下請求，...

```kotlin
```
{src="snippets/client-default-request/src/main/kotlin/com/example/Application.kt" include-lines="25"}

... 結果 URL 將是以下內容：`https://ktor.io/docs/welcome.html`。
要了解基礎 URL 和請求 URL 如何合併，請參閱 [DefaultRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-default-request/index.html)。

### URL 參數 {id="url-params"}

`url` 函數也允許您單獨指定 URL 組件，例如：
- HTTP 方案；
- 主機名；
- 基礎 URL 路徑；
- 查詢參數。

```kotlin
```
{src="snippets/client-default-request/src/main/kotlin/com/example/Application.kt" include-lines="15-20"}

### 標頭 {id="headers"}

要為每個請求添加特定的標頭，請使用 `header` 函數：

```kotlin
```
{src="snippets/client-default-request/src/main/kotlin/com/example/Application.kt" include-lines="14,21-22"}

為避免標頭重複，您可以使用 `appendIfNameAbsent`、`appendIfNameAndValueAbsent` 和 `contains` 函數：

```kotlin
defaultRequest {
    headers.appendIfNameAbsent("X-Custom-Header", "Hello")
}
```

## 範例 {id="example"}

以下範例使用了以下 `DefaultRequest` 配置：
* `url` 函數定義了一個 HTTP 方案、一個主機、一個基礎 URL 路徑和一個查詢參數。
* `header` 函數為所有請求添加了一個自訂標頭。

```kotlin
```
{src="snippets/client-default-request/src/main/kotlin/com/example/Application.kt" include-lines="13-23"}

由該客戶端發出的以下請求僅指定了後續的路徑段，並自動應用為 `DefaultRequest` 配置的參數：

```kotlin
```
{src="snippets/client-default-request/src/main/kotlin/com/example/Application.kt" include-lines="25-26"}

您可以在這裡找到完整的範例：[client-default-request](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-default-request)。