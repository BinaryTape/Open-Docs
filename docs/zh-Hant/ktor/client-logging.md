[//]: # (title: Ktor 客戶端中的日誌記錄)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>所需的依賴項</b>：<code>io.ktor:ktor-client-logging</code>
</p>
<var name="example_name" value="client-logging"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

日誌記錄是一種追蹤程式執行情況並透過記錄重要事件、錯誤或資訊性訊息來診斷問題的方式。

Ktor 提供使用
[Logging](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging)
外掛程式來記錄 HTTP 呼叫的功能。
此外掛程式為不同的平台提供不同的日誌記錄器類型。

> 在伺服器端，Ktor 提供 [Logging](server-logging.md) 外掛程式用於應用程式日誌記錄，以及
> [CallLogging](server-call-logging.md) 外掛程式用於記錄客戶端請求。

## JVM

<snippet id="jvm-logging">
  <p>
    在 <a href="#jvm">JVM</a> 上，Ktor 使用適用於 Java 的簡單日誌記錄介面
    (<a href="http://www.slf4j.org/">SLF4J</a>) 作為日誌記錄的抽象層。SLF4J 將日誌記錄 API 與底層日誌記錄實作解耦，
    讓您可以整合最符合應用程式需求的日誌記錄框架。
    常見的選擇包括 <a href="https://logback.qos.ch/">Logback</a> 或
    <a href="https://logging.apache.org/log4j">Log4j</a>。如果沒有提供框架，SLF4J 將預設使用
    無操作 (NOP) 實作，這基本上會禁用日誌記錄。
  </p>

  <p>
    要啟用日誌記錄，請包含一個具有所需 SLF4J 實作的 artifact，例如
    <a href="https://logback.qos.ch/">Logback</a>：
  </p>
  <var name="group_id" value="ch.qos.logback"/>
  <var name="artifact_name" value="logback-classic"/>
  <var name="version" value="logback_version"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;%group_id%&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%&lt;/artifactId&gt;&#10;                  &lt;version&gt;${%version%}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>
</snippet>

### Android

<p>
    在 Android 上，我們建議使用 SLF4J Android 函式庫：
</p>
 <var name="group_id" value="org.slf4j"/>
  <var name="artifact_name" value="slf4j-android"/>
  <var name="version" value="slf4j_version"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
    </TabItem>
</Tabs>

## Native

對於 [Native 目標](client-engines.md#native)，`Logging` 外掛程式提供一個將所有內容
列印到標準輸出串流 (`STDOUT`) 的日誌記錄器。

## Multiplatform

在 [多平台專案](client-create-multiplatform-application.md) 中，您可以指定
[自訂日誌記錄器](#custom_logger)，例如 [Napier](https://github.com/AAkira/Napier)。

## 新增依賴項 {id="add_dependencies"}

要新增 `Logging` 外掛程式，請在您的建置腳本中包含以下 artifact：

  <var name="artifact_name" value="ktor-client-logging"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                  &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>
  <p>
      您可以從 <Links href="/ktor/client-dependencies" summary="了解如何將客戶端依賴項新增到現有專案。">新增客戶端依賴項</Links> 中了解更多關於 Ktor 客戶端所需的 artifact。
  </p>

## 安裝 Logging {id="install_plugin"}

要安裝 `Logging`，請在
[客戶端配置區塊](client-create-and-configure.md#configure-client) 中將其傳遞給 `install` 函數：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*
//...
val client = HttpClient(CIO) {
    install(Logging)
}
```

## 配置 Logging {id="configure_plugin"}

`Logging` 外掛程式的配置由
[Logging.Config](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging-config)
類別提供。以下範例顯示一個範例配置：

`logger`
: 指定一個 Logger 實例。`Logger.DEFAULT` 使用 SLF4J 日誌記錄框架。對於 Native 目標，將此屬性設定為 `Logger.SIMPLE`。

`level`
: 指定日誌記錄級別。`LogLevel.HEADERS` 只會記錄請求/回應標頭。

`filter()`
: 允許您篩選與指定判斷式匹配的請求的日誌訊息。在以下範例中，只有發送到 `ktor.io` 的請求會進入日誌。

`sanitizeHeader()`
: 允許您淨化敏感標頭，以避免其值出現在日誌中。在以下範例中，當記錄時，`Authorization` 標頭的值將被替換為 '***'。

```kotlin
package com.example

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val client = HttpClient(CIO) {
            install(Logging) {
                logger = Logger.DEFAULT
                level = LogLevel.HEADERS
                filter { request ->
                    request.url.host.contains("ktor.io")
                }
                sanitizeHeader { header -> header == HttpHeaders.Authorization }
            }
        }

        val response1: HttpResponse = client.get("https://ktor.io/")
        val response2: HttpResponse = client.get("https://jetbrains.com/")
    }
}
```

有關完整範例，請參閱
[client-logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging)。

### 提供自訂的日誌記錄器 {id="custom_logger"}

要在您的客戶端應用程式中使用自訂日誌記錄器，您需要建立一個 `Logger` 實例並覆寫 `log`
函數。
以下範例顯示如何使用 [Napier](https://github.com/AAkira/Napier) 函式庫記錄 HTTP 呼叫：

```kotlin
package com.example

import io.github.aakira.napier.DebugAntilog
import io.github.aakira.napier.Napier
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val client = HttpClient(CIO) {
            install(Logging) {
                logger = object: Logger {
                    override fun log(message: String) {
                        Napier.v("HTTP Client", null, message)
                    }
                }
                level = LogLevel.HEADERS
            }
        }.also { Napier.base(DebugAntilog()) }

        val response: HttpResponse = client.get("https://ktor.io/")
    }
}

```

有關完整範例，請參閱
[client-logging-napier](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging-napier)。