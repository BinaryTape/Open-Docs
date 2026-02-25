---
title: CheckModules - 检查 Koin 配置 (弃用)
---

:::warning
此 API 自 Koin 4.0 起已弃用
:::

Koin 允许您验证配置模块，从而避免在运行时发现依赖注入问题。

### Koin 动态检查 - CheckModules()  

在简单的 JUnit 测试中调用 `checkModules()` 函数。这将启动您的模块并尝试为您运行每个可能的定义。 

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

对于任何使用注入的形参、属性或动态实例的定义，`checkModules` DSL 允许指定如何处理以下情况：

* `withInstance(value)` - 将 `value` 实例添加到 Koin 图（可用于依赖项或形参）

* `withInstance<MyType>()` - 将添加 `MyType` 的模拟实例。使用 MockProviderRule。（可用于依赖项或形参）

* `withParameter<Type>(qualifier){ qualifier -> value }` - 将添加要作为形参注入的 `value` 实例

* `withParameter<Type>(qualifier){ qualifier -> parametersOf(...) }` - 将添加要作为形参注入的 `value` 实例

* `withProperty(key,value)` - 向 Koin 添加属性

#### 通过 Junit 规则允许模拟

要在 `checkModules` 中使用模拟，您需要提供一个 `MockProviderRule`

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // 在此处根据 clazz 使用您的框架进行模拟 
}
```

#### 验证具有动态行为的模块 (3.1.3+)

要验证如下所示的动态行为，让我们使用 CheckKoinModules DSL 为测试提供缺少的实例数据：

```kotlin
val myModule = module {
    factory { (id: String) -> FactoryPresenter(id) }
}
```

您可以使用以下代码进行验证：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(myModule)
            checkModules(){
                // 要添加到 Koin 的值，供定义使用
                withInstance("_my_id_value")
            }
        }
    }
}
```

通过这种方式，`FactoryPresenter` 定义将注入上面定义的 `"_my_id_value"`。

您还可以使用模拟实例来填充您的图。请注意，我们需要声明 `MockProviderRule` 以允许 Koin 模拟任何注入的定义

```kotlin
val myModule1 = module {
    factory { (a : ComponentA) -> ComponentB(a) }
}
// 或者
val myModule2 = module {
    factory { ComponentB(get()) }
}
```

```kotlin
class CheckModulesTest : KoinTest {
    
    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        // 设置您的模拟框架
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

#### 为 Android 检查模块 (3.1.3)

以下是如何为典型的 Android 应用测试您的图：

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

如果需要，您可以为检查模块中的所有类型设置默认值。例如，我们可以重写所有注入的字符串值：

让我们在 `checkModules` 块中使用 `withInstance()` 函数，为所有定义设置默认值：

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

所有使用注入的 `String` 形参的注入定义都将接收 `"_ID_"`：

```kotlin
module {
    single { (i: String) -> Simple.ComponentC(i) }
    factory { (id: String) -> FactoryPresenter(id) }
}
```

#### 提供 ParametersOf 值 (3.1.4)

您可以使用 `withParameter` 或 `withParameters` 函数为特定的定义定义要注入的默认值：

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

您可以在 `checkModules` 块中使用 `withScopeLink` 函数链接作用域，从而注入来自另一个作用域定义的实例：

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