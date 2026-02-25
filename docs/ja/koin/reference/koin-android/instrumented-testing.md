---
title: Androidのインストゥルメンテッドテスト
---

## カスタムApplicationクラスでのプロダクションモジュールのオーバーライド

各テストクラスで実質的にKoinを開始する（すなわち `startKoin` や `KoinTestExtension` を呼び出す）[ユニットテスト](/docs/reference/koin-test/testing.md)とは異なり、インストゥルメンテッドテストでは `Application` クラスによってKoinが開始されます。

プロダクション用のKoinモジュールをオーバーライドする場合、`loadModules` や `unloadModules` は変更が即座に適用されないことが多いため、安全でない場合があります。代わりに、`Application` クラスの `startKoin` で使用される `modules` に、オーバーライド用の `module` を追加する方法が推奨されます。
アプリケーションの `Application` を継承しているクラスを変更したくない場合は、以下のように `AndroidTest` パッケージ内に別のクラスを作成できます。

```kotlin
class TestApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            modules(productionModule, instrumentedTestModule)
        }
    }
}
```

インストゥルメンテッドテストでこのカスタム `Application` を使用するには、以下のようにカスタム [AndroidJUnitRunner](https://developer.android.com/training/testing/instrumented-tests/androidx-test-libraries/runner) を作成する必要があるかもしれません。

```kotlin
class InstrumentationTestRunner : AndroidJUnitRunner() {
    override fun newApplication(
        classLoader: ClassLoader?,
        className: String?,
        context: Context?
    ): Application {
        return super.newApplication(classLoader, TestApplication::class.java.name, context)
    }
}
```

その後、gradleファイル内で以下のように登録します。

```groovy
testInstrumentationRunner "com.example.myapplication.InstrumentationTestRunner"
```

## テストルールを使用したプロダクションモジュールのオーバーライド

より柔軟性が必要な場合は、カスタム `AndroidJUnitRunner` を作成した上で、カスタムアプリケーション内で `startKoin { ... }` を実行する代わりに、以下のようなカスタムテストルール内に記述することができます。

```kotlin
class KoinTestRule(
    private val modules: List<Module>
) : TestWatcher() {
    override fun starting(description: Description) {

        if (getKoinApplicationOrNull() == null) {
            startKoin {
                androidContext(InstrumentationRegistry.getInstrumentation().targetContext.applicationContext)
                modules(modules)
            }
        } else {
            loadKoinModules(modules)
        }
    }

    override fun finished(description: Description) {
        unloadKoinModules(modules)
    }
}
```

これにより、以下のようにテストクラスから直接定義をオーバーライドできるようになります。

```kotlin
private val instrumentedTestModule = module {
    factory<Something> { FakeSomething() }
}

@get:Rule
val koinTestRule = KoinTestRule(
    modules = listOf(productionModule, instrumentedTestModule)
)