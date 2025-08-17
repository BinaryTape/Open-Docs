[//]: # (title: Ktor Clientでのロギング)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:ktor-client-logging</code>
</p>
<var name="example_name" value="client-logging"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

ロギングとは、重要なイベント、エラー、または情報メッセージを記録することで、プログラムの動作を追跡し、問題を診断する方法です。

Ktorは、[Logging](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging)プラグインを使用してHTTPコールをログに記録する機能を提供します。
このプラグインは、異なるプラットフォーム向けに異なるロガータイプを提供します。

> サーバー側では、Ktorはアプリケーションロギング用の[Logging](server-logging.md)プラグインと、クライアントリクエストのロギング用の[CallLogging](server-call-logging.md)プラグインを提供します。

## JVM

<snippet id="jvm-logging">
  <p>
    <a href="#jvm">JVM</a>では、Ktorはロギングの抽象化レイヤーとしてSimple Logging Facade for Java
    (<a href="http://www.slf4j.org/">SLF4J</a>)を使用します。SLF4Jは、ロギングAPIと基盤となるロギング実装を分離し、
    アプリケーションの要件に最適なロギングフレームワークを統合できるようにします。
    一般的な選択肢には<a href="https://logback.qos.ch/">Logback</a>や
    <a href="https://logging.apache.org/log4j">Log4j</a>があります。フレームワークが提供されていない場合、SLF4Jはデフォルトで
    no-operation (NOP)実装となり、実質的にロギングを無効にします。
  </p>

  <p>
    ロギングを有効にするには、<a href="https://logback.qos.ch/">Logback</a>のような必要なSLF4J実装を含むアーティファクトを含めます。
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
    Androidでは、SLF4J Androidライブラリの使用を推奨します。
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

[Nativeターゲット](client-engines.md#native)の場合、`Logging`プラグインはすべてを標準出力ストリーム (`STDOUT`) に出力するロガーを提供します。

## Multiplatform

[マルチプラットフォームプロジェクト](client-create-multiplatform-application.md)では、[Napier](https://github.com/AAkira/Napier)のような[カスタムロガー](#custom_logger)を指定できます。

## 依存関係の追加 {id="add_dependencies"}

`Logging`プラグインを追加するには、以下のアーティファクトをビルドスクリプトに含めます。

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
      Ktorクライアントに必要なアーティファクトの詳細については、<Links href="/ktor/client-dependencies" summary="既存のプロジェクトにクライアントの依存関係を追加する方法について学びます。">クライアントの依存関係を追加する</Links>を参照してください。
  </p>

## ロギングのインストール {id="install_plugin"}

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

## ロギングの設定 {id="configure_plugin"}

`Logging`プラグインの設定は、[Logging.Config](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging-config)クラスによって提供されます。以下の例は、設定のサンプルを示しています。

`logger`
: Loggerインスタンスを指定します。`Logger.DEFAULT`はSLF4Jロギングフレームワークを使用します。Nativeターゲットの場合、このプロパティを`Logger.SIMPLE`に設定します。

`level`
: ロギングレベルを指定します。`LogLevel.HEADERS`はリクエスト/レスポンスヘッダーのみをログに記録します。

`filter()`
: 指定された述語に一致するリクエストのログメッセージをフィルタリングできます。以下の例では、`ktor.io`へのリクエストのみがログに含まれます。

`sanitizeHeader()`
: 機密性の高いヘッダーをサニタイズして、その値がログに表示されないようにすることができます。以下の例では、ログに記録される際に`Authorization`ヘッダーの値が「***」に置き換えられます。

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

完全な例については、[client-logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging)を参照してください。

### カスタムロガーを提供する {id="custom_logger"}

クライアントアプリケーションでカスタムロガーを使用するには、`Logger`インスタンスを作成し、`log`関数をオーバーライドする必要があります。
以下の例は、HTTPコールをログに記録するために[Napier](https://github.com/AAkira/Napier)ライブラリを使用する方法を示しています。

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

完全な例については、[client-logging-napier](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging-napier)を参照してください。