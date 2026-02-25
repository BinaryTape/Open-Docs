---
title: WorkManager
---

`koin-androidx-workmanager`プロジェクトは、Android WorkManagerの機能を提供するためのものです。

## WorkManager DSL

## WorkManagerのセットアップ

開始時に、`KoinApplication`の宣言内で`workManagerFactory()`キーワードを使用して、カスタムのWorkManagerインスタンスをセットアップします。

```kotlin
class MainApplication : Application(), KoinComponent {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // WorkManagerインスタンスをセットアップ
            workManagerFactory()
            modules(...)
        }

        setupWorkManagerFactory()
}
```

また、https://developer.android.com/topic/libraries/architecture/workmanager/advanced/custom-configuration#remove-default に示されているように、Androidがデフォルトの`WorkManagerFactory`を初期化するのを防ぐために`AndroidManifest.xml`を編集することも重要です。これを行わないと、アプリがクラッシュします。

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

## ListenableWorkerの宣言

```kotlin
val appModule = module {
    single { MyService() }
    worker { MyListenableWorker(get()) }
}
```

### 追加のWorkManagerファクトリの作成

`WorkManagerFactory`を作成してKoinに渡すこともできます。これはデリゲートとして追加されます。

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

Koinと`workFactory1`の両方から提供された`WorkManagerFactory`が`ListenableWorker`をインスタンス化できる場合、Koinから提供されたファクトリが使用されます。

## いくつかの想定

### koinライブラリ自体にマニフェストの変更を追加する
`koin-androidx-workmanager`自体のマニフェストでデフォルトのWorkManagerを無効にすれば、アプリケーション開発者の手間を一つ減らすことができます。しかし、アプリ開発者がKoinのWorkManagerインフラストラクチャを初期化しなかった場合、使用可能なWorkManagerファクトリがなくなってしまうため、混乱を招く可能性があります。

これは`checkModules`が役立つ可能性があるケースです。プロジェクト内のいずれかのクラスが`ListenableWorker`を実装している場合、マニフェストとコードの両方を検査して、整合性が取れているかを確認できるのではないでしょうか。

### DSLの改善案：
```kotlin

val workerFactoryModule = module {
   factory<WorkerFactory> { WorkerFactory1() }
   factory<WorkerFactory> { WorkerFactory2() }
}
```

その上で、Koinの内部で次のような処理を行います。

```kotlin
fun Application.setupWorkManagerFactory(
  // WorkerFactoryの可変長引数はなし
) {
. . .
            getKoin().getAll<WorkerFactory>()
                .forEach {
                    delegatingWorkerFactory.addFactory(it)
                }
}