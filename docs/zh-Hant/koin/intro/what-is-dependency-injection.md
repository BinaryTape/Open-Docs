---
title: 什麼是相依注入？
---

# 什麼是相依注入？

相依注入 (Dependency Injection, DI) 是一種設計模式，物件從外部來源接收其相依項，而不是在內部建立它們。這促進了鬆散耦合、更好的測試性以及更整潔的程式碼架構。

## 什麼是相依項？

相依項是另一個物件運作所需的任何物件。例如，`Car` 需要 `Engine` 才能行駛。

### 未使用相依注入

```kotlin
class Engine {
    fun start() {
        println("Engine starting...")
    }
}

class Car {
    private val engine = Engine()  // Car 建立自己的 engine

    fun drive() {
        engine.start()
        println("Car is driving")
    }
}
```

**此方法的缺點：**
- `Car` 與特定的 `Engine` 實作緊密耦合
- 難以獨立測試 `Car`
- 難以更換引擎類型（電動、柴油等）
- `Car` 控制 `Engine` 的生命週期

### 使用相依注入

```kotlin
class Car(private val engine: Engine) {  // Engine 已注入
    fun drive() {
        engine.start()
        println("Car is driving")
    }
}

// 現在我們可以輕鬆提供不同的引擎
val gasolineCar = Car(GasEngine())
val electricCar = Car(ElectricEngine())
```

**優點：**
- `Car` 不知道 `Engine` 是如何建立的
- 易於使用模擬 (mock) 引擎進行測試
- 靈活 - 可以更換實作
- 在建構函式中可以清楚看到相依項

## 提供相依項的三種方式

### 1. 建構函式注入 (推薦)

相依項透過建構函式傳遞：

```kotlin
class UserRepository(
    private val database: Database,
    private val apiClient: ApiClient
) {
    fun getUser(id: String): User {
        return database.query(id) ?: apiClient.fetchUser(id)
    }
}
```

**優點：**
- 相依項是明確且必要的
- 不可變（使用 `val`）
- 易於測試
- 清楚的相依圖

**使用 Koin：**

```kotlin
val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()  // Koin 自動連接相依項
}
```

:::info
建構函式注入是 Koin 中 **首選的方法**。它使您的程式碼具備測試性，且在單元測試中不需要 Koin。
:::

### 2. 欄位注入

相依項被注入到類別屬性中：

```kotlin
class UserActivity : AppCompatActivity() {
    // 延遲注入 - 在第一次存取時建立執行個體
    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewModel.loadUser()  // ViewModel 執行個體在此處建立
    }
}
```

**何時使用：**
- 您無法控制建構過程的 Android 架構類別（Activity, Fragment, Service）
- 當無法使用建構函式注入時

**使用 Koin：**

```kotlin
// 延遲注入
val presenter: Presenter by inject()

// 立即注入
val presenter: Presenter = get()
```

### 3. 方法注入

相依項透過方法傳遞（較不常見）：

```kotlin
class ReportGenerator {
    fun generateReport(data: DataSource) {
        // 使用 data 產生報告
    }
}
```

**何時使用：**
- 選用相依項
- 在物件生命週期內會變動的相依項
- 回呼 (callback) 模式

## 手動 vs 自動化相依注入

### 手動 DI 的問題

隨著應用程式成長，手動管理相依項會變得複雜：

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 手動建立整個相依圖
        val database = Database()
        val apiClient = ApiClient()
        val userRepository = UserRepository(database, apiClient)
        val authRepository = AuthRepository(database, apiClient)
        val userService = UserService(userRepository, authRepository)
        val viewModel = UserViewModel(userService)

        // 終於可以使用 viewModel...
    }
}
```

**問題：**
- 在不同的 Activity/Fragment 之間重複程式碼
- 容易在相依順序上出錯
- 隨著應用程式成長而難以維護
- 難以管理生命週期（單例 (singleton)、作用域物件）
- 沒有集中化的配置

### 容器模式 (手動方法)

開發人員通常會建立一個容器來集中管理物件建立：

```kotlin
object AppContainer {
    private val database by lazy { Database() }
    private val apiClient by lazy { ApiClient() }

    val userRepository by lazy { UserRepository(database, apiClient) }
    val authRepository by lazy { AuthRepository(database, apiClient) }

    fun createUserViewModel() = UserViewModel(
        UserService(userRepository, authRepository)
    )
}

// 使用方式
class MainActivity : AppCompatActivity() {
    private val viewModel = AppContainer.createUserViewModel()
}
```

**仍然存在的問題：**
- 手動連接相依項
- 沒有自動化的生命週期管理
- 全域狀態（單例容器）
- 對於複雜的圖結構仍然需要重複操作

### Koin 如何解決此問題

Koin 提供自動化的相依解析，您可以選擇使用 **DSL 或註解**：

```kotlin
// 定義一次相依項
val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()
    single<AuthRepository>()
    single<UserService>()
    viewModel<UserViewModel>()
}

// 啟動一次 Koin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            modules(appModule)
        }
    }
}

// 在任何地方使用 - Koin 處理整個相依圖
class MainActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModel()
    // 就這樣！Koin 會建立 UserViewModel 及其所有相依項
}
```

**Koin 的優點：**
- 宣告式相依配置
- 自動相依解析
- 生命週期管理（單例、工廠、作用域）
- 型別安全的注入
- 易於測試和模組替換

## 自動化 DI 解決方案

自動化相依注入有不同的方法：

| 方法 | 範例 | 運作方式 |
|----------|----------|--------------|
| **基於反射** | (較舊的架構) | 在執行期使用反射 |
| **程式碼產生** | Dagger, Hilt | 在編譯期產生程式碼（註解處理） |
| **編譯器外掛程式** | Koin Compiler Plugin | 針對 DSL 與註解的原生編譯器整合 |
| **基於 DSL** | Koin (經典版) | 執行期 DSL 配置 |

**Koin 的方法 - DSL 與註解，兩者同樣強大：**
- **DSL 風格：** 簡潔的 Kotlin DSL 配置 (`single<MyService>()`, `viewModel<MyVM>()`)
- **註解風格：** 熟悉的註解 (`@Singleton`, `@KoinViewModel`)
- 兩者皆由同一個編譯器外掛程式提供支援，以確保編譯期安全性
- 無反射，輕量級
- 選擇適合您團隊的風格

## 服務定位器 vs 相依注入

了解兩者的區別非常重要：

### 服務定位器模式 (Service Locator Pattern)

組件主動從註冊表中請求相依項：

```kotlin
class UserService : KoinComponent {
    private val repository: UserRepository by inject()  // 「拉取」相依項
}
```

### 相依注入模式 (Dependency Injection Pattern)

相依項從外部提供：

```kotlin
class UserService(
    private val repository: UserRepository  // 「推送」到組件中
)
```

### 比較

| 面向 | 服務定位器 | 相依注入 |
|--------|----------------|---------------------|
| 相依項可見性 | 隱藏在類別內部 | 在建構函式中明確顯示 |
| 測試 | 需要架構支援 | 容易 - 傳入測試替身 |
| 耦合 | 依賴於容器 | 依賴於介面 |
| 在 Koin 中的用法 | `get()`, `by inject()` | 配合 Koin 模組使用建構函式 |
| 最佳用途 | Android 架構類別 | 商業邏輯、服務 |

### 使用 Koin 的最佳實務

1. **商業邏輯偏好使用建構函式注入**：

```kotlin
// 良好 - 不需 Koin 即可測試
class UserViewModel(private val userService: UserService) : ViewModel()

val appModule = module {
    viewModel<UserViewModel>()  // Koin 解析相依項
}
```

2. **僅在必要時使用服務定位器**：

```kotlin
// 可接受 - Activity 的建構由 Android 控制
class UserActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModel()
}
```

3. **避免在商業邏輯中使用 `KoinComponent`**：

```kotlin
// 不良 - 難以測試
class UserService : KoinComponent {
    private val repository: UserRepository = get()
}

// 良好 - 明確的相依項
class UserService(private val repository: UserRepository)
```

## 相依注入的優點

### 1. 測試性

沒有 DI，測試會很困難：

```kotlin
class UserService {
    private val repository = UserRepository()  // 無法模擬 (mock)！
}
```

有了 DI，測試變得簡單直接：

```kotlin
class UserService(private val repository: UserRepository)

@Test
fun testGetUser() {
    val mockRepository = mockk<UserRepository>()
    val service = UserService(mockRepository)  // 完全掌控

    every { mockRepository.findUser("123") } returns testUser
    assertEquals(testUser, service.getUser("123"))
}
```

### 2. 靈活性

輕鬆更換實作：

```kotlin
val appModule = module {
    single<EmailService> { GmailService() }  // 生產環境
}

val testModule = module {
    single<EmailService> { MockEmailService() }  // 測試環境
}
```

### 3. 程式碼組織

集中化的相依配置：

```kotlin
val dataModule = module {
    single<Database>()
    single<ApiClient>()
}

val domainModule = module {
    single<UserRepository>()
    single<AuthRepository>()
}

val presentationModule = module {
    viewModel<UserViewModel>()
}

startKoin {
    modules(dataModule, domainModule, presentationModule)
}
```

### 4. 生命週期管理

Koin 處理物件生命週期：

```kotlin
val appModule = module {
    single<Database>()       // 整個應用程式只有一個執行個體
    factory<Presenter>()     // 每次都建立新的執行個體
    scoped<SessionData>()    // 每個作用域一個執行個體
}
```

## 總結

相依注入是一種強大的模式，它可以：
- 將組件與其相依項 **解耦**
- 透過允許替換相依項來 **提高測試性**
- 透過集中化配置 **簡化維護**
- 比起手動相依管理 **具備更好的擴展性**

Koin 透過以下方式簡化了 Kotlin 中的 DI：
- 提供 **兩種同樣強大的風格**：DSL 或註解 - 任君挑選
- 同時支援 **建構函式注入** (推薦) 與 **欄位注入** (必要時)
- 透過編譯器外掛程式提供 **編譯期安全性**
- 需要 **零反射** - 純 Kotlin 實作

## 下一步

- **[什麼是 Koin？](/docs/intro/what-is-koin)** - 了解 Koin 的方法
- **[Koin 編譯器外掛程式](/docs/intro/koin-compiler-plugin)** - 推薦且更安全的方法
- **[設定指南](/docs/setup/gradle)** - 將 Koin 加入您的專案