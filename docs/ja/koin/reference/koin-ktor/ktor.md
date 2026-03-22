---
title: Ktor 用 Koin
---

`koin-ktor` モジュールは、Ktor アプリケーションに依存性の注入（Dependency Injection）の統合を提供し、Ktor 組み込みの DI システムと連携して動作します。

## なぜ Ktor で Koin を使うのか？

Ktor 3.4 以降には DI システムが組み込まれています。以下にそれらの比較を示します。

| 機能 | Ktor DI | Koin |
|---------|---------|------|
| 基本的な注入 | 対応 | 対応 |
| クォリファイア (`@Named`) | 対応 | 対応 |
| プロパティ注入 | 対応 (`@Property`) | 対応 |
| Null 許容/オプションの依存関係 | 対応 | 対応 |
| スコープ（リクエスト、カスタム） | 非対応 | 対応 |
| モジュールの構成 | 非対応 | 対応 |
| 遅延モジュール | 非対応 | 対応 |
| アノテーションベースのコンポーネント | 非対応 | 対応 |
| コンパイラプラグインによる検証 | 非対応 | 対応 |

### Ktor DI の制限事項

- **スコープ機能なし** - リクエストスコープやカスタムスコープはなく、クリーンアップ順序を伴うシングルトンのような動作のみです。
- **アノテーションベースのコンポーネントなし** - Koin Annotations のような `@Singleton` や `@Factory` によるコンポーネントスキャンはありません。
- **コンパイル時の検証なし** - 実行前に DI 設定を検証するコンパイラプラグインはありません。
- **制限された型パラメータ** - 型引数のサブタイプをまたがる型パラメータを解決できません。

**Koin を使用すべき場合:**
- スコープ付きの依存関係（リクエストスコープ、カスタムスコープ）が必要な場合
- モジュールベースの構成が必要な場合
- アノテーションベースのコンポーネントスキャンを使用したい場合
- コンパイラプラグインによるコンパイル時の検証が必要な場合

**Ktor DI で十分な場合:**
- 依存関係が少ないシンプルなアプリケーション
- スコープの要件がない場合
- 基本的なクォリファイアのみが必要な場合

## セットアップ

Koin Ktor の依存関係を追加します。

```kotlin
dependencies {
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version") // オプション
}
```

## 依存関係の宣言

Koin は複数の DSL アプローチをサポートしています。

### コンパイラプラグイン DSL

最もシンプルな構文です。

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

### アノテーション

コンパイル時の検証を備えた Spring 風の記述です。

```kotlin
@Module
@ComponentScan("com.example")
class AppModule

@Singleton
class UserRepositoryImpl : UserRepository

@Singleton
class UserService(private val repository: UserRepository)
```

### クラシック DSL

コンストラクタ参照を使用します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) bind UserRepository::class
    singleOf(::UserService)
}
```

## Koin プラグインのインストール

`Application` モジュールで Koin をインストールします。

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

### 完全な設定例

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        fileProperties("/application.conf")
        modules(
            networkModule,
            repositoryModule,
            serviceModule
        )
        createEagerInstances()
    }
}
```

## 依存性の注入

Koin は Ktor のコアタイプに対して拡張関数を提供します。

### 注入ポイント

`inject()` および `get()` は以下で利用可能です。
- `Application`
- `Route`
- `Routing`
- `ApplicationCall` (ルートハンドラ内)

### アプリケーションレベル

```kotlin
fun Application.main() {
    val helloService by inject<HelloService>()  // Lazy (遅延注入)
    val configService = get<ConfigService>()     // Eager (即時注入)

    routing {
        get("/hello") {
            call.respondText(helloService.sayHello())
        }
    }
}
```

### ルートレベル

```kotlin
fun Route.customerRoutes() {
    val customerService by inject<CustomerService>()

    get("/customers") {
        call.respond(customerService.getAllCustomers())
    }

    get("/customers/{id}") {
        val id = call.parameters["id"]?.toInt()
            ?: return@get call.respond(HttpStatusCode.BadRequest)
        call.respond(customerService.getCustomer(id))
    }
}
```

### リクエストハンドラ

```kotlin
routing {
    get("/users/{id}") {
        val userService = get<UserService>()
        val userId = call.parameters["id"]!!
        call.respond(userService.getUser(userId))
    }
}
```

## Ktor イベント

Koin のライフサイクルイベントを監視できます。

| イベント | 説明 |
|-------|-------------|
| `KoinApplicationStarted` | Koin コンテナが開始された |
| `KoinApplicationStopPreparing` | Koin が停止の準備中 |
| `KoinApplicationStopped` | Koin コンテナが停止した |

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }

    environment.monitor.subscribe(KoinApplicationStarted) {
        log.info("Koin started")
        get<CacheWarmer>().warmUp()
    }

    environment.monitor.subscribe(KoinApplicationStopped) {
        log.info("Koin stopped")
    }
}
```

## クイックリファレンス

| 関数 | 説明 |
|----------|-------------|
| `install(Koin) { }` | Koin プラグインをインストールする |
| `inject<T>()` | 遅延注入 (Lazy injection) |
| `get<T>()` | 即時注入 (Eager injection) |
| `koinModule { }` | インラインモジュールを宣言する |
| `koinModules(...)` | 既存のモジュールをロードする |

## ドキュメント

| トピック | 説明 |
|-------|-------------|
| **[DI ブリッジ](/docs/reference/koin-ktor/ktor-bridge)** | Koin ↔ Ktor DI の統合 |
| **[リクエストスコープ](/docs/reference/koin-ktor/ktor-scopes)** | リクエストスコープの依存関係 |
| **[テスト](/docs/reference/koin-ktor/ktor-testing)** | Koin を使用した Ktor のテスト |
| **[隔離されたコンテキスト](/docs/reference/koin-ktor/ktor-isolated)** | 隔離された Koin インスタンス |

## 関連情報

- **[チュートリアル: Ktor](/docs/quickstart/ktor)** - ステップバイステップのチュートリアル
- **[チュートリアル: Ktor (アノテーション編)](/docs/quickstart/ktor-annotations)** - アノテーションのチュートリアル
- **[Koin Annotations](/docs/reference/koin-annotations/start)** - アノテーションのリファレンス
- **[Ktor ドキュメント](https://ktor.io/)** - Ktor 公式ドキュメント