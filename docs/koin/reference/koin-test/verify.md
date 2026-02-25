---
title: 验证您的 Koin 配置
---

Koin 允许您验证您的配置模块，从而避免在运行时发现依赖项注入问题。

## 使用 verify() 进行 Koin 配置检查 - 仅限 JVM [3.3]

在Koin模块上使用verify()扩展函数。就这么简单！在底层，这将验证所有构造函数类，并与Koin配置进行交叉检查，以了解是否为该依赖项声明了组件。如果失败，该函数将抛出MissingKoinDefinitionException。

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

启动JUnit测试，大功告成！✅

如您所见，我们使用extraTypes形参来列出Koin配置中使用但未直接声明的类型。SavedStateHandle和WorkerParameters类型就是这种情况，它们被用作注入参数。Context在启动时通过androidContext()函数声明。

verify()API 运行起来非常轻巧，不需要任何类型的 mock/存根即可在您的配置上运行。

## 使用注入参数进行验证 - 仅限 JVM [4.0]

当您的配置涉及使用parametersOf注入对象时，验证将失败，因为您的配置中没有该形参类型的定义。
但是，您可以定义一个形参类型，以便通过给定的定义definition<Type>(Class1::class, Class2::class ...)进行注入。

具体操作如下：

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

我们可以将类型添加为“白名单”。这意味着该类型被认为存在于系统中，可用于任何定义。具体操作如下：

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {

        // Verify Koin configuration
        niaAppModule.verify(
            // List types used in definitions but not declared directly (like parameter injection)
            extraTypes = listOf(MyType::class ...)
        )
    }
}
```

## 核心注解 - 自动声明安全类型

我们还在Koin主项目（位于koin-core-annotations模块下）中引入了从Koin注解中提取的注解。
这些注解通过使用@InjectedParam和@Provided避免了冗长的声明，帮助Koin推断注入契约并验证配置。相比复杂的 DSL 配置，这有助于识别这些元素。
目前这些注解仅与verify()API 配合使用。

```kotlin
// indicates that "a" is an injected parameter
class ComponentB(@InjectedParam val a: ComponentA)
// indicates that "a" is dynamically provided
class ComponentBProvided(@Provided val a: ComponentA)
```

这有助于防止在测试或运行时出现微妙的问题，而无需编写自定义验证逻辑。