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

### KtorのDIとの互換性 (4.1)

Koin 4.1は、新しいKtor 3.2を完全にサポートしています！

Koinの解決ルールを抽象化し、`ResolutionExtension`による拡張を可能にするために、`CoreResolver`を抽出しました。KoinがKtorのデフォルトDIインスタンスを解決するのを助けるために、新しい`KtorDIExtension`をKtorの`ResolutionExtension`として追加しました。

Koin Ktorプラグインは、Ktor DI統合を自動的にセットアップします。以下に、KoinからKtorの依存性を消費する方法を示します。

```kotlin
// Ktorオブジェクトを定義しましょう
fun Application.setupDatabase(config: DbConfig) {
    // ...
    dependencies {
        provide<Database> { database }
    }
}
```

```kotlin
// Koinの定義に注入しましょう
class CustomerRepositoryImpl(private val database: Database) : CustomerRepository

    fun Application.customerDataModule() {
        koinModule {
            singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
        }
}
```

## Ktorでの注入

Koinの`inject()`および`get()`関数は、`Application`、`Route`、および`Routing`クラスから利用可能です。

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

### Ktorリクエストスコープからの解決 (4.1以降)

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

これにより、スコープ化された依存性が、解決のスコープのソースとして`ApplicationCall`を解決できるようになります。コンストラクタに直接注入できます。

```kotlin
class ScopeComponent(val call : ApplicationCall) {
}
```

:::note
新しいリクエストごとにスコープが再作成されます。これにより、リクエストごとにスコープインスタンスが作成および破棄されます。
:::

### Ktorモジュール内でKoinモジュールを宣言 (4.1)

`Application.koinModule {}`または`Application.koinModules()`をアプリのセットアップ内で直接使用し、Ktorモジュール内で新しいモジュールを宣言します。

```kotlin
fun Application.customerDataModule() {
    koinModule {
        singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
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