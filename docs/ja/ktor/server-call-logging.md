[//]: # (title: 呼び出しロギング)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="CallLogging"/>
<var name="package_name" value="io.ktor.server.plugins.calllogging"/>
<var name="artifact_name" value="ktor-server-call-logging"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="logging"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktorは、[SLF4J](http://www.slf4j.org/)ライブラリを使用してアプリケーションイベントをログに記録する機能を提供します。一般的なロギング設定については、[](server-logging.md)トピックで学ぶことができます。

`%plugin_name%`プラグインを使用すると、受信クライアントリクエストをログに記録できます。

## 依存関係を追加する {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name%をインストールする {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## ロギング設定を構成する {id="configure"}

`%plugin_name%`は、ロギングレベルの指定、特定の条件に基づいたリクエストのフィルタリング、ログメッセージのカスタマイズなど、複数の方法で設定できます。利用可能な設定は、[CallLoggingConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-logging/io.ktor.server.plugins.calllogging/-call-logging-config/index.html)で確認できます。

### ロギングレベルを設定する {id="logging_level"}

デフォルトでは、Ktorは`Level.INFO`ロギングレベルを使用します。変更するには、`level`プロパティを使用します。

```kotlin
```

{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="14-15,25"}

### ログリクエストをフィルタリングする {id="filter"}

`filter`プロパティを使用すると、リクエストをフィルタリングするための条件を追加できます。以下の例では、`/api/v1`へのリクエストのみがログに記録されます。

```kotlin
```

{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="14,16-18,25"}

### ログメッセージのフォーマットをカスタマイズする {id="format"}

`format`関数を使用すると、リクエスト/レスポンスに関連する任意のデータをログに含めることができます。以下の例は、各リクエストのレスポンスステータス、HTTPメソッド、および`User-Agent`ヘッダーの値をログに記録する方法を示しています。

```kotlin
```

{src="snippets/logging/src/main/kotlin/com/example/Application.kt" include-lines="14,19-25"}

完全な例は、こちらで確認できます: [logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)。

### 呼び出しパラメータをMDCに設定する {id="mdc"}

`%plugin_name%`プラグインはMDC（Mapped Diagnostic Context）をサポートしています。`mdc`関数を使用すると、指定された名前で目的のコンテキスト値をMDCに設定できます。たとえば、以下のコードスニペットでは、`name`クエリパラメータがMDCに追加されています。

```kotlin
install(CallLogging) {
    mdc("name-parameter") { call ->
        call.request.queryParameters["name"]
    }
}
```

追加された値は、`ApplicationCall`のライフタイム中にアクセスできます。

```kotlin
import org.slf4j.MDC
// ...
MDC.get("name-parameter")