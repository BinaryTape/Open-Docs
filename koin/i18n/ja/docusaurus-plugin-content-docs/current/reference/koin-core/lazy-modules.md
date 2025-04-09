---
title: "Lazy Modules とバックグラウンドローディング"
---
このセクションでは、遅延ロードのアプローチでモジュールを整理する方法を見ていきます。

## 遅延モジュールの定義 [試験的]

リソースの事前割り当てを避け、Koin の起動時にバックグラウンドでロードするために、遅延 Koin モジュールを宣言できるようになりました。

- `lazyModule` - Koin モジュールの遅延 Kotlin バージョンを宣言します。
- `Module.includes` - 遅延モジュールの組み込みを許可します。

良い例は、理解を深めるのに役立ちます。

```kotlin
// いくつかの遅延モジュール
val m2 = lazyModule {
    singleOf(::ClassB)
}

// m2 遅延モジュールを含める
val m1 = lazyModule {
    includes(m2)
    singleOf(::ClassA) { bind<IClassA>() }
}
```

:::info
    LazyModule は、次の API によってロードされるまで、リソースをトリガーしません。
:::

## Kotlin コルーチンを使用したバックグラウンドロード [試験的]

いくつかの遅延モジュールを宣言したら、Koin の構成からバックグラウンドでロードできます。

- `KoinApplication.lazyModules` - プラットフォームのデフォルトの Dispatchers を考慮して、コルーチンを使用してバックグラウンドで遅延モジュールをロードします。
- `Koin.waitAllStartJobs` - 開始ジョブが完了するのを待ちます。
- `Koin.runOnKoinStarted` - 開始完了後にブロックコードを実行します。

良い例は、理解を深めるのに役立ちます。

```kotlin
startKoin {
    // バックグラウンドで遅延モジュールをロード
    lazyModules(m1)
}

val koin = KoinPlatform.getKoin()

// ロードジョブが完了するのを待ちます
koin.waitAllStartJobs()

// または、ロードが完了した後にコードを実行します
koin.runOnKoinStarted { koin ->
    // バックグラウンドロードが完了した後に実行
}
```

:::note
    `lazyModules` 関数を使用すると、ディスパッチャを指定できます: `lazyModules(modules, dispatcher = Dispatcher.IO)`
:::

:::info
    コルーチンエンジンのデフォルトのディスパッチャは `Dispatchers.Default` です。
:::

### 制限事項 - モジュール/遅延モジュールの混合

今のところ、起動時にモジュールと遅延モジュールを混在させることは避けることをお勧めします。`lazyReporter` で依存関係を必要とする `mainModule` を持つことは避けてください。

```kotlin
startKoin {
    androidLogger()
    androidContext(this@TestApp)
    modules(mainModule)
    lazyModules(lazyReporter)
}
```

:::warning
今のところ、Koin はモジュールが遅延モジュールに依存しているかどうかをチェックしません。
:::