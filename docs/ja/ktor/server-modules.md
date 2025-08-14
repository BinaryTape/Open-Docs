[//]: # (title: モジュール)

<tldr>
<p>
<b>コード例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules">embedded-server-modules</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules">engine-main-modules</a>
</p>
</tldr>

<link-summary>モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。</link-summary>

Ktorでは、特定のモジュール内に特定の[ルート](server-routing.md)を定義することで、モジュールを使用してアプリケーションを[構造化](server-application-structure.md)できます。モジュールは、[Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html)クラスの_[拡張関数](https://kotlinlang.org/docs/extensions.html)_です。以下の例では、`module1`拡張関数が`/module1` URLパスへのGETリクエストを受け入れるモジュールを定義しています。

[object Promise]

アプリケーションでのモジュールのロードは、[サーバーを作成する](server-create-and-configure.topic)方法によって異なります。`embeddedServer`関数をコードで使用するか、`application.conf`設定ファイルを使用するかです。

> 指定されたモジュールにインストールされた[プラグイン](server-plugins.md#install)は、他のロードされたモジュールにも有効であることに注意してください。

## embeddedServer {id="embedded-server"}

通常、`embeddedServer`関数はモジュールをラムダ引数として暗黙的に受け入れます。例は[](server-create-and-configure.topic#embedded-server)セクションで確認できます。アプリケーションロジックを別のモジュールに抽出し、このモジュールへの参照を`module`パラメータとして渡すこともできます。

[object Promise]

完全な例はこちらで確認できます: [embedded-server-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules)。

## 設定ファイル {id="hocon"}

サーバーを設定するために`application.conf`または`application.yaml`ファイルを使用する場合、`ktor.application.modules`プロパティを使用してロードするモジュールを指定する必要があります。

2つのパッケージに3つのモジュールが定義されているとします。`com.example`パッケージに2つ、`org.sample`パッケージに1つです。

<tabs>
<tab title="Application.kt">

[object Promise]

</tab>
<tab title="Sample.kt">

[object Promise]

</tab>
</tabs>

設定ファイルでこれらのモジュールを参照するには、それらの完全修飾名を提供する必要があります。完全修飾モジュール名には、クラスの完全修飾名と拡張関数名が含まれます。

<tabs group="config">
<tab title="application.conf" group-key="hocon">

[object Promise]

</tab>
<tab title="application.yaml" group-key="yaml">

[object Promise]

</tab>
</tabs>

完全な例はこちらで確認できます: [engine-main-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules)。

## モジュールの並行ロード

アプリケーションモジュールを作成する際に、中断可能な関数を使用できます。これにより、アプリケーションの起動時にイベントを非同期で実行できます。そのためには、`suspend`キーワードを追加します。

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

すべてのアプリケーションモジュールを独立して起動することもできます。これにより、1つが中断されても他のモジュールがブロックされることはありません。これにより、依存性注入のための非シーケンシャルロードが可能になり、場合によってはロードが高速化されます。

### 設定オプション

以下のGradle設定プロパティが利用可能です:

| プロパティ                                | 型                        | 説明                                              | デフォルト      |
|-----------------------------------------|-----------------------------|----------------------------------------------------------|--------------|
| `ktor.application.startup`              | `sequential` / `concurrent` | アプリケーションモジュールのロード方法を定義します       | `sequential` |
| `ktor.application.startupTimeoutMillis` | `Long`                      | アプリケーションモジュールのロードのタイムアウト（ミリ秒単位） | `100000`     |

### モジュールの並行ロードを有効にする

モジュールの並行ロードを選択するには、`gradle.properties`ファイルに以下のプロパティを追加します。

```none
ktor.application.startup = concurrent
```

依存性注入の場合、以下のモジュールを出現順に問題なくロードできます。

```kotlin
suspend fun Application.installEvents() {
    // Suspends until provided
    val kubernetesConnection = dependencies.resolve<KubernetesConnection>()
}

suspend fun Application.loadEventsConnection() {
    dependencies.provide<KubernetesConnection> {
        connect(property<KubernetesConfig>("app.events"))
    }
}
```

> モジュールの並行ロードはシングルスレッドプロセスです。これにより、アプリケーションの内部共有状態における安全でないコレクションでのスレッド問題を回避するのに役立ちます。
>
{style="note"}