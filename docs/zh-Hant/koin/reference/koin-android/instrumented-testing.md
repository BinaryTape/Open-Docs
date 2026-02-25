---
title: Android Instrumented 測試
---

## 在自訂 Application 類別中覆寫生產環境模組

與 [單元測試](/docs/reference/koin-test/testing.md) 不同，在單元測試中您實際上是在每個測試類別中呼叫啟動 Koin（即 `startKoin` 或 `KoinTestExtension`），而在 Instrumented 測試中，Koin 是由您的 `Application` 類別啟動的。

為了覆寫生產環境的 Koin 模組，`loadModules` 與 `unloadModules` 通常是不安全的，因為變更不會立即套用。相反地，建議的方法是將您要覆寫的 `module` 加入到 `Application` 類別中 `startKoin` 所使用的 `modules` 裡。
如果您想保持應用程式中繼承 `Application` 的類別不被更動，您可以在 `AndroidTest` 套件中建立另一個類別，例如：
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
為了在您的 Instrumentation 測試中使用此自訂 `Application`，您可能需要建立一個自訂的 [AndroidJUnitRunner](https://developer.android.com/training/testing/instrumented-tests/androidx-test-libraries/runner)，例如：
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
然後在您的 gradle 檔案中透過以下方式註冊：
```groovy
testInstrumentationRunner "com.example.myapplication.InstrumentationTestRunner"
```

## 使用測試規則覆寫生產環境模組

如果您想要更多彈性，您仍然需要建立自訂的 `AndroidJUnitRunner`，但不是在自訂應用程式內使用 `startKoin { ... }`，而是可以將其放入自訂測試規則中，例如：
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
透過這種方式，我們可以潛在地直接從測試類別中覆寫定義，例如：
```kotlin
private val instrumentedTestModule = module {
    factory<Something> { FakeSomething() }
}

@get:Rule
val koinTestRule = KoinTestRule(
    modules = listOf(productionModule, instrumentedTestModule)
)