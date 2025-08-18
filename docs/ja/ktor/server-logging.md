[//]: # (title: Ktorサーバーでのロギング)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="logging"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
Ktorは、さまざまなロギングフレームワーク（例えばLogbackやLog4j）のファサードとしてSLF4J APIを使用し、アプリケーションイベントのログ記録を可能にします。
</link-summary>

Ktorは、使用するプラットフォームに応じて、アプリケーションのログ記録にさまざまな方法を提供します。

- JVMでは、Ktorは[SLF4J API](http://www.slf4j.org/)をさまざまなロギングフレームワーク（例えば[Logback](https://logback.qos.ch/)や[Log4j](https://logging.apache.org/log4j)）のファサードとして使用し、アプリケーションイベントのログ記録を可能にします。ロギングを有効にするには、目的のフレームワークの[依存関係](#add_dependencies)を追加し、そのフレームワークに固有の[設定](#configure-logger)を提供する必要があります。
  > クライアントリクエストをログに記録するために、[CallLogging](server-call-logging.md)プラグインをインストールして設定することもできます。
- [Nativeサーバー](server-native.md)の場合、Ktorはすべてを標準出力に出力するロガーを提供します。

## JVM {id="jvm"}
### ロガーの依存関係を追加する {id="add_dependencies"}
ロギングを有効にするには、目的のロギングフレームワークのアーティファクトを含める必要があります。
例えば、Logbackには以下の依存関係が必要です。

<var name="group_id" value="ch.qos.logback"/>
<var name="artifact_name" value="logback-classic"/>
<var name="version" value="logback_version"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;%group_id%&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%&lt;/artifactId&gt;&#10;                &lt;version&gt;${%version%}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

Log4jを使用するには、`org.apache.logging.log4j:log4j-core`と`org.apache.logging.log4j:log4j-slf4j-impl`のアーティファクトを追加する必要があります。

### ロガーを設定する {id="configure-logger"}

選択したロギングフレームワークの設定方法については、そのドキュメントを参照してください。例えば、以下の通りです。
- [Logback configuration](http://logback.qos.ch/manual/configuration.html)
- [Log4j configuration](https://logging.apache.org/log4j/2.x/manual/configuration.html)

例えば、Logbackを設定するには、`logback.xml`ファイルをクラスパスのルート（例えば`src/main/resources`）に配置する必要があります。
以下の例は、ログをコンソールに出力する`STDOUT`アペンダーを使用したサンプルのLogback設定を示しています。

```xml
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{YYYY-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    <root level="trace">
        <appender-ref ref="STDOUT"/>
    </root>
    <logger name="io.netty" level="INFO"/>
</configuration>
```

ログをファイルに出力したい場合は、`FILE`アペンダーを使用できます。

```xml
<configuration>
    <appender name="FILE" class="ch.qos.logback.core.FileAppender">
        <file>testFile.log</file>
        <append>true</append>
        <encoder>
            <pattern>%d{YYYY-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    <root level="trace">
        <appender-ref ref="FILE"/>
    </root>
    <logger name="io.netty" level="INFO"/>
</configuration>
```

完全な例はこちらで確認できます: [logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)。

## Native {id="native"}

Nativeサーバーのロギングレベルを設定するには、アプリケーションの[実行時](server-run.md)に`KTOR_LOG_LEVEL`環境変数に以下のいずれかの値を割り当てます。
- _TRACE_
- _DEBUG_
- _INFO_
- _WARN_
- _ERROR_

例えば、_TRACE_レベルでは[ルートトレース](server-routing.md#trace_routes)が有効になり、特定のルートが実行されない理由を判断するのに役立ちます。

## コード内のロガーにアクセスする {id="access_logger"}
Loggerインスタンスは、[Logger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-logger/index.html)インターフェースを実装するクラスによって表現されます。`Application`内で[Application.log](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/log.html)プロパティを使用してLoggerインスタンスにアクセスできます。例えば、以下のコードスニペットは、[モジュール](server-modules.md)内でログにメッセージを追加する方法を示しています。

```kotlin
import io.ktor.server.application.*

fun Application.module() {
    log.info("Hello from module!")
}
```

`call.application.environment.log`プロパティを使用して[ApplicationCall](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/index.html)からLoggerにアクセスすることもできます。

```kotlin
routing {
    get("/api/v1") {
        call.application.environment.log.info("Hello from /api/v1!")
    }
}
```

## プラグインとファイルでのロギング {id="plugins_and_files"}

プラグインやファイル内でアプリケーションログを使用することは推奨されません。各プラグインまたはファイルごとに別個のロガーを使用する方が良いでしょう。これを行うには、任意のロギングライブラリを使用できます。

マルチプラットフォームプロジェクトの場合、[KtorSimpleLogger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-ktor-simple-logger.html)クラスを使用できます。

```kotlin
package com.example

import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.util.logging.*

internal val LOGGER = KtorSimpleLogger("com.example.RequestTracePlugin")

val RequestTracePlugin = createRouteScopedPlugin("RequestTracePlugin", { }) {
    onCall { call ->
        LOGGER.trace("Processing call: ${call.request.uri}")
    }
}