---
title: レイジーモジュールとバックグラウンドロード
---

レイジーモジュールは、スタートアップ（起動）時のパフォーマンスを向上させるために、非同期かつ並列なモジュールのロードを可能にします。起動時にすべてのモジュールを同期的にロードする代わりに、モジュールの初期化を遅延させたり並列化したりすることができます。

:::info
このページでは **Koin Compiler Plugin DSL** (`single<T>()`) を使用しています。設定については [Compiler Plugin Setup](/docs/setup/compiler-plugin) を参照してください。
:::

## レイジーモジュールとは？

レイジーモジュールは、明示的にロードされるまでモジュールの登録とインスタンスの作成を遅延させます。これらは特に以下のようなケースで役立ちます：

- **大規模なアプリケーション** - 初期化処理を複数のスレッドに分散させる
- **パフォーマンスの最適化** - スタートアップ時間を短縮する
- **条件付き機能** - 必要な時だけモジュールをロードする
- **バックグラウンド初期化** - クリティカル（重要）ではないモジュールを非同期でロードする

## レイジーモジュールの定義

`lazyModule` 関数を使用してレイジーモジュールを作成します：

```kotlin
// レイジーモジュール - 明示的に要求されるまでロードされません
val networkModule = lazyModule {
    single<ApiClient>()
    single<NetworkMonitor>()
}

val databaseModule = lazyModule {
    single<Database>()
    single<UserDao>()
}
```

### レイジーモジュールの構成

レイジーモジュールは、通常のモジュールと同様に `includes()` をサポートしています：

```kotlin
val dataModule = lazyModule {
    single<UserRepository>()
}

val featureModule = lazyModule {
    includes(dataModule)  // 他のレイジーモジュールをインクルードする
    single<FeatureService>()
}
```

:::info
レイジーモジュールは、`lazyModules()` 関数を介してロードされるまで、いかなるリソースも割り当てません。
:::

## レイジーモジュールのロード

Koinの設定内で `lazyModules()` を使用してレイジーモジュールをロードします。

### 基本的なロード方法

```kotlin
val analyticsModule = lazyModule {
    single<AnalyticsService>()
}

val reportingModule = lazyModule {
    single<CrashReporter>()
}

startKoin {
    // クリティカルなモジュールを即座にロードする
    modules(coreModule, networkModule)

    // クリティカルではないモジュールをバックグラウンドでロードする
    lazyModules(analyticsModule, reportingModule)
}
```

### 並列ロード (4.2.0+)

バージョン 4.2.0 以降、複数のレイジーモジュールは、各モジュールが独自のコルーチン内で**並列**にロードされるようになりました：

```kotlin
val module1 = lazyModule { single<DatabaseService>() }
val module2 = lazyModule { single<NetworkService>() }
val module3 = lazyModule { single<AnalyticsService>() }

startKoin {
    // 3つのモジュールすべてが同時にロードされます！
    lazyModules(module1, module2, module3)
}
```

**パフォーマンスへの影響:**

| シナリオ | 4.2.0 より前 (シーケンシャル) | 4.2.0 以降 (並列) |
|----------|--------------------------|------------------------|
| 1 モジュール @ 100ms | 100ms | 100ms |
| 3 モジュール @ 各 100ms | 300ms | ~100ms |
| 10 モジュール @ 各 100ms | 1000ms | ~100ms |

### ロード完了の待機

#### 全プラットフォーム共通: `waitAllStartJobs()`

```kotlin
startKoin {
    lazyModules(module1, module2, module3)
}

val koin = KoinPlatform.getKoin()

// すべてのレイジーモジュールがロードされるまでブロックする
koin.waitAllStartJobs()

// これでレイジーモジュールの依存関係を安全に使用できます
val service = koin.get<AnalyticsService>()
```

**プラットフォームごとの動作:**
- **JVM/Native**: `runBlocking` による真のブロッキング
- **JS**: `GlobalScope.promise` を使用（真のブロッキングではなく、警告をログ出力します）

#### JVM 限定: `runOnKoinStarted()`

```kotlin
startKoin {
    lazyModules(analyticsModule)
}

// JVM 限定のコールバック
KoinPlatform.getKoin().runOnKoinStarted { koin ->
    // すべてのレイジーモジュールのロードが完了した後に実行されます
    koin.get<AnalyticsService>().trackAppStart()
}
```

#### サスペンドによる代替手段: `awaitAllStartJobs()`

コルーチンコンテキストや、ブロッキングをサポートしていないプラットフォームの場合：

```kotlin
suspend fun initializeApp() {
    startKoin {
        lazyModules(module1, module2)
    }

    // ブロックせずに待機（Await）する
    KoinPlatform.getKoin().awaitAllStartJobs()

    // 処理を続行可能
    println("All modules loaded!")
}
```

## カスタムディスパッチャ (Custom Dispatchers)

レイジーモジュールのロードを実行するディスパッチャを制御できます：

```kotlin
import kotlinx.coroutines.Dispatchers

startKoin {
    // Default ではなく IO ディスパッチャでロードする
    lazyModules(
        databaseModule,
        networkModule,
        dispatcher = Dispatchers.IO
    )
}
```

**一般的なディスパッチャの選択肢:**
- `Dispatchers.Default` - CPU負荷の高い作業（デフォルト）
- `Dispatchers.IO` - I/O 操作、ファイルアクセス、ネットワーク
- `Dispatchers.Main` - UI 更新（Android/Desktop）

:::info
指定しない場合、デフォルトのディスパッチャは `Dispatchers.Default` です。
:::

## 実践的な例

```kotlin
// コアモジュール - 即座にロード
val coreModule = module {
    single<AppConfig>()
    single<UserSession>()
}

// 機能モジュール - バックグラウンドでロード
val analyticsModule = lazyModule {
    single<AnalyticsEngine>()
    single<EventTracker>()
}

val networkingModule = lazyModule {
    single<ApiClient>()
    single<WebSocketManager>()
}

val databaseModule = lazyModule {
    single<Database>()
    single<UserDao>()
}

// Android Application
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MyApp)

            // クリティカルなモジュールを即座にロード
            modules(coreModule)

            // 非クリティカルなモジュールをバックグラウンドで並列ロード
            lazyModules(
                analyticsModule,
                networkingModule,
                databaseModule,
                dispatcher = Dispatchers.IO
            )
        }

        // オプション: バックグラウンドロードの完了を待機する
        lifecycleScope.launch {
            KoinPlatform.getKoin().awaitAllStartJobs()
            Log.d("Koin", "All modules loaded!")
        }
    }
}
```

## 重要な制限事項

### 相互依存の回避

レイジーモジュールと通常のモジュールは、互いに独立している必要があります。通常のモジュールからレイジーモジュールへの依存関係を作成しないでください：

```kotlin
// ❌ NG - mainModule がレイジーモジュールに依存している
val lazyAnalytics = lazyModule {
    single { AnalyticsService() }
}

val mainModule = module {
    single { AppController(get<AnalyticsService>()) }  // 失敗する可能性があります！
}

startKoin {
    modules(mainModule)
    lazyModules(lazyAnalytics)
}
```

```kotlin
// ✅ OK - 依存関係を分離しておく
val lazyAnalytics = lazyModule {
    single { AnalyticsService() }
}

val mainModule = module {
    single { AppController() }
}

startKoin {
    modules(mainModule)
    lazyModules(lazyAnalytics)
}
```

:::warning
Koinは現在、通常のモジュールとレイジーモジュール間の依存関係を検証しません。通常のモジュールがレイジーモジュールの定義に依存しないように注意してください。
:::

### ベストプラクティス: ロード順序

1. **即時モジュール (Immediate modules)** - 起動時に必要なクリティカルなサービス
2. **レイジーモジュール (Lazy modules)** - クリティカルではない、遅延可能なサービス
3. **必要に応じて待機** - レイジーな定義にアクセスする前に `waitAllStartJobs()` を使用する

## レイジーモジュールを使用すべきタイミング

### 適したユースケース

- **アナリティクス/トラッキング** - コア機能には不要
- **クラッシュレポート** - バックグラウンドで初期化可能
- **機能モジュール (Feature Modules)** - オンデマンドでロードされるモジュール化された機能
- **データベース/ネットワーク** - 遅延可能な重い初期化処理
- **大規模アプリ** - 起動時の負荷をスレッド間に分散させる

### 推奨されないケース

- **コアサービス** - 即座に必要となるクリティカルな依存関係
- **小規模なアプリ** - オーバーヘッドがメリットを上回る可能性がある
- **密結合なモジュール** - モジュール間に多くの相互依存関係がある場合

## API リファレンス

| 関数 | プラットフォーム | 説明 |
|----------|----------|-------------|
| `lazyModules()` | すべて | レイジーモジュールをバックグラウンドでロードする |
| `waitAllStartJobs()` | すべて | すべてのレイジーモジュールがロードされるまでブロックする |
| `awaitAllStartJobs()` | すべて | すべてのレイジーモジュールがロードされるまでサスペンドする |
| `runOnKoinStarted()` | JVM のみ | ロード完了後のコールバック |

## 関連項目

- **[Modules](/docs/reference/koin-core/modules)** - `includes()` によるモジュールの構成
- **[Definitions](/docs/reference/koin-core/definitions)** - Eager（先行） vs Lazy（遅延）シングルトン
- **[Starting Koin](/docs/reference/koin-core/starting-koin)** - Koin の起動設定