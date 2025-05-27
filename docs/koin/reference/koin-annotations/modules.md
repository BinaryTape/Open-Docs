---
title: 带有 @Module 的模块
---

在使用定义时，您可能需要或不需要将它们组织到模块中。您甚至可以完全不使用任何模块，而使用“默认”生成的模块。

## 无模块 - 使用生成的默认模块

如果您不想指定任何模块，Koin 会提供一个默认模块来承载您的所有定义。`defaultModule` 可以直接使用：

```kotlin
// Use Koin Generation
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        defaultModule()
    }
}

// or 

fun main() {
    startKoin {
        modules(
          defaultModule
        )
    }
}
```

:::info
  不要忘记使用 `org.koin.ksp.generated.*` 导入
:::

## 带有 @Module 的类模块

要声明一个模块，只需使用 `@Module` 注解标记一个类：

```kotlin
@Module
class MyModule
```

要在 Koin 中加载您的模块，只需使用为任何 `@Module` 类生成的 `.module` 扩展。只需创建模块的新实例 `MyModule().module` 即可：

```kotlin
// Use Koin Generation
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          MyModule().module
        )
    }
}
```

> 不要忘记使用 `org.koin.ksp.generated.*` 导入

## 带有 @ComponentScan 的组件扫描

要扫描并将带注解的组件收集到一个模块中，只需在模块上使用 `@ComponentScan` 注解：

```kotlin
@Module
@ComponentScan
class MyModule
```

这将扫描当前包及其子包中带注解的组件。您可以指定扫描一个给定的包 `@ComponentScan("com.my.package")`

:::info
  当使用 `@ComponentScan` 注解时，KSP 会遍历所有 Gradle 模块以查找相同的包。（自 1.4 版起）
:::

## 类模块中的定义

要直接在模块中定义一个定义，您可以使用定义注解标记一个函数：

```kotlin
// given 
// class MyComponent(val myDependency : MyDependency)

@Module
class MyModule {

  @Single
  fun myComponent(myDependency : MyDependency) = MyComponent(myDependency)
}
```

> `@InjectedParam`、`@Property` 也可以在函数成员上使用

## 包含模块

要将其他类模块包含到您的模块中，只需使用 `@Module` 注解的 `includes` 属性：

```kotlin
@Module
class ModuleA

@Module(includes = [ModuleA::class])
class ModuleB
```

这样您就可以直接运行您的根模块：

```kotlin
// Use Koin Generation
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          // will load ModuleB & ModuleA
          ModuleB().module
        )
    }
}