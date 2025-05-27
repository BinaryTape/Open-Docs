---
title: Ktorでの依存性注入
---

`koin-ktor`モジュールは、Ktorに依存性注入を提供するために特化しています。

## Koinプラグインのインストール

KtorでKoinコンテナを起動するには、次のように`Koin`プラグインをインストールするだけです。

```kotlin
fun Application.main() {
    // Install Koin
    install(Koin) {
        slf4jLogger()
        modules(helloAppModule)
    }

}
```

## Ktorでの注入

Koinの`inject()`および`get()`関数は、`Application`、`Route`、`Routing`クラスから利用可能です。

```kotlin
fun Application.main() {

    // inject HelloService
    val service by inject<HelloService>()

    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

### Ktorリクエストスコープからの解決 (4.1.0以降)

Ktorリクエストスコープのライフサイクル内で存続するコンポーネントを宣言できます。そのためには、`requestScope`セクション内にコンポーネントを宣言するだけです。Ktorウェブ・リクエストスコープでインスタンス化する`ScopeComponent`クラスがある場合、次のように宣言します。

```kotlin
requestScope {
    scopedOf(::ScopeComponent)
}
```

そして、HTTPコールから`call.scope.get()`を呼び出すだけで、適切な依存性を解決できます。

```kotlin
routing {
    get("/hello") {
        val component = call.scope.get<ScopeComponent>()
        // ... 
    }
}
```

:::note
新しいリクエストごとにスコープが再作成されます。これにより、リクエストごとにスコープインスタンスが作成および破棄されます。
:::

### 外部KtorモジュールからのKoinの実行

Ktorモジュールの場合、特定のKoinモジュールをロードできます。`koin { }`関数でそれらを宣言するだけです。

```kotlin
fun Application.module2() {

    koin {
        // load koin modules
        modules(appModule2)
    }

}
```

### Ktorイベント

KTor Koinイベントをリッスンできます。

```kotlin
fun Application.main() {
    // ...

    // Install Ktor features
    environment.monitor.subscribe(KoinApplicationStarted) {
        log.info("Koin started.")
    }

    environment.monitor.subscribe(KoinApplicationStopPreparing) {
        log.info("Koin stopping...")
    }

    environment.monitor.subscribe(KoinApplicationStopped) {
        log.info("Koin stopped.")
    }

    //...
}