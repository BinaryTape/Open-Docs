---
title: "Android で Koin を始める"
---
`koin-android` プロジェクトは、Koin の機能を Android の世界に提供することに特化しています。詳細については、[Android セットアップ](/setup/koin.md) セクションを参照してください。

## Application クラスから

`Application` クラスから、`startKoin` 関数を使用し、`androidContext` を使用して Android コンテキストを注入できます。

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // Koin を Android ロガーに出力
            androidLogger()
            // Android コンテキストを参照
            androidContext(this@MainApplication)
            // モジュールをロード
            modules(myAppModules)
        }
    }
}
```

:::info
Application クラスから起動したくない場合は、どこからでも Koin を起動できます。
:::

別の Android クラスから Koin を起動する必要がある場合は、`startKoin` 関数を使用し、Android の `Context` インスタンスを次のように指定できます。

```kotlin
startKoin {
    // Android コンテキストを注入
    androidContext(/* your android context */)
    // ...
}
```

## 追加設定

Koin の設定 ( `startKoin { }` ブロックコード内) から、Koin のいくつかの部分を設定することもできます。

### Android 向け Koin ロギング

`KoinApplication` インスタンス内には、`AndroidLogger()` クラスを使用する拡張機能 `androidLogger` があります。このロガーは、Koin ロガーの Android 実装です。

必要に応じて、このロガーを変更できます。

```kotlin
startKoin {
    // Android ロガーを使用 - デフォルトで Level.INFO
    androidLogger()
    // ...
}
```

### プロパティのロード

`assets/koin.properties` ファイルで Koin プロパティを使用して、キー/値を保存できます。

```kotlin
startKoin {
    // ...
    // assets/koin.properties からプロパティを使用
    androidFileProperties()   
}
```

## Androidx Startup (4.0.1) で Koin を起動する [Experimental]

Gradle パッケージ `koin-androidx-startup` を使用すると、`KoinStartup` インターフェースを使用して、Application クラスで Koin 構成を宣言できます。

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

これは、通常 `onCreate` で使用される `startKoin` 関数を置き換えます。`koinConfiguration` 関数は `KoinConfiguration` インスタンスを返します。

:::info
`KoinStartup` は、起動時にメインスレッドをブロックするのを避け、より優れたパフォーマンスを提供します。
:::

## Koin による起動依存関係

Koin をセットアップする必要があり、依存関係を注入できるようにする場合は、`Initializer` を `KoinInitializer` に依存させることができます。

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