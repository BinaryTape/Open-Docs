---
title: Isolated Context
---

# Ktor における Isolated Context

`KoinIsolated`プラグインは、グローバルの Koin インスタンスとは別に、アイソレートされた（隔離された）コンテキストで Koin を実行します。これは、テスト、マルチテナントアプリケーション、および複数の Koin インスタンスの実行に役立ちます。

## Isolated Context を使用すべきケース

- **テスト** - 各テストが独自のアイソレートされた Koin インスタンスを取得します。
- **マルチテナントアプリケーション** - テナントごとに異なる構成を使用します。
- **プラグイン/モジュールシステム** - 独自の依存関係を持つ独立したモジュール。
- **組み込み Ktor サーバー** - 同じ JVM 内で複数の Ktor インスタンスを実行します。

## 基本設定

`Koin`の代わりに`KoinIsolated`をインストールします：

```kotlin
fun Application.main() {
    install(KoinIsolated) {
        slf4jLogger()
        modules(appModule)
    }
}
```

## Global Context と Isolated Context の比較

### Global Context（デフォルト）

```kotlin
// GlobalContext を使用 - アプリケーション全体で共有されます
install(Koin) {
    modules(appModule)
}

// GlobalContext を介してどこからでも Koin にアクセスできます
val service = GlobalContext.get().get<UserService>()
```

### Isolated Context

```kotlin
// アイソレートされたコンテキストを使用 - GlobalContext を介してアクセスすることはできません
install(KoinIsolated) {
    modules(appModule)
}

// GlobalContext.get() はこの Koin インスタンスを返しません
// Ktor アプリケーションのスコープ内でのみアクセス可能です
```

:::warning
`KoinIsolated`を使用する場合、`GlobalContext`を介して Koin にアクセスすることはできません。すべてのインジェクションは、`inject()`または`get()`を使用して Ktor アプリケーションのスコープ内で行う必要があります。
:::

## 完全な例

```kotlin
val appModule = module {
    singleOf(::UserRepository)
    singleOf(::UserService)

    requestScope {
        scopedOf(::RequestLogger)
    }
}

fun Application.main() {
    // アイソレートモードで Koin をインストール
    install(KoinIsolated) {
        slf4jLogger()
        modules(appModule)
    }

    // インジェクションは Application スコープ内で動作します
    val userService by inject<UserService>()

    routing {
        get("/users/{id}") {
            val logger = call.scope.get<RequestLogger>()
            val id = call.parameters["id"]!!

            logger.log("Fetching user $id")
            val user = userService.getUser(id)

            call.respond(user)
        }
    }
}
```

## DI Bridge との使用

アイソレートされたコンテキストは、Ktor DI Bridge もサポートしています：

```kotlin
fun Application.main() {
    // Ktor DI - インフラストラクチャ
    val database = Database(environment.config)
    dependencies {
        provide<Database> { database }
    }

    // Koin Isolated とブリッジの設定
    install(KoinIsolated) {
        slf4jLogger()

        bridge {
            koinToKtor()  // Koin が Ktor DI から解決できるようにする
        }

        modules(appModule)
    }

    routing {
        userRoutes()
    }
}

val appModule = module {
    // ブリッジを介して Ktor DI から Database をインジェクトできます
    singleOf(::UserRepository)
    singleOf(::UserService)
}
```

## Isolated Context を使用したテスト

アイソレートされたコンテキストは、特にテストに役立ちます：

```kotlin
class UserServiceTest {
    @Test
    fun `test user endpoint`() = testApplication {
        application {
            // 各テストは独自のアイソレートされた Koin インスタンスを取得します
            install(KoinIsolated) {
                modules(testModule)
            }
            configureRouting()
        }

        client.get("/users/123").apply {
            assertEquals(HttpStatusCode.OK, status)
        }
    }
}

val testModule = module {
    single<UserRepository> { MockUserRepository() }
    singleOf(::UserService)
}
```

### テストの並列実行

アイソレートされたコンテキストを使用すると、干渉することなくテストを並列で実行できます：

```kotlin
class ParallelTests {
    @Test
    fun `test A`() = testApplication {
        application {
            install(KoinIsolated) {
                modules(moduleA)  // 独自のアイソレートされたインスタンス
            }
        }
        // ...
    }

    @Test
    fun `test B`() = testApplication {
        application {
            install(KoinIsolated) {
                modules(moduleB)  // 別のアイソレートされたインスタンス
            }
        }
        // ...
    }
}
```

## 複数の Ktor サーバー

独立した Koin インスタンスを使用して複数の Ktor サーバーを実行します：

```kotlin
fun main() {
    // サーバー 1 - ユーザーサービス
    val userServer = embeddedServer(Netty, port = 8080) {
        install(KoinIsolated) {
            modules(userServiceModule)
        }
        userRouting()
    }

    // サーバー 2 - 注文サービス（異なる Koin インスタンス）
    val orderServer = embeddedServer(Netty, port = 8081) {
        install(KoinIsolated) {
            modules(orderServiceModule)
        }
        orderRouting()
    }

    // 両方のサーバーは独立した Koin コンテナを持ちます
    userServer.start(wait = false)
    orderServer.start(wait = true)
}
```

## ライフサイクル

アイソレートされた Koin インスタンスは、Ktor アプリケーションのライフサイクルに従います：

```kotlin
fun Application.main() {
    install(KoinIsolated) {
        slf4jLogger()
        modules(appModule)
    }

    // Koin のライフサイクルを監視
    environment.monitor.subscribe(KoinApplicationStarted) {
        log.info("Isolated Koin started")
    }

    environment.monitor.subscribe(KoinApplicationStopped) {
        log.info("Isolated Koin stopped")
    }
}
```

## Isolated Koin インスタンスへのアクセス

Ktor アプリケーション内では、アイソレートされた Koin インスタンスにアクセスできます：

```kotlin
fun Application.main() {
    install(KoinIsolated) {
        modules(appModule)
    }

    // Application から Koin インスタンスにアクセス
    val koin = getKoin()

    // またはプラグイン属性を介してアクセス
    val koinApp = attributes[KoinPluginKey]
}
```

## Isolated Context を使用すべきでないケース

- **単一の Ktor アプリケーション** - Global Context の方がシンプルです。
- **モジュール間で共有される依存関係** - Global Context を使用すると共有が容易になります。
- **Koin にアクセスするバックグラウンドジョブ** - これらには GlobalContext が必要です。

## ベストプラクティス

1. **テストに使用する** - アイソレートされたコンテキストはテスト間の干渉を防ぎます。
2. **マルチテナントに使用する** - テナントごとに異なる構成を持つことができます。
3. **シンプルなアプリでは避ける** - ほとんどのユースケースでは Global Context の方がシンプルです。
4. **選択理由をドキュメント化する** - なぜアイソレートされたコンテキストが使用されているのかを明確にします。

## 関連項目

- **[Ktor Integration](/docs/reference/koin-ktor/ktor)** - メインの Ktor ドキュメント
- **[Context Isolation](/docs/reference/koin-core/context-isolation)** - コアのアイソレーション（分離）の概念
- **[Testing](/docs/reference/koin-test/testing)** - Koin を使用したテスト