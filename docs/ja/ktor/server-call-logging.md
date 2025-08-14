[//]: # (title: コールロギング)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="CallLogging"/>
<var name="package_name" value="io.ktor.server.plugins.calllogging"/>
<var name="artifact_name" value="ktor-server-call-logging"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="logging"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✖️
    </p>
    
</tldr>

Ktorは、[SLF4J](http://www.slf4j.org/)ライブラリを使用してアプリケーションイベントをログに記録する機能を提供します。一般的なロギング設定については、[](server-logging.md)トピックを参照してください。

`%plugin_name%`プラグインを使用すると、着信クライアントリクエストをログに記録できます。

## 依存関係の追加 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>を使用するには、<code>%artifact_name%</code>アーティファクトをビルドスクリプトに含める必要があります。
    </p>
    

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
    

## %plugin_name%のインストール {id="install_plugin"}

    <p>
        <code>%plugin_name%</code>プラグインをアプリケーションに<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルーティングをグループ化することでアプリケーションを構造化できます。">モジュール</Links>の<code>install</code>関数に渡します。以下のコードスニペットは、<code>%plugin_name%</code>のインストール方法を示しています...
    </p>
    <list>
        <li>
            ...<code>embeddedServer</code>関数呼び出し内で。
        </li>
        <li>
            ...<code>Application</code>クラスの拡張関数である明示的に定義された<code>module</code>内で。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

## ロギング設定の構成 {id="configure"}

`%plugin_name%`を複数の方法で構成できます。ロギングレベルの指定、指定された条件に基づくリクエストのフィルタリング、ログメッセージのカスタマイズなどです。利用可能な設定については、[CallLoggingConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-logging/io.ktor.server.plugins.calllogging/-call-logging-config/index.html)で確認できます。

### ロギングレベルの設定 {id="logging_level"}

デフォルトでは、Ktorは<code>Level.INFO</code>ロギングレベルを使用します。変更するには、<code>level</code>プロパティを使用します。

[object Promise]

### ログリクエストのフィルタリング {id="filter"}

<code>filter</code>プロパティを使用すると、リクエストをフィルタリングするための条件を追加できます。以下の例では、<code>/api/v1</code>へのリクエストのみがログに含まれます。

[object Promise]

### ログメッセージ形式のカスタマイズ {id="format"}

<code>format</code>関数を使用すると、リクエスト/レスポンスに関連する任意のデータをログに含めることができます。以下の例は、各リクエストに対するレスポンスステータス、リクエストHTTPメソッド、および<code>User-Agent</code>ヘッダー値をログに記録する方法を示しています。

[object Promise]

完全な例はこちらで確認できます: [logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)。

### コールパラメータをMDCに含める {id="mdc"}

`%plugin_name%`プラグインはMDC（Mapped Diagnostic Context）をサポートしています。<code>mdc</code>関数を使用すると、指定された名前で目的のコンテキスト値をMDCに配置できます。たとえば、以下のコードスニペットでは、<code>name</code>クエリパラメータがMDCに追加されます。

```kotlin
install(CallLogging) {
    mdc("name-parameter") { call ->
        call.request.queryParameters["name"]
    }
}
```

追加された値は、<code>ApplicationCall</code>のライフタイム中にアクセスできます。

```kotlin
import org.slf4j.MDC
// ...
MDC.get("name-parameter")
```