---
title: 验证您的 Koin 配置
---

Koin 允许您验证您的配置模块，从而避免在运行时发现依赖项注入问题。

:::tip 编译时安全性现已推出
**Koin 编译器插件**现在提供编译时依赖项验证——在构建时捕获缺失的依赖项、限定符不匹配和损坏的调用站点。在大多数情况下，这取代了对 `verify()` 和 `checkModules()` 的需求。

请参阅 [编译时安全性](/docs/reference/koin-compiler/compile-safety) 进行迁移。
:::

## Verify API - 仅限 JVM [3.3+]

在 Koin 模块上使用 `verify()` 扩展函数。在底层，这将验证所有构造函数类，并与 Koin 配置进行交叉检查，以了解是否为该依赖项声明了组件。如果失败，该函数将抛出 `MissingKoinDefinitionException`。

```kotlin
val niaAppModule = module {
    includes(
        jankStatsKoinModule,
        dataKoinModule,
        syncWorkerKoinModule,
        topicKoinModule,
        authorKoinModule,
        interestsKoinModule,
        settingsKoinModule,
        bookMarksKoinModule,
        forYouKoinModule
    )
    viewModel<MainActivityViewModel>()
}
```

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {
        // 验证 Koin 配置
        niaAppModule.verify()
    }
}
```

启动 JUnit 测试，大功告成！

`verify()` API 运行起来非常轻巧，不需要任何类型的 mock/存根即可在您的配置上运行。

### 使用注入形参进行验证 [4.0+]

当您的配置涉及使用 `parametersOf` 注入对象时，验证将失败，因为您的配置中没有该形参类型的定义。
但是，您可以定义一个形参类型，以便通过给定的定义 `definition<Type>(Class1::class, Class2::class ...)` 进行注入。

```kotlin
class ModuleCheck {

    // 给定一个带有注入定义的定义
    val module = module {
        single { (a: Simple.ComponentA) -> Simple.ComponentB(a) }
    }

    @Test
    fun checkKoinModule() {

        // 验证并声明注入形参
        module.verify(
            injections = injectedParameters(
                definition<Simple.ComponentB>(Simple.ComponentA::class)
            )
        )
    }
}
```

### 类型白名单

我们可以将类型添加为“白名单”。这意味着该类型被认为存在于系统中，可用于任何定义：

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {

        // 验证 Koin 配置
        niaAppModule.verify(
            // 列出定义中使用的但未直接声明的类型（如形参注入）
            extraTypes = listOf(MyType::class ...)
        )
    }
}
```

### 使用注解进行验证

来自 `koin-core-annotations` 的注解可以帮助 Koin 推断注入契约并验证配置。相比复杂的 DSL 配置，这有助于识别这些元素：

```kotlin
// 表示 "a" 是一个注入形参
class ComponentB(@InjectedParam val a: ComponentA)
// 表示 "a" 是动态提供的
class ComponentBProvided(@Provided val a: ComponentA)
```

这有助于防止在测试或运行时出现微妙的问题，而无需编写自定义验证逻辑。

---

## CheckModules API（已弃用）

:::warning
`checkModules()` API 自 Koin 4.0 起已弃用。请改用 `verify()`，或迁移到 Koin 编译器插件以获得编译时安全性。
:::

`checkModules()` 函数会启动您的模块并尝试运行每个可能的定义。

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {

        koinApplication {
            modules(module1, module2)
            checkModules()
        }
    }
}
```

或者使用 `checkKoinModules`：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        checkKoinModules(listOf(module1, module2))
    }
}
```

### CheckModule DSL

对于任何使用注入形参、属性或动态实例的定义：

* `withInstance(value)` - 将 `value` 实例添加到 Koin 图中
* `withInstance<MyType>()` - 将添加 `MyType` 的 mock 实例（需要 `MockProviderRule`）
* `withParameter<Type>(qualifier){ qualifier -> value }` - 将添加要作为形参注入的 `value` 实例
* `withProperty(key, value)` - 向 Koin 添加属性

### 使用 JUnit 规则进行 Mocking

要在 `checkModules` 中使用 mock，请提供一个 `MockProviderRule`：

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // 在此处根据给定的 clazz 使用您的框架进行 Mock
    Mockito.mock(clazz.java)
}
```

### 验证具有动态行为的模块

```kotlin
val myModule = module {
    factory { (id: String) -> FactoryPresenter(id) }
}
```

验证方式：

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

### Android 示例

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

### 提供作用域链接

使用 `withScopeLink` 链接作用域：

```kotlin
val myModule = module {
    scope(named("scope1")) {
        scoped { ComponentA() }
    }
    scope(named("scope2")) {
        scoped { ComponentB(get()) }
    }
}

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

---

## 迁移到编译时安全性

Koin 编译器插件现在提供编译时依赖项验证，取代了对运行时验证的需求：

| 之前 | 之后 |
|--------|-------|
| 测试中的 `module.verify()` | 编译器插件（自动） |
| 测试中的 `checkModules()` | 编译器插件（自动） |
| 运行时验证 | 编译时验证 |
| 手动测试设置 | 不需要测试代码 |

编译器在每次构建时进行验证——不需要测试代码。在启用编译器插件后，您可以安全地移除 `verify()` 和 `checkModules()` 测试。

请参阅 [编译时安全性](/docs/reference/koin-compiler/compile-safety) 了解完整详情，并参阅 [编译器插件设置](/docs/setup/compiler-plugin) 了解设置说明。