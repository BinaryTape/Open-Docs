---
title: DIブリッジ
---

# Ktor DIブリッジ

Koin 4.2+ は、設定可能なブリッジを介して、**Ktor 3.4+** の組み込み依存性注入（DI）システムとのシームレスな統合を提供します。

:::info 実験的機能
Ktor DIブリッジは、KoinとKtor DIの間の双方向の依存性解決を可能にする実験的機能です。
:::

## ブリッジの設定

双方向の依存性解決を有効にするには、`bridge { }` DSLを使用します。

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()

        bridge {
            ktorToKoin()  // Ktor DIがKoinの依存関係を解決できるようにする
            koinToKtor()  // KoinがKtor DIの依存関係を解決できるようにする
        }

        modules(appModule)
    }

    // Ktor DIの依存関係
    dependencies {
        provide<KtorSpecificService> { KtorSpecificServiceImpl() }
    }
}
```

## ブリッジのオプション

| オプション | 説明 |
|--------|-------------|
| `ktorToKoin()` | Ktorの `by dependencies` デリゲートを使用してKoinから解決できるようにします |
| `koinToKtor()` | Koinの `inject()` や `get()` を使用してKtor DIから解決できるようにします |

## ktorToKoin() の使用

Ktorの `by dependencies` デリゲートを使用してKoinの依存関係を解決します。

```kotlin
fun Application.module() {
    install(Koin) {
        bridge {
            ktorToKoin()
        }
        modules(module {
            single<HelloService> { HelloServiceImpl() }
        })
    }

    routing {
        get("/hello") {
            // Ktorのデリゲートを使用してKoinの依存関係を解決する
            val helloService: HelloService by dependencies
            call.respondText(helloService.sayHello())
        }
    }
}
```

## koinToKtor() の使用

Koinの `inject()` を使用してKtor DIの依存関係を解決します。

```kotlin
fun Application.module() {
    install(Koin) {
        bridge {
            koinToKtor()
        }
        modules(appModule)
    }

    // Ktor DIで宣言する
    dependencies {
        provide<DatabaseConnection> { DatabaseConnectionImpl() }
    }

    routing {
        get("/data") {
            // Koinを使用してKtor DIの依存関係を解決する
            val database: DatabaseConnection by inject()
            call.respondText(database.query())
        }
    }
}
```

## 双方向のフルサンプル

最大限の柔軟性を得るために、両方の方向を有効にします。

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()

        bridge {
            ktorToKoin()
            koinToKtor()
        }

        modules(module {
            single<HelloService> { HelloServiceImpl() }
        })
    }

    dependencies {
        provide<KtorSpecificService> { KtorSpecificServiceImpl() }
    }

    routing {
        // 両方にKoinの inject() を使用
        get("/mixed-koin") {
            val helloService: HelloService by inject()        // Koinから取得
            val ktorService: KtorSpecificService by inject()  // Ktor DIから取得
            call.respondText("${helloService.sayHello()} - ${ktorService.process()}")
        }

        // 両方にKtorの dependencies デリゲートを使用
        get("/mixed-ktor") {
            val helloService: HelloService by dependencies        // Koinから取得
            val ktorService: KtorSpecificService by dependencies  // Ktor DIから取得
            call.respondText("${helloService.sayHello()} - ${ktorService.process()}")
        }
    }
}
```

## アーキテクチャパターン

インフラストラクチャをアプリケーションロジックから分離します。

- **Ktor DI** - フレームワークレベルの依存関係（データベース、設定、インフラストラクチャ）
- **Koin** - アプリケーションレベルの依存関係（リポジトリ、サービス、ユースケース）

```kotlin
fun Application.module() {
    // Ktor DI - インフラストラクチャ層
    val config = environment.config
    val database = Database(config)
    dependencies {
        provide<Database> { database }
        provide<ApplicationConfig> { config }
    }

    // Koin - アプリケーション層
    install(Koin) {
        slf4jLogger()

        bridge {
            koinToKtor()  // Koinがインフラストラクチャの依存関係を解決できるようにする
        }

        modules(appModule)
    }
}

val appModule = module {
    // これらはブリッジを介してKtor DIからDatabaseを注入できる
    singleOf(::CustomerRepository)
    singleOf(::OrderRepository)
    singleOf(::CustomerService)
}
```

## ベストプラクティス

1. **インフラストラクチャはKtor DIに** - データベース接続、設定、外部クライアントなど。
2. **ビジネスロジックはKoinに** - リポジトリ、サービス、ユースケースなど。
3. **必要な方向のみを有効にする** - 必要な場合を除き、両方ではなく `koinToKtor()` のみを使用することを検討してください。
4. **境界を文書化する** - どのシステムがどの依存関係を所有しているかを明確にします。

## 隔離されたコンテキスト（Isolated Context）での使用

ブリッジは `KoinIsolated` でも動作します。

```kotlin
fun Application.module() {
    dependencies {
        provide<Database> { Database(environment.config) }
    }

    install(KoinIsolated) {
        slf4jLogger()

        bridge {
            koinToKtor()
        }

        modules(appModule)
    }
}
```

## 関連項目

- **[Koin for Ktor](/docs/reference/koin-ktor/ktor)** - Ktorのメインドキュメント
- **[Isolated Context](/docs/reference/koin-ktor/ktor-isolated)** - 隔離されたKoinインスタンス