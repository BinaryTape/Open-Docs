---
title: AndroidでKoinを開始する
---

`koin-android` プロジェクトは、Androidの世界にKoinのパワーを提供することに特化しています。詳細については、[Androidのセットアップ](/docs/setup/koin#android) セクションを参照してください。

## Applicationクラスから

`Application` クラスから `startKoin` 関数を使用し、以下のように `androidContext` でAndroidのコンテキストを注入できます。

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // KoinをAndroidロガーにログ出力する
            androidLogger()
            // Androidコンテキストを参照する
            androidContext(this@MainApplication)
            // モジュールをロードする
            modules(myAppModules)
        }
    }
}
```

:::info
Applicationクラスから開始したくない場合は、他の場所からKoinを開始することもできます。
:::

他のAndroidクラスからKoinを開始する必要がある場合は、`startKoin` 関数を使用して、以下のようにAndroidの `Context` インスタンスを提供できます。

```kotlin
startKoin {
    // Androidコンテキストを注入する
    androidContext(/* your android context */)
    // ...
}
```

## アノテーションでKoinを開始する

Koin Annotationsを使用する場合、`startKoin<T>()` を使用して、アノテーションが付加されたモジュールクラスでKoinを開始できます。

```kotlin
@KoinApplication
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin<MainApplication> {
            androidLogger()
            androidContext(this@MainApplication)
        }
    }
}
```

`startKoin<T>()` 関数は、`@Module` アノテーションが付加されたクラスから生成されたモジュールを自動的にロードします。

複数のモジュールの場合：

```kotlin
@Module
@Configuration
@ComponentScan("com.myapp.data")
class DataModule

@Module
@Configuration
@ComponentScan("com.myapp.domain")
class DomainModule

@KoinApplication
class MainApplication

// 複数のモジュールで開始する
startKoin<MainApplication> {
    androidLogger()
    androidContext(this@MainApplication)
}
```

## 追加設定

Koinの設定（`startKoin { }` ブロック内）から、Koinのいくつかの構成要素を設定することもできます。

### Android用Koinロギング

`KoinApplication` インスタンス内には、`AndroidLogger()` クラスを使用する拡張機能 `androidLogger` があります。
このロガーは、KoinロガーのAndroid実装です。

ニーズに合わない場合は、このロガーを自由に変更してください。

```kotlin
startKoin {
    // Androidロガーを使用する - デフォルトは Level.INFO
    androidLogger()
    // ...
}
```

### プロパティの読み込み

`assets/koin.properties` ファイル内のKoinプロパティを使用して、キーと値を保存できます。

```kotlin
startKoin {
    // ...
    // assets/koin.properties からプロパティを使用する
    androidFileProperties()   
}
```

## AndroidX StartupによるKoinの開始 (4.0.1)

[AndroidX Startup](https://developer.android.com/topic/libraries/app-startup) は、アプリの起動時にコンポーネントを初期化するための簡単な方法を提供するライブラリです。単一の `ContentProvider` を使用してすべての依存関係を初期化し、早期の初期化が必要な各コンポーネントに対して個別の `ContentProvider` を用意するオーバーヘッドを回避します。

Gradleパッケージ `koin-androidx-startup` を使用することで、`KoinStartup` インターフェースを使用して `Application` クラスでKoin設定を宣言できます。

```kotlin
class MainApplication : Application(), KoinStartup {

     override fun onKoinStartup() = koinConfiguration {
        androidContext(this@MainApplication)
        modules(appModule)
    }

    override fun onCreate() {
        super.onCreate()
    }
}
```

これは、通常 `onCreate` で使用される `startKoin` 関数を置き換えるものです。`koinConfiguration` 関数は `KoinConfiguration` インスタンスを返します。

:::info
`KoinStartup` は AndroidX App Startup と統合し、`Application.onCreate()` の前に `ContentProvider` を介してKoinを初期化します。これは、Koinが利用可能であることを前提とする他の `Initializer` との初期化順序を管理する必要がある場合に便利です。
:::

:::warning
`KoinStartup` はアプリ起動時にメインスレッドで実行されます。他の `Initializer` を管理するために AndroidX App Startup ライブラリを使用していない場合、`KoinStartup` を使用する**メリットはありません**。代わりに標準の `startKoin` アプローチを使用してください。モジュールのロードをバックグラウンドスレッドに分散する方法については、[Lazy Modules](/docs/reference/koin-core/lazy-modules) を参照してください。
:::

Koinを必要とする他の `Initializer` がある場合は、それらを `KoinInitializer` に依存させてください。

```kotlin
class CrashTrackerInitializer : Initializer<Unit>, KoinComponent {
    private val crashTrackerService: CrashTrackerService by inject()

    override fun create(context: Context) {
        crashTrackerService.configure(context)
    }

    override fun dependencies(): List<Class<out Initializer<*>>> {
        return listOf(KoinInitializer::class.java)
    }
}
```

## 次のステップ

- **[JSR-330 Compatibility](/docs/reference/koin-android/jsr330)** - 標準の `@Inject`、`@Singleton` アノテーションを使用する
- **[Injecting in Android](/docs/reference/koin-android/get-instances)** - Activity、Fragment、Serviceでインスタンスを取得する
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModelの注入とスコーピング
- **[Hilt Migration](/docs/reference/koin-android/hilt-migration)** - HiltからKoinへ移行する