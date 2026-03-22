---
title: 定義
---

# 定義

定義は、Koinがどのように依存関係を作成し管理するかを宣言するものです。このガイドでは、DSLとアノテーションの両方を使用したすべての定義型について説明します。

## 定義の型

| 型 | DSL | アノテーション | ライフサイクル | ユースケース |
|------|-----|------------|-----------|----------|
| シングルトン | `single()` | `@Singleton` | アプリの生存期間中、1つのインスタンス | サービス、リポジトリ、データベース |
| ファクトリ | `factory()` | `@Factory` | リクエストのたびに新しいインスタンス | プレゼンター、ユースケース、状態を持つオブジェクト |
| スコープ | `scoped()` | `@Scoped` | スコープごとに1つのインスタンス | Activityやセッションに紐づくオブジェクト |
| ViewModel | `viewModel()` | `@KoinViewModel` | Android ViewModelのライフサイクル | ViewModel |

## 定義の宣言

### コンパイラプラグインDSL（推奨）

```kotlin
import org.koin.plugin.module.dsl.*

val appModule = module {
    // シングルトン
    single<Database>()
    single<UserRepository>()

    // ファクトリ - リクエストのたびに新しいインスタンスを作成
    factory<UserPresenter>()

    // ViewModel
    viewModel<UserViewModel>()
}
```

### アノテーション

```kotlin
@Singleton  // または @Single
class Database

@Singleton
class UserRepository(private val database: Database)

@Factory
class UserPresenter(private val repository: UserRepository)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

### クラシックDSL

```kotlin
val appModule = module {
    // コンストラクタ参照（自動ワイヤリング）を使用
    singleOf(::Database)
    singleOf(::UserRepository)
    factoryOf(::UserPresenter)
    viewModelOf(::UserViewModel)

    // ラムダ（手動ワイヤリング）を使用
    single { Database() }
    single { UserRepository(get()) }
    factory { UserPresenter(get()) }
    viewModel { UserViewModel(get()) }
}
```

## 定義の比較

| コンセプト | コンパイラプラグインDSL | クラシックDSL | アノテーション |
|---------|---------------------|-------------|------------|
| シングルトン | `single<MyClass>()` | `singleOf(::MyClass)` | `@Singleton` / `@Single` |
| ファクトリ | `factory<MyClass>()` | `factoryOf(::MyClass)` | `@Factory` |
| スコープ | `scoped<MyClass>()` | `scopedOf(::MyClass)` | `@Scoped` |
| ViewModel | `viewModel<MyVM>()` | `viewModelOf(::MyVM)` | `@KoinViewModel` |
| Worker | `worker<MyWorker>()` | `workerOf(::MyWorker)` | `@KoinWorker` |

:::info
コンパイラプラグインはクラスや関数のパラメータを解析し、適切な `get()` 関数の呼び出しを自動生成します。そのため、手動で `get()` を記述する必要はありません。
:::

## Single（シングルトン）

アプリ全体で再利用される単一のインスタンスを作成します。

```kotlin
// DSL
single<DatabaseHelper>()

// アノテーション
@Singleton
class DatabaseHelper
```

どちらも同じ結果、つまりすべてのコンシューマ（利用側）で共有される単一のインスタンスを作成します。

## Factory（ファクトリ）

リクエストのたびに新しいインスタンスを作成します。

```kotlin
// DSL
factory<UserPresenter>()

// アノテーション
@Factory
class UserPresenter(private val repository: UserRepository)
```

## Scoped（スコープ）

スコープごとに1つのインスタンスを作成します。

```kotlin
// DSL
scope<MyActivity> {
    scoped<ActivityPresenter>()
}

// アノテーション
@Scoped(MyActivityScope::class)
class ActivityPresenter
```

## ViewModel

適切なライフサイクルを持つAndroid ViewModelです。

```kotlin
// DSL
viewModel<UserViewModel>()

// アノテーション
@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

## インターフェースのバインド

### コンパイラプラグインDSL

```kotlin
single<UserRepositoryImpl>() bind UserRepository::class

// 複数のバインド
single<MyServiceImpl>() binds arrayOf(ServiceA::class, ServiceB::class)
```

### クラシックDSL

```kotlin
singleOf(::UserRepositoryImpl) bind UserRepository::class

// またはラムダを使用
single<UserRepository> { UserRepositoryImpl(get()) }
```

### アノテーション

クラスがインターフェースを実装している場合、**インターフェースのバインドは自動的に行われます**。

```kotlin
@Singleton
class UserRepositoryImpl(
    private val database: Database
) : UserRepository  // 自動的に UserRepository にバインドされる
```

明示的にバインドする場合：

```kotlin
@Singleton
@Binds(UserRepository::class)
class UserRepositoryImpl : UserRepository
```

## クオリファイア（名前の指定された定義）

同じ型の定義が複数ある場合に使用します。取得方法については、[クオリファイアを使用した注入](/docs/reference/koin-core/injection#injection-with-qualifiers)も参照してください。

### コンパイラプラグインDSL

コンパイラプラグインDSLで文字列のクオリファイアを使用する場合（以前 `named()` を使用していたときのように）、`@Named` でアノテーションを付ける必要があります。

```kotlin
@Named("local")
class LocalDatabase : Database

@Named("remote")
class RemoteDatabase : Database

class UserRepository(
    @Named("local") private val localDb: Database,
    @Named("remote") private val remoteDb: Database
)

single<LocalDatabase>()
single<RemoteDatabase>()
single<UserRepository>()

// 使用方法
val localDb: Database = get(named("local"))
```

### クラシックDSL

```kotlin
single<Database>(named("local")) { LocalDatabase() }
single<Database>(named("remote")) { RemoteDatabase() }

// 使用方法
val localDb: Database = get(named("local"))
```

### アノテーション

```kotlin
@Singleton
@Named("local")
class LocalDatabase : Database

@Singleton
@Named("remote")
class RemoteDatabase : Database

// コンシューマ（利用側）での例
@Singleton
class UserRepository(
    @Named("local") private val localDb: Database,
    @Named("remote") private val remoteDb: Database
)
```

## 注入パラメータ

注入時にパラメータを渡します。

### コンパイラプラグインDSL

`@InjectedParam` を使用して、そのパラメータが注入パラメータ（injected parameters）によって提供されることを示します。

```kotlin
class UserPresenter(
    @InjectedParam userId : String,
    repository : UserRepository
)

factory<UserPresenter>()
```

### クラシックDSL

```kotlin
class UserPresenter(
    userId : String,
    repository : UserRepository
)

factory { params ->
    UserPresenter(
        userId = params.get(),
        repository = get()
    )
}
```

### アノテーション

```kotlin
@Factory
class UserPresenter(
    @InjectedParam val userId: String,
    val repository: UserRepository  // 自動注入される
)

// 使用方法
val presenter: UserPresenter = get { parametersOf("user123") }
```

## オプショナルな依存関係

### コンパイラプラグインDSL

```kotlin
class MyService(
    val required: RequiredDep,
    val optional: OptionalDep?  // getOrNull() で解決される
)

single<MyService>()
```

### クラシックDSL

```kotlin
single {
    MyService(
        required = get(),
        optional = getOrNull()
    )
}
```

### アノテーション

Null許容（Nullable）なパラメータは自動的に処理されます。

```kotlin
@Singleton
class MyService(
    val required: RequiredDep,
    val optional: OptionalDep?  // getOrNull() で解決される
)
```

## 遅延注入

インスタンスの作成を遅延させます。

### コンパイラプラグインDSL

```kotlin
class MyService(
    val lazyDep: Lazy<HeavyDependency>  // 遅延作成
)

single<MyService>()
```

### クラシックDSL

```kotlin
single {
    MyService(
        lazyDep = inject()  // Lazy<Dependency>
    )
}
```

### アノテーション

```kotlin
@Singleton
class MyService(
    val lazyDep: Lazy<HeavyDependency>  // 遅延作成
)
```

## プロパティ

設定値を注入します。

### コンパイラプラグインDSL

```kotlin
class ApiClient(
    @Property("api_url") val url: String,
    @Property("api_key") val key: String
)

single<ApiClient>()
```

### クラシックDSL

```kotlin
single {
    ApiClient(
        url = getProperty("api_url"),
        key = getProperty("api_key", "default")
    )
}
```

### アノテーション

```kotlin
@Singleton
class ApiClient(
    @Property("api_url") val url: String,
    @Property("api_key") val key: String
)
```

## コールバック

### onClose コールバック

インスタンスが解放されるときにコードを実行します。

```kotlin
single {
    Database()
} onClose {
    it?.close()  // Koinの停止時、またはスコープの終了時に呼び出される
}
```

### createdAtStart

起動時にインスタンスを先行作成（eager creation）します。

```kotlin
// コンパイラプラグインDSL
single<ConfigManager>() withOptions {
    createdAtStart()
}

// クラシックDSL
single(createdAtStart = true) {
    ConfigManager()
}
```

## 定義のオーバーライド

### デフォルト：後勝ち（Last Wins）

```kotlin
val prodModule = module {
    single<ApiService> { ProductionApi() }
}

val testModule = module {
    single<ApiService> { MockApi() }  // 本番用をオーバーライドする
}

startKoin {
    modules(prodModule, testModule)
}
```

### 明示的なオーバーライド

厳密モード（strict mode）では、オーバーライドを明示的にマークします。

```kotlin
val testModule = module {
    single<ApiService> { MockApi() }.override()
}

startKoin {
    allowOverride(false)
    modules(prodModule, testModule)
}
```

## ベストプラクティス

1. **コンストラクタ注入を優先する** - Koinなしでコードをテスト可能にします。
2. **状態を持たないサービスには `single` を使用する** - リポジトリ、クライアント、ヘルパーなど。
3. **状態を持つオブジェクトには `factory` を使用する** - 状態を持つプレゼンター、ユースケースなど。
4. **ライフサイクルに紐づくオブジェクトには `scoped` を使用する** - Activity、Fragment、セッションなど。
5. **クオリファイアの使用を最小限に抑える** - 可能な場合は代わりに異なるインターフェースを使用します。
6. **インターフェースにバインドする** - 実装ではなく抽象に依存させます。
7. **外部ライブラリには `create(::builder)` を使用する** - より安全な依存関係の解決が可能です。

## 次のステップ

- **[注入](/docs/reference/koin-core/injection)** - 依存関係の取得
- **[クオリファイア](/docs/reference/koin-core/qualifiers)** - 名前付きおよび型付きのクオリファイア
- **[アドバンスドパターン](/docs/reference/koin-core/advanced-patterns)** - コレクション、デコレータ、外部ライブラリ
- **[スコープ](/docs/reference/koin-core/scopes)** - ライフサイクルの管理