[//]: # (title: Ktor Client における OpenTelemetry を使用した分散トレーシング)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>
<var name="plugin_name" value="KtorClientTelemetry"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.opentelemetry.instrumentation:opentelemetry-ktor-3.0</code>
</p>
<var name="example_name" value="opentelemetry"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Ktor は、トレース、メトリクス、ログなどのテレメトリデータを収集するためのオープンソースのオブザーバビリティ（観測性）フレームワークである [OpenTelemetry](https://opentelemetry.io/) と統合されています。OpenTelemetry は、アプリケーションをインストルメント（計装）し、Grafana や Jaeger などのモニタリングおよびオブザーバビリティツールにデータをエクスポートするための標準的な方法を提供します。

`%plugin_name%` プラグインを使用すると、送信 HTTP リクエストを自動的にトレースできます。メソッド、URL、ステータスコードなどのメタデータをキャプチャし、サービス間でトレースコンテキストを伝播させます。また、スパン属性をカスタマイズしたり、独自の OpenTelemetry 設定を使用したりすることも可能です。

> サーバー側では、OpenTelemetry はサーバーへの受信 HTTP リクエストをインストルメントするための [KtorServerTelemetry](server-opentelemetry.md) プラグインを提供しています。

undefined
undefined

## %plugin_name% のインストール {id="install_plugin"}

`%plugin_name%` プラグインをインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内の `install` 関数に渡し、[設定済みの `OpenTelemetry` インスタンス](#configure-otel)をセットします。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
//...

val client = HttpClient(CIO) {
    val openTelemetry = getOpenTelemetry(serviceName = "opentelemetry-ktor-client")

    install(%plugin_name%) {
        setOpenTelemetry(openTelemetry)
    }
}
```

## トレーシングの設定

Ktor クライアントが送信 HTTP コールの OpenTelemetry スパンを記録およびエクスポートする方法をカスタマイズできます。以下のオプションを使用して、どのリクエストをトレースするか、スパンの名前、含まれる属性、キャプチャされるヘッダー、およびスパンの種類（kind）の決定方法を調整できます。

> これらの概念の詳細については、[OpenTelemetry トレーシングのドキュメント](https://opentelemetry.io/docs/concepts/signals/traces/)を参照してください。

undefined
undefined

### レスポンスヘッダーのキャプチャ

特定の HTTP レスポンスヘッダーをスパン属性としてキャプチャするには、`capturedResponseHeaders` プロパティを使用します。

```kotlin
install(%plugin_name%) {
    // ...
    capturedResponseHeaders(HttpHeaders.ContentType, CUSTOM_HEADER)
}
```

undefined

## 次のステップ

`%plugin_name%` をインストールして設定すると、テレメトリが有効になっているサービス（[`KtorServerTelemetry`](server-opentelemetry.md) を使用しているサービスなど）にリクエストを送信することで、スパンが作成され伝播されていることを確認できます。[Jaeger](https://www.jaegertracing.io/)、[Zipkin](https://zipkin.io/)、[Grafana Tempo](https://grafana.com/oss/tempo/) などのオブザーバビリティバックエンドでトレースの両側を確認することで、分散トレーシングがエンドツーエンドで動作していることを確認できます。