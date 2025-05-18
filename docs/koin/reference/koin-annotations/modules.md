---
title: "使用 @Module 的模块"
---
在使用定义时，您可能需要将它们组织到模块中，或者不组织。您甚至可以完全不使用任何模块，而是使用生成的“默认”模块。

## 无模块 - 使用生成的默认模块

如果您不想指定任何模块，Koin 提供了一个默认模块来托管您的所有定义。 `defaultModule`可以直接使用：

```kotlin
// 使用 Koin 代码生成
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        defaultModule()
    }
}

// 或者

fun main() {
    startKoin {
        modules(
          defaultModule
        )
    }
}
```

:::info
  别忘了使用 `org.koin.ksp.generated.*` 导入
:::

## 使用 @Module 的类模块

要声明一个模块，只需使用 `@Module` 注解标记一个类：

```kotlin
@Module
class MyModule
```

要在 Koin 中加载您的模块，只需使用为任何 `@Module` 类生成的 `.module` 扩展。 只需创建模块的新实例 `MyModule().module`：

```kotlin
// 使用 Koin 代码生成
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          MyModule().module
        )
    }
}
```

> 别忘了使用 `org.koin.ksp.generated.*` 导入

## 使用 @ComponentScan 的组件扫描

要扫描并将带注解的组件收集到一个模块中，只需在模块上使用 `@ComponentScan` 注解：

```kotlin
@Module
@ComponentScan
class MyModule
```

这将扫描当前包和子包中的带注解的组件。 您可以指定要扫描的给定包 `@ComponentScan("com.my.package")`

:::info
  当使用 `@ComponentScan` 注解时，KSP 会遍历同一包的所有 Gradle 模块。（自 1.4 起）
:::

## 类模块中的定义

要直接在类中定义一个定义，你可以使用定义注解来注解一个函数：

```kotlin
// 给定
// class MyComponent(val myDependency : MyDependency)

@Module
class MyModule {

  @Single
  fun myComponent(myDependency : MyDependency) = MyComponent(myDependency)
}
```

> @InjectedParam, @Property 也可以在函数成员上使用

## 包含模块

要将其他类模块包含到您的模块中，只需使用 `@Module` 注解的 `includes` 属性：

```kotlin
@Module
class ModuleA

@Module(includes = [ModuleA::class])
class ModuleB
```

这样你就可以运行你的根模块了：

```kotlin
// 使用 Koin 代码生成
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          // 将加载 ModuleB 和 ModuleA
          ModuleB().module
        )
    }
}