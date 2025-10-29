[//]: # (title: 預設請求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-default-request"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
DefaultRequest 外掛程式允許您為所有請求設定預設參數。
</link-summary>

[DefaultRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-default-request/index.html) 外掛程式允許您為所有[請求](client-requests.md)設定預設參數：指定基礎 URL、新增標頭、設定查詢參數，等等。

## 新增依賴項 {id="add_dependencies"}

`DefaultRequest` 僅需要 [ktor-client-core](client-dependencies.md) artifact，不需要任何特定依賴項。

## 安裝 DefaultRequest {id="install_plugin"}

若要安裝 `DefaultRequest`，請將其傳遞給 [用戶端組態區塊](client-create-and-configure.md#configure-client) 內的 `install` 函數：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(DefaultRequest)
}
```

或者呼叫 `defaultRequest` 函數並[設定](#configure)所需的請求參數：

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

## 設定 DefaultRequest {id="configure"}

### 基礎 URL {id="url"}

`DefaultRequest` 允許您設定 URL 的基礎部分，該部分會與[請求 URL](client-requests.md#url) 合併。
例如，以下 `url` 函數為所有請求指定了基礎 URL：

```kotlin
defaultRequest {
    url("https://ktor.io/docs/")
}
```

如果您使用上述組態的用戶端發出以下請求，...

```kotlin
val response: HttpResponse = client.get("welcome.html")
```

... 產生的 URL 將是：`https://ktor.io/docs/welcome.html`。
要了解基礎 URL 和請求 URL 如何合併，請參閱 [DefaultRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-default-request/index.html)。

### URL 參數 {id="url-params"}

`url` 函數也允許您單獨指定 URL 元件，例如：
- HTTP 方案；
- 主機名稱；
- 基礎 URL 路徑；
- 查詢參數。

```kotlin
url {
    protocol = URLProtocol.HTTPS
    host = "ktor.io"
    path("docs/")
    parameters.append("token", "abc123")
}
```

### 標頭 {id="headers"}

要為每個請求新增特定標頭，請使用 `header` 函數：

```kotlin
defaultRequest {
    header("X-Custom-Header", "Hello")
}
```

為避免標頭重複，您可以使用 `appendIfNameAbsent`、`appendIfNameAndValueAbsent` 和 `contains` 函數：

```kotlin
defaultRequest {
    headers.appendIfNameAbsent("X-Custom-Header", "Hello")
}
```

### Unix 網域通訊端

> Unix 網域通訊端僅在 CIO 引擎中支援。
>
{style="note"}

您可以[使用 Unix 網域通訊端建構個別請求](client-requests.md#specify-a-unix-domain-socket)，但您也可以使用通訊端參數設定預設請求。

為此，將帶有通訊端路徑的 `unixSocket` 呼叫傳遞給 `defaultRequest` 函數，例如：

```kotlin
val client = HttpClient(CIO)

// Sending a single request to a Unix domain socket
val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}

// Setting up the socket for all requests from that client
val clientDefault = HttpClient(CIO) {
    defaultRequest {
        unixSocket("/tmp/test-unix-socket-ktor.sock")
    }    
}

val response: HttpResponse = clientDefault.get("/")
```

## 範例 {id="example"}

以下範例使用以下 `DefaultRequest` 組態：
* `url` 函數定義了 HTTP 方案、主機、基礎 URL 路徑和查詢參數。
* `header` 函數為所有請求新增了自訂標頭。

```kotlin
val client = HttpClient(CIO) {
    defaultRequest {
        url {
            protocol = URLProtocol.HTTPS
            host = "ktor.io"
            path("docs/")
            parameters.append("token", "abc123")
        }
        header("X-Custom-Header", "Hello")
    }
}
```

此用戶端發出的以下請求僅指定了後續的路徑段，並自動套用為 `DefaultRequest` 設定的參數：

```kotlin
val response: HttpResponse = client.get("welcome.html")
println(response.status)
```

您可以在此處找到完整範例：[client-default-request](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-default-request)。