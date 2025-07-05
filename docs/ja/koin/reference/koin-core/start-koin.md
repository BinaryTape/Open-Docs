---
title: Koinを起動する
---

KoinはDSLであり、軽量なコンテナであり、実用的なAPIです。Koinモジュール内に定義を宣言したら、Koinコンテナを起動する準備ができています。

### `startKoin`関数

`startKoin`関数は、Koinコンテナを起動するための主要なエントリーポイントです。実行するには、*Koinモジュールのリスト*が必要です。モジュールがロードされ、定義はKoinコンテナによって解決可能になります。

.Koinの起動
```kotlin
// start a KoinApplication in Global context
startKoin {
    // declare used modules
    modules(coffeeAppModule)
}
```

`startKoin`が呼び出されると、Koinはすべてのモジュールと定義を読み込みます。その後、Koinは必要なインスタンスを取得するための任意の`get()`または`by inject()`呼び出しに対応できるようになります。

Koinコンテナにはいくつかのオプションがあります。

*   `logger` - ロギングを有効にする - [ロギング](#logging)セクションを参照
*   `properties()`, `fileProperties( )` または `environmentProperties( )` - 環境、koin.propertiesファイル、追加プロパティなどからプロパティをロードする - [プロパティのロード](#loading-properties)セクションを参照

:::info
`startKoin`は複数回呼び出すことはできません。モジュールをロードする場所が複数必要な場合は、`loadKoinModules`関数を使用してください。
:::

### Koinの起動を拡張する（KMPなどでの再利用に役立つ）

Koinは現在、`KoinConfiguration`の再利用可能で拡張可能な設定オブジェクトをサポートしています。共有設定をプラットフォーム間（Android、iOS、JVMなど）で利用したり、異なる環境に合わせたりするために抽出できます。これは`includes()`関数で行うことができます。以下では、共通の設定を簡単に再利用し、Android環境設定を追加するためにそれを拡張する方法を示します。

```kotlin
fun initKoin(config : KoinAppDeclaration? = null){
   startKoin {
        includes(config) //can include external configuration extension
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

### 起動の裏側 - 内部のKoinインスタンス

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
    // Load properties from the default location
    // (i.e. `/src/main/resources/koin.properties`)
    fileProperties()
}
```

Koinモジュールでは、キーを使ってプロパティを取得できます。

/src/main/resources/koin.propertiesファイル内
```java
// Key - value
server_url=http://service_url
```

`getProperty`関数を使ってロードするだけです。

```kotlin
val myModule = module {

    // use the "server_url" key to retrieve its value
    single { MyService(getProperty("server_url")) }
}
```

## Koinオプション - 機能フラグ (4.1.0)

Koinアプリケーションは、専用の`options`セクションを通じて、いくつかの実験的な機能を有効にできるようになりました。例えば、以下のようになります。

```kotlin
startKoin {
    options(
        // activate ViewModel Scope factory feature 
        viewModelScopeFactory()
    )
}
```