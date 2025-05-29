---
title: Android 儀器化測試
---

## 在自訂 Application 類別中覆寫生產模組

不同於[單元測試](/docs/reference/koin-test/testing.md)，在單元測試中您會在每個測試類別（即 `startKoin` 或 `KoinTestExtension`）中有效地呼叫啟動 Koin，而在儀器化測試中，Koin 是由您的 `Application` 類別啟動的。

為了覆寫生產 Koin 模組，`loadModules` 和 `unloadModules` 通常不安全，因為變更不會立即生效。相反地，建議的方法是在 `Application` 類別中，將您的覆寫模組加入到由 `startKoin` 使用的模組中。
如果您想保持應用程式中繼承 `Application` 的類別不變，您可以在 `AndroidTest` 套件內建立另一個，例如：
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
為了在您的儀器化測試中使用這個自訂 `Application`，您可能需要建立一個自訂的 [AndroidJUnitRunner](https://developer.android.com/training/testing/instrumented-tests/androidx-test-libraries/runner)，例如：
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
然後在您的 Gradle 檔案中註冊它，如下所示：
```groovy
testInstrumentationRunner "com.example.myapplication.InstrumentationTestRunner"
```

## 使用測試規則覆寫生產模組

如果您想要更大的彈性，您仍然需要建立自訂的 `AndroidJUnitRunner`，但與其在自訂應用程式中包含 `startKoin { ... }`，不如將它放入自訂測試規則中，例如：
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