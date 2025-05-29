---
title: 帶有 @Module 的模組
---

在使用定義時，你可能需要將它們組織成模組，或者不這麼做。你甚至可以完全不使用任何模組，而使用「預設」生成的模組。

## 不使用模組 - 使用生成的預設模組

如果你不想指定任何模組，Koin 會提供一個預設模組來存放你所有的定義。`defaultModule` 可以直接使用：

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
  別忘了使用 `org.koin.ksp.generated.*` 導入。
:::

## 帶有 @Module 的類別模組

要宣告一個模組，只要使用 `@Module` 註解標記一個類別：

```kotlin
@Module
class MyModule
```

要在 Koin 中載入你的模組，只需使用為任何 `@Module` 類別生成的 `.module` 擴展函數。只需建立模組 `MyModule().module` 的新實例：

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

> 別忘了使用 `org.koin.ksp.generated.*` 導入。

## 帶有 @ComponentScan 的組件掃描

要掃描並收集帶有註解的組件到一個模組中，只需在模組上使用 `@ComponentScan` 註解：

```kotlin
@Module
@ComponentScan
class MyModule
```

這將會掃描目前套件及其子套件中的帶有註解的組件。你可以指定掃描某個給定的套件，例如 `@ComponentScan("com.my.package")`。

:::info
  當使用 `@ComponentScan` 註解時，KSP 會針對同一個套件遍歷所有 Gradle 模組。（自 1.4 版起）
:::

## 類別模組中的定義

要直接在你的模組中定義一個定義，你可以使用定義註解來註解一個函數：

```kotlin
// given 
// class MyComponent(val myDependency : MyDependency)

@Module
class MyModule {

  @Single
  fun myComponent(myDependency : MyDependency) = MyComponent(myDependency)
}
```

> `@InjectedParam`、`@Property` 也可以用於函數成員上。

## 包含模組

要將其他類別模組包含到你的模組中，只需使用 `@Module` 註解的 `includes` 屬性：

```kotlin
@Module
class ModuleA

@Module(includes = [ModuleA::class])
class ModuleB
```

這樣你就可以直接運行你的根模組：

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
```