---
title: 應用程式、配置與模組 
---

## 使用 @KoinApplication 進行應用程式引導

使用 `@KoinApplication` 來定義您的應用程式入口點：

```kotlin
@KoinApplication(modules = [MyModule::class])
class MyApp
```

使用強型別 API 啟動 Koin：

```kotlin
fun main() {
    startKoin<MyApp>()

    // 或使用配置
    startKoin<MyApp> {
        printLogger()
    }
}
```

### 可用的強型別 API

| API | 描述 |
|-----|-------------|
| `startKoin<T>()` | 全域啟動 Koin |
| `startKoin<T> { }` | 使用配置區塊啟動 |
| `koinApplication<T>()` | 建立隔離的 KoinApplication |
| `koinConfiguration<T>()` | 建立配置（適用於 Compose, Ktor） |

### @KoinApplication 參數

- `modules`：要包含的模組類別陣列
- `configurations`：要載入的配置標籤陣列

```kotlin
@KoinApplication(
    modules = [CoreModule::class],
    configurations = ["production"]
)
class ProdApp
```

:::info
當未指定任何配置時，標記為 `@Configuration`（預設標籤）的模組將自動載入。
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

## 使用模組進行組織

請務必使用 `@Module` 將您的定義組織在明確的模組中：

## 使用 @Module 的類別模組

若要宣告模組，請使用 `@Module` 註解標記類別：

```kotlin
@Module
class MyModule
```

在您的 `@KoinApplication` 中參考模組：

```kotlin
@KoinApplication(modules = [MyModule::class])
class MyApp

fun main() {
    startKoin<MyApp>()
}
```

## 使用 @ComponentScan 掃描組建

使用 `@ComponentScan` 自動探索帶有註解的組建：

```kotlin
@Module
@ComponentScan
class MyModule
```

這將掃描當前套件及其子套件以尋找帶有註解的組建。明確指定套件：

```kotlin
@Module
@ComponentScan("com.myapp.features")
class FeatureModule
```

:::info
`@ComponentScan` 會針對相同的套件跨所有 Gradle 模組進行遍歷。
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

> **注意**：`@InjectedParam`（用於來自 `startKoin` 的注入參數）和 `@Property`（用於屬性注入）也可用於函式成員。請參閱定義文件以了解有關這些註解的更多詳細資訊。

## 包含模組

使用 `includes` 屬性來組合模組：

```kotlin
@Module
class ModuleA

@Module(includes = [ModuleA::class])
class ModuleB
```

在您的應用程式中參考根模組：

```kotlin
@KoinApplication(modules = [ModuleB::class])  // 將自動包含 ModuleA
class MyApp

fun main() {
    startKoin<MyApp>()
}