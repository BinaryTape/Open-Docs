---
title: Ktor における依存性の注入
---

`koin-ktor` モジュールは、Ktor に依存性の注入 (Dependency Injection) を提供するための専用モジュールです。

## Koin プラグインのインストール

Ktor で Koin コンテナを開始するには、次のように `Koin` プラグインをインストールするだけです。

```kotlin
fun Application.main() {
    // Koin をインストール
    install(Koin) {
        slf4jLogger()
        modules(helloAppModule)
    }

}
```

### Ktor の DI との互換性 (4.1)

Koin 4.1 は新しい Ktor 3.2 を完全にサポートしています！

Koin の解決ルールを抽象化し、`ResolutionExtension` による拡張を可能にするために、`CoreResolver` を抽出しました。Koin が Ktor のデフォルト DI インスタンスを解決できるように、新しい `KtorDIExtension` を Ktor `ResolutionExtension` として追加しました。

Koin Ktor プラグインは、Ktor DI との統合を自動的にセットアップします。以下に、Koin から Ktor の依存関係を利用する方法を示します。

```kotlin
// Ktor オブジェクトを定義
fun Application.setupDatabase(config: DbConfig) {
    // ...
    dependencies {
        provide<Database> { database }
    }
}
```

```kotlin
// Koin の定義に注入
class CustomerRepositoryImpl(private val database: Database) : CustomerRepository

    fun Application.customerDataModule() {
        koinModule {
            singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
        }
}
```

## Ktor での注入 (Inject)

Koin の `inject()` および `get()` 関数は、`Application`、`Route`、および `Routing` クラスから利用可能です。

```kotlin
fun Application.main() {

    // HelloService を注入
    val service by inject<HelloService>()

    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

### Ktor リクエストスコープからの解決 (4.1 以降)

Ktor のリクエストスコープのタイムライン内で存続するコンポーネントを宣言できます。そのためには、`requestScope` セクション内でコンポーネントを宣言するだけです。Ktor の Web リクエストスコープでインスタンス化される `ScopeComponent` クラスを例に、宣言してみましょう。

```kotlin
requestScope {
    scopedOf(::ScopeComponent)
}
```

そして、HTTP コールから `call.scope.get()` を呼び出すだけで、適切な依存関係を解決できます。

```kotlin
routing {
    get("/hello") {
        val component = call.scope.get<ScopeComponent>()
        // ... 
    }
}
```

これにより、スコープ内の依存関係が、解決のソースとして `ApplicationCall` を解決できるようになります。これをコンストラクタに直接注入できます。

```kotlin
class ScopeComponent(val call : ApplicationCall) {
}
```

:::note
新しいリクエストごとにスコープが再作成されます。これにより、リクエストごとにスコープインスタンスが作成され、破棄されます。
:::

### Ktor モジュールでの Koin モジュールの宣言 (4.1)

アプリのセットアップ内で `Application.koinModule {}` または `Application.koinModules()` を直接使用して、Ktor モジュール内に新しいモジュールを宣言します。

```kotlin
fun Application.customerDataModule() {
    koinModule {
        singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
    }
}
```

### Ktor イベント

Ktor の Koin イベントをリッスンできます。

```kotlin
fun Application.main() {
    // ...

    // Ktor フィーチャーをインストール
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