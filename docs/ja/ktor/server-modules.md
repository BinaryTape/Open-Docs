[//]: # (title: モジュール)

<tldr>
<p>
<b>コード例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules">embedded-server-modules</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules">engine-main-modules</a>
</p>
</tldr>

<link-summary>モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。</link-summary>
<show-structure for="chapter" depth="2"/>

Ktorでは、特定のモジュール内に特定の[ルート](server-routing.md)のセットを定義することで、モジュールを使用してアプリケーションを構造化できます。モジュールは、ルートの設定、プラグインのインストール、およびサービスの設定を行う `Application` の拡張関数です。モジュールを使用すると、以下のことが可能になります。

- 関連するルートとロジックをグループ化する。
- 機能やドメインを分離した状態に保つ。
- テストの容易化とモジュール方式のデプロイを可能にする。

> アーキテクチャパターンやモジュールの構成に関する詳細は、[アプリケーションの構造](server-application-structure.md)を参照してください。

## モジュールの定義 {id="defining-a-module"}

モジュールは、[`Application`](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application/index.html) クラスの _[拡張関数](https://kotlinlang.org/docs/extensions.html)_ です。以下の例では、`module1` 拡張関数が `/module1` URL パスへの GET リクエストを受け付けるモジュールを定義しています。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.module1() {
    routing {
        get("/module1") {
            call.respondText("Hello from 'module1'!")
        }
    }
}
```

アプリケーションへのモジュールの読み込みは、`embeddedServer` 関数を使用してコード内で行うか、`application.conf` 設定ファイルを使用するかという、[サーバーの作成方法](server-create-and-configure.topic)によって異なります。

> 特定のモジュールにインストールされた[プラグイン](server-plugins.md#install)は、読み込まれた他のモジュールに対しても有効であることに注意してください。

## モジュールの読み込み {id="loading-modules"}
### Embedded server {id="embedded-server"}

通常、`embeddedServer` 関数はラムダ引数として暗黙的にモジュールを受け取ります。
その例は[コードによる設定](server-create-and-configure.topic#embedded-server)セクションで確認できます。
また、アプリケーションのロジックを別のモジュールに抽出し、そのモジュールへの参照を `module` パラメータとして渡すこともできます。

```kotlin
package com.example

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*

fun main() {
    embeddedServer(Netty, port = 8080, module = Application::module).start(wait = true)
}

fun Application.module() {
    module1()
    module2()
}

fun Application.module1() {
    routing {
        get("/module1") {
            call.respondText("Hello from 'module1'!")
        }
    }
}

fun Application.module2() {
    routing {
        get("/module2") {
            call.respondText("Hello from 'module2'!")
        }
    }
}

```

完全な例はこちらで確認できます: [embedded-server-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules)

### 設定ファイル {id="hocon"}

`application.conf` または `application.yaml` ファイルを使用してサーバーを設定する場合、`ktor.application.modules` プロパティを使用して読み込むモジュールを指定する必要があります。

2つのパッケージに3つのモジュールが定義されていると仮定します。`com.example` パッケージに2つのモジュール、`org.sample` パッケージに1つのモジュールです。

<Tabs>
<TabItem title="Application.kt">

```kotlin
package com.example

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module1() {
    routing {
        get("/module1") {
            call.respondText("Hello from 'module1'!")
        }
    }
}

fun Application.module2() {
    routing {
        get("/module2") {
            call.respondText("Hello from 'module2'!")
        }
    }
}

```

</TabItem>
<TabItem title="Sample.kt">

```kotlin
package org.sample

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.module3() {
    routing {
        get("/module3") {
            call.respondText("Hello from 'module3'!")
        }
    }
}

```

</TabItem>
</Tabs>

設定ファイルでこれらのモジュールを参照するには、その完全修飾名（fully qualified names）を指定する必要があります。
モジュールの完全修飾名には、クラスの完全修飾名と拡張関数の名前が含まれます。

<Tabs group="config">
<TabItem title="application.conf" group-key="hocon">

```shell
ktor {
    application {
        modules = [ com.example.ApplicationKt.module1,
                    com.example.ApplicationKt.module2,
                    org.sample.SampleKt.module3 ]
    }
}
```

</TabItem>
<TabItem title="application.yaml" group-key="yaml">

```yaml
ktor:
    application:
        modules:
            - com.example.ApplicationKt.module1
            - com.example.ApplicationKt.module2
            - org.sample.SampleKt.module3
```

</TabItem>
</Tabs>

完全な例はこちらで確認できます: [engine-main-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules)

## モジュールの依存関係

モジュールは、共通のサービス、リポジトリ、または設定を共有する必要があることがよくあります。依存関係をモジュール内で作成するのではなく注入することで、テスト容易性と柔軟性が向上します。Ktorは、プロジェクトの複雑さに応じていくつかのアプローチを提供しています。

### パラメータによる依存関係の受け渡し

依存関係を渡す最も簡単な方法は、モジュール関数のパラメータとして宣言することです。

```kotlin
fun main() {
    embeddedServer(CIO, port = 8080, host = "0.0.0.0") {
        // 依存関係をインスタンス化する
        val myService = MyService(property<MyServiceConfig>())
        // パラメータとしてモジュールに注入する
        routingModule(myService)
        schedulingModule(myService)
    }.start(wait = true)
}
```

これは小規模または中規模のアプリケーションに適しており、依存関係が明確になります。ただし、モジュールはコンパイル時に密結合になり、実行時に簡単に交換することはできません。

### アプリケーション属性の使用

すべてのモジュールで利用可能な型安全なマップである `Application.attributes` を使用できます。

```kotlin
val customerServiceKey = AttributeKey<CustomerService>("CustomerService")

fun Application.servicesModule() {
    attributes[customerServiceKey] = CustomerService()
}

fun Application.customerModule() {
    val service = attributes[customerServiceKey]
    routing {
        get("/customers") { call.respond(service.all()) }
    }
}
```

これにより、モジュール間の直接的な参照を避けることで疎結合が実現されます。

### 依存関係注入（DI）の使用 {id="dependency_injection"}

Ktorには[依存関係注入（DI）プラグイン](server-dependency-injection.md)が含まれており、軽量コンテナを使用してKtorアプリケーション内で直接依存関係を宣言および解決できます。

## モジュールの同時読み込み {id="concurrent-modules"}

アプリケーションモジュールを作成する際、サスペンド関数（suspendable functions）を使用できます。これにより、アプリケーションの起動時にイベントを非同期で実行できます。それには、`suspend` キーワードを追加します。

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

また、すべてのアプリケーションモジュールを個別に起動できるため、1つのモジュールが中断（suspend）されても、他のモジュールがブロックされることはありません。これにより、依存関係注入の非順次的な読み込みが可能になり、場合によっては読み込みが高速化されます。

### 設定オプション

以下の設定プロパティが利用可能です。

| プロパティ                                   | 型                           | 説明                                                 | デフォルト        |
|-----------------------------------------|----------------------------|----------------------------------------------------|--------------|
| `ktor.application.startup`              | `sequential` / `concurrent` | アプリケーションモジュールの読み込み方法を定義します                         | `sequential` |
| `ktor.application.startupTimeoutMillis` | `Long`                     | アプリケーションモジュールの読み込みタイムアウト（ミリ秒単位）                    | `10000`      |

### モジュールの同時読み込みを有効にする

同時読み込み（concurrent loading）を有効にするには、サーバー設定ファイルに以下を追加します。

```yaml
# application.conf

ktor {
    application {
        startup = concurrent
    }
}
```

依存関係注入の場合、以下のモジュールを記述順に読み込んでも問題ありません。

```kotlin
suspend fun Application.installEvents() {
    // 提供されるまでサスペンド（中断）します
    val kubernetesConnection = dependencies.resolve<KubernetesConnection>()
}

suspend fun Application.loadEventsConnection() {
    dependencies.provide<KubernetesConnection> {
        connect(property<KubernetesConfig>("app.events"))
    }
}
```

> 同時モジュール読み込みはシングルスレッドのプロセスです。これにより、アプリケーションの内部共有状態におけるスレッドセーフでないコレクションのスレッド問題を回避するのに役立ちます。
>
{style="note"}