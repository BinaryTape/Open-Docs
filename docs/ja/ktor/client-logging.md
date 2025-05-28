[//]: # (title: Ktor Clientでのロギング)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-client-logging</code>
</p>
<var name="example_name" value="client-logging"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

ロギングは、重要なイベント、エラー、または情報メッセージを記録することで、プログラムの動作を追跡し、問題を診断する方法です。

Ktorは、[Logging](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging)プラグインを使用してHTTPコールをログに記録する機能を提供します。
このプラグインは、さまざまなプラットフォーム向けの異なるロガータイプを提供します。

> サーバー側では、Ktorはアプリケーションロギング用の[Logging](server-logging.md)プラグインと、クライアントリクエストのロギング用の[CallLogging](server-call-logging.md)プラグインを提供します。

## JVM

<snippet id="jvm-logging">
  <p>
    <a href="client-engines.md" anchor="jvm">JVM</a>では、Ktorはロギングの抽象化レイヤーとしてSimple Logging Facade for Java (<a href="http://www.slf4j.org/">SLF4J</a>)を使用します。SLF4Jは、ロギングAPIと基盤となるロギング実装を分離し、アプリケーションの要件に最も適したロギングフレームワークを統合できるようにします。一般的な選択肢には、<a href="https://logback.qos.ch/">Logback</a>や<a href="https://logging.apache.org/log4j">Log4j</a>などがあります。フレームワークが提供されない場合、SLF4Jはデフォルトでno-operation (NOP)実装を使用し、実質的にロギングを無効にします。
  </p>

  <p>
    ロギングを有効にするには、<a href="https://logback.qos.ch/">Logback</a>など、必要なSLF4J実装を含むアーティファクトを含めます。
  </p>
  <var name="group_id" value="ch.qos.logback"/>
  <var name="artifact_name" value="logback-classic"/>
  <var name="version" value="logback_version"/>
  <include from="lib.topic" element-id="add_artifact"/>
</snippet>

### Android

<p>
    Androidでは、SLF4J Androidライブラリの使用を推奨します。
</p>
 <var name="group_id" value="org.slf4j"/>
  <var name="artifact_name" value="slf4j-android"/>
  <var name="version" value="slf4j_version"/>
<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin">
            implementation("%group_id%:%artifact_name%:$%version%")
        </code-block>
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy">
            implementation "%group_id%:%artifact_name%:$%version%"
        </code-block>
    </tab>
</tabs>

## Native

[Nativeターゲット](client-engines.md#native)の場合、`Logging`プラグインはすべてを標準出力ストリーム（`STDOUT`）に出力するロガーを提供します。

## マルチプラットフォーム

[マルチプラットフォームプロジェクト](client-create-multiplatform-application.md)では、[Napier](https://github.com/AAkira/Napier)のような[カスタムロガー](#custom_logger)を指定できます。

## 依存関係の追加 {id="add_dependencies"}

`Logging`プラグインを追加するには、ビルドスクリプトに以下のアーティファクトを含めます。

  <var name="artifact_name" value="ktor-client-logging"/>
  <include from="lib.topic" element-id="add_ktor_artifact"/>
  <include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## Loggingのインストール {id="install_plugin"}

`Logging`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡します。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*
//...
val client = HttpClient(CIO) {
    install(Logging)
}
```

## Loggingの設定 {id="configure_plugin"}

`Logging`プラグインの設定は、[Logging.Config](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging-config)クラスによって提供されます。以下の例は、設定例を示しています。

`logger`
: Loggerインスタンスを指定します。`Logger.DEFAULT`はSLF4Jロギングフレームワークを使用します。Nativeターゲットの場合、このプロパティを`Logger.SIMPLE`に設定します。

`level`
: ロギングレベルを指定します。`LogLevel.HEADERS`はリクエスト/レスポンスヘッダーのみをログに記録します。

`filter()`
: 指定された述語に一致するリクエストのログメッセージをフィルタリングできます。以下の例では、`ktor.io`へのリクエストのみがログに記録されます。

`sanitizeHeader()`
: 機密性の高いヘッダーをサニタイズし、その値がログに表示されないようにします。以下の例では、`Authorization`ヘッダーの値はログ記録時に'***'に置き換えられます。

```kotlin
```

{src="snippets/client-logging/src/main/kotlin/com/example/Application.kt"}

完全な例については、[client-logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging)を参照してください。

### カスタムロガーの提供 {id="custom_logger"}

クライアントアプリケーションでカスタムロガーを使用するには、`Logger`インスタンスを作成し、`log`関数をオーバーライドする必要があります。以下の例は、[Napier](https://github.com/AAkira/Napier)ライブラリを使用してHTTPコールをログに記録する方法を示しています。

```kotlin
```

{src="snippets/client-logging-napier/src/main/kotlin/com/example/Application.kt" include-symbol="main"}

完全な例については、[client-logging-napier](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging-napier)を参照してください。