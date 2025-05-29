---
title: レイジーモジュールとバックグラウンドロード
---

このセクションでは、レイジーローディングのアプローチでモジュールを整理する方法について説明します。

## レイジーモジュールの定義 [実験的]

Koin起動時にリソースの事前割り当てを避け、バックグラウンドでロードするために、レイジーなKoinモジュールを宣言できるようになりました。

- ``lazyModule` - KoinモジュールのレイジーKotlinバージョンを宣言します`
- ``Module.includes` - レイジーモジュールを含めることを可能にします`

良い例は常に理解を深めます。

```kotlin
// レイジーなモジュール
val m2 = lazyModule {
    singleOf(::ClassB)
}

// m2レイジーモジュールを含める
val m1 = lazyModule {
    includes(m2)
    singleOf(::ClassA) { bind<IClassA>() }
}
```

:::info
    `LazyModule`は、以下のAPIによってロードされるまで、いかなるリソースもトリガーしません
:::

## Kotlinコルーチンによるバックグラウンドロード [実験的]

レイジーモジュールを宣言したら、Koinの設定からバックグラウンドでそれらをロードし、さらに利用することができます。

- ``KoinApplication.lazyModules` - プラットフォームのデフォルトの`Dispatchers`を使用して、コルーチンでバックグラウンドでレイジーモジュールをロードします`
- ``Koin.waitAllStartJobs` - 起動ジョブが完了するのを待ちます`
- ``Koin.runOnKoinStarted` - 起動完了後にコードブロックを実行します`

良い例は常に理解を深めます。

```kotlin
startKoin {
    // バックグラウンドでレイジーモジュールをロード
    lazyModules(m1)
}

val koin = KoinPlatform.getKoin()

// ロードジョブが完了するのを待つ
koin.waitAllStartJobs()

// または、ロード完了後にコードを実行する
koin.runOnKoinStarted { koin ->
    // バックグラウンドロード完了後に実行
}
```

:::note
    `lazyModules`関数では、ディスパッチャーを指定できます: `lazyModules(modules, dispatcher = Dispatcher.IO)`
:::

:::info
    コルーチンエンジンのデフォルトディスパッチャーは`Dispatchers.Default`です
:::

### 制限 - モジュールとレイジーモジュールの混在

現時点では、起動時にモジュールとレイジーモジュールを混在させないことを推奨します。`mainModule`が`lazyReporter`内で依存関係を要求しないようにしてください。

```kotlin
startKoin {
    androidLogger()
    androidContext(this@TestApp)
    modules(mainModule)
    lazyModules(lazyReporter)
}
```

:::warning
現時点では、Koinはあなたのモジュールがレイジーモジュールに依存しているかどうかをチェックしません
:::