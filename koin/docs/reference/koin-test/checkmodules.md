---
title: "CheckModules - 检查 Koin 配置（已弃用）"
---
:::warning
此 API 现已弃用 - 自 Koin 4.0 起
:::

Koin 允许你验证配置模块，避免在运行时发现依赖注入问题。

### Koin 动态检查 - CheckModules()

在简单的 JUnit 测试中调用 `checkModules()` 函数。这将启动你的模块并尝试运行每个可能的定义。

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(module1,module2)
            checkModules()
        }
    }
}
```

也可以使用 `checkKoinModules`：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        checkKoinModules(listOf(module1,module2))
    }
}
```

#### CheckModule DSL

对于任何使用注入的参数、属性或动态实例的定义，`checkModules` DSL 允许指定如何处理以下情况：

* `withInstance(value)` - 将 `value` 实例添加到 Koin 图中（可以在依赖项或参数中使用）

* `withInstance<MyType>()` - 将 `MyType` 的模拟实例添加到 Koin 图中。使用 MockProviderRule。（可以在依赖项或参数中使用）

* `withParameter<Type>(qualifier){ qualifier -> value }` - 将 `value` 实例添加为要注入的参数

* `withParameter<Type>(qualifier){ qualifier -> parametersOf(...) }` - 将 `value` 实例添加为要注入的参数

* `withProperty(key,value)` - 将属性添加到 Koin

#### 允许使用 Junit 规则进行模拟

要将 mock 与 `checkModules` 一起使用，你需要提供一个 `MockProviderRule`

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // 在此处使用你的框架进行模拟，给定 clazz
}
```

#### 验证具有动态行为的模块 (3.1.3+)

要验证如下所示的动态行为，让我们使用 CheckKoinModules DSL 来为我们的测试提供缺少的实例数据：

```kotlin
val myModule = module {
    factory { (id: String) -> FactoryPresenter(id) }
}
```

你可以使用以下方法进行验证：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(myModule)
            checkModules(){
                // 要添加到 Koin 的值，由定义使用
                withInstance("_my_id_value")
            }
        }
    }
}
```

这样，`FactoryPresenter` 定义将被注入上面定义的 `"_my_id_value"`。

你还可以使用模拟实例来填充你的图。你可以注意到，我们需要一个 `MockProviderRule` 声明，以允许 Koin 模拟任何注入的定义

```kotlin
val myModule1 = module {
    factory { (a : ComponentA) -> ComponentB(a) }
}
// or
val myModule2 = module {
    factory { ComponentB(get()) }
}
```

```kotlin
class CheckModulesTest : KoinTest {
    
    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        // 设置你的 mock 框架
        Mockito.mock(clazz.java)
    }

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(myModule1)
            checkModules(){
                // 将 ComponentA 的 mock 添加到 Koin
                withInstance<ComponentA>()
            }
        }
    }
}
```

#### 检查 Android 的模块 (3.1.3)

以下是如何为典型的 Android 应用程序测试你的图：

```kotlin
class CheckModulesTest {

    @get:Rule
    val rule: TestRule = InstantTaskExecutorRule()

    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        Mockito.mock(clazz.java)
    }

    @Test
    fun `test DI modules`(){
        koinApplication {
            modules(allModules)
            checkModules(){
                withInstance<Context>()
                withInstance<Application>()
                withInstance<SavedStateHandle>()
                withInstance<WorkerParameters>()
            }
        }
    }
}
```

也可以使用 `checkKoinModules`：

```kotlin
class CheckModulesTest {

    @get:Rule
    val rule: TestRule = InstantTaskExecutorRule()

    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        Mockito.mock(clazz.java)
    }

    @Test
    fun `test DI modules`(){
        checkKoinModules(allModules) {
            withInstance<Context>()
            withInstance<Application>()
            withInstance<SavedStateHandle>()
            withInstance<WorkerParameters>()
        }
    }
}
```

#### 提供默认值 (3.1.4)

如果需要，你可以为检查的模块中的所有类型设置默认值。例如，我们可以覆盖所有注入的字符串值：

让我们在 `checkModules` 块中使用 `withInstance()` 函数，为所有定义定义一个默认值：

```kotlin
@Test
fun `test DI modules`(){
    koinApplication {
        modules(allModules)
        checkModules(){
            withInstance("_ID_")
        }
    }
}
```

所有使用注入的 `String` 参数的注入定义都将收到 `"_ID_"`：

```kotlin
module {
    single { (i: String) -> Simple.ComponentC(i) }
    factory { (id: String) -> FactoryPresenter(id) }
}
```

#### 提供 ParametersOf 值 (3.1.4)

你可以使用 `withParameter` 或 `withParameters` 函数定义一个默认值，以便为一个特定定义注入：

```kotlin
@Test
fun `test DI modules`(){
    koinApplication {
        modules(allModules)
        checkModules(){
            withParameter<FactoryPresenter> { "_FactoryId_" }
            withParameters<FactoryPresenter> { parametersOf("_FactoryId_",...) }
        }
    }
}
```

#### 提供作用域链接

你可以通过在 `checkModules` 块中使用 `withScopeLink` 函数来链接作用域，以从另一个作用域的定义中注入实例：

```kotlin
val myModule = module {
    scope(named("scope1")) {
        scoped { ComponentA() }
    }
    scope(named("scope2")) {
        scoped { ComponentB(get()) }
    }
}
```

```kotlin
@Test
fun `test DI modules`(){
    koinApplication {
        modules(myModule)
        checkModules(){
            withScopeLink(named("scope2"), named("scope1"))
        }
    }
}
```