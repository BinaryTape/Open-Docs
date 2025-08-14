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
Ktorは、SLF4J APIをさまざまなロギングフレームワーク（例えばLogbackやLog4j）のファサードとして使用し、アプリケーションイベントをログに記録できます。
</link-summary>

Ktorは、使用するプラットフォームに応じて、アプリケーションをログに記録するためのさまざまな方法を提供します。

- JVMでは、Ktorは[SLF4J API](http://www.slf4j.org/)をさまざまなロギングフレームワーク（例えば[Logback](https://logback.qos.ch/)や[Log4j](https://logging.apache.org/log4j)）のファサードとして使用し、アプリケーションイベントをログに記録できます。ロギングを有効にするには、目的のフレームワークの[依存関係](#add_dependencies)を追加し、このフレームワークに固有の[設定](#configure-logger)を提供する必要があります。
  > クライアントリクエストをログに記録するために、[CallLogging](server-call-logging.md)プラグインをインストールして設定することもできます。
- [Nativeサーバー](server-native.md)の場合、Ktorはすべてを標準出力に出力するロガーを提供します。

## JVM {id="jvm"}
### ロガーの依存関係を追加する {id="add_dependencies"}
ロギングを有効にするには、目的のロギングフレームワークのアーティファクトを含める必要があります。
例えば、Logbackは以下の依存関係を必要とします。

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
    

Log4jを使用するには、`org.apache.logging.log4j:log4j-core`と`org.apache.logging.log4j:log4j-slf4j-impl`のアーティファクトを追加する必要があります。

### ロガーを設定する {id="configure-logger"}

選択したロギングフレームワークの設定方法については、例えば以下のドキュメントを参照してください。
- [Logbackの設定](http://logback.qos.ch/manual/configuration.html)
- [Log4jの設定](https://logging.apache.org/log4j/2.x/manual/configuration.html)

例えばLogbackを設定するには、`logback.xml`ファイルをクラスパスのルート（例えば`src/main/resources`内）に配置する必要があります。
以下の例は、`STDOUT`アペンダーを使用し、ログをコンソールに出力するLogback設定の例を示しています。

[object Promise]

ログをファイルに出力したい場合は、`FILE`アペンダーを使用できます。

[object Promise]

完全な例は[こちら](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)で確認できます。

## Native {id="native"}

Nativeサーバーのロギングレベルを設定するには、
アプリケーションを[実行](server-run.md)する際に、`KTOR_LOG_LEVEL`環境変数に次のいずれかの値を割り当てます。
- _TRACE_
- _DEBUG_
- _INFO_
- _WARN_
- _ERROR_

例えば、_TRACE_レベルは[ルートトレース](server-routing.md#trace_routes)を有効にし、特定のルートが実行されない理由を特定するのに役立ちます。

## コードでロガーにアクセスする {id="access_logger"}
Loggerインスタンスは、[Logger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-logger/index.html)インターフェースを実装するクラスによって表現されます。[Application.log](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/log.html)プロパティを使用して、`Application`内でLoggerインスタンスにアクセスできます。例えば、以下のコードスニペットは、[モジュール](server-modules.md)内でログにメッセージを追加する方法を示しています。

[object Promise]

[ApplicationCall](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/index.html)から`call.application.environment.log`プロパティを使用してLoggerにアクセスすることもできます。

[object Promise]

## プラグインとファイルでのロギング {id="plugins_and_files"}

プラグインやファイル内でアプリケーションログを使用することは推奨されません。各プラグインまたはファイルごとに個別のロガーを使用する方が良いでしょう。

これを行うには、任意のロギングライブラリを使用できます。

マルチプラットフォームプロジェクトの場合、[KtorSimpleLogger](https://api.ktor.io/ktor-utils/io.ktor.util.logging/-ktor-simple-logger.html)クラスを使用できます。

[object Promise]