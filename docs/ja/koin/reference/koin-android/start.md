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

## AndroidX StartupによるKoinの開始 (4.0.1) [試験的]

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
`KoinStartup` は起動時のメインスレッドのブロックを回避し、より優れたパフォーマンスを提供します。
:::

## Koinによるスタートアップの依存関係

Koinのセットアップが必要で、依存関係の注入を可能にしたい場合は、`Initializer` を `KoinInitializer` に依存させることができます。

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