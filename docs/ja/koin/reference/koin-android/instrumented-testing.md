---
title: Androidインストゥルメンテーションテスト
---

## カスタムApplicationクラスでの本番モジュールの上書き

各テストクラスで実質的にKoinを起動する（つまり、`startKoin`や`KoinTestExtension`を呼び出す）[ユニットテスト](/docs/reference/koin-test/testing.md)とは異なり、インストゥルメンテーションテストではKoinは`Application`クラスによって起動されます。

本番Koinモジュールをオーバーライドする場合、`loadModules`や`unloadModules`は変更がすぐに適用されないため、多くの場合安全ではありません。代わりに、推奨されるアプローチは、`Application`クラスで`startKoin`が使用する`modules`に、オーバーライド用の`module`を追加することです。
アプリケーションの`Application`を継承するクラスをそのままにしておきたい場合、`AndroidTest`パッケージ内に次のように別のクラスを作成できます。
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
このカスタム`Application`をインストゥルメンテーションテストで使用するには、次のようにカスタムの[AndroidJUnitRunner](https://developer.android.com/training/testing/instrumented-tests/androidx-test-libraries/runner)を作成する必要がある場合があります。
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
そして、それをGradleファイル内に次のように登録します。
```groovy
testInstrumentationRunner "com.example.myapplication.InstrumentationTestRunner"
```

## テストルールでの本番モジュールの上書き

より柔軟性を求める場合、カスタムの`AndroidJUnitRunner`を依然として作成する必要がありますが、カスタムアプリケーション内に`startKoin { ... }`を置く代わりに、次のようにカスタムテストルール内に置くことができます。
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
このようにして、テストクラスから直接、次のように定義をオーバーライドできる可能性があります。
```kotlin
private val instrumentedTestModule = module {
    factory<Something> { FakeSomething() }
}

@get:Rule
val koinTestRule = KoinTestRule(
    modules = listOf(productionModule, instrumentedTestModule)
)