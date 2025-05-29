---
title: Android 仪器化测试
---

## 在自定义 Application 类中覆盖生产模块

与[单元测试](/docs/reference/koin-test/testing.md)不同，在单元测试中你可以在每个测试类中有效地调用启动 Koin（即 `startKoin` 或 `KoinTestExtension`），而在仪器化测试中，Koin 是由你的 `Application` 类启动的。

对于覆盖生产环境的 Koin 模块，`loadModules` 和 `unloadModules` 通常不安全，因为更改不会立即生效。相反，推荐的方法是将你的覆盖模块添加到 `Application` 类中 `startKoin` 所使用的 `modules` 中。
如果你想保持应用程序中继承 `Application` 的类不变，你可以在 `AndroidTest` 包中创建另一个，如下所示：
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
为了在你的仪器化测试中使用这个自定义 `Application`，你可能需要创建一个自定义的 [AndroidJUnitRunner](https://developer.android.com/training/testing/instrumented-tests/androidx-test-libraries/runner)，如下所示：
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
然后通过以下代码将其注册到你的 Gradle 文件中：
```groovy
testInstrumentationRunner "com.example.myapplication.InstrumentationTestRunner"
```

## 使用测试规则覆盖生产模块

如果你想要更大的灵活性，你仍然需要创建自定义的 `AndroidJUnitRunner`，但不是将 `startKoin { ... }` 放在自定义应用程序中，而是可以将其放入自定义测试规则中，如下所示：
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
通过这种方式，我们可以直接从我们的测试类中覆盖定义，例如：
```kotlin
private val instrumentedTestModule = module {
    factory<Something> { FakeSomething() }
}

@get:Rule
val koinTestRule = KoinTestRule(
    modules = listOf(productionModule, instrumentedTestModule)
)