---
title: モジュール
---

# モジュール

Koin モジュールは、依存性注入（DI）の設定を整理するための構成要素です。

## モジュールとは何か？

モジュールは、関連する定義をグループ化するための論理的なコンテナです。

```kotlin
val appModule = module {
    single<Database>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

モジュールは以下のことに役立ちます：
- 機能またはレイヤーごとに定義を**整理する**
- 関連する依存関係を**カプセル化する**
- コンテキスト間で設定を**再利用する**
- モジュール化されたプロジェクトで**可視性を制御する**

## モジュールの作成

### コンパイラプラグイン DSL を使用する場合

```kotlin
import org.koin.plugin.module.dsl.*

val networkModule = module {
    single<ApiClient>()
    single<TokenManager>()
}

val databaseModule = module {
    single<Database>()
    single<UserDao>()
}
```

### アノテーションを使用する場合

```kotlin
@Module
@ComponentScan("com.myapp.network")
class NetworkModule

@Module
@ComponentScan("com.myapp.database")
class DatabaseModule
```

### クラシック DSL を使用する場合

```kotlin
val networkModule = module {
    singleOf(::ApiClient)
    singleOf(::TokenManager)
}
```

## 複数のモジュールの使用

依存関係は、他のモジュールで宣言された定義を参照できます：

```kotlin
// データレイヤー
val dataModule = module {
    single<Database>()
    single<UserRepository>()  // このモジュールの Database を使用可能
}

// プレゼンテーションレイヤー
val viewModelModule = module {
    viewModel<UserViewModel>()  // dataModule の UserRepository を使用可能
}

// 両方をロード
startKoin {
    modules(dataModule, viewModelModule)
}
```

:::info 
Koin は、ロードされたすべてのモジュール間で依存関係を自動的に解決します。明示的なインポート（import）は不要です。
:::

:::note
モジュールを直接リストアップすることも可能ですが、構造を改善しロードを最適化するために、[`includes()`](#includes-によるモジュールの構成) を使用してモジュールを階層構造に整理することを検討してください。
:::

## `includes()` によるモジュールの構成

`includes()` 関数は、モジュールを整理するための**推奨される方法**です。以下の利点があります：

- **モジュールの階層構造** - 親子関係を明確にしてモジュールを構成できます。
- **ロードの最適化** - Koin はインクルードされたモジュールの重複を排除し、冗長な登録を防ぎます。
- **よりクリーンな起動** - 長いリストの代わりに、単一のルートモジュールをロードするだけで済みます。
- **カプセル化** - 内部（internal）モジュールを公開 API モジュールの背後に隠すことができます。

:::tip
**ベストプラクティス:** `startKoin` ですべてのモジュールを列挙するのではなく、`includes()` を使用してモジュール階層を構築してください。これにより、整理が容易になり、効率的なモジュールロードが保証されます。
:::

```kotlin
val networkModule = module {
    single<ApiClient>()
}

val storageModule = module {
    single<Database>()
}

// 親モジュールが子モジュールをインクルード
val dataModule = module {
    includes(networkModule, storageModule)
    single<UserRepository>()
}

// ✅ 推奨：includes を使用してルートモジュールをロード
startKoin {
    modules(dataModule)
}

// ❌ 非推奨：フラットなモジュールリスト
startKoin {
    modules(networkModule, storageModule, dataModule)
}
```

### `includes()` によるロードの最適化

モジュールが複数回インクルードされた場合でも、Koin はそれらを一度だけロードします：

```kotlin
val commonModule = module {
    single<Logger>()
}

val featureAModule = module {
    includes(commonModule)
    single<FeatureA>()
}

val featureBModule = module {
    includes(commonModule)  // ここでも commonModule をインクルード
    single<FeatureB>()
}

val appModule = module {
    includes(featureAModule, featureBModule)
}

// commonModule は 2 回インクルードされていますが、一度だけロードされます
startKoin {
    modules(appModule)
}
```

### マルチモジュールプロジェクト

可視性修飾子を使用して、公開する内容を制御します：

```kotlin
// :feature:user モジュール

// Private - 他のモジュールからは隠される
private val userDataModule = module {
    single<UserDao>()
    single<UserCache>()
}

// 公開 API
val userFeatureModule = module {
    includes(userDataModule)
    viewModel<UserViewModel>()
}
```

```kotlin
// :app モジュール
startKoin {
    modules(userFeatureModule)  // これだけがアクセス可能
}
```

## モジュールのオーバーライド

### デフォルトの挙動

デフォルトでは、**最後にロードされた定義が優先**されます：

```kotlin
val productionModule = module {
    single<ApiService> { ProductionApi() }
}

val debugModule = module {
    single<ApiService> { DebugApi() }
}

startKoin {
    modules(productionModule, debugModule)  // DebugApi が優先される
}
```

### ストリクト（厳格）モード

プロダクション環境でオーバーライドを無効にする：

```kotlin
startKoin {
    allowOverride(false)  // オーバーライドしようとすると例外をスローする
    modules(productionModule)
}
```

### 明示的なオーバーライド

ストリクトモードで特定のオーバーライドを許可する：

```kotlin
val testModule = module {
    single<ApiService> { MockApi() }.override()  // 許可される
}

startKoin {
    allowOverride(false)
    modules(productionModule, testModule)
}
```

## モジュールの先行作成 (Eager Module Creation)

起動時にシングルトンを即座に作成します：

```kotlin
val coreModule = module(createdAtStart = true) {
    single<ConfigManager>()
    single<LoggingSystem>()
}
```

## パラメータ化されたモジュール

動的にモジュールを作成します：

```kotlin
fun featureModule(debug: Boolean) = module {
    single<Logger> {
        if (debug) DebugLogger() else ProductionLogger()
    }
}

startKoin {
    modules(featureModule(debug = BuildConfig.DEBUG))
}
```

## ストラテジーパターン

モジュールを使用して実装を切り替えます：

```kotlin
val repositoryModule = module {
    single<UserRepository>()  // Datasource に依存
}

// ストラテジーのオプション
val localDatasourceModule = module {
    single<Datasource> { LocalDatasource() }
}

val remoteDatasourceModule = module {
    single<Datasource> { RemoteDatasource() }
}

// プロダクション
startKoin {
    modules(repositoryModule, remoteDatasourceModule)
}

// オフラインモード
startKoin {
    modules(repositoryModule, localDatasourceModule)
}
```

## アノテーション付きモジュール

Koin は、DSL の代替としてアノテーションベースのモジュール構成をサポートしています。

```kotlin
@Module
@ComponentScan("com.myapp.data")
class DataModule

@Module
@ComponentScan("com.myapp.network")
class NetworkModule

// 他のモジュールをインクルード
@Module(includes = [DataModule::class, NetworkModule::class])
class AppModule
```

主な機能：
- `@Module` はクラスを Koin モジュールとしてマークします
- `@ComponentScan` はパッケージ内のアノテーション付きクラスを自動検出します
- `@Configuration` は起動時の自動検出を有効にします
- モジュール関数は外部ライブラリのインスタンスを提供します

:::info
アノテーション付きモジュールの詳細なドキュメントについては、[アノテーションリファレンス - モジュール](/docs/reference/koin-annotations/modules) を参照してください。
:::

## ベストプラクティス

### 整理

1. **機能/レイヤーごとにグループ化する**
   ```kotlin
   val authModule = module { /* 認証機能 */ }
   val networkModule = module { /* ネットワークレイヤー */ }
   ```

2. **`includes()` を使用してモジュール階層を構築する**（推奨）
   ```kotlin
   // すべての機能を含むルートモジュールを作成する
   val appModule = module {
       includes(
           coreModule,
           networkModule,
           featureAModule,
           featureBModule
       )
   }

   // 単一モジュールによるクリーンな起動
   startKoin {
       modules(appModule)
   }
   ```

3. **モジュールの責務を絞る** - 1 つのモジュールにつき 1 つの責務を持たせる。

### 命名

- わかりやすい名前を使用する： `networkModule`, `userFeatureModule`
- 関連するものをグループ化する： `authDataModule`, `authDomainModule`

### マルチモジュールプロジェクト

1. **1 つの機能につき 1 つの公開モジュールを用意する**
2. **実装モジュールには `private`/`internal` を使用する**
3. **共有モジュールは `:core` に配置する**

## 次のステップ

- **[定義](/docs/reference/koin-core/definitions)** - 定義を作成する
- **[クオリファイア](/docs/reference/koin-core/qualifiers)** - 名前付きおよび型付きのクオリファイア
- **[スコープ](/docs/reference/koin-core/scopes)** - スコープでライフサイクルを管理する
- **[トラブルシューティング](/docs/reference/koin-core/troubleshooting)** - 一般的な問題のデバッグと修正