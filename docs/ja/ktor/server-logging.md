[//]: # (title: Ktorサーバーでのロギング)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="logging"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
Ktorは、様々なロギングフレームワーク（例：LogbackやLog4j）のファサードとしてSLF4J APIを使用し、アプリケーションイベントをログに記録できます。
</link-summary>

Ktorは、使用するプラットフォームに応じて、アプリケーションをログに記録するための様々な手段を提供します。

- JVMでは、Ktorは様々なロギングフレームワーク（例：[Logback](https://logback.qos.ch/)や[Log4j](https://logging.apache.org/log4j)）のファサードとして[SLF4J API](http://www.slf4j.org/)を使用し、アプリケーションイベントをログに記録できます。ロギングを有効にするには、必要なフレームワークの[依存関係](#add_dependencies)を追加し、このフレームワークに固有の[設定](#configure-logger)を提供する必要があります。
  > クライアントからのリクエストをログに記録するために、[CallLogging](server-call-logging.md)プラグインをインストールして設定することもできます。
- [Nativeサーバー](server-native.md)の場合、Ktorはすべてを標準出力にプリントするロガーを提供します。

## JVM {id="jvm"}
### ロガーの依存関係を追加 {id="add_dependencies"}
ロギングを有効にするには、目的のロギングフレームワークのアーティファクトを含める必要があります。
例えば、Logbackは以下の依存関係を必要とします。

<var name="group_id" value="ch.qos.logback"/>
<var name="artifact_name" value="logback-classic"/>
<var name="version" value="logback_version"/>
<include from="lib.topic" element-id="add_artifact"/>

Log4jを使用するには、`org.apache.logging.log4j:log4j-core`と`org.apache.logging.log4j:log4j-slf4j-impl`のアーティファクトを追加する必要があります。

### ロガーの設定 {id="configure-logger"}

選択したロギングフレームワークの設定方法については、そのドキュメントを参照してください。例えば、以下の通りです。
- [Logbackの設定](http://logback.qos.ch/manual/configuration.html)
- [Log4jの設定](https://logging.apache.org/log4j/2.x/manual/configuration.html)

例えば、Logbackを設定するには、`logback.xml`ファイルをクラスパスのルート（例：`src/main/resources`）に配置する必要があります。
以下の例は、`STDOUT`アペンダーを使用したLogback設定のサンプルを示しており、ログをコンソールに出力します。

```xml
```
{style="block" src="snippets/logging/src/main/resources/logback.xml"}

ログをファイルに出力したい場合は、`FILE`アペンダーを使用できます。

```xml
```
{style="block" src="snippets/logging/src/main/resources/logback-fileAppender.xml"}

完全な例は以下で確認できます: [logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)。

## Native {id="native"}

Nativeサーバーのロギングレベルを設定するには、アプリケーションを[実行する](server-run.md)際に、`KTOR_LOG_LEVEL`環境変数に以下のいずれかの値を割り当てます。
- _TRACE_
- _DEBUG_
- _INFO_
- _WARN_
- _ERROR_

例えば、_TRACE_レベルでは、いくつかのルートが実行されない理由を特定するのに役立つ[ルーティングのトレース](server-routing.md#trace_routes)が有効になります。

## コード内でのロガーへのアクセス {id="access_logger"}
Loggerインスタンスは、[Logger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-logger/index.html)インターフェースを実装するクラスによって表現されます。`Application`内で[Application.log](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/log.html)プロパティを使用してLoggerインスタンスにアクセスできます。例えば、以下のコードスニペットは、[モジュール](server-modules.md)内でログにメッセージを追加する方法を示しています。

```kotlin
```
{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="3,11-13,35"}

また、`call.application.environment.log`プロパティを使用して、[ApplicationCall](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/index.html)からLoggerにアクセスすることもできます。

```kotlin
```
{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="26-28,30,34"}

## プラグインとファイルでのロギング {id="plugins_and_files"}

プラグインやファイル内でアプリケーションログを使用することは推奨されません。各プラグインまたはファイルごとに個別のロガーを使用することをお勧めします。これを行うには、任意のロギングライブラリを使用できます。

マルチプラットフォームプロジェクトの場合、[KtorSimpleLogger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-ktor-simple-logger.html)クラスを使用できます。

```kotlin
```

{src="snippets/logging/src/main/kotlin/com/example/RequestTracePlugin.kt" include-lines="1-13"}