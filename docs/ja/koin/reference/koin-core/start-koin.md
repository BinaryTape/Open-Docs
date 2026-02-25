---
title: Koin の開始
---

Koin は、DSL、軽量なコンテナ、そして実用的な API です。Koin モジュール内で定義（definitions）を宣言すれば、Koin コンテナを開始する準備は完了です。

### startKoin 関数

`startKoin` 関数は、Koin コンテナを起動するためのメインのエントリーポイントです。実行には *Koin モジュールのリスト* が必要です。
モジュールがロードされると、Koin コンテナによって定義を解決（resolve）できるようになります。

.Koin の開始
```kotlin
// グローバルコンテキストで KoinApplication を開始する
startKoin {
    // 使用するモジュールを宣言する
    modules(coffeeAppModule)
}
```

`startKoin` が呼び出されると、Koin はすべてのモジュールと定義を読み込みます。その後、Koin は `get()` や `by inject()` の呼び出しに対して、必要なインスタンスを取得できるようになります。

Koin コンテナには、いくつかのオプションを設定できます：

* `logger` - ロギングを有効にする - [ロギング](#logging) セクションを参照
* `properties()`、`fileProperties( )`、または `environmentProperties( )` - 環境変数、koin.properties ファイル、追加プロパティなどからプロパティをロードする - [プロパティのロード](#loading-properties) セクションを参照

:::info
 `startKoin` を複数回呼び出すことはできません。複数の場所でモジュールをロードする必要がある場合は、`loadKoinModules` 関数を使用してください。
:::

### Koin の開始処理の拡張（KMP などでの再利用に便利）

Koin は、KoinConfiguration 用の再利用可能で拡張可能な設定オブジェクトをサポートするようになりました。共有設定を抽出して、プラットフォーム間（Android、iOS、JVM など）で使い回したり、異なる環境に合わせてカスタマイズしたりできます。これは `includes()` 関数で行うことができます。以下のように、共通の設定を簡単に再利用し、さらに拡張して Android 環境の設定を追加することができます。

```kotlin
fun initKoin(config : KoinAppDeclaration? = null){
   startKoin {
        includes(config) // 外部の設定拡張を含めることができる
        modules(appModule)
   }
}

class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        initKoin {
            androidContext(this@MainApplication)
            androidLogger()
        }
    }
}
```

### 開始処理の背後 - 内部での Koin インスタンス

Koin を開始すると、Koin コンテナの設定インスタンスを表す `KoinApplication` インスタンスが作成されます。起動すると、モジュールとオプションの結果として `Koin` インスタンスが生成されます。
この `Koin` インスタンスは `GlobalContext` によって保持され、任意の `KoinComponent` クラスから使用できるようになります。

`GlobalContext` は、Koin におけるデフォルトの JVM コンテキスト戦略です。これは `startKoin` によって呼び出され、`GlobalContext` に登録されます。これにより、Koin Multiplatform の観点から、異なる種類のコンテキストを登録できるようになります。

### startKoin 後のモジュールのロード

`startKoin` 関数を複数回呼び出すことはできません。しかし、`loadKoinModules()` 関数を直接使用することは可能です。

この関数は、Koin を使用したい SDK 開発者にとって有用です。なぜなら、`startKoin()` 関数を使用する必要がなく、ライブラリの開始時に `loadKoinModules` を使用するだけで済むからです。

```kotlin
loadKoinModules(module1, module2 ...)
```

### モジュールのアンロード

一連の定義をアンロードし、指定された関数でそれらのインスタンスを解放することも可能です。

```kotlin
unloadKoinModules(module1, module2 ...)
```

### Koin の停止 - すべてのリソースを閉じる

すべての Koin リソースを閉じ、インスタンスと定義を破棄できます。これを行うには、どこからでも `stopKoin()` 関数を呼び出して Koin の `GlobalContext` を停止させます。
または、`KoinApplication` インスタンスに対して `close()` を呼び出します。

## ロギング

Koin には、あらゆる Koin アクティビティ（アロケーション、ルックアップなど）を記録するためのシンプルなロギング API があります。ロギング API は以下のクラスで表されます。

Koin Logger

```kotlin
abstract class Logger(var level: Level = Level.INFO) {

    abstract fun display(level: Level, msg: MESSAGE)

    fun debug(msg: MESSAGE) {
        log(Level.DEBUG, msg)
    }

    fun info(msg: MESSAGE) {
        log(Level.INFO, msg)
    }

    fun warn(msg: MESSAGE) {
        log(Level.WARNING, msg)
    }

    fun error(msg: MESSAGE) {
        log(Level.ERROR, msg)
    }
}
```

Koin は、ターゲットプラットフォームに応じて、いくつかのロギング実装を提案しています。

* `PrintLogger` - コンソールに直接ログを出力する（`koin-core` に含まれる）
* `EmptyLogger` - 何もログを出力しない（`koin-core` に含まれる）
* `SLF4JLogger` - SLF4J でログを出力する。ktor や spark で使用される（`koin-logger-slf4j` プロジェクト）
* `AndroidLogger` - Android Logger にログを出力する（`koin-android` に含まれる）

### 開始時にロギングを設定する

デフォルトでは、Koin は `EmptyLogger` を使用します。次のように `PrintLogger` を直接使用できます。

```kotlin
startKoin {
    logger(LEVEL.INFO)
}
```

## プロパティのロード

開始時にいくつかの種類のプロパティをロードできます：

* 環境プロパティ - *システム* プロパティをロード
* koin.properties ファイル - `/src/main/resources/koin.properties` ファイルからプロパティをロード
* 「追加の」開始プロパティ - `startKoin` 関数に渡される値のマップ

### モジュールからのプロパティの読み取り

Koin の開始時にプロパティをロードするようにしてください：

```kotlin
startKoin {
    // デフォルトの場所（すなわち `/src/main/resources/koin.properties`）から
    // プロパティをロードする
    fileProperties()
}
```

Koin モジュールでは、キーを使用してプロパティを取得できます。

/src/main/resources/koin.properties ファイル内：
```java
// キー - 値
server_url=http://service_url
```

`getProperty` 関数を使用してロードするだけです：

```kotlin
val myModule = module {

    // "server_url" キーを使用してその値を取得する
    single { MyService(getProperty("server_url")) }
}
```

## Koin オプション - フィーチャーフラグ (4.1.0)

Koin アプリケーションは、専用の `options` セクションを通じて、いくつかの実験的機能を有効にできるようになりました。例：

```kotlin
startKoin {
    options(
        // ViewModel Scope factory 機能を有効化する
        viewModelScopeFactory()
    )
}