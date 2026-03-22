---
title: Koin 開始リファレンス
---

Koin の開始に関するクイックリファレンスです。詳細なガイドについては、**[コア - Koin の開始](/docs/reference/koin-core/starting-koin)** を参照してください。

## 開始メソッド

| メソッド | ユースケース |
|--------|----------|
| `startKoin { }` | 標準的なアプリ - GlobalContext に登録 |
| `koinApplication { }` | テスト、SDK - 分離されたインスタンス |
| `koinConfiguration { }` | Compose、Ktor 用の設定 |
| `startKoin<T>()` | コンパイラプラグインを使用した型指定による起動 |

## 基本的な開始方法

```kotlin
startKoin {
    modules(appModule)
}
```

## 完全な設定例

```kotlin
startKoin {
    logger(Level.INFO)
    environmentProperties()
    fileProperties()
    properties(mapOf("env" to "production"))
    modules(coreModule, networkModule)
    lazyModules(analyticsModule)
    createEagerInstances()
    allowOverride(false)
}
```

## 設定オプション

| オプション | 説明 |
|--------|-------------|
| `logger()` | ログレベルと実装を設定 |
| `modules()` | モジュールを即座にロード |
| `lazyModules()` | バックグラウンドでモジュールをロード |
| `properties()` | マップからプロパティをロード |
| `fileProperties()` | koin.properties ファイルからロード |
| `environmentProperties()` | システム/環境変数からロード |
| `createEagerInstances()` | すべての `createdAtStart` シングルトンを作成 |
| `allowOverride()` | 定義のオーバーライドの有効化/無効化 |

## 型指定による起動 (コンパイラプラグイン)

[Koin コンパイラプラグイン](/docs/setup/compiler-plugin) と `@KoinApplication` が必要です：

```kotlin
@KoinApplication
class MyApp

// 開始
startKoin<MyApp>()

// 設定あり
startKoin<MyApp> {
    printLogger()
}
```

## 動的なモジュール管理

```kotlin
// 開始後にロード
loadKoinModules(featureModule)

// アンロード
unloadKoinModules(featureModule)
```

## Koin の停止

```kotlin
stopKoin()  // グローバルインスタンス

// 分離されたインスタンス
koinApp.close()
```

## ロギング

| ロガー | プラットフォーム | 説明 |
|--------|----------|-------------|
| `EmptyLogger` | すべて | ログ出力なし（デフォルト） |
| `PrintLogger` | すべて | コンソール出力 |
| `AndroidLogger` | Android | Logcat |
| `SLF4JLogger` | JVM | SLF4J |

```kotlin
startKoin {
    logger(Level.DEBUG)  // または Android の場合は androidLogger()
}
```

## プロパティ

```kotlin
startKoin {
    environmentProperties()
    fileProperties()  // koin.properties
    properties(mapOf("key" to "value"))
}

// モジュール内
single {
    ApiClient(url = getProperty("server_url"))
}
```

## プラットフォーム別の例

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

### Compose

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

### Ktor

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

## 関連項目

- **[コア - Koin の開始](/docs/reference/koin-core/starting-koin)** - 完全なガイド
- **[Lazy モジュール](/docs/reference/koin-core/lazy-modules)** - バックグラウンドロード
- **[KoinComponent](/docs/reference/koin-core/koin-component)** - インスタンスの取得