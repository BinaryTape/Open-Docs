---
title: Koinコンパイラプラグイン
---

# Koinコンパイラプラグイン

**Koinコンパイラプラグイン**は、すべての新しいKotlin 2.xプロジェクトで推奨されるアプローチです。これは、**DSLとアノテーション**の両方でオートワイヤリング、コンパイル時の安全性、およびよりクリーンな構文を支えるネイティブのKotlinコンパイラプラグインです。

## コンパイラプラグインとは？

Koinコンパイラプラグインは、KSPやアノテーションプロセッシングではなく、**ネイティブのKotlinコンパイラプラグイン (K2)** です。Kotlinコンパイラと直接統合することで、以下の機能を提供します。

- **コンストラクタ引数の自動検出** - 手動の `get()` 呼び出しが不要になります
- **コンパイル時のコード変換** - ビルド中にエラーを捕捉します
- **DSLとアノテーションの両方に対応** - 好みのスタイルを選択できます
- **可視ファイルの生成なし** - プロジェクト構造をクリーンに保ちます

## なぜコンパイラプラグインを使用するのか？

### 1. より安全なコード

プラグインがコンストラクタの依存関係を自動検出するため、手動による配線ミスを減らすことができます。

```kotlin
// コンパイラプラグインなし - ミスが発生しやすい
val appModule = module {
    single { UserService(get(), get(), get()) }  // 順番が正しいことを祈るしかありません！
}

// コンパイラプラグインあり - オートワイヤリング
val appModule = module {
    single<UserService>()  // プラグインがすべてのコンストラクタ引数を検出
}
```

### 2. よりクリーンな構文

ボイラープレートが減り、可読性が向上します。

| 従来のDSL | コンパイラプラグインDSL |
|-------------|---------------------|
| `singleOf(::MyService)` | `single<MyService>()` |
| `single { MyService(get(), get()) }` | `single<MyService>()` |
| `factoryOf(::MyRepo)` | `factory<MyRepo>()` |
| `viewModelOf(::MyVM)` | `viewModel<MyVM>()` |
| `scopedOf(::MyPresenter)` | `scoped<MyPresenter>()` |
| `workerOf(::MyWorker)` | `worker<MyWorker>()` |

### 3. コンパイル時の安全性

Koinコンパイラプラグインは、DSLとアノテーションの両方に対して**コンパイル時の依存関係検証**を提供します。

- **A2 — モジュール単位:** 可視スコープに対して定義を検証します（早期フィードバック）
- **A3 — フルグラフ:** `startKoin<T>()` において、組み立てられた完全なグラフを検証します
- **A4 — コールサイト:** すべての `get<T>()`、`inject<T>()`、`koinViewModel<T>()` の呼び出しを検証します

コンパイルが通れば、すべての依存関係とすべてのインジェクション実行箇所が満たされていることになります。これにより `verify()` や `checkModules()` が不要になり、実行時のテストハーネスも必要ありません。

詳細は [Compile-Time Safety](/docs/reference/koin-compiler/compile-safety) を参照してください。

### 4. DSLとアノテーション - 両方とも同様に強力

どちらのスタイルでもお好みのものを使用できます。同じプラグインが同一の機能を提供します。

**DSLスタイル:**
```kotlin
val appModule = module {
    single<Database>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

:::info DSL + 引数アノテーション
DSLスタイルを使用する場合でも、プラグインに指示を与えるためにクラス内で**引数アノテーション**を使用します。

```kotlin
class UserPresenter(
    @InjectedParam val userId: String,      // 実行時パラメータ
    @Named("api") val client: ApiClient,    // 限定子付きの依存関係
    val repository: UserRepository          // 自動解決
)

val appModule = module {
    factory<UserPresenter>()  // プラグインがクラスからアノテーションを読み取る
}
```

DSLは依存関係が**どこで**登録されるかを定義します。引数アノテーションはそれらが**どのように**解決されるかを定義します。
:::

**アノテーションスタイル:**
```kotlin
@Singleton
class Database

@Singleton
class UserRepository(private val database: Database)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

## はじめに

### セットアップ

プロジェクトにコンパイラプラグインを追加します。

:::info
詳細な手順については、**[コンパイラプラグイン セットアップガイド](/docs/setup/compiler-plugin)**を参照してください。
:::

### コンパイラプラグインDSLの使用

コンパイラプラグインのパッケージからインポートします。

```kotlin
import org.koin.plugin.module.dsl.*
import org.koin.dsl.module

val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

:::note
コンパイラプラグインDSLは `org.koin.plugin.module.dsl` にあります。従来のDSLは引き続き `org.koin.dsl` にあります。
:::

### アノテーションの使用

アノテーションは以前と同じように機能します。

```kotlin
@Singleton
class Database

@Singleton
class ApiClient

@Singleton
class UserRepository(
    private val database: Database,
    private val apiClient: ApiClient
)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

## 仕組み

コンパイラプラグインは2つのフェーズで動作します。

### 1. FIRフェーズ (解析)

Frontend Intermediate Representation (FIR) フェーズでは、プラグインは以下のことを行います。
- モジュール定義の解析
- コンストラクタ引数の検出
- 依存関係宣言の検証

### 2. IRフェーズ (変換)

Intermediate Representation (IR) フェーズでは、プラグインは以下のことを行います。
- 各引数に対して適切な `get()` 呼び出しを生成
- 限定子 (`@Named`) の処理
- 注入パラメータ (`@InjectedParam`) の処理
- Null許容型および Lazy 型の処理

### 生成される内容

以下のように記述すると：

```kotlin
single<UserRepository>()
```

プラグインは次のように変換します。

```kotlin
single { UserRepository(get(), get()) }  // 引数は自動検出されます
```

より複雑なケースでは：

```kotlin
// あなたのコード
@Singleton
class MyService(
    val required: RequiredDep,
    val optional: OptionalDep?,
    @Named("special") val named: NamedDep,
    val lazy: Lazy<LazyDep>,
    @InjectedParam val param: String
)
```

プラグインは各引数の型に対して適切な処理を生成します。
- 必須 (Required): `get()`
- 任意 (Optional): `getOrNull()`
- 限定子付き (Named): `get(named("special"))`
- Lazy: `inject()`
- InjectedParam: `params.get()`

## コンパイラプラグインDSLリファレンス

### 定義タイプ

```kotlin
import org.koin.plugin.module.dsl.*

val appModule = module {
    // シングルトン - インスタンスは1つ
    single<MyService>()

    // ファクトリ - 呼び出しのたびに新しいインスタンス
    factory<MyPresenter>()

    // スコープ - スコープごとにインスタンス
    scope<MyActivity> {
        scoped<ActivityPresenter>()
    }

    // ViewModel
    viewModel<MyViewModel>()

    // Worker (Android WorkManager)
    worker<MyWorker>()
}
```

### `create()` による安全なインスタンス作成

定義ラムダ内で `create(::T)` を使用すると、自動解決されたコンストラクタ依存関係を持つインスタンスを安全に構築できます。

```kotlin
val appModule = module {
    single { create(::MyService) }
}
```

コンパイラプラグインは `create(::MyService)` を `MyService(get(), get(), ...)` に変換し、すべてのコンストラクタ引数をオートワイヤリングします。

### 限定子 (Qualifiers) の使用

クラスに `@Named` を使用して限定子を定義し、引数に `@Named` を使用してどの依存関係を注入するかを指定します。

```kotlin
// @Named 限定子を使用して実装を定義
@Named("local")
class LocalDatabase : Database

@Named("remote")
class RemoteDatabase : Database

// 引数に @Named を使用して、どちらを注入するか指定
class SyncService(
    @Named("local") val localDb: Database,
    @Named("remote") val remoteDb: Database
)

// DSL - プラグインがクラスと引数から @Named を読み取る
val appModule = module {
    single<LocalDatabase>()
    single<RemoteDatabase>()
    single<SyncService>()
}
```

`@Qualifier` を使用してカスタム限定子を作成することもできます。

```kotlin
@Qualifier
annotation class LocalDb

@Qualifier
annotation class RemoteDb

@LocalDb
class LocalDatabase : Database

@RemoteDb
class RemoteDatabase : Database

class SyncService(
    @LocalDb val localDb: Database,
    @RemoteDb val remoteDb: Database
)
```

### パラメータの使用

クラス内で `@InjectedParam` を使用して、注入時に渡されるパラメータをマークします。

```kotlin
// クラスのアノテーション - この引数をどう扱うかをプラグインに伝える
class UserPresenter(
    @InjectedParam val userId: String,    // parametersOf() 経由で渡される
    val repository: UserRepository        // Koinによって自動解決される
)

// モジュール内のDSL - どこに登録するかをKoinに伝える
val appModule = module {
    factory<UserPresenter>()
}

// 使用法 - 実行時パラメータを渡す
val presenter: UserPresenter = get { parametersOf("user123") }
```

### インターフェースのバインド

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class

    // または複数のバインド
    single<MyServiceImpl>() binds arrayOf(
        ServiceA::class,
        ServiceB::class
    )
}
```

## アノテーションリファレンス

### 定義アノテーション

| アノテーション | 説明 |
|------------|-------------|
| `@Singleton` / `@Single` | シングルトンインスタンス |
| `@Factory` | 呼び出しごとに新しいインスタンス |
| `@Scoped` | スコープごとのインスタンス |
| `@KoinViewModel` | Android ViewModel |
| `@KoinWorker` | Android WorkManager Worker |

### 引数アノテーション

| アノテーション | 説明 |
|------------|-------------|
| `@Named("qualifier")` | 名前付き限定子 |
| `@InjectedParam` | 実行時パラメータ (`parametersOf()` 経由) |
| `@Property("key")` | Koinプロパティ値 |
| `@Provided` | 外部依存関係 (検証をスキップ) |

### モジュールアノテーション

| アノテーション | 説明 |
|------------|-------------|
| `@Module` | Koinモジュールを宣言 |
| `@ComponentScan("package")` | アノテーション付きクラスのパッケージスキャン |
| `@Configuration` | 自動検出されるモジュール |

## アプローチの比較

| アプローチ | ステータス | パッケージ | 構文 |
|----------|--------|---------|--------|
| **コンパイラプラグインDSL** | 推奨 | **`org.koin.plugin.module.dsl`** | `single<MyService>()`, `factory<MyRepo>()`, `viewModel<MyVM>()` |
| **コンパイラプラグイン・アノテーション** | 推奨 | **`koin-annotations`** | `@Singleton`, `@Factory`, `@KoinViewModel ` |
| **従来のDSL** | フルサポート | `org.koin.dsl` | `singleOf(::MyService)`, `single { MyService(get()) }`, `viewModelOf(::MyVM)` |
| **KSPプロセッサ** | 非推奨 | `koin-ksp-compiler` | Koinアノテーション用のレガシープロセッサ。アノテーションは共通ですが、**コンパイラプラグインへ移行してください ⚠️** |

### コンパイラプラグインDSL (推奨)

- 依存関係を自動検出
- コンパイル時の解析
- 最もクリーンな構文

### コンパイラプラグイン・アノテーション (推奨)

- 依存関係を自動検出
- コンパイル時の解析
- 馴染みのあるアノテーションスタイル

### 従来のDSL (フルサポート)

- 任意のKotlinバージョンで動作
- 配線の完全な制御
- 準備ができたらプラグインDSLに移行可能

### KSPプロセッサ `koin-ksp-compiler` (非推奨)

- `koin-annotations` ライブラリ自体は**非推奨ではありません**。現在はKoinプロジェクトの一部です。
- レガシーなKSPベースのプロセッサ (`koin-ksp-compiler`) のみが非推奨です。
- Koinコンパイラプラグインに移行してください。アノテーションはそのままで機能します。
- `koin-ksp-compiler` は将来のKoinバージョンで削除される予定です。

## 移行

### 従来のDSLからの移行

従来のDSLを使用している場合、移行は任意ですが推奨されます。

1. Gradleにコンパイラプラグインを追加します。
2. インポートを `org.koin.plugin.module.dsl.*` に更新します。
3. `singleOf(::Class)` を `single<Class>()` に置き換えます。
4. 手動の `get()` 呼び出しを削除します。

コンパイル時の安全な構文については、[コンパイラプラグインDSLリファレンス](/docs/setup/compiler-plugin#dsl-style)を参照してください。

### KSPプロセッサ (`koin-ksp-compiler`) からの移行

レガシーなKSPプロセッサでKoinアノテーションを使用している場合、今すぐ移行することをお勧めします。

1. Kotlinを2.xにアップデートします。
2. `koin-ksp-compiler` を Koinコンパイラプラグインに置き換えます。
3. **アノテーションはそのままです**。コードの変更は不要です！
4. 生成されたファイルを削除します。

[Migrating from KSP to Compiler Plugin](/docs/migration/from-ksp-to-compiler-plugin) を参照してください。

## 要件

- **Kotlin 2.x** (K2コンパイラ)
- Gradle 8.x以上

## 設定オプション

```kotlin
// build.gradle.kts
koinCompiler {
    // オプションについてはこちらに記載される予定です
}
```

## 従来のDSL：引き続きフルサポート

コンパイラプラグインは従来のDSLを置き換えるものではなく、その上に解析と生成の機能を追加するものです。従来のDSLは引き続き完全にサポートされます。

```kotlin
// 引き続き完全に動作します
val appModule = module {
    singleOf(::Database)
    singleOf(::ApiClient)
    single { CustomService(get(), get(), configValue) }  // カスタムロジック
    viewModelOf(::UserViewModel)
}
```

以下のような場合には従来のDSLを使用してください。
- カスタムのファクトリロジック
- 任意（オプション）の依存関係に対する `getOrNull()`
- 条件付きのインスタンス化
- Kotlin 1.xとの後方互換性

## 次のステップ

- **[セットアップガイド](/docs/setup/compiler-plugin)** - 詳細なセットアップ手順
- **[DSLリファレンス](/docs/reference/dsl-reference)** - DSLの完全なドキュメント
- **[アノテーションリファレンス](/docs/reference/annotations-reference)** - アノテーションの完全なドキュメント
- **[移行ガイド](/docs/migration/from-ksp-to-compiler-plugin)** - プロジェクトのアップグレード