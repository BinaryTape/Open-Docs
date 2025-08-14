[//]: # (title: Ktor Clientでのロギング)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-client-logging</code>
</p>
<var name="example_name" value="client-logging"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

ロギングとは、プログラムが何を行っているかを追跡し、重要なイベント、エラー、または情報メッセージを記録することで問題を診断する方法です。

Ktorは、[Logging](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging)プラグインを使用してHTTP呼び出しをログに記録する機能を提供します。
このプラグインは、異なるプラットフォーム向けに異なるロガータイプを提供します。

> サーバー側では、Ktorはアプリケーションロギング用の[Logging](server-logging.md)プラグインと、クライアントリクエストのロギング用の[CallLogging](server-call-logging.md)プラグインを提供します。

## JVM

<snippet id="jvm-logging">
  <p>
    [JVM](#jvm)では、Ktorはロギングの抽象レイヤーとしてSimple Logging Facade for Java ([SLF4J](http://www.slf4j.org/))を使用します。SLF4JはロギングAPIと基盤となるロギング実装を分離し、アプリケーションの要件に最適なロギングフレームワークを統合できるようにします。一般的な選択肢としては、[Logback](https://logback.qos.ch/)や[Log4j](https://logging.apache.org/log4j)があります。フレームワークが提供されていない場合、SLF4Jはデフォルトでno-operation (NOP)実装になり、実質的にロギングが無効になります。
  </p>

  <p>
    ロギングを有効にするには、[Logback](https://logback.qos.ch/)など、必要なSLF4J実装を含むアーティファクトを含めます。
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
    Androidでは、SLF4J Androidライブラリの使用を推奨します。
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

[Nativeターゲット](client-engines.md#native)の場合、`Logging`プラグインはすべてを標準出力ストリーム（`STDOUT`）に出力するロガーを提供します。

## Multiplatform

[マルチプラットフォームプロジェクト](client-create-multiplatform-application.md)では、[Napier](https://github.com/AAkira/Napier)などの[カスタムロガー](#custom_logger)を指定できます。

## 依存関係の追加 {id="add_dependencies"}

`Logging`プラグインを追加するには、ビルドスクリプトに次のアーティファクトを含めます。

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
        Ktorクライアントに必要なアーティファクトの詳細については、<Links href="/ktor/client-dependencies" summary="Learn how to add client dependencies to an existing project.">クライアントの依存関係の追加</Links>を参照してください。
    </p>
    

## ロギングのインストール {id="install_plugin"}

`Logging`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内の`install`関数に渡します。

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

`Logging`プラグインの設定は、[Logging.Config](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-logging/io.ktor.client.plugins.logging/-logging-config)クラスによって提供されます。以下の例は、設定例を示しています。

`logger`
: Loggerインスタンスを指定します。`Logger.DEFAULT`はSLF4Jロギングフレームワークを使用します。Nativeターゲットの場合、このプロパティを`Logger.SIMPLE`に設定します。

`level`
: ロギングレベルを指定します。`LogLevel.HEADERS`はリクエスト/レスポンスヘッダーのみをログに記録します。

`filter()`
: 指定された述語に一致するリクエストのログメッセージをフィルタリングできます。以下の例では、`ktor.io`へのリクエストのみがログに記録されます。

`sanitizeHeader()`
: 機密性の高いヘッダーをサニタイズして、その値がログに表示されないようにすることができます。以下の例では、ログに記録される際に`Authorization`ヘッダーの値が'***'に置き換えられます。

[object Promise]

完全な例については、[client-logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging)を参照してください。

### カスタムロガーの提供 {id="custom_logger"}

クライアントアプリケーションでカスタムロガーを使用するには、`Logger`インスタンスを作成し、`log`関数をオーバーライドする必要があります。
以下の例は、HTTP呼び出しをログに記録するために[Napier](https://github.com/AAkira/Napier)ライブラリを使用する方法を示しています。

[object Promise]

完全な例については、[client-logging-napier](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-logging-napier)を参照してください。