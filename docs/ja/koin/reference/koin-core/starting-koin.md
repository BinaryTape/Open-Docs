---
title: Koin の開始
---

# Koin の開始

このガイドでは、Koin コンテナを初期化し、アプリケーション用に設定する方法について説明します。

## `startKoin` 関数

`startKoin` は Koin を起動するためのメインのエントリポイントです。これはコンテナを `GlobalContext` に登録し、アプリケーション全体からアクセス可能にします。

```kotlin
startKoin {
    modules(appModule)
}
```

一度起動すると、`get()` や `by inject()` を通じて依存関係を解決（resolution）できるようになります。

### 設定オプション

```kotlin
startKoin {
    // ロギング
    logger(Level.INFO)

    // プロパティ
    environmentProperties()
    fileProperties()
    properties(mapOf("env" to "production"))

    // モジュール
    modules(
        coreModule,
        networkModule,
        dataModule
    )

    // 遅延モジュール (バックグラウンド読み込み)
    lazyModules(analyticsModule, reportingModule)

    // Eager シングルトンの作成
    createEagerInstances()

    // オーバーライドの制御
    allowOverride(false)
}
```

| オプション | 説明 |
|--------|-------------|
| `logger()` | ログレベルと実装を設定する |
| `modules()` | モジュールを即座にロードする |
| `lazyModules()` | バックグラウンドでモジュールをロードする |
| `properties()` | Map からプロパティをロードする |
| `fileProperties()` | koin.properties ファイルからロードする |
| `environmentProperties()` | システム/環境変数からロードする |
| `createEagerInstances()` | すべての `createdAtStart` シングルトンを作成する |
| `allowOverride()` | 定義のオーバーライドの有効/無効を切り替える |

:::info
`startKoin` は **1回** しか呼び出すことができません。後で追加のモジュールをロードするには、`loadKoinModules()` を使用してください。
:::

## Koin コンテナの起動

| メソッド | ユースケース |
|--------|----------|
| `startKoin { }` | 標準的なアプリ - GlobalContext に登録する |
| `koinApplication { }` | テスト、SDK、隔離されたコンテキスト - ローカルインスタンス |
| `koinConfiguration { }` | 専用 API 用の設定ホルダー (Compose, Ktor) |

:::tip
**Koin Compiler Plugin** を使用すると、`startKoin<T>()`、`koinApplication<T>()`、`koinConfiguration<T>()` といった型指定されたバリアントが利用可能です。詳細は以下の [Compiler Plugin を使用した Koin の開始](#compiler-plugin-を使用した-koin-の開始) を参照してください。
:::

### `startKoin` - グローバルインスタンス

最も一般的なアプローチで、Koin をグローバルに開始します。

```kotlin
fun main() {
    startKoin {
        modules(appModule)
    }

    // どこでも使用可能
    val service: MyService = get()
}
```

### `koinApplication` - 隔離されたインスタンス

（GlobalContext ではない）隔離された Koin インスタンスを作成します。

```kotlin
val myKoin = koinApplication {
    modules(myModule)
}.koin

// 隔離されたインスタンスを使用する
val service: MyService = myKoin.get()
```

**ユースケース:**
- 隔離されたコンテキストでのテスト
- SDK 開発（ホストアプリへの影響を避けるため）
- 複数の Koin インスタンスの保持

### `koinConfiguration` - 設定ホルダー

専用の API（Compose の `KoinApplication`、Ktor プラグインなど）で使用される設定を作成します。

```kotlin
val config = koinConfiguration {
    modules(appModule)
}

// Compose の KoinApplication や Ktor などで使用される
```

## Compiler Plugin を使用した Koin の開始

アノテーションと共に **Koin Compiler Plugin** を使用すると、生成されたコードを意識することなく、**型指定された API** を使用して Koin を開始できます。

:::info
これには [Koin Compiler Plugin](/docs/setup/compiler-plugin) が必要です。アプリケーションクラスに `@KoinApplication` アノテーションを付与する必要があります。
:::

### アプリケーションの定義

```kotlin
@Module
@Configuration
@ComponentScan("com.myapp")
class MyModule

@KoinApplication
class MyApp
```

### 型指定された起動 API

| API | 説明 |
|-----|-------------|
| `startKoin<T>()` | アプリケーション T を使用して Koin をグローバルに開始する |
| `startKoin<T> { }` | アプリケーション T と追加設定を使用して開始する |
| `koinApplication<T>()` | T を使用して隔離された KoinApplication を作成する |
| `koinConfiguration<T>()` | T から KoinConfiguration を作成する (Compose, Ktor 用) |

ここで `T` は `@KoinApplication` が付与されたクラスです。

### 例

```kotlin
// シンプルな起動
startKoin<MyApp>()

// 追加設定あり
startKoin<MyApp> {
    printLogger()
}

// 隔離されたインスタンス
val myKoin = koinApplication<MyApp>().koin

// Compose/Ktor 用の設定
val config = koinConfiguration<MyApp>()
```

### マルチモジュールプロジェクト

```kotlin
// feature/src/main/kotlin/FeatureModule.kt
@Module
@Configuration
@ComponentScan("com.myapp.feature")
class FeatureModule

// app/src/main/kotlin/MyApp.kt
@KoinApplication
class MyApp

// Koin の開始
startKoin<MyApp>()
```

## プラットフォーム統合

### Android

```kotlin
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MainApplication)
            modules(appModule)
        }
    }
}
```

**Compiler Plugin を使用する場合:**

```kotlin
@KoinApplication
class MyApp

class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin<MyApp> {
            androidLogger()
            androidContext(this@MainApplication)
        }
    }
}
```

### Compose

`koinConfiguration` と共に `KoinApplication` Composable を使用します。

```kotlin
@Composable
fun App() {
    KoinApplication(
        configuration = koinConfiguration { modules(appModule) }
    ) {
        MainScreen()
    }
}
```

**Compiler Plugin を使用する場合:**

```kotlin
@KoinApplication
class MyApp

@Composable
fun App() {
    KoinApplication(
        configuration = koinConfiguration<MyApp>()
    ) {
        MainScreen()
    }
}
```

### Ktor

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

**Compiler Plugin を使用する場合:**

```kotlin
@KoinApplication
class MyApp

fun Application.module() {
    install(Koin) {
        slf4jLogger()
        withConfiguration<MyApp>()
    }
}
```

:::info
詳細は [Ktor Integration](/docs/reference/koin-ktor/ktor) を参照してください。
:::

### Kotlin Multiplatform

プラットフォーム間で設定を共有します。

```kotlin
// commonMain
fun initKoin(config: KoinAppDeclaration? = null) {
    startKoin {
        config?.invoke(this)
        modules(sharedModule)
    }
}

// androidMain
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        initKoin {
            androidContext(this@MainApplication)
            androidLogger()
        }
    }
}

// iosMain
fun initKoinIos() = initKoin()
```

## 動的なモジュール管理

### 起動後のモジュールのロード

```kotlin
// 最初の起動
startKoin {
    modules(coreModule)
}

// 後で追加のモジュールをロードする
loadKoinModules(featureModule)
```

### モジュールのアンロード

```kotlin
unloadKoinModules(featureModule)
```

### 機能トグル (Feature Toggle) の例

```kotlin
if (isFeatureEnabled) {
    loadKoinModules(premiumFeatureModule)
}

// 後で無効になった場合
unloadKoinModules(premiumFeatureModule)
```

## Koin の停止

コンテナを閉じ、リソースを解放します。

```kotlin
stopKoin()
```

隔離されたインスタンスの場合:

```kotlin
val koinApp = koinApplication { modules(myModule) }
koinApp.close()
```

## ロギング

### ロギングの有効化

```kotlin
startKoin {
    logger(Level.INFO)  // または DEBUG, WARNING, ERROR, NONE
}
```

### 利用可能なロガー

| ロガー | プラットフォーム | 説明 |
|--------|----------|-------------|
| `EmptyLogger` | 全て | ログ出力なし (デフォルト) |
| `PrintLogger` | 全て | コンソール出力 |
| `AndroidLogger` | Android | Android Logcat |
| `SLF4JLogger` | JVM | SLF4J 統合 |

### プラットフォーム固有のロガー

```kotlin
// Android
startKoin {
    androidLogger(Level.DEBUG)
}

// Ktor
install(Koin) {
    slf4jLogger()
}
```

## プロパティ

### プロパティのロード

```kotlin
startKoin {
    // 環境変数から
    environmentProperties()

    // ファイルから (koin.properties)
    fileProperties()

    // コードから
    properties(mapOf(
        "server_url" to "https://api.example.com",
        "api_key" to "secret123"
    ))
}
```

### プロパティの使用

```kotlin
val appModule = module {
    single {
        ApiClient(
            url = getProperty("server_url"),
            key = getProperty("api_key", "default")
        )
    }
}
```

## ベストプラクティス

1. **`startKoin` は一度だけ呼び出す** - アプリケーションのエントリポイントで行います。
2. **重要なモジュールは即座にロードする** - `modules()` を使用します。
3. **遅延モジュールを活用する** - `lazyModules()` で重要度の低いもののロードを遅らせます。
4. **開発中はロギングを有効にする** - `logger(Level.DEBUG)` を使用します。
5. **本番環境では strict モードを使用する** - `allowOverride(false)` を設定します。
6. **テスト間では Koin を停止する** - 状態をリセットするために `stopKoin()` を呼び出します。

## 次のステップ

- **[モジュール](/docs/reference/koin-core/modules)** - 定義を整理する
- **[定義](/docs/reference/koin-core/definitions)** - DSL またはアノテーションで定義を作成する
- **[インジェクション](/docs/reference/koin-core/injection)** - 依存関係を取得する