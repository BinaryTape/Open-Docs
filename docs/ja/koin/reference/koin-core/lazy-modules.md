---
title: レイジーモジュールとバックグラウンドロード
---

このセクションでは、レイジーロード（遅延読み込み）のアプローチを使用してモジュールを構成する方法について説明します。

## レイジーモジュールの定義 [実験的]

リソースの事前割り当てを回避し、Koinの開始時にバックグラウンドでロードするための、レイジー（Lazy）なKoinモジュールを宣言できるようになりました。

- `lazyModule` - KoinモジュールのレイジーKotlinバージョンを宣言します
- `Module.includes` - レイジーモジュールのインクルードを可能にします

理解を深めるために、コード例を見てみましょう：

```kotlin
// いくつかのレイジーモジュール
val m2 = lazyModule {
    singleOf(::ClassB)
}

// m2 レイジーモジュールをインクルードする
val m1 = lazyModule {
    includes(m2)
    singleOf(::ClassA) { bind<IClassA>() }
}
```

:::info
    LazyModuleは、以下のAPIによってロードされるまで、いかなるリソースもトリガーしません。
:::

## Kotlinコルーチンによるバックグラウンドロード [実験的]

レイジーモジュールを宣言すると、Koinの設定などからバックグラウンドでそれらをロードできるようになります。

- `KoinApplication.lazyModules` - プラットフォームのデフォルトDispatcherに従って、コルーチンを使用してバックグラウンドでレイジーモジュールをロードします
- `Koin.waitAllStartJobs` - 開始ジョブ（start jobs）の完了を待機します
- `Koin.runOnKoinStarted` - 開始完了後にコードブロックを実行します

理解を深めるために、コード例を見てみましょう：

```kotlin
startKoin {
    // レイジーモジュールをバックグラウンドでロードする
    lazyModules(m1)
}

val koin = KoinPlatform.getKoin()

// ロードジョブが完了するのを待機する
koin.waitAllStartJobs()

// または、ロード完了後にコードを実行する
koin.runOnKoinStarted { koin ->
    // バックグラウンドロード完了後に実行される
}
```

:::note
    `lazyModules` 関数では、ディスパッチャを指定できます：`lazyModules(modules, dispatcher = Dispatcher.IO)`
:::

:::info
    コルーチンエンジンのデフォルトディスパッチャは `Dispatchers.Default` です。
:::

### 制限事項 - 通常のモジュールとレイジーモジュールの混在

現時点では、スタートアップ時に通常のモジュールとレイジーモジュールを混在させることは避けることをお勧めします。例えば、`mainModule` が `lazyReporter` 内の依存関係を必要とするような構成は避けてください。

```kotlin
startKoin {
    androidLogger()
    androidContext(this@TestApp)
    modules(mainModule)
    lazyModules(lazyReporter)
}
```

:::warning
現時点では、Koinはモジュールがレイジーモジュールに依存しているかどうかをチェックしません。
:::