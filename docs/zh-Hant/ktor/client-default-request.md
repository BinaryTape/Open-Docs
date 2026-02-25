[//]: # (title: 預設請求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-default-request"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
DefaultRequest 外掛程式可讓您為所有請求配置預設參數。
</link-summary>

[`DefaultRequest`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-default-request/index.html) 外掛程式可讓您為所有[請求](client-requests.md)配置預設參數：指定基礎 URL、添加標頭、配置查詢參數等。

## 添加相依性 {id="add_dependencies"}

`DefaultRequest` 僅需要 [ktor-client-core](client-dependencies.md) 構件，不需要任何特定的相依性。

## 安裝 DefaultRequest {id="install_plugin"}

若要安裝 `DefaultRequest`，請將其傳遞給[用戶端配置區塊](client-create-and-configure.md#configure-client)內的 `install` 函式：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(DefaultRequest)
}
```

或呼叫 `defaultRequest()` 函式並[配置](#configure)所需的請求參數：

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

### 替換現有配置 {id="default_request_replace"}

如果 `DefaultRequest` 外掛程式已經安裝，您可以使用以下任一方式替換其現有配置：

- 使用 `defaultRequest()` 函式的 `replace` 參數：

```kotlin
val client = HttpClient(CIO) {
    defaultRequest(replace = true) {
        // this: DefaultRequestBuilder
    }
}
```

- 使用泛型 `installOrReplace()` 函式：

```kotlin
val client = HttpClient(CIO) {
    installOrReplace(DefaultRequest) {
        // this: DefaultRequestBuilder
    }
}
```

## 配置 DefaultRequest {id="configure"}

### 基礎 URL {id="url"}

`DefaultRequest` 可讓您配置 URL 的基礎部分，該部分會與[請求 URL](client-requests.md#url) 合併。
例如，下方的 `url` 函式為所有請求指定了基礎 URL：

```kotlin
defaultRequest {
    url("https://ktor.io/docs/")
}
```

如果您使用具有上述配置的用戶端發出以下請求，...

```kotlin
val response: HttpResponse = client.get("welcome.html")
```

...產生的 URL 將如下所示：`https://ktor.io/docs/welcome.html`。
若要了解基礎 URL 與請求 URL 如何合併，請參閱 [DefaultRequest](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/-default-request/index.html)。

### URL 參數 {id="url-params"}

`url` 函式還允許您個別指定 URL 元件，例如：
- HTTP 配置方案（scheme）；
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

若要向每個請求添加特定的標頭，請使用 `header` 函式：

```kotlin
defaultRequest {
    header("X-Custom-Header", "Hello")
}
```

若要避免標頭重複，您可以使用 `appendIfNameAbsent`、`appendIfNameAndValueAbsent` 和 `contains` 函式：

```kotlin
defaultRequest {
    headers.appendIfNameAbsent("X-Custom-Header", "Hello")
}
```

### Unix 網域通訊端

> Unix 網域通訊端僅在 CIO 引擎中支援。
>
{style="note"}

您可以[使用 Unix 網域通訊端建置個別請求](client-requests.md#specify-a-unix-domain-socket)，但也可以使用通訊端參數配置預設請求。

若要執行此操作，請將帶有通訊端路徑的 `unixSocket` 呼叫傳遞給 `defaultRequest` 函式，例如：

```kotlin
val client = HttpClient(CIO)

// 向 Unix 網域通訊端發送單個請求
val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}

// 為該用戶端的所有請求設定通訊端
val clientDefault = HttpClient(CIO) {
    defaultRequest {
        unixSocket("/tmp/test-unix-socket-ktor.sock")
    }    
}

val response: HttpResponse = clientDefault.get("/")
```

## 範例 {id="example"}

下方的範例使用了以下 `DefaultRequest` 配置：
* `url` 函式定義了 HTTP 配置方案、主機、基礎 URL 路徑和一個查詢參數。
* `header` 函式為所有請求添加了一個自訂標頭。

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

下方由該用戶端發出的請求僅指定了路徑的後半部分，並會自動套用為 `DefaultRequest` 配置的參數：

```kotlin
val response: HttpResponse = client.get("welcome.html")
println(response.status)
```

您可以在此處找到完整的範例：[client-default-request](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-default-request)。