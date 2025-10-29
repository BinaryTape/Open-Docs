---
title: 應用程式、組態與模組
---

## 使用 @KoinApplication 啟動應用程式

若要建立一個完整的 Koin 應用程式啟動流程，你可以在進入點 (entry point) 類別上使用 `@KoinApplication` 註解。此註解有助於產生 Koin 應用程式的啟動函數：

```kotlin
@KoinApplication // 載入預設組態
object MyApp

@KoinApplication(
    configurations = ["default", "production"], 
    modules = [MyModule::class]
)
object MyApp
```

這會產生 **兩個** 用於啟動 Koin 應用程式的函數：

```kotlin
// 以下的 import 讓你可以存取生成的擴展函數
import org.koin.ksp.generated.*

fun main() {
    // 選項 1: 直接啟動 Koin
    MyApp.startKoin()
    
    // 選項 2: 取得 KoinApplication 實例
    val koinApp = MyApp.koinApplication()
}
```

這兩個生成的函數都支援自訂組態：

```kotlin
fun main() {
    MyApp.startKoin {
        printLogger()
        // 加入其他 Koin 組態
    }
    
    // 或者使用 koinApplication
    MyApp.koinApplication {
        printLogger()
    }
}
```

`@KoinApplication` 註解支援：
- `configurations`：要掃描和載入的組態名稱陣列
- `modules`：要直接包含的模組類別陣列 (除了組態之外)

:::info
當未指定組態時，它會自動載入「default」組態。
:::

## 使用 @Configuration 管理組態

`@Configuration` 註解允許你將模組組織成不同的組態 (環境、風格等)。這對於按部署環境或功能集組織模組非常有用。

### 基本組態用法

```kotlin
// 將模組放入預設組態
@Module
@Configuration
class CoreModule
```

:::info
預設組態名為 "default"，可以與 `@Configuration` 或 `@Configuration("default")` 一起使用
:::

你需要使用 `@KoinApplication` 才能夠從組態中掃描模組：

```kotlin
// 模組 A
@Module
@Configuration
class ModuleA

// 模組 B
@Module
@Configuration
class ModuleB

// 模組 App，掃描所有 @Configuration 模組
@KoinApplication
object MyApp
```

### 多組態支援

一個模組可以與多個組態關聯：

```kotlin
// 此模組在 "prod" 和 "test" 組態中都可用
@Module
@Configuration("prod", "test")
class DatabaseModule {
    @Single
    fun database() = PostgreSQLDatabase()
}

// 此模組在 default、test 和 development 組態中都可用
@Module
@Configuration("default", "test", "development") 
class LoggingModule {
    @Single
    fun logger() = Logger()
}
```

### 環境專屬組態

```kotlin
// 僅限開發環境的組態
@Module
@Configuration("development")
class DevDatabaseModule {
    @Single
    fun database() = InMemoryDatabase()
}

// 僅限生產環境的組態  
@Module
@Configuration("production")
class ProdDatabaseModule {
    @Single
    fun database() = PostgreSQLDatabase()
}

// 適用於多個環境
@Module
@Configuration("default", "production", "development")
class CoreModule {
    @Single
    fun logger() = Logger()
}
```

### 搭配 @KoinApplication 使用組態

預設情況下，`@KoinApplication` 會載入所有預設組態 (使用 `@Configuration` 標記的模組)。

你也可以在應用程式啟動時參考這些組態：

```kotlin
@KoinApplication(configurations = ["default", "production"])
class ProductionApp

@KoinApplication(configurations = ["default", "development"])  
class DevelopmentApp

// 僅載入預設組態 (與不帶參數的 @KoinApplication 相同)
@KoinApplication
class SimpleApp
```

:::info
- 空的 `@Configuration` 等同於 `@Configuration("default")`
- 當未指定特定組態時，「default」組態會自動載入
- 模組可以透過在註解中列出多個組態來歸屬於多個組態
:::

## 預設模組 (自 1.3.0 版起已棄用)

:::warning
自 Annotations 1.3.0 版起，預設模組方法已棄用。我們建議使用帶有 `@Module` 和 `@Configuration` 註解的明確模組，以實現更好的組織和清晰度。
:::

在使用定義時，你可能需要將它們組織成模組，或者不這麼做。以前，你可以使用「預設」生成的模組來存放沒有明確模組的定義。

如果你不想指定任何模組，Koin 會提供一個預設模組來存放你所有的定義。`defaultModule` 可以直接使用：

```kotlin
// 以下的 import 讓你可以存取生成的擴展函數
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

**推薦方法**：代替使用預設模組，請將你的定義組織在明確的模組中：

```kotlin
@Module
@Configuration
class MyModule {
    // 你的定義在此
}

// 然後使用 @KoinApplication
@KoinApplication
object MyApp
```

:::info
別忘了使用 `org.koin.ksp.generated.*` 導入
:::

## 帶有 @Module 的類別模組

要宣告一個模組，只要使用 `@Module` 註解標記一個類別：

```kotlin
@Module
class MyModule
```

要在 Koin 中載入你的模組，只需使用為任何 `@Module` 類別生成的 `.module` 擴展函數。只需建立模組 `MyModule().module` 的新實例：

```kotlin
// 使用 Koin 生成
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          MyModule().module
        )
    }
}
```

> 別忘了使用 `org.koin.ksp.generated.*` 導入

## 帶有 @ComponentScan 的組件掃描

要掃描並收集帶有註解的組件到一個模組中，只需在模組上使用 `@ComponentScan` 註解：

```kotlin
@Module
@ComponentScan
class MyModule
```

這將會掃描目前套件及其子套件中的帶有註解的組件。你可以指定掃描某個給定的套件，例如 `@ComponentScan("com.my.package")`

:::info
當使用 `@ComponentScan` 註解時，KSP 會針對同一個套件遍歷所有 Gradle 模組。(自 1.4 版起)
:::

## 類別模組中的定義

要直接在你的程式碼中定義一個定義，你可以使用定義註解來註解一個函數：

```kotlin
// 假設 
// class MyComponent(val myDependency : MyDependency)

@Module
class MyModule {

  @Single
  fun myComponent(myDependency : MyDependency) = MyComponent(myDependency)
}
```

> **注意**：`@InjectedParam` (用於來自 startKoin 的注入參數) 和 `@Property` (用於屬性注入) 也可以用於函數成員上。有關這些註解的更多詳細資訊，請參閱定義文件。

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
// 使用 Koin 生成
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          // 將載入 ModuleB 和 ModuleA
          ModuleB().module
        )
    }
}
```