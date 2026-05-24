---
title: 編譯期安全性
---

Koin 外掛程式會在編譯期驗證您的相依性圖表 — 在應用程式執行前攔截缺失的相依性、限定符不比對以及損毀的呼叫點。

這取代了 `verify()` 和 `checkModules()` 等執行時驗證工具。只要能通過編譯，就能正常運作。

## 運作原理

外掛程式在編譯期間會從三個層級驗證您的圖表：

### A2 — 每個模組（早期回饋）

每個模組的定義都會針對可見的定義進行檢查：其自身的定義、明確包含的模組，以及 `@Configuration` 同級模組。

```kotlin
@Module(includes = [DataModule::class])
@ComponentScan("app")
class AppModule
// 驗證：來自 AppModule + DataModule 的定義
```

共享同一個 `@Configuration` 標籤的模組是相互可見的：

```kotlin
@Module @ComponentScan("core") @Configuration("prod")
class CoreModule  // 提供 Repository

@Module @ComponentScan("service") @Configuration("prod")
class ServiceModule  // Service(repo: Repository) → OK，從 CoreModule 可見
```

不同的標籤則是隔離的：

```kotlin
@Configuration("core")
class CoreModule

@Configuration("service")  // 標籤不同 — CoreModule 不可見
class ServiceModule         // Service(repo: Repository) → 錯誤
```

**A2 攔截的內容：**

- 缺失的相依性
- 限定符不比對（請求 `@Named("prod")` 但僅提供 `@Named("test")`）
- 跨作用域違規
- `Lazy<T>` 但未提供 `T`
- 未標記為 `@Provided` 的外部相依性

### A3 — 完整圖表（完整保證）

在 `startKoin<T>()` 處，來自所有來源的所有模組都會被組合，並驗證完整的圖表。A2 無法看到的內容 — 跨模組相依性、來自 JAR 的定義 — 都會在此處進行檢查。

```kotlin
@KoinApplication(modules = [CoreModule::class, ServiceModule::class])
object MyApp

startKoin<MyApp> { }
// 驗證：結合 CoreModule + ServiceModule 的「所有」定義
```

當 DSL 定義（`single<T>()`、`factory<T>()` 等）是圖表的一部分時，A3 也會對其進行驗證。

### A4 — 呼叫點驗證

程式碼庫中的每個 `koinViewModel<T>()`、`get<T>()`、`inject<T>()` 呼叫都會被攔截。外掛程式會擷取目標型別、檔案、行號和欄位 — 然後檢查 `T` 是否存在於組合後的圖表中。

```kotlin
@Composable
fun UserScreen() {
    val viewModel: UserViewModel = koinViewModel()  // ← A4 驗證此處
}

class MyFragment : Fragment() {
    val service: PaymentService by inject()  // ← A4 驗證此處
}
```

如果 `UserViewModel` 不在圖表中 → 拋出包含精確檔案、行號和欄位的組建錯誤。

**跨模組呼叫點：** 如果功能模組呼叫了 `koinViewModel<T>()` 但不具備完整圖表的可見性，外掛程式會產生呼叫點提示。當應用程式模組編譯時，它會從相依性 JAR 中發現這些提示，並根據完整圖表對其進行驗證。

## 驗證內容

| 場景 | 結果 |
|----------|--------|
| 非可 null 參數，無定義 | **錯誤** |
| 可 null 參數 (`T?`)，無定義 | OK — 使用 `getOrNull()` |
| 具有預設值的參數，無定義 | OK — 使用 Kotlin 預設值（當 `skipDefaultValues=true` 時） |
| `@InjectedParam`，無定義 | OK — 執行時透過 `parametersOf()` 提供 |
| `@Property("key")` 參數 | OK — 屬性注入（若無 `@PropertyValue` 預設值則會發出警告） |
| `List<T>` 參數 | OK — 若無則 `getAll()` 回傳空清單 |
| `Lazy<T>`，無 `T` 的定義 | **錯誤** — 解開包裝以驗證內部型別 |
| `@Named("x")` 參數，無匹配的限定符 | **錯誤** — 若存在無限定符的繫結則提供提示 |
| 來自錯誤作用域的限定範圍相依性 | **錯誤** |
| 帶有 `@Named` 限定符的預設值參數 | **錯誤** — 限定符會強制進行注入 |
| `@Provided` 型別或參數，無定義 | OK — 執行時由外部提供 |
| `@ScopeId(name = "x")` 參數 | OK — 執行時從具名作用域解析 |
| `Scope` 型別參數 | OK — 直接傳遞作用域接收者 |
| Android 架構型別（例如 `Context`） | OK — 硬編碼白名單 |
| 循環相依 (A → B → A) | **錯誤** — 在 A2/A3 圖表遍歷期間偵測到 |

## 使用註解確保安全性

標註您的類別，將它們組織在模組中，編譯器就會驗證一切：

```kotlin
@Singleton
class Database

@Singleton
class UserRepository(private val db: Database)

@KoinViewModel
class UserViewModel(private val repo: UserRepository) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

外掛程式透過 `@ComponentScan` 發現標註的類別，在 A2 驗證每個模組的定義，並在您宣告應用程式進入點時在 A3 驗證完整圖表：

```kotlin
@KoinApplication(modules = [AppModule::class])
object MyApp

startKoin<MyApp> { }  // ← 觸發 A3 完整圖表驗證
```

同時也支援**頂層函式**。標註的頂層函式會由 `@ComponentScan` 發現，並像類別定義一樣進行驗證：

```kotlin
@Singleton
fun provideDatabase(): DatabaseService = PostgresDatabase()

@Factory
fun provideCache(db: DatabaseService): CacheService = RedisCache(db)
// ← 驗證通過：DatabaseService 存在
```

使用 `@Configuration` 標籤將模組組織成一組進行共同驗證：

```kotlin
@Module @ComponentScan("core") @Configuration("prod")
class CoreModule

@Module @ComponentScan("feature") @Configuration("prod")
class FeatureModule  // 可見 CoreModule 的定義
```

## 使用 DSL 確保安全性

編譯器外掛程式也會驗證 DSL 定義。當您撰寫 `single<T>()`、`factory<T>()` 或 `viewModel<T>()` 時，外掛程式會攔截該呼叫，自動裝配建構函式，並驗證所有參數：

```kotlin
val appModule = module {
    single<Database>()
    single<UserRepository>()       // ← 驗證通過：Database 存在
    viewModel<UserViewModel>()     // ← 驗證通過：UserRepository 存在
}
```

不需要手動呼叫 `get()` — 外掛程式會產生它們並同時進行驗證。

`create(::T)` 函式也會被驗證。它呼叫一個函式參考（通常是 builder 函式，但也可以是建構函式）並驗證其所有參數：

```kotlin
fun buildUserRepository(db: Database): UserRepository = UserRepository(db)

val appModule = module {
    scope<UserSession> {
        scoped { create(::buildUserRepository) }  // ← 驗證通過：Database 存在
    }
}
```

DSL 定義會參與 A3 驗證（完整圖表）和 A4 驗證（呼叫點）。如果您使用 `startKoin { modules(appModule) }`，外掛程式會根據組合後的圖表驗證所有 DSL 定義。

## 兩種風格結合使用

您可以在同一個專案中混合使用註解和 DSL。兩者都會被收集到同一個驗證圖表中：

```kotlin
// 註解
@Singleton class Database

// DSL
val featureModule = module {
    single<UserRepository>()  // ← 驗證通過：來自註解的 Database 是可見的
}
```

## 錯誤訊息

錯誤會報告缺失的型別、需要該型別的定義，以及所在的模組：

```
[Koin] Missing dependency: Repository
  required by: Service (parameter 'repo')
  in module: ServiceModule
```

當存在不同限定符的繫結時，會顯示提示：

```
[Koin] Missing dependency: NetworkClient (qualifier: @Named("http"))
  required by: ApiService (parameter 'client')
  in module: AppModule
  Hint: Found NetworkClient without qualifier — did you mean to add @Named("http")?
```

呼叫點錯誤包含確切位置：

```
[Koin] Missing definition: com.app.UserRepository
  resolved by: koinViewModel<UserViewModel>()
  No matching definition found in any declared module.
  → file: UserScreen.kt, line: 12, column: 5
```

## 禁止的定義

某些回傳型別永遠無法透過 Koin 進行有意義的解析，因此在編譯期會被拒絕：

### KOIN-D007：`@Factory` 回傳 suspend `fun interface`

回傳繼承自 suspend `fun interface` 型別的 `@Factory` 無法透過 Koin 的同步 `get<T>()` API 調用。外掛程式會在編譯期阻斷此行為。

```kotlin
fun interface AsyncTask { suspend operator fun invoke(): Result }

@Factory
fun provideTask(): AsyncTask = AsyncTask { ... }
// KOIN-D007 — 錯誤：@Factory 回傳型別不能繼承 suspend fun interface
```

請重構為一般介面，或透過具有 suspend 方法的類別公開 suspend 作業。

## 泛型 DSL 型別

執行時 Koin 會在**抹除後的原始類別（erased raw class）**上解析定義 — 型別參數不是查閱鍵（lookup key）的一部分。編譯安全性遵循此原則：`get<Box<X>>()` 呼叫會針對圖表中的任何 `Box<*>` 提供者進行驗證，而兩個 `single<Box<A>>()` / `single<Box<B>>()` 宣告會發生衝突（原始類別相同，且無限定符）。

```kotlin
class Box<T>(val value: T)

val appModule = module {
    single { Box(42) }   // 註冊為 Box (raw)
}

koin.get<Box<Int>>()    // → 回傳單一的 Box 註冊
koin.get<Box<String>>() // → 回傳同一個註冊（型別抹除）
```

在原始類別上驗證也避免了 Kotlin/Native klib 簽章修飾（signature mangling）失敗的問題，該問題以前在 DSL 定義攜帶未替換的型別參數時會導致 iOS 組建崩潰。

### 區分泛型執行個體：泛型參數上的型別限定符

當同一個泛型類別的多個執行個體必須共存時，慣用的模式是註冊一個**具體的包裝型別**，並使用**衍生自泛型參數的型別限定符** — `named<T>()`。這正是 `koin-compose-navigation3` 在內部將每個導航路線與其路線型別關聯時所做的：

```kotlin
inline fun <reified T : Any> Module.navigation(
    noinline definition: @Composable Scope.(T) -> Unit,
): KoinDefinition<EntryProviderInstaller> {
    // 註冊一個「具體」型別 (EntryProviderInstaller)，
    // 透過衍生自泛型參數 T 的型別限定符進行區分。
    return _singleInstanceFactory<EntryProviderInstaller>(named<T>(), { ... })
}
```

用於兩端：

```kotlin
// 宣告 — T 是一個具體型別 (HomeRoute, SettingsRoute, ...)
module {
    navigation<HomeRoute> { route -> HomeScreen() }
    navigation<SettingsRoute> { route -> SettingsScreen() }
}

// 解析 — 使用相同的型別限定符作為查閱鍵
koin.get<EntryProviderInstaller>(named<HomeRoute>())
```

`named<T>()` 從具現化（reified）的 `T` 產生型別限定符，因此每個泛型具現化都會獲得一個穩定且唯一的限定符。執行時 Koin 會匹配（原始類別 + 限定符），這重新引入了型別抹除所移除的辨別能力。

每當您需要區分泛型具現化時，請優先使用此模式而非直接使用 `single<Box<X>>()`。

## 作用域參數注入

型別為 `org.koin.core.scope.Scope` 的參數會自動被注入作用域接收者 — 不需要註解。驗證會被跳過，因為注入作用域可以進行動態查閱。

```kotlin
@Scoped
class ScopedService(val scope: Scope) {
    fun dynamicLookup() = scope.get<SomeDep>()
}
// 產生：ScopedService(scope)  — 直接傳遞作用域接收者
```

## 具名作用域解析：`@ScopeId`

使用 `@ScopeId` 從具名的 Koin 作用域（而非目前作用域）解析相依性。驗證會被跳過，因為作用域是在執行時解析的。

```kotlin
@Factory
class ProfileService(@ScopeId(name = "user_session") val session: UserSession)
// 產生：ProfileService(scope.getScope("user_session").get<UserSession>())
```

`@ScopeId` 支援兩種形式：

| 形式 | 範例 | 作用域 ID |
|------|---------|----------|
| 字串名稱 | `@ScopeId(name = "user_session")` | `"user_session"` |
| 型別參考 | `@ScopeId(UserSessionScope::class)` | 完整限定類名 |

## 屬性驗證

`@Property("key")` 參數是從 Koin 屬性（透過啟動時的 `properties()` 設定）中解析。當不存在 `@PropertyValue("key")` 預設值時，外掛程式會在編譯期發出警告：

```kotlin
@PropertyValue("api.timeout")
val defaultTimeout = 30

@Factory
class ApiClient(@Property("api.timeout") val timeout: Int)
// OK — @PropertyValue("api.timeout") 提供編譯期預設值

@Factory
class Other(@Property("missing.key") val value: String)
// 警告 — 找不到 @PropertyValue("missing.key")
// （仍可編譯 — 屬性可能在執行時提供）
```

## 外部型別：`@Provided`

某些型別是由平台或外部架構在執行時提供的，且永遠不會宣告為 Koin 定義。請使用 `@Provided` 標記它們以跳過驗證。

`@Provided` 可用於**類別**（所有用法均跳過驗證）及**參數**（僅該參數跳過）：

```kotlin
// 用在類別上 — 該型別的所有用法皆跳過驗證
@Provided
class SavedStateHandle

// 用在參數上 — 僅此參數跳過驗證
@Singleton
class MyViewModel(@Provided val handle: SavedStateHandle)
```

**何時使用 `@Provided`：**

- 不在白名單中的 **Android 架構型別** — 例如，自訂 Android 服務
- 外部注入的 **第三方 SDK 型別** — 例如，Firebase、分析 SDK
- **來自非 Koin 模組的跨模組型別** — 當相依性來自不使用 Koin 的程式庫時
- **測試替身** — 在測試配置中取代真實實作時
- **手動提供的型別** — `androidContext()`、手動 `single { }` 註冊

```kotlin
// 外部 SDK — 不受 Koin 管理
@Singleton
class AnalyticsService(@Provided val firebaseAnalytics: FirebaseAnalytics)

// 跨模組：執行時由另一個團隊的模組提供
@Factory
class PaymentProcessor(@Provided val paymentGateway: PaymentGateway)
```

**常見的 Android 架構型別會自動列入白名單**，不需要 `@Provided`：

- `android.content.Context`
- `android.app.Application`
- `android.app.Activity`
- `androidx.fragment.app.Fragment`
- `androidx.lifecycle.SavedStateHandle`
- `androidx.work.WorkerParameters`

## 預設值與 skipDefaultValues

當啟用 `skipDefaultValues` 時（預設），具有 Kotlin 預設值的參數會使用該預設值，而不是從 DI 容器中解析：

```kotlin
// 當 skipDefaultValues = true (預設值)：
@Singleton
class ServiceWithDefault(val timeout: Int = 5000)
// → 使用 Kotlin 預設值 (5000)，不進行 DI 解析

// 可 null 參數仍會被注入：
@Singleton
class Service(val dep: Dependency? = null)
// → 使用來自 DI 的 getOrNull()

// 標註過的參數一律使用 DI，無論是否有預設值：
@Singleton
class Service(@Named("custom") val name: String = "fallback")
// → 使用 @Named("custom") 限定符從 DI 解析

// 混合使用：部分來自 DI，部分來自預設值
@Singleton
class ApiClient(
    val repo: UserRepository,                        // → 從 DI 解析
    val timeout: Int = 30_000,                       // → 使用 Kotlin 預設值
    @Property("api_url") val url: String = "https://api.example.com"  // → 從 DI 解析（已標註）
)
```

將 `skipDefaultValues = false` 設定為一律從 DI 容器注入所有參數，忽略 Kotlin 預設值。

## 配置

編譯期安全性預設為啟用。若要停用：

```kotlin
koinCompiler {
    compileSafety = false  // 停用編譯期安全性檢查
}
```

其他相關選項：

```kotlin
koinCompiler {
    compileSafety = true       // 編譯期相依性驗證（預設：true）
    strictSafety = true        // 強制聚合器（aggregator）的安全性階段在每次組建時重新執行
                               // （預設：在具有 startKoin / @KoinApplication 的模組上自動偵測）
    skipDefaultValues = true   // 跳過具有預設值參數的注入（預設：true）
    unsafeDslChecks = true     // 驗證 create() 是 lambda 中唯一的指令（預設：true）
}
```

:::info 增量編譯與 `strictSafety`
完整圖表階段 (A3) 僅在聚合器的 `compileKotlin` 中執行。K2 下的 Kotlin 增量編譯不會追蹤 `module { }` lambda 主體內部的 DSL 變更，也不會追蹤新加入 `@ComponentScan` 套件的類別 — 因此即使圖表已變更，聚合器仍可能被標記為 UP-TO-DATE。外掛程式會在偵測到的聚合器模組上自動啟用 [`strictSafety`](/docs/reference/koin-annotations/options#strictsafety) 以強制 A3 重新執行；程式庫和功能模組則保持完全增量。
:::

## 從 verify() / checkModules() 遷移

編譯器外掛程式取代了執行時驗證。您可以移除驗證測試：

| 之前 | 之後 |
|--------|-------|
| 測試中的 `module.verify()` | 編譯器外掛程式（自動） |
| 測試中的 `checkModules()` | 編譯器外掛程式（自動） |
| 執行時驗證 | 編譯期驗證 |
| 手動測試設定 | 不需要測試程式碼 |

編譯器會在每次組建時進行驗證 — 不需要測試程式碼。

## 另請參閱

- **[編譯器外掛程式選項](/docs/reference/koin-annotations/options)** - 所有配置選項
- **[編譯器外掛程式設定](/docs/setup/compiler-plugin)** - 安裝指南
- **[從註解開始](/docs/reference/koin-annotations/start)** - 入門指南
- **[Playground 應用程式](https://github.com/InsertKoinIO/koin-compiler-plugin/tree/main/playground-apps)** - 包含註解 (`app-annotations/`) 和 DSL (`app-dsl/`) 方法的完整參考應用程式