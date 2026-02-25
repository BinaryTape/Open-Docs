---
title: Android 仪器化测试
---

## 在自定义 Application 类中重写生产环境模块

与[单元测试](/docs/reference/koin-test/testing.md)不同（在单元测试中，您实际上是在每个测试类中调用 start Koin，即 `startKoin` 或 `KoinTestExtension`），在仪器化测试中，Koin 是由您的 `Application` 类启动的。

为了重写生产环境的 Koin 模块，使用 `loadModules` 和 `unloadModules` 通常是不安全的，因为更改不会立即生效。相反，推荐的方法是将重写定义的 `module` 添加到 `Application` 类中 `startKoin` 所使用的 `modules` 中。
如果您想保持应用中继承自 `Application` 的类不被改动，您可以在 `AndroidTest` 软件包中创建另一个类，例如：
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
为了在您的仪器化测试中使用此自定义 `Application`，您可能需要创建一个自定义 [AndroidJUnitRunner](https://developer.android.com/training/testing/instrumented-tests/androidx-test-libraries/runner)，如下所示：
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
然后在您的 gradle 文件中通过以下方式注册它：
```groovy
testInstrumentationRunner "com.example.myapplication.InstrumentationTestRunner"
```

## 使用测试规则重写生产环境模块

如果您需要更高的灵活性，您仍需要创建自定义 `AndroidJUnitRunner`，但不再将 `startKoin { ... }` 放在自定义应用程序中，而是可以将其放在自定义测试规则中，如下所示：
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
通过这种方式，我们可以直接从测试类中重写定义，例如：
```kotlin
private val instrumentedTestModule = module {
    factory<Something> { FakeSomething() }
}

@get:Rule
val koinTestRule = KoinTestRule(
    modules = listOf(productionModule, instrumentedTestModule)
)