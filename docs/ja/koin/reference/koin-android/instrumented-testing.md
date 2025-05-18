---
title: "Android インストルメント化テスト (Android Instrumented Testing)"
---
## カスタムの Application クラスで本番モジュールをオーバーライドする

各テストクラスで `startKoin`（つまり `startKoin` または `KoinTestExtension`）を効果的に呼び出す[単体テスト](/reference/koin-test/testing.md)とは異なり、インストルメンテーションテストでは、Koin は `Application` クラスによって開始されます。

本番 Koin モジュールをオーバーライドするために、`loadModules` と `unloadModules` は、変更がすぐに適用されないため、安全でないことがよくあります。代わりに、推奨されるアプローチは、`Application` クラスの `startKoin` で使用される `modules` にオーバーライドの `module` を追加することです。
アプリケーションの `Application` を拡張するクラスを変更したくない場合は、`AndroidTest` パッケージ内に別のクラスを作成できます。例：
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
インストルメンテーションテストでこのカスタム `Application` を使用するには、次のようなカスタムの [AndroidJUnitRunner](https://developer.android.com/training/testing/instrumented-tests/androidx-test-libraries/runner) を作成する必要がある場合があります。
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
次に、gradle ファイル内で次のように登録します。
```groovy
testInstrumentationRunner "com.example.myapplication.InstrumentationTestRunner"
```

## テストルールで本番モジュールをオーバーライドする

より柔軟性が必要な場合は、カスタム `AndroidJUnitRunner` を作成する必要がありますが、カスタムアプリケーション内に `startKoin { ... }` を記述する代わりに、次のようなカスタムテストルール内に配置できます。
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
このようにして、次のように、テストクラスから定義を直接オーバーライドする可能性があります。
```kotlin
private val instrumentedTestModule = module {
    factory<Something> { FakeSomething() }
}

@get:Rule
val koinTestRule = KoinTestRule(
    modules = listOf(productionModule, instrumentedTestModule)
)
```