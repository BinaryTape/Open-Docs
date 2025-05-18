---
title: "使用 @Module 的模組"
---
當使用定義時，您可能需要將它們組織在模組中，也可能不需要。 您甚至可以完全不使用任何模組，而使用產生的「預設」（default）模組。

## 無模組 - 使用產生的預設模組 (No Module - Using the Generated Default Module)

如果您不想指定任何模組，Koin 提供一個預設模組來存放您的所有定義。 `defaultModule` 可以直接使用：

```kotlin
// 使用 Koin 產生器 (Use Koin Generation)
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
  別忘了使用 `org.koin.ksp.generated.*` 導入 (import)
:::

## 帶有 @Module 的類別模組 (Class Module with @Module)

要宣告一個模組，只需使用 `@Module` 註解標記一個類別：

```kotlin
@Module
class MyModule
```

要在 Koin 中載入您的模組，只需使用為任何 `@Module` 類別產生的 `.module` 擴充函式。 建立您的模組的新實例 `MyModule().module`：

```kotlin
// 使用 Koin 產生器 (Use Koin Generation)
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          MyModule().module
        )
    }
}
```

> 別忘了使用 `org.koin.ksp.generated.*` 導入 (import)

## 使用 @ComponentScan 進行元件掃描 (Components Scan with @ComponentScan)

要掃描並將帶註解的元件收集到一個模組中，只需在模組上使用 `@ComponentScan` 註解：

```kotlin
@Module
@ComponentScan
class MyModule
```

這將掃描當前套件和子套件以尋找帶註解的元件。 您可以指定掃描給定的套件 `@ComponentScan("com.my.package")`

:::info
  當使用 `@ComponentScan` 註解時，KSP 會遍歷所有 Gradle 模組以尋找相同的套件。（自 1.4 起）(When using `@ComponentScan` annotation, KSP traverses accross all Gradle modules for the same package. (since 1.4))
:::

## 類別模組中的定義 (Definitions in Class Modules)

要在您的模組中直接定義一個定義，您可以透過定義註解來註解一個函式：

```kotlin
// given 
// class MyComponent(val myDependency : MyDependency)

@Module
class MyModule {

  @Single
  fun myComponent(myDependency : MyDependency) = MyComponent(myDependency)
}
```

> @InjectedParam, @Property 也可以在函式成員上使用 (@InjectedParam, @Property are also usable on function members)

## 包含模組 (Including Modules)

要將其他類別模組包含到您的模組中，只需使用 `@Module` 註解的 `includes` 屬性：

```kotlin
@Module
class ModuleA

@Module(includes = [ModuleA::class])
class ModuleB
```

這樣您就可以直接執行您的根模組：

```kotlin
// 使用 Koin 產生器 (Use Koin Generation)
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          // 將載入 ModuleB & ModuleA (will load ModuleB & ModuleA)
          ModuleB().module
        )
    }
}
```