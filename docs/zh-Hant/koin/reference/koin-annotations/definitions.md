---
title: 使用註解進行定義
---

Koin 註解允許使用註解來宣告與常規 Koin DSL 相同的定義。只需在類別標記所需的註解，它就會為您產生一切！

例如，與 `single { MyComponent(get()) }` DSL 宣告等效的操作，只需像這樣標記 `@Single` 即可：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency)
```

Koin 註解保持與 Koin DSL 相同的語意。您可以使用以下定義來宣告您的元件：

- `@Single` - singleton 執行個體（在 DSL 中使用 `single { }` 宣告）
- `@Factory` - factory 執行個體。例如每次需要執行個體時都會重新建立。（在 DSL 中使用 `factory { }` 宣告）
- `@KoinViewModel` - Android ViewModel 執行個體（在 DSL 中使用 `viewModel { }` 宣告）
- `@KoinWorker` - Android Worker Workmanager 執行個體（在 DSL 中使用 `worker { }` 宣告）

關於作用域 (Scope)，請參閱 [宣告作用域 (Declaring Scopes)](/docs/reference/koin-core/scopes) 章節。

## 標記註解的頂層函式 (Annotated Top-Level Functions)

註解可以用於 **頂層函式 (Top-level functions)**，而不僅僅是類別。這對於提供來自外部程式庫或建置器模式 (Builder patterns) 的執行個體非常有用。頂層函式會像類別一樣被 `@ComponentScan` 偵測到：

```kotlin
import org.koin.core.annotation.Singleton
import org.koin.core.annotation.Factory
import org.koin.core.annotation.Named

// 提供 Room 資料庫執行個體
@Singleton
fun provideDatabase(context: Context): AppDatabase =
    Room.databaseBuilder(context, AppDatabase::class.java, "my-db").build()

// 提供 JSON 序列化器
@Singleton
fun provideJson(): Json = Json { ignoreUnknownKeys = true }

// 提供 HTTP 用戶端
@Singleton
@Named("api")
fun provideHttpClient(json: Json): HttpClient = HttpClient { install(ContentNegotiation) { json(json) } }
```

參數會自動從 DI 容器中解析。限定詞（`@Named`、自訂 `@Qualifier`）可以同時作用於函式及其參數。

## 模組函式（提供者函式）

在 `@Module` 類別中，標記了 `@Singleton`、`@Factory` 等註解的函式充當提供者函式 (Provider functions) —— 類似於 Dagger/Hilt 中的 `@Provides`：

```kotlin
import org.koin.core.annotation.Module
import org.koin.core.annotation.Singleton

@Module
internal object DatabaseModule {

    @Singleton
    fun providesDatabase(context: Context): AppDatabase =
        Room.databaseBuilder(context, AppDatabase::class.java, "my-db").build()
}

@Module(includes = [DatabaseModule::class])
class DaosModule {

    @Singleton
    fun providesTopicDao(database: AppDatabase): TopicDao = database.topicDao()

    @Singleton
    fun providesNewsDao(database: AppDatabase): NewsResourceDao = database.newsResourceDao()
}
```

這是封裝您不具備所有權且無法直接標記註解的外部程式庫（如 Room、Retrofit、OkHttp 等）的模式。

## 自訂限定詞註解

除了 `@Named` 之外，您還可以使用 `@Qualifier` 建立帶有參數的自訂限定詞註解：

```kotlin
import org.koin.core.annotation.Qualifier

@Qualifier
@Retention(AnnotationRetention.RUNTIME)
annotation class Dispatcher(val niaDispatcher: NiaDispatchers)

enum class NiaDispatchers { Default, IO }
```

將其用於提供者函式和注入點：

```kotlin
import org.koin.core.annotation.Module
import org.koin.core.annotation.Configuration
import org.koin.core.annotation.Singleton

@Module
@Configuration
class DispatchersModule {

    @Singleton
    @Dispatcher(NiaDispatchers.IO)
    fun providesIODispatcher(): CoroutineDispatcher = Dispatchers.IO

    @Singleton
    @Dispatcher(NiaDispatchers.Default)
    fun providesDefaultDispatcher(): CoroutineDispatcher = Dispatchers.Default

    @Singleton
    fun providesApplicationScope(
        @Dispatcher(NiaDispatchers.Default) dispatcher: CoroutineDispatcher,
    ): CoroutineScope = CoroutineScope(SupervisorJob() + dispatcher)
}
```

自訂限定詞會在編譯時進行驗證 —— 如果提供者上的限定詞與注入點不相符，將會產生建置錯誤。

### Kotlin 多平台之 ViewModel

`@KoinViewModel` 註解使用統一的 `koin-core-viewmodel` API 產生 ViewModel，提供 Kotlin 多平台相容性。

```kotlin
@KoinViewModel
class UserViewModel(val repository: UserRepository) : ViewModel()
```

這會產生與 Android 和 Compose 多平台皆相容的 `viewModel` 定義。

## 自動或特定繫結

宣告元件時，所有偵測到的「繫結」（關聯的超型別）都將為您準備就緒。例如，以下定義：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency) : MyInterface
```

Koin 會宣告您的 `MyComponent` 元件也與 `MyInterface` 繫結。DSL 等效項為 `single { MyComponent(get()) } bind MyInterface::class`。

除了讓 Koin 為您偵測外，您也可以使用 `binds` 註解參數指定您真正想要繫結的型別：

 ```kotlin
@Single(binds = [MyBoundType::class])
```

## 可為 Null 的相依性

如果您的元件使用可為 null 的相依性，請不用擔心，它會自動為您處理。繼續使用您的定義註解，Koin 會推斷該怎麼做：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency?)
```

產生的 DSL 等效項將是 `single { MyComponent(getOrNull()) }`

> 請注意，這也適用於注入的參數 (Parameters) 和屬性 (Properties)

## 使用 @Named 的限定詞

您可以使用 `@Named` 註解為定義加入「名稱」（也稱為限定詞），以便區分相同型別的多個定義：

```kotlin
@Single
@Named("InMemoryLogger")
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@Named("DatabaseLogger")
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource
```

解析相依性時，只需搭配 `named` 函式使用限定詞：

```kotlin
val logger: LoggerDataSource by inject(named("InMemoryLogger"))
```

也可以建立自訂的限定詞註解。使用前面的範例：

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

## 使用 @InjectedParam 的注入參數

您可以將建構函式成員標記為「注入參數」，這意味著在呼叫解析時，該相依性將被傳入圖中。

例如：

```kotlin
@Single
class MyComponent(@InjectedParam val myDependency : MyDependency)
```

然後您可以呼叫您的 `MyComponent` 並傳入 `MyDependency` 的執行個體：

```kotlin
val m = MyDependency()
// 解析 MyComponent 的同時傳入 MyDependency
koin.get<MyComponent> { parametersOf(m) }
```

產生的 DSL 等效項將是 `single { params -> MyComponent(params.get()) }`

## 注入延遲相依性 - `Lazy<T>`

Koin 可以自動偵測並解析延遲相依性。例如在這裡，我們想要延遲解析 `LoggerDataSource` 定義。您只需使用 Kotlin 的 `Lazy` 型別如下：

```kotlin
@Single
class LoggerInMemoryDataSource : LoggerDataSource

@Single
class LoggerAggregator(val lazyLogger : Lazy<LoggerDataSource>)
```

在背後，它會產生類似使用 `inject()` 而非 `get()` 的 DSL：

```kotlin
single { LoggerAggregator(inject()) }
```

## 注入相依性清單 - `List<T>`

Koin 可以自動偵測並解析相依性清單。例如在這裡，我們想要解析所有的 `LoggerDataSource` 定義。您只需使用 Kotlin 的 `List` 型別如下：

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

在背後，它會產生類似使用 `getAll()` 函式的 DSL：

```kotlin
single { LoggerAggregator(getAll()) }
```

## 使用 @Property 的屬性

要在您的定義中解析 Koin 屬性，只需使用 `@Property` 標記建構函式成員。這將根據傳遞給註解的值來解析 Koin 屬性：

```kotlin
@Factory
public class ComponentWithProps(
    @Property("id") public val id : String
)
```

產生的 DSL 等效項將是 `factory { ComponentWithProps(getProperty("id")) }`

### @PropertyValue - 具有預設值的屬性 (自 1.4 起)

Koin 註解讓您能夠直接從程式碼中使用 `@PropertyValue` 註解為屬性定義預設值。
讓我們接著看範例：

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

產生的 DSL 等效項將是 `factory { ComponentWithProps(getProperty("id", ComponentWithProps.DEFAULT_ID)) }`

## JSR-330 相容性註解

Koin 註解透過 `koin-jsr330` 模組提供 JSR-330 (Jakarta Inject) 相容註解。這些註解對於從其他 JSR-330 相容架構（如 Hilt、Dagger 或 Guice）遷移的開發人員特別有用。

### 設定

將 `koin-jsr330` 相依性加入到您的專案：

```kotlin
dependencies {
    implementation "io.insert-koin:koin-jsr330:$koin_version"
}
```

### 可用的 JSR-330 註解

#### @Singleton (jakarta.inject.Singleton)

JSR-330 標準 singleton 註解，等同於 Koin 的 `@Single`：

```kotlin
import jakarta.inject.Singleton

@Singleton
class DatabaseService
```

這會產生與 `@Single` 相同的結果——Koin 中的一個 singleton 執行個體。

#### @Named (jakarta.inject.Named)

用於基於字串的限定詞的 JSR-330 標準限定詞註解：

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

JSR-330 標準注入註解。雖然 Koin 註解不需要明確標記建構函式，但為了 JSR-330 相容性可以使用 `@Inject`：

```kotlin
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class UserService @Inject constructor(
    private val repository: UserRepository
)
```

#### @Qualifier (jakarta.inject.Qualifier)

用於建立自訂限定詞註解的元註解 (Meta-annotation)：

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

// 搭配 Koin 的作用域系統使用
@Scope(name = "request") 
@RequestScoped
class RequestProcessor
```

### 混合使用

您可以在同一個專案中自由混合使用 JSR-330 註解與 Koin 註解：

```kotlin
// JSR-330 風格
@Singleton
@Named("primary")
class PrimaryDatabase : Database

// Koin 風格  
@Single
@Named("secondary")
class SecondaryDatabase : Database

// 在同一個類別中混合使用
@Factory
class DatabaseManager @Inject constructor(
    @Named("primary") private val primary: Database,
    @Named("secondary") private val secondary: Database  
)
```

### 架構遷移的好處

使用 JSR-330 註解為架構遷移提供了多項優點：

- **熟悉的 API**：來自 Hilt、Dagger 或 Guice 的開發人員可以使用已知的註解
- **漸進式遷移**：現有的 JSR-330 註解程式碼僅需極少變動即可運作
- **標準合規**：遵循 JSR-330 可確保與相依注入標準的相容性
- **團隊引導**：對於熟悉其他 DI 架構的團隊來說更容易上手

:::info
Koin 中的 JSR-330 註解產生的底層 DSL 與對應的 Koin 註解相同。選擇 JSR-330 還是 Koin 註解純粹是風格問題，並取決於團隊偏好或遷移需求。
:::