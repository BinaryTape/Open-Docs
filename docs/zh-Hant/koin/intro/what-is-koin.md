---
title: 什麼是 Koin？
---

# 什麼是 Koin？

### 務實的 Kotlin 相依注入架構 – 既簡單又強大

Koin 是一款專為 Kotlin 設計的輕量級相依注入架構。與依賴程式碼產生或反射的傳統 DI 架構不同，Koin 提供兩種同樣強大的方法：純淨的 **Kotlin DSL** 以及直覺的 **註解**。您可以根據團隊需求進行選擇——兩者都是一等公民。

## Koin 的核心價值

| 價值 | 意義 |
|-------|---------------|
| **高效** | 易於學習，易於撰寫。在幾分鐘內完成 DI 設定，而非數小時 |
| **開發者友善** | DSL 或註解任君選擇。錯誤訊息清晰、偵錯容易，提供最佳的 DX |
| **可擴充性** | 為具有複雜相依圖的大型企業應用程式提供支援 |
| **安全** | 透過 Koin Compiler Plugin 確保編譯期安全性 |
| **動態** | 執行時彈性：動態載入模組、延遲載入、功能切換 (feature flags) |

## 為什麼開發者喜愛 Koin

- **幾分鐘內上手** – 沒有概念複雜的概念，只有直覺的 DSL 與簡單的註解
- **撰寫更少程式碼** – 無論是 DSL 或註解，Compiler Plugin 都會自動裝配相依項
- **選擇您的風格** – 為 Kotlin 純粹主義者提供 DSL，為熟悉模式的開發者提供註解 – 兩者同樣強大
- **輕鬆偵錯** – 清晰的錯誤訊息，無需追蹤產生的程式碼
- **自信地擴大規模** – 已被全球企業應用於生產環境
- **保持安全** – 編譯期驗證可在執行前擷取錯誤
- **保持彈性** – 基於執行時但效能優異。支援動態模組、延遲載入與功能切換
- **IDE 支援** – 適用於 Android Studio 和 IntelliJ IDEA 的官方外掛程式 — 支援跳轉到定義、即時安全檢查與圖形化視覺化

## 兩種風格，一個架構 – 兩者同樣強大

Koin 支援兩種定義相依項的風格。兩者都是一等公民，功能完全對等。請選擇最適合您團隊的一種：

### DSL 風格

使用 Kotlin DSL 語法定義相依項：

```kotlin
val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

### 註解風格

使用註解定義相依項：

```kotlin
@Singleton
class Database

@Singleton
class ApiClient

@Singleton
class UserRepository(
    private val database: Database,
    private val apiClient: ApiClient
)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

這兩種風格都由 **Koin Compiler Plugin** 處理，以確保編譯期安全性。

## Koin 的註解更簡單

如果您使用過 Hilt 或 Dagger，您會發現 Koin 註解所需的繁瑣手續較少：

| 任務 | Koin | Hilt |
|------|------|------|
| **Singleton** | `@Singleton class MyService` | `@Singleton class MyService @Inject constructor(...)` |
| **介面繫結** | 自動（只需實作介面） | 需要在抽象模組中使用 `@Binds` |
| **組件掃描** | `@ComponentScan("package")` | 不提供 |
| **模組探索** | `@Configuration` - 自動探索 | 每個模組需手動使用 `@InstallIn` |

**範例比較：**

```kotlin
// KOIN - 就這樣！
@Singleton
class MyRepository(val api: ApiService)

@Module
@ComponentScan("com.app")
class AppModule
```

```kotlin
// HILT - 更多繁瑣手續
@Singleton
class MyRepository @Inject constructor(val api: ApiService)

@Module
@InstallIn(SingletonComponent::class)
abstract class AppModule {
    @Binds
    abstract fun bindRepository(impl: MyRepository): Repository
}
```

## 由 Koin Compiler Plugin 提供支援

**Koin Compiler Plugin** 是所有新專案使用 Koin 的推薦方式：

- **原生 Kotlin 編譯器外掛程式 (K2)** – 並非 KSP，而是直接與編譯器整合
- **自動偵測建構函式參數** – 減少手動裝配
- **編譯期安全性** – 在建置期間擷取錯誤
- **同時支援 DSL 與註解** – 任君選擇
- **設定簡單** – 一個 Gradle 外掛程式

### 使用 Compiler Plugin 獲得更簡潔的語法

| 經典 DSL | Compiler Plugin DSL |
|-------------|---------------------|
| `singleOf(::MyService)` | `single<MyService>()` |
| `single { MyService(get(), get()) }` | `single<MyService>()` |
| `factoryOf(::MyRepo)` | `factory<MyRepo>()` |
| `viewModelOf(::MyVM)` | `viewModel<MyVM>()` |

在 [Koin Compiler Plugin](/docs/intro/koin-compiler-plugin) 中了解更多資訊。

## 經典 DSL（完全支援）

經典 DSL 在所有 Kotlin 版本中仍受到完全支援：

```kotlin
val appModule = module {
    singleOf(::Database)
    singleOf(::ApiClient)
    singleOf(::UserRepository)
    viewModelOf(::UserViewModel)
}
```

或使用明確裝配：

```kotlin
val appModule = module {
    single { Database() }
    single { ApiClient() }
    single { UserRepository(get(), get()) }
    viewModel { UserViewModel(get()) }
}
```

:::info
經典 DSL 並未棄用。Koin 與其完美搭配。當您準備好遷移時，Compiler Plugin 會在此基礎上加入編譯期分析。
:::

## Koin Annotations 現在是 Koin 專案的一部分

`koin-annotations` 程式庫 — 包括 `@Singleton`、`@Factory`、`@KoinViewModel`、`@Module`、`@ComponentScan` 等 — 隨主要 Koin 版本發行並受到完全支援。它**並未**被棄用。

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-core")
    implementation("io.insert-koin:koin-annotations") // 相同的 Koin 版本
}
```

您的註解將由 **Koin Compiler Plugin** 處理 — 請參閱 [Koin Compiler Plugin](/docs/intro/koin-compiler-plugin) 和 [Annotations 參考](/docs/reference/koin-annotations/start)。

## Koin KSP Compiler 已棄用，建議改用 Koin Compiler Plugin

:::info
舊有的 KSP 處理器 `koin-ksp-compiler` 已**棄用**，並將在未來的 Koin 版本中移除。替代方案是 **Koin Compiler Plugin** — 原生 K2 編譯器整合、無產生檔案、更簡單的 KMP 設定。
:::

如果您正在搭配 `koin-ksp-compiler` 使用 Koin Annotations，請遷移至 Compiler Plugin：

- **相同的註解** — 無需更改程式碼
- **更好的處理** — 原生編譯器整合，無產生檔案
- **更簡單的設定** — 無需 KSP 配置

請參閱[從 KSP 遷移至 Compiler Plugin](/docs/migration/from-ksp-to-compiler-plugin)。

## 執行時 + 編譯安全 = 兩全其美

Koin 是**基於執行時，但具備高效能且編譯安全**。這種獨特的結合實現了：

**編譯期安全性**（搭配 Compiler Plugin）：
- 在建置期間驗證您的相依圖
- 自動偵測建構函式參數
- 在執行前擷取缺失的相依項

**執行時彈性**（僅限編譯期的架構無法提供）：
- 動態模組載入/卸載
- 延遲模組載入（背景）
- 功能切換 (feature flag) 驅動的注入
- 外掛程式架構
- 使用不同實作進行 A/B 測試

```kotlin
// 動態模組載入 - Hilt 無法實現
if (featureEnabled) {
    loadKoinModules(premiumFeatureModule)
}

// 之後，如果功能停用
unloadKoinModules(premiumFeatureModule)
```

## Koin 適合誰？

Koin 是以下對象的理想選擇：

- **重視生產力的團隊** – 更少的樣板程式碼，更快的開發速度
- **想要比 Hilt/Dagger 更簡潔 DI 的 Android 開發者**
- **Kotlin 多平台專案** – Android、iOS、桌面、Web、後端
- **需要擴大規模的企業專案**
- **任何認為 DI 不應該複雜的人**

## 後續步驟

- **[什麼是相依注入？](/docs/intro/what-is-dependency-injection)** – 學習 DI 基礎知識
- **[Koin Compiler Plugin](/docs/intro/koin-compiler-plugin)** – 推薦的做法
- **[設定指南](/docs/setup/gradle)** – 將 Koin 新增至您的專案
- **[教學](/docs/tutorials/your-first-app)** – 使用 Koin 建立您的第一個應用程式