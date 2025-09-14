[//]: # (title: Ktor ClientにおけるOpenTelemetryを使った分散トレース)

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

Ktorは[OpenTelemetry](https://opentelemetry.io/)と統合されています。OpenTelemetryは、トレース、メトリクス、ログなどのテレメトリーデータを収集するためのオープンソースのオブザーバビリティフレームワークです。これにより、アプリケーションをインストゥルメントし、GrafanaやJaegerのようなモニタリングおよびオブザーバビリティツールにデータをエクスポートする標準的な方法が提供されます。

`%plugin_name%`プラグインを使用すると、送信HTTPリクエストを自動的にトレースできます。このプラグインは、メソッド、URL、ステータスコードなどのメタデータをキャプチャし、サービス間でトレースコンテキストを伝播します。スパン属性をカスタマイズしたり、独自のOpenTelemetry設定を使用したりすることもできます。

> サーバー側では、OpenTelemetryはサーバーへの受信HTTPリクエストをインストゥルメントするための[KtorServerTelemetry](server-opentelemetry.md)プラグインを提供します。

<br/>
<br/>

## %plugin_name%をインストールする {id="install_plugin"}

`%plugin_name%`プラグインをインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡し、[設定済みの`OpenTelemetry`インスタンス](#configure-otel)を設定します。

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

## トレースを設定する

Ktorクライアントが送信HTTPコールに対するOpenTelemetryスパンをどのように記録し、エクスポートするかをカスタマイズできます。以下のオプションを使用すると、どのリクエストをトレースするか、スパンにどのように名前を付けるか、どのような属性が含まれるか、どのヘッダーをキャプチャするか、スパンの種類をどのように決定するかを調整できます。

> これらの概念の詳細については、[OpenTelemetryトレースドキュメント](https://opentelemetry.io/docs/concepts/signals/traces/)を参照してください。

<br/>
<br/>

### レスポンスヘッダーをキャプチャする

特定HTTPレスポンスヘッダーをスパン属性としてキャプチャするには、`capturedResponseHeaders`プロパティを使用します。

```kotlin
install(%plugin_name%) {
    // ...
    capturedResponseHeaders(HttpHeaders.ContentType, CUSTOM_HEADER)
}
```

<br/>

## 次のステップ

`%plugin_name%`をインストールして設定したら、[`KtorServerTelemetry`](server-opentelemetry.md)を使用しているサービスなど、テレメトリーが有効になっているサービスにリクエストを送信することで、スパンが作成され伝播されていることを確認できます。[Jaeger](https://www.jaegertracing.io/)、[Zipkin](https://zipkin.io/)、[Grafana Tempo](https://grafana.com/oss/tempo/)のようなオブザーバビリティバックエンドでトレースの両側を視覚化することで、分散トレースがエンドツーエンドで機能していることを確認できます。