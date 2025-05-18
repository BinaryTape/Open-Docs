---
title: "Ktor における依存性注入 (Dependency Injection)"
---
`koin-ktor`モジュールは、Ktorに依存性注入をもたらすことに特化しています。

## Koinプラグインのインストール

KtorでKoinコンテナを開始するには、次のように`Koin`プラグインをインストールします。

```kotlin
fun Application.main() {
    // Koinのインストール
    install(Koin) {
        slf4jLogger()
        modules(helloAppModule)
    }

}
```

## Ktorでの注入

Koinの`inject()`および`get()`関数は、`Application`、`Route`、`Routing`クラスから利用できます。

```kotlin
fun Application.main() {

    // HelloServiceを注入
    val service by inject<HelloService>()

    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

### Ktorリクエストスコープからの解決 (since 4.1.0)

Ktorリクエストスコープのタイムライン内で生存するコンポーネントを宣言できます。そのためには、`requestScope`セクション内でコンポーネントを宣言する必要があります。Ktor Webリクエストスコープでインスタンス化する`ScopeComponent`クラスがあると仮定して、それを宣言しましょう。

```kotlin
requestScope {
    scopedOf(::ScopeComponent)
}
```

そして、HTTPコールから、`call.scope.get()`を呼び出して、正しい依存関係を解決します。

```kotlin
routing {
    get("/hello") {
        val component = call.scope.get<ScopeComponent>()
        // ... 
    }
}
```

:::note
新しいリクエストごとに、スコープが再作成されます。これにより、各リクエストに対してスコープインスタンスが作成および破棄されます。
:::

### 外部KtorモジュールからのKoinの実行

Ktorモジュールの場合、特定のKoinモジュールをロードできます。それらを`koin { }`関数で宣言するだけです。

```kotlin
fun Application.module2() {

    koin {
        // koinモジュールをロード
        modules(appModule2)
    }

}
```

### Ktorイベント

KTor Koinイベントをリッスンできます。

```kotlin
fun Application.main() {
    // ...

    // Ktorフィーチャのインストール
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
```