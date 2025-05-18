---
title: "Android 檢測儀器化測試 (Android Instrumented Testing)"
---
## 在自定義的 Application 類別中覆寫生產模組

與 [單元測試](/reference/koin-test/testing.md) 不同，在單元測試中，您可以在每個測試類別中有效地呼叫 start Koin (即 `startKoin` 或 `KoinTestExtension`)，在 Instrumented 測試中，Koin 由您的 `Application` 類別啟動。

為了覆寫生產 Koin 模組，`loadModules` 和 `unloadModules` 通常是不安全的，因為變更不會立即生效。 相反，建議的方法是將覆寫的 `module` 添加到 `Application` 類別中 `startKoin` 使用的 `modules` 中。 如果您想保持擴展應用程式的 `Application` 的類別不變，您可以在 `AndroidTest` 套件中建立另一個類別，例如：
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
為了在您的 Instrumentation 測試中使用此自定義 `Application`，您可能需要建立一個自定義的 [AndroidJUnitRunner](https://developer.android.com/training/testing/instrumented-tests/androidx-test-libraries/runner)，例如：
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
然後在您的 gradle 檔案中註冊它：
```groovy
testInstrumentationRunner "com.example.myapplication.InstrumentationTestRunner"
```

## 使用測試規則覆寫生產模組

如果您想要更大的靈活性，您仍然需要建立自定義的 `AndroidJUnitRunner`，但不是在自定義的 application 中使用 `startKoin { ... }`，您可以將其放入自定義的測試規則中，例如：
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
透過這種方式，我們可以潛在地直接從我們的測試類別中覆寫定義，例如：
```kotlin
private val instrumentedTestModule = module {
    factory<Something> { FakeSomething() }
}

@get:Rule
val koinTestRule = KoinTestRule(
    modules = listOf(productionModule, instrumentedTestModule)
)
```