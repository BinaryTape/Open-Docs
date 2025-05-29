---
title: 验证 Koin 配置
---

Koin 允许你验证你的配置模块，避免在运行时发现依赖注入问题。

## 使用 Verify() 检查 Koin 配置 - 仅限 JVM [3.3]

在 Koin 模块上使用 `verify()` 扩展函数即可！在底层，这会验证所有构造函数类，并与 Koin 配置进行交叉核对，以确定是否为该依赖项声明了组件。如果失败，该函数将抛出 `MissingKoinDefinitionException`。

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
    viewModelOf(::MainActivityViewModel)
}
```

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {

        // Verify Koin configuration
        niaAppModule.verify()
    }
}
```

运行 JUnit 测试，即可完成！ ✅

如你所见，我们使用 `extra Types` 参数来列出 Koin 配置中用到但未直接声明的类型。例如 `SavedStateHandle` 和 `WorkerParameters` 类型，它们被用作注入参数。`Context` 则在启动时由 `androidContext()` 函数声明。

`verify()` API 运行起来非常轻量，并且不需要任何模拟 (mock)/桩 (stub) 即可在你的配置上运行。

## 使用注入参数进行验证 - 仅限 JVM [4.0]

当你的配置中包含通过 `parametersOf` 注入的对象时，验证将会失败，因为你的配置中没有参数类型的定义。但是，你可以定义一个参数类型，通过给定的定义 `definition<Type>(Class1::class, Class2::class ...)` 进行注入。

具体示例如下：

```kotlin
class ModuleCheck {

    // given a definition with an injected definition
    val module = module {
        single { (a: Simple.ComponentA) -> Simple.ComponentB(a) }
    }

    @Test
    fun checkKoinModule() {
        
        // Verify and declare Injected Parameters
        module.verify(
            injections = injectedParameters(
                definition<Simple.ComponentB>(Simple.ComponentA::class)
            )
        )
    }
}
```

## 类型白名单

我们可以将类型添加为“白名单”。这意味着该类型在系统中被视为对任何定义都存在。具体示例如下：

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {

        // Verify Koin configuration
        niaAppModule.verify(
            // List types used in definitions but not declared directly (like parameters injection)
            extraTypes = listOf(MyType::class ...)
        )
    }
}
```