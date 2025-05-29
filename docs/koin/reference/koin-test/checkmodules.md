---
title: CheckModules - 检查 Koin 配置（已弃用）
---

:::warning
此 API 现已弃用 - 自 Koin 4.0 起
:::

Koin 允许你验证你的配置模块，避免在运行时发现依赖注入问题。

### Koin 动态检查 - CheckModules()

在一个简单的 JUnit 测试中调用 `checkModules()` 函数。这将启动你的模块，并尝试为你运行每个可能的定义。

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

对于使用注入参数、属性或动态实例的任何定义，`checkModules` DSL 允许指定如何处理以下情况：

*   `withInstance(value)` - 将 `value` 实例添加到 Koin 依赖图（可在依赖项或参数中使用）

*   `withInstance<MyType>()` - 将添加一个 `MyType` 的模拟实例。使用 MockProviderRule。（可在依赖项或参数中使用）

*   `withParameter<Type>(qualifier){ qualifier -> value }` - 将添加 `value` 实例作为参数注入

*   `withParameter<Type>(qualifier){ qualifier -> parametersOf(...) }` - 将添加 `value` 实例作为参数注入

*   `withProperty(key,value)` - 向 Koin 添加属性

#### 允许使用 JUnit 规则进行模拟

要将模拟与 `checkModules` 配合使用，你需要提供一个 `MockProviderRule`

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // Mock with your framework here given clazz 
}
```

#### 验证具有动态行为的模块 (3.1.3+)

要验证以下动态行为，让我们使用 CheckKoinModules DSL 为我们的测试提供缺失的实例数据：

```kotlin
val myModule = module {
    factory { (id: String) -> FactoryPresenter(id) }
}
```

你可以通过以下方式进行验证：

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

这样，`FactoryPresenter` 的定义将注入上面定义的 `"_my_id_value"`。

你也可以使用模拟实例来填充你的依赖图。你会注意到我们需要一个 `MockProviderRule` 声明，以允许 Koin 模拟任何注入的定义

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
        // 设置你的模拟框架
        Mockito.mock(clazz.java)
    }

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(myModule1)
            checkModules(){
                // 向 Koin 添加 ComponentA 的模拟
                withInstance<ComponentA>()
            }
        }
    }
}
```

#### 检查 Android 模块 (3.1.3)

以下是你如何测试典型 Android 应用的依赖图：

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

如果需要，你可以为被检查模块中的所有类型设置一个默认值。例如，我们可以覆盖所有注入的字符串值：

让我们在 `checkModules` 块中使用 `withInstance()` 函数，为所有定义设置一个默认值：

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

所有使用注入 `String` 参数的注入定义，都将接收 `"_ID_"`：

```kotlin
module {
    single { (i: String) -> Simple.ComponentC(i) }
    factory { (id: String) -> FactoryPresenter(id) }
}
```

#### 提供 ParametersOf 值 (3.1.4)

你可以使用 `withParameter` 或 `withParameters` 函数为某个特定定义设置一个默认注入值：

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

你可以在 `checkModules` 块中使用 `withScopeLink` 函数来链接作用域，从而从另一个作用域的定义中注入实例：

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