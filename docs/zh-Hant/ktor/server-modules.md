[//]: # (title: 模組)

<tldr>
<p>
<b>程式碼範例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules">embedded-server-modules</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules">engine-main-modules</a>
</p>
</tldr>

<link-summary>模組允許您透過分組路由來組織您的應用程式。</link-summary>

Ktor 允許您透過在特定模組內定義一組特定的[路由](server-routing.md)來使用模組以[組織](server-application-structure.md)您的應用程式。模組是 [Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html) 類別的[擴充函式](https://kotlinlang.org/docs/extensions.html)。在以下範例中，`module1` 擴充函式定義了一個模組，它接受對 `/module1` URL 路徑發出的 GET 請求。

[object Promise]

在您的應用程式中載入模組取決於[建立伺服器](server-create-and-configure.topic)的方式：在程式碼中使用 `embeddedServer` 函式，或透過使用 `application.conf` 設定檔。

> 請注意，在指定模組中安裝的[外掛程式](server-plugins.md#install)對其他已載入的模組也有效。

## embeddedServer {id="embedded-server"}

通常，`embeddedServer` 函式會隱式地將模組作為 lambda 引數接受。
您可以在 [](server-create-and-configure.topic#embedded-server) 區段中看到範例。
您也可以將應用程式邏輯提取到一個獨立的模組中，並將此模組的參照作為 `module` 參數傳遞：

[object Promise]

您可以在此處找到完整範例：[embedded-server-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules)。

## 設定檔 {id="hocon"}

如果您使用 `application.conf` 或 `application.yaml` 檔案來設定伺服器，您需要使用 `ktor.application.modules` 屬性指定要載入的模組。

假設您在兩個套件中定義了三個模組：`com.example` 套件中有兩個模組，`org.sample` 套件中有一個模組。

<tabs>
<tab title="Application.kt">

[object Promise]

</tab>
<tab title="Sample.kt">

[object Promise]

</tab>
</tabs>

要在設定檔中參照這些模組，您需要提供它們的完全限定名稱。
完全限定模組名稱包含類別的完全限定名稱和擴充函式名稱。

<tabs group="config">
<tab title="application.conf" group-key="hocon">

[object Promise]

</tab>
<tab title="application.yaml" group-key="yaml">

[object Promise]

</tab>
</tabs>

您可以在此處找到完整範例：[engine-main-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules)。

## 並行模組載入

您可以在建立應用程式模組時使用可暫停函式。它們允許事件在應用程式啟動時非同步執行。為此，請新增 `suspend` 關鍵字：

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

您還可以獨立啟動所有應用程式模組，這樣當一個模組被暫停時，其他模組不會被阻塞。
這允許依賴注入的非循序載入，在某些情況下，可以加快載入速度。

### 配置選項

以下 Gradle 配置屬性可用：

| Property                                | Type                        | Description                                          | Default      |
|-----------------------------------------|-----------------------------|------------------------------------------------------|--------------|
| `ktor.application.startup`              | `sequential` / `concurrent` | 定義應用程式模組的載入方式                           | `sequential` |
| `ktor.application.startupTimeoutMillis` | `Long`                      | 應用程式模組載入的逾時時間（毫秒）                   | `100000`     |

### 啟用並行模組載入

要選擇啟用並行模組載入，請將以下屬性新增到您的 `gradle.properties` 檔案中：

```none
ktor.application.startup = concurrent
```

對於依賴注入，您可以按照出現順序載入以下模組而不會有問題：

```kotlin
suspend fun Application.installEvents() {
    // Suspends until provided
    val kubernetesConnection = dependencies.resolve<KubernetesConnection>()
}

suspend fun Application.loadEventsConnection() {
    dependencies.provide<KubernetesConnection> {
        connect(property<KubernetesConfig>("app.events"))
    }
}
```

> 並行模組載入是單執行緒處理程序。它有助於避免應用程式內部共享狀態中不安全集合的執行緒問題。
>
{style="note"}