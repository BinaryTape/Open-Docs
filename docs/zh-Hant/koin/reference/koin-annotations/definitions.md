---
title: 帶有註解的定義
---

Koin 註解允許像常規的 Koin DSL 一樣宣告相同類型的定義，但改用註解方式。只需使用所需的註解標記您的類別，它將為您生成所有內容！

例如，等同於 `single { MyComponent(get()) }` DSL 宣告的方式，只需像這樣使用 `@Single` 標記：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency)
```

Koin 註解保持與 Koin DSL 相同的語義。您可以使用以下定義來宣告您的元件：

- `@Single` - 單例實例 (在 DSL 中使用 `single { }` 宣告)
- `@Factory` - 工廠實例。用於每次您需要實例時重新建立的實例。(在 DSL 中使用 `factory { }` 宣告)
- `@KoinViewModel` - Android ViewModel 實例 (在 DSL 中使用 `viewModel { }` 宣告)
- `@KoinWorker` - Android Worker Workmanager 實例 (在 DSL 中使用 `worker { }` 宣告)

關於作用域 (Scopes)，請查閱 [宣告作用域](/docs/reference/koin-core/scopes.md) 章節。

### 為 Kotlin Multiplatform 生成 Compose ViewModel (自 1.4.0 起)

`@KoinViewModel` 註解預設情況下會使用 `koin-core-viewmodel` 主要 DSL 生成 ViewModel (自 2.2.0 起啟用)。這提供了 Kotlin Multiplatform 相容性並使用統一的 ViewModel API。

`KOIN_USE_COMPOSE_VIEWMODEL` 選項預設為啟用：

```groovy
ksp {
    // This is the default behavior since 2.2.0
    arg("KOIN_USE_COMPOSE_VIEWMODEL","true")
}
```

這會使用 `org.koin.compose.viewmodel.dsl.viewModel` 生成 `viewModel` 定義，以實現多平台相容性。

:::info
- `KOIN_USE_COMPOSE_VIEWMODEL` 自 Annotations 2.2.0 起預設為啟用
- 這確保了跨所有平台的統一 ViewModel API 的一致性
- 舊的 `USE_COMPOSE_VIEWMODEL` 鍵已被移除
:::

## 自動或特定綁定

當宣告一個元件時，所有檢測到的「綁定」(相關聯的超類別) 都將為您準備好。例如，以下定義：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency) : MyInterface
```

Koin 將宣告您的 `MyComponent` 元件也與 `MyInterface` 綁定。其 DSL 等效為 `single { MyComponent(get()) } bind MyInterface::class`。

除了讓 Koin 為您檢測，您也可以透過 `binds` 註解參數來指定您真正想要綁定的類型：

 ```kotlin
@Single(binds = [MyBoundType::class])
```

## 可為 Null 的依賴項

如果您的元件使用可為 Null 的依賴項，請不用擔心，它將自動為您處理。只需繼續使用您的定義註解，Koin 會猜測該怎麼做：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency?)
```

生成的 DSL 等效將是 `single { MyComponent(getOrNull()) }`

> 請注意，這也適用於注入的參數和屬性。

## 使用 @Named 的限定符

您可以為定義添加一個「名稱」(也稱為限定符 Qualifier)，以區分相同類型的多個定義，使用 `@Named` 註解：

```kotlin
@Single
@Named("InMemoryLogger")
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@Named("DatabaseLogger")
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource
```

解析依賴項時，只需使用 `named` 函式搭配限定符：

```kotlin
val logger: LoggerDataSource by inject(named("InMemoryLogger"))
```

也可以建立自訂的限定符註解。以上述範例為例：

```kotlin
@Named
annotation class InMemoryLogger

@Named
annotation class DatabaseLogger

@Single
@InMemoryLogger
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@DatabaseLogger
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource
```

```kotlin
val logger: LoggerDataSource by inject(named<InMemoryLogger>())
```

## 使用 @InjectedParam 注入參數

您可以將建構子成員標記為「注入參數」，這表示在呼叫解析時，該依賴項將在圖中傳遞。

例如：

```kotlin
@Single
class MyComponent(@InjectedParam val myDependency : MyDependency)
```

然後您可以呼叫您的 `MyComponent` 並傳遞 `MyDependency` 的實例：

```kotlin
val m = MyDependency()
// Resolve MyComponent while passing MyDependency
koin.get<MyComponent> { parametersOf(m) }
```

生成的 DSL 等效將是 `single { params -> MyComponent(params.get()) }`

## 注入懶載入依賴項 - `Lazy<T>`

Koin 可以自動檢測並解析懶載入的依賴項。例如，我們希望懶載入解析 `LoggerDataSource` 定義。您只需使用 `Lazy` Kotlin 類型，如下所示：

```kotlin
@Single
class LoggerInMemoryDataSource : LoggerDataSource

@Single
class LoggerAggregator(val lazyLogger : Lazy<LoggerDataSource>)
```

其背後將生成類似於使用 `inject()` 而非 `get()` 的 DSL：

```kotlin
single { LoggerAggregator(inject()) }
```

## 注入依賴項列表 - `List<T>`

Koin 可以自動檢測並解析所有依賴項列表。例如，我們希望解析所有 `LoggerDataSource` 定義。您只需使用 `List` Kotlin 類型，如下所示：

```kotlin
@Single
@Named("InMemoryLogger")
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@Named("DatabaseLogger")
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource

@Single
class LoggerAggregator(val datasource : List<LoggerDataSource>)
```

其背後將生成類似於使用 `getAll()` 函式的 DSL：

```kotlin
single { LoggerAggregator(getAll()) }
```

## 帶有 @Property 的屬性

要在您的定義中解析 Koin 屬性，只需使用 `@Property` 標記建構子成員。這將透過傳遞給註解的值來解析 Koin 屬性：

```kotlin
@Factory
public class ComponentWithProps(
    @Property("id") public val id : String
)
```

生成的 DSL 等效將是 `factory { ComponentWithProps(getProperty("id")) }`

### @PropertyValue - 帶有預設值的屬性 (自 1.4 起)

Koin 註解提供了直接從您的程式碼中透過 `@PropertyValue` 註解為屬性定義預設值的可能性。讓我們沿用我們的範例：

```kotlin
@Factory
public class ComponentWithProps(
    @Property("id") public val id : String
){
    public companion object {
        @PropertyValue("id")
        public const val DEFAULT_ID : String = "_empty_id"
    }
}
```

生成的 DSL 等效將是 `factory { ComponentWithProps(getProperty("id", ComponentWithProps.DEFAULT_ID)) }`

## JSR-330 相容性註解

Koin 註解透過 `koin-jsr330` 模組提供了 JSR-330 (Jakarta Inject) 相容的註解。這些註解對於從其他 JSR-330 相容框架 (例如 Hilt、Dagger 或 Guice) 遷移的開發者來說特別有用。

### 設定

將 `koin-jsr330` 依賴項加入您的專案：

```kotlin
dependencies {
    implementation "io.insert-koin:koin-jsr330:$koin_version"
}
```

### 可用的 JSR-330 註解

#### @Singleton (jakarta.inject.Singleton)

JSR-330 標準單例註解，等同於 Koin 的 `@Single`：

```kotlin
import jakarta.inject.Singleton

@Singleton
class DatabaseService
```

這會生成與 `@Single` 相同的結果 – 在 Koin 中產生一個單例實例。

#### @Named (jakarta.inject.Named)

JSR-330 標準限定符註解，用於基於字串的限定符：

```kotlin
import jakarta.inject.Named
import jakarta.inject.Singleton

@Singleton
@Named("inMemory")
class InMemoryCache : Cache

@Singleton  
@Named("redis")
class RedisCache : Cache
```

#### @Inject (jakarta.inject.Inject)

JSR-330 標準注入註解。雖然 Koin 註解不需要明確的建構子標記，但 `@Inject` 可用於 JSR-330 相容性：

```kotlin
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class UserService @Inject constructor(
    private val repository: UserRepository
)
```

#### @Qualifier (jakarta.inject.Qualifier)

用於建立自訂限定符註解的元註解：

```kotlin
import jakarta.inject.Qualifier

@Qualifier
annotation class Database

@Qualifier  
annotation class Cache

@Singleton
@Database
class DatabaseConfig

@Singleton
@Cache  
class CacheConfig
```

#### @Scope (jakarta.inject.Scope)

用於建立自訂作用域註解的元註解：

```kotlin
import jakarta.inject.Scope

@Scope
annotation class RequestScoped

// Use with Koin's scope system
@Scope(name = "request") 
@RequestScoped
class RequestProcessor
```

### 混合使用

您可以在同一個專案中自由混用 JSR-330 註解和 Koin 註解：

```kotlin
// JSR-330 style
@Singleton
@Named("primary")
class PrimaryDatabase : Database

// Koin style  
@Single
@Named("secondary")
class SecondaryDatabase : Database

// Mixed in same class
@Factory
class DatabaseManager @Inject constructor(
    @Named("primary") private val primary: Database,
    @Named("secondary") private val secondary: Database  
)
```

### 框架遷移優點

使用 JSR-330 註解為框架遷移提供了多項優點：

- **熟悉的 API**：來自 Hilt、Dagger 或 Guice 的開發者可以使用熟悉的註解
- **漸進式遷移**：現有的 JSR-330 註解程式碼僅需少量修改即可運作
- **標準合規性**：遵循 JSR-330 可確保與依賴注入標準的相容性
- **團隊上手**：讓熟悉其他 DI 框架的團隊更容易上手

:::info
Koin 中的 JSR-330 註解會生成與其 Koin 等效項相同的底層 DSL。JSR-330 和 Koin 註解之間的選擇純粹是風格上的考量，並基於團隊偏好或遷移需求。
:::