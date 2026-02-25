---
title: 應用程式、配置與模組
---

## 使用 @KoinApplication 進行應用程式引導

若要建立完整的 Koin 應用程式引導（Bootstrap），您可以在入口點類別上使用 `@KoinApplication` 註解。此註解有助於產生 Koin 應用程式引導函式：

```kotlin
@KoinApplication // 載入預設配置
object MyApp

@KoinApplication(
    configurations = ["default", "production"], 
    modules = [MyModule::class]
)
object MyApp
```

這會產生 **兩個** 用於啟動 Koin 應用程式的函式：

```kotlin
// 下方的匯入可讓您存取產生的擴充函式
import org.koin.ksp.generated.*

fun main() {
    // 選項 1：直接啟動 Koin
    MyApp.startKoin()
    
    // 選項 2：獲取 KoinApplication 執行個體
    val koinApp = MyApp.koinApplication()
}
```

這兩個產生的函式都支援自訂配置：

```kotlin
fun main() {
    MyApp.startKoin {
        printLogger()
        // 新增其他 Koin 配置
    }
    
    // 或使用 koinApplication
    MyApp.koinApplication {
        printLogger()
    }
}
```

`@KoinApplication` 註解支援：
- `configurations`：要掃描並載入的配置名稱陣列
- `modules`：要直接包含的模組類別陣列（除配置之外）

:::info
當未指定任何配置時，它會自動載入「default」配置。
:::

## 使用 @Configuration 進行配置管理

`@Configuration` 註解允許您將模組組織到不同的配置（環境、變體等）中。這對於按部署環境或功能集組織模組非常有用。

### 基本配置用法

```kotlin
// 將模組放入預設配置中
@Module
@Configuration
class CoreModule
```

:::info
預設配置名為「default」，可以透過 `@Configuration` 或 `@Configuration("default")` 使用
:::

您需要使用 `@KoinApplication` 才能從配置中掃描模組：

```kotlin
// 模組 A
@Module
@Configuration
class ModuleA

// 模組 B
@Module
@Configuration
class ModuleB

// 應用程式模組，掃描所有 @Configuration 模組
@KoinApplication
object MyApp
```

### 多重配置支援

一個模組可以與多個配置相關聯：

```kotlin
// 此模組在 "prod" 和 "test" 配置中皆可用
@Module
@Configuration("prod", "test")
class DatabaseModule {
    @Single
    fun database() = PostgreSQLDatabase()
}

// 此模組在 default、test 和 development 中皆可用
@Module
@Configuration("default", "test", "development") 
class LoggingModule {
    @Single
    fun logger() = Logger()
}
```

### 環境特定的配置

```kotlin
// 僅限開發環境的配置
@Module
@Configuration("development")
class DevDatabaseModule {
    @Single
    fun database() = InMemoryDatabase()
}

// 僅限正式環境的配置  
@Module
@Configuration("production")
class ProdDatabaseModule {
    @Single
    fun database() = PostgreSQLDatabase()
}

// 在多個環境中可用
@Module
@Configuration("default", "production", "development")
class CoreModule {
    @Single
    fun logger() = Logger()
}
```

### 在 @KoinApplication 中使用配置

預設情況下，`@KoinApplication` 會載入所有預設配置（標記有 `@Configuration` 的模組）。

您也可以在應用程式引導中參考這些配置：

```kotlin
@KoinApplication(configurations = ["default", "production"])
class ProductionApp

@KoinApplication(configurations = ["default", "development"])  
class DevelopmentApp

// 僅載入預設配置（與不帶參數的 @KoinApplication 相同）
@KoinApplication
class SimpleApp
```

:::info
- 空的 `@Configuration` 等同於 `@Configuration("default")`
- 當未指定特定配置時，會自動載入「default」配置
- 模組可以透過在註解中列出多個配置來屬於多個配置
:::

## 預設模組（自 1.3.0 起棄用）

:::warning
自 Annotations 1.3.0 起，預設模組方法已棄用。我們建議使用帶有 `@Module` 和 `@Configuration` 註解的明確模組，以獲得更好的組織性和清晰度。
:::

在使用定義時，您可能需要將它們組織在模組中，或者不進行組織。以前，您可以使用產生的「預設」模組來裝載定義，而無需使用明確的模組。

如果您不想指定任何模組，Koin 提供了一個預設模組來裝載您的所有定義。`defaultModule` 已準備好直接使用：

```kotlin
// 下方的匯入可讓您存取產生的擴充函式
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        defaultModule()
    }
}

// 或 

fun main() {
    startKoin {
        modules(
          defaultModule
        )
    }
}
```

**建議做法**：不要使用預設模組，而是將您的定義組織在明確的模組中：

```kotlin
@Module
@Configuration
class MyModule {
    // 您的定義放在這裡
}

// 然後使用 @KoinApplication
@KoinApplication
object MyApp
```

:::info
不要忘記使用 `org.koin.ksp.generated.*` 匯入
:::

## 使用 @ComponentScan 掃描組建

若要掃描並將帶有註解的組建收集到模組中，只需在模組上使用 `@ComponentScan` 註解：

```kotlin
@Module
@ComponentScan
class MyModule
```

這將掃描當前套件及其子套件以尋找帶有註解的組建。您可以透過 `@ComponentScan("com.my.package")` 指定掃描特定的套件。

:::info
使用 `@ComponentScan` 註解時，KSP 會針對相同的套件跨所有 Gradle 模組進行遍歷。（自 1.4 起）
:::

## 類別模組中的定義

若要直接在程式碼中定義定義，您可以使用定義註解來標註函式：

```kotlin
// 給定 
// class MyComponent(val myDependency : MyDependency)

@Module
class MyModule {

  @Single
  fun myComponent(myDependency : MyDependency) = MyComponent(myDependency)
}
```

> **注意**：`@InjectedParam`（用於來自 startKoin 的注入參數）和 `@Property`（用於屬性注入）也可用於函式成員。請參閱定義文件以了解有關這些註解的更多詳細資訊。

## 包含模組

若要在您的模組中包含其他類別模組，請使用 `@Module` 註解的 `includes` 屬性：

```kotlin
@Module
class ModuleA

@Module(includes = [ModuleA::class])
class ModuleB
```

這樣您就可以直接執行您的根模組：

```kotlin
// 使用 Koin 產生
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          // 將會載入 ModuleB 和 ModuleA
          ModuleB().module
        )
    }
}