---
title: WorkManager
---

`koin-androidx-workmanager`プロジェクトは、Android WorkManagerの機能を提供することに特化しています。

## WorkManager DSL

## WorkManagerをセットアップする

開始時に、`KoinApplication`の宣言で`workManagerFactory()`キーワードを使用して、カスタムのWorkManagerインスタンスをセットアップします。

```kotlin
class MainApplication : Application(), KoinComponent {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // setup a WorkManager instance
            workManagerFactory()
            modules(...)
        }

        setupWorkManagerFactory()
}
```

Androidがデフォルトの`WorkManagerFactory`を初期化するのを防ぐために、`AndroidManifest.xml`を編集することも重要です。これは、https://developer.android.com/topic/libraries/architecture/workmanager/advanced/custom-configuration#remove-default に示されている通りです。そうしないと、アプリがクラッシュします。

```xml
    <application . . .>
        . . .
        <provider
            android:name="androidx.startup.InitializationProvider"
            android:authorities="${applicationId}.androidx-startup"
            android:exported="false"
            tools:node="merge">
            <meta-data
                android:name="androidx.work.WorkManagerInitializer"
                android:value="androidx.startup"
                tools:node="remove" />
        </provider>
    </application>
```

## ListenableWorkerを宣言する

```kotlin
val appModule = module {
    single { MyService() }
    worker { MyListenableWorker(get()) }
}
```

### 追加のWorkManagerファクトリを作成する

`WorkManagerFactory`を記述して、Koinに渡すこともできます。それはデリゲートとして追加されます。

```kotlin
class MainApplication : Application(), KoinComponent {

    override fun onCreate() {
        super.onCreate()

        startKoin {
           workManagerFactory(workFactory1, workFactory2)
           . . .
        }

        setupWorkManagerFactory()
    }
}

```

Koinと`workFactory1`の両方が提供する`WorkManagerFactory`が`ListenableWorker`をインスタンス化できる場合、Koinによって提供されるファクトリが使用されます。

## いくつかの仮定

### Koinライブラリ自体にマニフェストの変更を追加する

`koin-androidx-workmanager`自身のマニフェストがデフォルトのワークマネージャーを無効にする場合、アプリケーション開発者にとって手間を1つ減らすことができます。しかし、アプリ開発者がKoinのワークマネージャーインフラストラクチャを初期化しない場合、利用可能なワークマネージャーファクトリがなくなってしまうため、それは紛らわしい可能性があります。

それは`checkModules`が役立つかもしれません。プロジェクト内のいずれかのクラスが`ListenableWorker`を実装している場合、マニフェストとコードの両方を検査し、それらが適切であることを確認すべきでしょうか？

### DSL改善オプション:

```kotlin

val workerFactoryModule = module {
   factory<WorkerFactory> { WorkerFactory1() }
   factory<WorkerFactory> { WorkerFactory2() }
}
```

その後、Koinの内部が以下のような処理を行うようにします。

```kotlin
fun Application.setupWorkManagerFactory(
  // no vararg for WorkerFactory
) {
. . .
            getKoin().getAll<WorkerFactory>()
                .forEach {
                    delegatingWorkerFactory.addFactory(it)
                }
}