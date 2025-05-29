---
title: Koinを起動する
---

KoinはDSLであり、軽量なコンテナであり、実用的なAPIです。Koinモジュール内に定義を宣言したら、Koinコンテナを起動する準備ができています。

### `startKoin`関数

`startKoin`関数は、Koinコンテナを起動するための主要なエントリーポイントです。実行するには、*Koinモジュールのリスト*が必要です。モジュールがロードされ、定義はKoinコンテナによって解決可能になります。

Koinの起動
```kotlin
// GlobalコンテキストでKoinApplicationを開始
startKoin {
    // 使用するモジュールを宣言
    modules(coffeeAppModule)
}
```

`startKoin`が呼び出されると、Koinはすべてのモジュールと定義を読み込みます。その後、Koinは必要なインスタンスを取得するための任意の`get()`または`by inject()`呼び出しに対応できるようになります。

Koinコンテナにはいくつかのオプションがあります。

*   `logger` - ロギングを有効にする - <<logging.adoc#_logging,ロギング>>セクションを参照
*   `properties()`, `fileProperties()` または `environmentProperties()` - 環境、koin.propertiesファイル、追加プロパティなどからプロパティをロードする - <<properties.adoc#_lproperties,プロパティ>>セクションを参照

:::info
`startKoin`は複数回呼び出すことはできません。モジュールをロードする場所が複数必要な場合は、`loadKoinModules`関数を使用してください。
:::

### 起動の裏側 - Koinインスタンスの内部

Koinを起動すると、Koinコンテナの設定インスタンスを表す`KoinApplication`インスタンスが作成されます。起動されると、モジュールとオプションに基づいて`Koin`インスタンスを生成します。この`Koin`インスタンスは`GlobalContext`によって保持され、任意の`KoinComponent`クラスで使用されます。

`GlobalContext`は、KoinのデフォルトのJVMコンテキスト戦略です。これは`startKoin`によって呼び出され、`GlobalContext`に登録されます。これにより、Koin Multiplatformの観点から、異なる種類のコンテキストを登録できるようになります。

### `startKoin`後にモジュールをロードする

`startKoin`関数を複数回呼び出すことはできません。しかし、`loadKoinModules()`関数を直接使用することはできます。

この関数は、Koinを使いたいSDK開発者にとって興味深い機能です。なぜなら、彼らは`startKoin()`関数を使う必要がなく、ライブラリの開始時に`loadKoinModules`を使うだけでよいからです。

```kotlin
loadKoinModules(module1,module2 ...)
```

### モジュールのアンロード

定義のセットをアンロードし、指定された関数でそれらのインスタンスを解放することも可能です。

```kotlin
unloadKoinModules(module1,module2 ...)
```

### Koinを停止する - すべてのリソースを閉じる

Koinのすべてのリソースを閉じ、インスタンスと定義を破棄できます。そのためには、どこからでも`stopKoin()`関数を使用して、Koinの`GlobalContext`を停止できます。あるいは、`KoinApplication`インスタンスに対して、単に`close()`を呼び出すだけです。

## ロギング

Koinには、Koinの任意のアクティビティ（アロケーション、ルックアップなど）をログに記録するためのシンプルなロギングAPIがあります。ロギングAPIは以下のクラスによって表現されます。

Koinロガー

```kotlin
abstract class Logger(var level: Level = Level.INFO) {

    abstract fun log(level: Level, msg: MESSAGE)

    fun debug(msg: MESSAGE) {
        log(Level.DEBUG, msg)
    }

    fun info(msg: MESSAGE) {
        log(Level.INFO, msg)
    }

    fun error(msg: MESSAGE) {
        log(Level.ERROR, msg)
    }
}
```

Koinは、ターゲットプラットフォームに応じて、いくつかのロギング実装を提供しています。

*   `PrintLogger` - コンソールに直接ログを出力します (`koin-core`に含まれています)
*   `EmptyLogger` - 何もログに出力しません (`koin-core`に含まれています)
*   `SLF4JLogger` - SLF4Jでログを出力します。KtorとSparkで使用されます (`koin-logger-slf4j`プロジェクト)
*   `AndroidLogger` - Androidロガーにログを出力します (`koin-android`に含まれています)

### 起動時にロギングを設定する

デフォルトでは、Koinは`EmptyLogger`を使用します。以下の方法で`PrintLogger`を直接使用できます。

```kotlin
startKoin {
    logger(LEVEL.INFO)
}
```

## プロパティのロード

起動時にいくつかの種類のプロパティをロードできます。

*   環境プロパティ - *システム*プロパティをロードします
*   koin.propertiesファイル - `/src/main/resources/koin.properties`ファイルからプロパティをロードします
*   「追加の」起動プロパティ - `startKoin`関数に渡される値のマップ

### モジュールからプロパティを読み込む

Koinの起動時にプロパティをロードするようにしてください。

```kotlin
startKoin {
    // デフォルトの場所からプロパティをロードします
    // (つまり、`/src/main/resources/koin.properties`から)
    fileProperties()
}
```

Koinモジュールでは、キーを使ってプロパティを取得できます。

/src/main/resources/koin.propertiesファイル内
```java
// キー - 値
server_url=http://service_url
```

`getProperty`関数を使ってロードするだけです。

```kotlin
val myModule = module {

    // "server_url"キーを使ってその値を取得します
    single { MyService(getProperty("server_url")) }
}