---
title: コンパイル時の安全性
---

Koin Compiler Pluginは、コンパイル時に依存関係グラフを検証します。これにより、アプリが実行される前に、依存関係の欠落、クオリファイア（qualifier）の不一致、および壊れたコールサイト（呼び出し箇所）をキャッチできます。

これは、`verify()` や `checkModules()` といった実行時の検証ツールに代わるものです。コンパイルが通れば、動作が保証されます。

## 仕組み

プラグインは、コンパイル中に以下の3つのレベルでグラフを検証します。

### A2 — モジュール単位（早期フィードバック）

各モジュールの定義が、可視性のある定義（そのモジュール自身の定義、明示的にインクルードされたモジュール、および `@Configuration` ラベルを共有する兄弟モジュール）に対してチェックされます。

```kotlin
@Module(includes = [DataModule::class])
@ComponentScan("app")
class AppModule
// 検証対象: AppModule + DataModule の定義
```

`@Configuration` ラベルを共有するモジュールは、相互に可視性があります。

```kotlin
@Module @ComponentScan("core") @Configuration("prod")
class CoreModule  // Repository を提供

@Module @ComponentScan("service") @Configuration("prod")
class ServiceModule  // Service(repo: Repository) → OK、CoreModule から可視
```

異なるラベルは隔離されます。

```kotlin
@Configuration("core")
class CoreModule

@Configuration("service")  // 異なるラベル — CoreModule は不可視
class ServiceModule         // Service(repo: Repository) → エラー
```

**A2で検出される内容:**

- 依存関係の欠落
- クオリファイアの不一致（`@Named("prod")` が要求されているが、`@Named("test")` しか提供されていないなど）
- スコープを跨ぐ違反（Cross-scope violations）
- `T` が提供されていない `Lazy<T>`
- `@Provided` がマークされていない外部依存関係

### A3 — フルグラフ（完全な保証）

`startKoin<T>()` において、すべてのソースからの全モジュールが組み立てられ、完全なグラフが検証されます。A2では確認できなかった、モジュール間の依存関係やJARからの定義など、すべてがここでチェックされます。

```kotlin
@KoinApplication(modules = [CoreModule::class, ServiceModule::class])
object MyApp

startKoin<MyApp> { }
// 検証対象: CoreModule + ServiceModule を組み合わせた「すべて」の定義
```

A3では、グラフの一部である場合のDSL定義（`single<T>()`、`factory<T>()` など）も検証されます。

### A4 — コールサイトの検証

コードベース内のすべての `koinViewModel<T>()`、`get<T>()`、`inject<T>()` の呼び出しがインターセプトされます。プラグインはターゲットの型、ファイル、行、列をキャプチャし、組み立てられたグラフ内に `T` が存在するかをチェックします。

```kotlin
@Composable
fun UserScreen() {
    val viewModel: UserViewModel = koinViewModel()  // ← A4 がこれを検証
}

class MyFragment : Fragment() {
    val service: PaymentService by inject()  // ← A4 がこれを検証
}
```

もし `UserViewModel` がグラフ内に存在しない場合、正確なファイル、行、列の情報と共にビルドエラーが発生します。

**モジュールを跨ぐコールサイト:** 機能（feature）モジュールが `koinViewModel<T>()` を呼び出しているが、フルグラフへの可視性がない場合、プラグインはコールサイトのヒント（hint）を生成します。アプリモジュールがコンパイルされる際に、依存関係にあるJARからこれらのヒントを見つけ出し、完全なグラフに対して検証を行います。

## 検証される内容

| シナリオ | 結果 |
|----------|--------|
| 非 null パラメータ、定義なし | **エラー** |
| Null 許容パラメータ (`T?`)、定義なし | OK — `getOrNull()` を使用 |
| デフォルト値を持つパラメータ、定義なし | OK — Kotlin のデフォルト値を使用 (`skipDefaultValues=true` の場合) |
| `@InjectedParam`、定義なし | OK — 実行時に `parametersOf()` 経由で提供 |
| `@Property("key")` パラメータ | OK — プロパティ注入 (`@PropertyValue` デフォルトがない場合は警告) |
| `List<T>` パラメータ | OK — 定義がなければ `getAll()` は空リストを返す |
| `Lazy<T>`、`T` の定義なし | **エラー** — 内部の型を検証するために展開 |
| `@Named("x")` パラメータ、一致するクオリファイアなし | **エラー** — 修飾なしのバインディングが存在する場合はヒントを表示 |
| 誤ったスコープからのスコープ依存関係 | **エラー** |
| `@Named` クオリファイア付きのデフォルト値パラメータ | **エラー** — クオリファイアは強制的に注入を行う |
| `@Provided` 型またはパラメータ、定義なし | OK — 実行時に外部から提供 |
| `@ScopeId(name = "x")` パラメータ | OK — 実行時に名前付きスコープから解決 |
| `Scope` 型のパラメータ | OK — スコープのレシーバーが直接渡される |
| Android フレームワークの型 (例: `Context`) | OK — ハードコードされたホワイトリスト |
| 循環参照 (A → B → A) | **エラー** — A2/A3 のグラフ探索中に検出 |

## アノテーションによる安全性

クラスにアノテーションを付け、それらをモジュールに整理することで、コンパイラがすべてを検証します。

```kotlin
@Singleton
class Database

@Singleton
class UserRepository(private val db: Database)

@KoinViewModel
class UserViewModel(private val repo: UserRepository) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

プラグインは `@ComponentScan` を介してアノテーション付きクラスを検出し、A2で各モジュールの定義を検証し、アプリケーションのエントリポイントを宣言した際のA3でフルグラフを検証します。

```kotlin
@KoinApplication(modules = [AppModule::class])
object MyApp

startKoin<MyApp> { }  // ← A3 のフルグラフ検証をトリガー
```

**トップレベル関数**もサポートされています。アノテーション付きのトップレベル関数は `@ComponentScan` によって検出され、クラス定義と同様に検証されます。

```kotlin
@Singleton
fun provideDatabase(): DatabaseService = PostgresDatabase()

@Factory
fun provideCache(db: DatabaseService): CacheService = RedisCache(db)
// ← 検証済み: DatabaseService が存在することを確認
```

`@Configuration` ラベルを使用して、まとめて検証されるモジュールのグループを整理できます。

```kotlin
@Module @ComponentScan("core") @Configuration("prod")
class CoreModule

@Module @ComponentScan("feature") @Configuration("prod")
class FeatureModule  // CoreModule の定義を参照可能
```

## DSL による安全性

コンパイラプラグインは DSL 定義も検証します。`single<T>()`、`factory<T>()`、または `viewModel<T>()` を記述すると、プラグインはその呼び出しをインターセプトし、コンストラクタを自動でワイヤリング（接続）し、すべてのパラメータを検証します。

```kotlin
val appModule = module {
    single<Database>()
    single<UserRepository>()       // ← 検証済み: Database が存在することを確認
    viewModel<UserViewModel>()     // ← 検証済み: UserRepository が存在することを確認
}
```

手動での `get()` 呼び出しは不要です。プラグインがそれらを生成し、同時に検証も行います。

`create(::T)` 関数も検証されます。これは関数参照（通常はビルダー関数ですが、コンストラクタも可能）を呼び出し、そのすべてのパラメータを検証します。

```kotlin
fun buildUserRepository(db: Database): UserRepository = UserRepository(db)

val appModule = module {
    scope<UserSession> {
        scoped { create(::buildUserRepository) }  // ← 検証済み: Database が存在することを確認
    }
}
```

DSL 定義は A3 検証（フルグラフ）および A4 検証（コールサイト）に参加します。`startKoin { modules(appModule) }` を使用すると、プラグインは組み立てられたグラフに対してすべての DSL 定義を検証します。

## 両方のスタイルの併用

同じプロジェクト内でアノテーションと DSL を混在させることができます。両方は同じ検証グラフに集約されます。

```kotlin
// アノテーション
@Singleton class Database

// DSL
val featureModule = module {
    single<UserRepository>()  // ← 検証済み: アノテーションからの Database が可視
}
```

## エラーメッセージ

エラーは、欠落している型、それを必要としている定義、およびどのモジュールにあるかを報告します。

```
[Koin] Missing dependency: Repository
  required by: Service (parameter 'repo')
  in module: ServiceModule
```

異なるクオリファイアを持つバインディングが存在する場合、ヒントが表示されます。

```
[Koin] Missing dependency: NetworkClient (qualifier: @Named("http"))
  required by: ApiService (parameter 'client')
  in module: AppModule
  Hint: Found NetworkClient without qualifier — did you mean to add @Named("http")?
```

コールサイトのエラーには正確な場所が含まれます。

```
[Koin] Missing definition: com.app.UserRepository
  resolved by: koinViewModel<UserViewModel>()
  No matching definition found in any declared module.
  → file: UserScreen.kt, line: 12, column: 5
```

## 禁止されている定義

一部の戻り値の型は Koin を通じて意味のある解決ができず、コンパイル時に拒否されます。

### KOIN-D007: suspend `fun interface` を返す `@Factory`

suspend `fun interface` を拡張する型を返す `@Factory` は、Koin の同期的な `get<T>()` API を通じて呼び出すことができません。プラグインはこれをコンパイル時にブロックします。

```kotlin
fun interface AsyncTask { suspend operator fun invoke(): Result }

@Factory
fun provideTask(): AsyncTask = AsyncTask { ... }
// KOIN-D007 — エラー: @Factory の戻り値の型は suspend fun interface を拡張できません
```

通常のインターフェースにリファクタリングするか、suspend メソッドを持つクラスを通じて suspend 操作を公開してください。

## ジェネリック DSL 型

実行時の Koin は、**型消去された生のクラス (erased raw class)** に基づいて定義を解決します。型パラメータはルックアップキーの一部ではありません。コンパイル時の安全性もこれに従います。`get<Box<X>>()` の呼び出しはグラフ内の任意の `Box<*>` プロバイダーに対して検証され、2つの `single<Box<A>>()` / `single<Box<B>>()` 宣言は衝突します（生のクラスが同じで、クオリファイアがないため）。

```kotlin
class Box<T>(val value: T)

val appModule = module {
    single { Box(42) }   // Box (raw) として登録
}

koin.get<Box<Int>>()    // → 登録された単一の Box を返す
koin.get<Box<String>>() // → 同じ登録を返す (型消去のため)
```

生のクラスで検証することにより、DSL 定義が置換されていない型パラメータを保持していた場合に iOS ビルドをクラッシュさせていた Kotlin/Native の klib シグネチャ・マングリングの失敗も回避できます。

### ジェネリックインスタンスの識別: ジェネリックパラメータによる型クオリファイア

同じジェネリッククラスの複数のインスタンスが共存する必要がある場合の慣用的なパターンは、**具体的なラッパー型**を登録し、**ジェネリックパラメータから派生した型クオリファイア**（`named<T>()`）を使用することです。これは `koin-compose-navigation3` が内部で行っていることで、各ナビゲーションルートをそのルート型に関連付けています。

```kotlin
inline fun <reified T : Any> Module.navigation(
    noinline definition: @Composable Scope.(T) -> Unit,
): KoinDefinition<EntryProviderInstaller> {
    // 具体的な型 (EntryProviderInstaller) を登録し、
    // ジェネリックパラメータ T から派生した型クオリファイアで識別する。
    return _singleInstanceFactory<EntryProviderInstaller>(named<T>(), { ... })
}
```

両方の側で使用されます。

```kotlin
// 宣言 — T は具体的な型 (HomeRoute, SettingsRoute, ...)
module {
    navigation<HomeRoute> { route -> HomeScreen() }
    navigation<SettingsRoute> { route -> SettingsScreen() }
}

// 解決 — 同じ型クオリファイアをキーにルックアップ
koin.get<EntryProviderInstaller>(named<HomeRoute>())
```

`named<T>()` は具体化された `T` から型クオリファイアを生成するため、各ジェネリックのインスタンス化に対して安定した個別のクオリファイアが付与されます。実行時の Koin は（生のクラス + クオリファイア）でマッチングを行い、型消去によって失われた識別能力を再導入します。

ジェネリックのインスタンス化を区別する必要がある場合は、直接 `single<Box<X>>()` を使用するよりも、常にこのパターンを優先してください。

## スコープパラメータの注入

`org.koin.core.scope.Scope` 型のパラメータには、自動的にスコープのレシーバーが注入されます。アノテーションは不要です。スコープを注入することで動的なルックアップが可能になるため、検証はスキップされます。

```kotlin
@Scoped
class ScopedService(val scope: Scope) {
    fun dynamicLookup() = scope.get<SomeDep>()
}
// 生成内容: ScopedService(scope) — スコープのレシーバーを直接渡す
```

## 名前付きスコープの解決: `@ScopeId`

現在のスコープではなく、名前付き Koin スコープから依存関係を解決するには `@ScopeId` を使用します。スコープは実行時に解決されるため、検証はスキップされます。

```kotlin
@Factory
class ProfileService(@ScopeId(name = "user_session") val session: UserSession)
// 生成内容: ProfileService(scope.getScope("user_session").get<UserSession>())
```

`@ScopeId` は2つの形式をサポートしています。

| 形式 | 例 | スコープ ID |
|------|---------|----------|
| 文字列名 | `@ScopeId(name = "user_session")` | `"user_session"` |
| 型参照 | `@ScopeId(UserSessionScope::class)` | 完全修飾クラス名 (FQ class name) |

## プロパティの検証

`@Property("key")` パラメータは Koin プロパティ（起動時に `properties()` 経由で設定）から解決されます。`@PropertyValue("key")` によるデフォルト値が存在しない場合、プラグインはコンパイル時に警告を表示します。

```kotlin
@PropertyValue("api.timeout")
val defaultTimeout = 30

@Factory
class ApiClient(@Property("api.timeout") val timeout: Int)
// OK — @PropertyValue("api.timeout") がコンパイル時のデフォルトを提供

@Factory
class Other(@Property("missing.key") val value: String)
// 警告 — @PropertyValue("missing.key") が見つからない
// (コンパイル自体は可能 — プロパティは実行時に提供される可能性があるため)
```

## 外部の型: `@Provided`

一部の型は、実行時にプラットフォームや外部フレームワークによって提供され、Koin の定義として宣言されることはありません。これらを検証から除外するには、`@Provided` をマークします。

`@Provided` は **クラス**（その型のすべての使用箇所で検証をスキップ）と **パラメータ**（そのパラメータのみスキップ）の両方で機能します。

```kotlin
// クラスに付与 — この型のすべての使用箇所で検証をスキップ
@Provided
class SavedStateHandle

// パラメータに付与 — このパラメータのみ検証をスキップ
@Singleton
class MyViewModel(@Provided val handle: SavedStateHandle)
```

**`@Provided` を使用すべきケース:**

- ホワイトリストに含まれていない **Android フレームワークの型**（例: カスタム Android サービス）
- 外部から注入される **サードパーティ SDK の型**（例: Firebase、アナリティクス SDK）
- **Koin を使用していないモジュールからの型**（依存関係が Koin を使用していないライブラリから提供される場合）
- **テストダブル**（テスト構成で実際の実装を置き換える場合）
- **手動で提供される型**（`androidContext()`、手動での `single { }` 登録）

```kotlin
// 外部 SDK — Koin によって管理されていない
@Singleton
class AnalyticsService(@Provided val firebaseAnalytics: FirebaseAnalytics)

// モジュール間: 実行時に別のチームのモジュールから提供される
@Factory
class PaymentProcessor(@Provided val paymentGateway: PaymentGateway)
```

**一般的な Android フレームワークの型は自動的にホワイトリストに登録されているため**、`@Provided` は不要です。

- `android.content.Context`
- `android.app.Application`
- `android.app.Activity`
- `androidx.fragment.app.Fragment`
- `androidx.lifecycle.SavedStateHandle`
- `androidx.work.WorkerParameters`

## デフォルト値と skipDefaultValues

`skipDefaultValues` が有効な場合（デフォルト）、Kotlin のデフォルト値を持つパラメータは、DI コンテナから解決される代わりにデフォルト値を使用します。

```kotlin
// skipDefaultValues = true (デフォルト) の場合:
@Singleton
class ServiceWithDefault(val timeout: Int = 5000)
// → DI 解決ではなく、Kotlin のデフォルト値 (5000) を使用

// Null 許容パラメータは引き続き注入される:
@Singleton
class Service(val dep: Dependency? = null)
// → DI から getOrNull() を使用

// アノテーション付きのパラメータは、デフォルト値に関わらず常に DI を使用する:
@Singleton
class Service(@Named("custom") val name: String = "fallback")
// → @Named("custom") クオリファイアを使用して DI から解決

// 混合: 一部は DI から、一部はデフォルト値から
@Singleton
class ApiClient(
    val repo: UserRepository,                        // → DI から解決
    val timeout: Int = 30_000,                       // → Kotlin のデフォルト値を使用
    @Property("api_url") val url: String = "https://api.example.com"  // → DI から解決 (アノテーション付き)
)
```

`skipDefaultValues = false` に設定すると、Kotlin のデフォルト値を無視して、すべてのパラメータを常に DI コンテナから注入します。

## 設定

コンパイル時の安全性はデフォルトで有効になっています。無効にするには以下のように記述します。

```kotlin
koinCompiler {
    compileSafety = false  // コンパイル時の安全性チェックを無効化
}
```

その他の関連オプション:

```kotlin
koinCompiler {
    compileSafety = true       // コンパイル時の依存関係検証 (デフォルト: true)
    strictSafety = true        // ビルドのたびにアグリゲーターの安全性パスを強制的に再実行する
                               // (デフォルト: startKoin / @KoinApplication があるモジュールで自動検出)
    skipDefaultValues = true   // デフォルト値を持つパラメータの注入をスキップする (デフォルト: true)
    unsafeDslChecks = true     // create() がラムダ内の唯一の命令であることを検証する (デフォルト: true)
}
```

:::info インクリメンタルコンパイルと `strictSafety`
フルグラフパス（A3）は、アグリゲーターの `compileKotlin` でのみ実行されます。K2 における Kotlin のインクリメンタルコンパイルは、`module { }` ラムダ内の DSL の変更や、`@ComponentScan` パッケージに新しく追加されたクラスを追跡しません。そのため、グラフが変更された場合でもアグリゲーターが UP-TO-DATE とマークされる可能性があります。プラグインは、検出されたアグリゲーターモジュールで [`strictSafety`](/docs/reference/koin-annotations/options#strictsafety) を自動的に有効にし、A3 の再実行を強制します。ライブラリや機能モジュールは、完全なインクリメンタル状態を維持します。
:::

## verify() / checkModules() からの移行

コンパイラプラグインは、実行時の検証を置き換えます。検証テストを削除することができます。

| 以前 | 以後 |
|--------|-------|
| テスト内での `module.verify()` | コンパイラプラグイン (自動) |
| テスト内での `checkModules()` | コンパイラプラグイン (自動) |
| 実行時の検証 | コンパイル時の検証 |
| 手動のテストセットアップ | テストコード不要 |

コンパイラはビルドのたびに検証を行うため、テストコードは不要になります。

## 関連項目

- **[Compiler Plugin Options](/docs/reference/koin-annotations/options)** - すべての設定オプション
- **[Compiler Plugin Setup](/docs/setup/compiler-plugin)** - インストールガイド
- **[Starting with Annotations](/docs/reference/koin-annotations/start)** - はじめに
- **[Playground Apps](https://github.com/InsertKoinIO/koin-compiler-plugin/tree/main/playground-apps)** - アノテーション方式 (`app-annotations/`) と DSL 方式 (`app-dsl/`) の両方を備えた完全なリファレンスアプリ