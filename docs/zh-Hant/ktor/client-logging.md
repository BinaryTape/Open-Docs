[//]: # (title: Ktor Client 中的日誌記錄)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:ktor-client-logging</code>
</p>
<var name="example_name" value="client-logging"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

日誌記錄是一種透過記錄重要事件、錯誤或資訊訊息，來追蹤程式執行情況並診斷問題的方式。

Ktor 提供使用 [Logging](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging) 外掛程式來記錄 HTTP 呼叫的功能。
這個外掛程式為不同平台提供不同類型的日誌記錄器。

> 在伺服器端，Ktor 提供 [Logging](server-logging.md) 外掛程式用於應用程式日誌記錄，以及 [CallLogging](server-call-logging.md) 外掛程式用於記錄客戶端請求。

## JVM

<snippet id="jvm-logging">
  <p>
    在 <a href="#jvm">JVM</a> 上，Ktor 使用適用於 Java 的簡單日誌門面
    (<a href="http://www.slf4j.org/">SLF4J</a>) 作為日誌記錄的抽象層。SLF4J 將日誌記錄 API 與底層日誌記錄實作分離，
    讓您能夠整合最符合應用程式需求的日誌記錄框架。
    常見的選擇包括 <a href="https://logback.qos.ch/">Logback</a> 或
    <a href="https://logging.apache.org/log4j">Log4j</a>。如果未提供框架，SLF4J 將預設為無操作 (NOP) 實作，
    這基本上會停用日誌記錄。
  </p>

  <p>
    若要啟用日誌記錄，請包含一個含有所需 SLF4J 實作的 Artifact，例如 <a href="https://logback.qos.ch/">Logback</a>：
  </p>
  <var name="group_id" value="ch.qos.logback"/>
  <var name="artifact_name" value="logback-classic"/>
  <var name="version" value="logback_version"/>
  
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
    
</snippet>

### Android

<p>
    在 Android 上，我們建議使用 SLF4J Android 函式庫：
</p>
 <var name="group_id" value="org.slf4j"/>
  <var name="artifact_name" value="slf4j-android"/>
  <var name="version" value="slf4j_version"/>
<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
</tabs>

## Native

對於 [Native 目標](client-engines.md#native)，`Logging` 外掛程式提供一個將所有內容列印到標準輸出流 (`STDOUT`) 的日誌記錄器。

## Multiplatform

在 [多平台專案](client-create-multiplatform-application.md) 中，您可以指定一個 [自訂日誌記錄器](#custom_logger)，例如 [Napier](https://github.com/AAkira/Napier)。

## 新增依賴項 {id="add_dependencies"}

若要新增 `Logging` 外掛程式，請將以下 Artifact 包含到您的建置腳本中：

  <var name="artifact_name" value="ktor-client-logging"/>
  
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
    
  
    <p>
        您可以從 <Links href="/ktor/client-dependencies" summary="了解如何將客戶端依賴項新增至現有專案。">新增客戶端依賴項</Links> 中了解更多關於 Ktor 客戶端所需 Artifact 的資訊。
    </p>
    

## 安裝 Logging {id="install_plugin"}

若要安裝 `Logging`，請將其傳遞到 [客戶端組態區塊](client-create-and-configure.md#configure-client) 內的 `install` 函數中：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*
//...
val client = HttpClient(CIO) {
    install(Logging)
}
```

## 設定 Logging {id="configure_plugin"}

`Logging` 外掛程式的組態由 [Logging.Config](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging-config) 類別提供。以下範例顯示了一個範例組態：

`logger`
: 指定一個 Logger 實例。`Logger.DEFAULT` 使用 SLF4J 日誌記錄框架。對於 Native 目標，將此屬性設定為 `Logger.SIMPLE`。

`level`
: 指定日誌記錄級別。`LogLevel.HEADERS` 只會記錄請求/回應標頭。

`filter()`
: 允許您根據指定的判斷式過濾匹配請求的日誌訊息。在以下範例中，只有發送到 `ktor.io` 的請求會被記錄到日誌中。

`sanitizeHeader()`
: 允許您淨化敏感標頭，以避免其值出現在日誌中。在以下範例中，`Authorization` 標頭的值在記錄時將被替換為 '***'。

[object Promise]

如需完整範例，請參閱 [client-logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging)。

### 提供自訂日誌記錄器 {id="custom_logger"}

若要在您的客戶端應用程式中使用自訂日誌記錄器，您需要建立一個 `Logger` 實例並覆寫 `log` 函數。
以下範例展示了如何使用 [Napier](https://github.com/AAkira/Napier) 函式庫來記錄 HTTP 呼叫：

[object Promise]

如需完整範例，請參閱 [client-logging-napier](https://github.com/AAkira/Napier)。