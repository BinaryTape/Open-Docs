[//]: # (title: モジュール)

<tldr>
<p>
<b>コード例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules">embedded-server-modules</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules">engine-main-modules</a>
</p>
</tldr>

<link-summary>モジュールを使用すると、ルートをグループ化してアプリケーションを構成できます。</link-summary>

Ktorでは、特定のモジュール内に特定の[ルート](server-routing.md)セットを定義することで、モジュールを使用してアプリケーションを[構成](server-application-structure.md)できます。モジュールは[Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html)クラスの_[拡張関数](https://kotlinlang.org/docs/extensions.html)_です。以下の例では、`module1`拡張関数は、`/module1`のURLパスへのGETリクエストを受け入れるモジュールを定義しています。

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

アプリケーションでのモジュールの読み込みは、[サーバーの作成方法](server-create-and-configure.topic)によって異なります。`embeddedServer`関数を使ってコードで作成する方法、または`application.conf`設定ファイルを使用する方法があります。

> 特定のモジュールにインストールされた[プラグイン](server-plugins.md#install)は、他の読み込まれたモジュールにも有効であることに注意してください。

## embeddedServer {id="embedded-server"}

通常、`embeddedServer`関数は、ラムダ引数としてモジュールを暗黙的に受け入れます。[コードでの設定](server-create-and-configure.topic#embedded-server)のセクションで例を見ることができます。
アプリケーションロジックを別のモジュールに抽出し、このモジュールへの参照を`module`パラメーターとして渡すこともできます。

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

完全な例はこちらで見つけることができます: [embedded-server-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules)。

## 設定ファイル {id="hocon"}

`application.conf`または`application.yaml`ファイルを使用してサーバーを設定する場合、`ktor.application.modules`プロパティを使用して読み込むモジュールを指定する必要があります。

`com.example`パッケージに2つ、`org.sample`パッケージに1つの、合計3つのモジュールが定義されていると仮定します。

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

これらのモジュールを設定ファイルで参照するには、その完全修飾名を提供する必要があります。
完全修飾モジュール名には、クラスの完全修飾名と拡張関数名が含まれます。

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

完全な例はこちらで見つけることができます: [engine-main-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules)。

## 並行モジュール読み込み

アプリケーションモジュールを作成する際に、中断可能関数（suspend関数）を使用できます。これにより、アプリケーションの起動時にイベントを非同期で実行できます。これを行うには、`suspend`キーワードを追加します。

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

また、すべてのアプリケーションモジュールを独立して起動することもできます。これにより、1つが中断されても、他のモジュールがブロックされることはありません。
これにより、依存性注入のための非シーケンシャルな読み込みが可能になり、場合によっては読み込みが高速化されます。

### 設定オプション

以下のGradle設定プロパティが利用可能です。

| プロパティ                                | 型                        | 説明                                              | デフォルト      |
|-----------------------------------------|-----------------------------|----------------------------------------------------------|--------------|
| `ktor.application.startup`              | `sequential` / `concurrent` | アプリケーションモジュールの読み込み方法を定義します               | `sequential` |
| `ktor.application.startupTimeoutMillis` | `Long`                      | アプリケーションモジュールの読み込みのタイムアウト (ミリ秒単位) | `100000`     |

### 並行モジュール読み込みを有効にする

並行モジュール読み込みを有効にするには、`gradle.properties`ファイルに以下のプロパティを追加します。

```none
ktor.application.startup = concurrent
```

依存性注入の場合、以下のモジュールを出現順に問題なく読み込むことができます。

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

> 並行モジュール読み込みはシングルスレッドプロセスです。これにより、アプリケーションの内部共有状態における安全でないコレクションによるスレッドの問題を回避できます。
>
{style="note"}