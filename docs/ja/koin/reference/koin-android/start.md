---
title: KoinをAndroidで開始する
---

`koin-android`プロジェクトは、Androidの世界にKoinの機能を提供することに特化しています。詳細については、[Androidのセットアップ](/docs/setup/koin#android)セクションを参照してください。

## `Application`クラスから

`Application`クラスから、`startKoin`関数を使用し、`androidContext`でAndroidコンテキストを以下のように注入（インジェクト）できます。

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // KoinをAndroidロガーに出力
            androidLogger()
            // Androidコンテキストを参照
            androidContext(this@MainApplication)
            // モジュールをロード
            modules(myAppModules)
        }
    }
}
```

:::info
`Application`クラスからKoinを開始したくない場合は、どこからでも開始できます。
:::

Koinを他のAndroidクラスから開始する必要がある場合は、`startKoin`関数を使用し、Androidの`Context`インスタンスを次のように提供できます。

```kotlin
startKoin {
    // Androidコンテキストを注入
    androidContext(/* your android context */)
    // ...
}
```

## 追加の構成

Koinの設定（`startKoin { }`ブロックコード内）から、Koinのいくつかの部分を設定することもできます。

### Android向けのKoinロギング

`KoinApplication`インスタンス内で、`AndroidLogger()`クラスを使用する拡張関数`androidLogger`があります。
このロガーは、KoinロガーのAndroid実装です。

ニーズに合わない場合は、このロガーを変更してください。

```kotlin
startKoin {
    // Androidロガーを使用 - デフォルトではLevel.INFO
    androidLogger()
    // ...
}
```

### プロパティのロード

`assets/koin.properties`ファイルでKoinプロパティを使用して、キー/値を保存できます。

```kotlin
startKoin {
    // ...
    // assets/koin.propertiesからプロパティを使用
    androidFileProperties()   
}
```

## Androidx Startup (4.0.1) でKoinを開始 [実験的]

Gradleパッケージ`koin-androidx-startup`を使用することで、`KoinStartup`インターフェースを使用して、`Application`クラスにKoin設定を宣言できます。

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

これは、通常`onCreate`で使用される`startKoin`関数を置き換えます。`koinConfiguration`関数は`KoinConfiguration`インスタンスを返します。

:::info
`KoinStartup`は起動時にメインスレッドをブロックするのを防ぎ、パフォーマンスを向上させます。
:::

## Koinとの起動時の依存関係

Koinがセットアップされる必要があり、依存関係を注入できるようにするには、`Initializer`を`KoinInitializer`に依存させることができます。

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