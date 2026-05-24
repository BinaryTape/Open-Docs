---
title: Koin 編譯器外掛程式
---

# Koin 編譯器外掛程式

**Koin 編譯器外掛程式**是所有新 Kotlin 2.x 專案的推薦做法。它是一個原生的 Kotlin 編譯器外掛程式，為 **DSL 與註解**提供支援，具備自動裝配（auto-wiring）、編譯期安全性以及更簡潔的語法。

## 什麼是編譯器外掛程式？

Koin 編譯器外掛程式是一個**原生的 Kotlin 編譯器外掛程式 (K2)** — 而非 KSP 或註解處理。它直接與 Kotlin 編譯器整合，以達成：

- **自動偵測建構函式參數** — 無需手動呼叫 `get()`
- **在編譯期轉換程式碼** — 在組建過程中擷取錯誤
- **同時支援 DSL 與註解** — 由您選擇風格
- **不產生可見檔案** — 保持專案結構簡潔

## 為什麼要使用編譯器外掛程式？

### 1. 更安全的程式碼

此外掛程式會自動偵測建構函式相依性，減少手動連線錯誤：

```kotlin
// 不使用編譯器外掛程式 - 容易出錯
val appModule = module {
    single { UserService(get(), get(), get()) }  // 希望你的順序是對的！
}

// 使用編譯器外掛程式 - 自動裝配
val appModule = module {
    single<UserService>()  // 外掛程式會偵測所有建構函式參數
}
```

### 2. 更簡潔的語法

更少的樣板程式碼，更高的可讀性：

| 經典 DSL | 編譯器外掛程式 DSL |
|-------------|---------------------|
| `singleOf(::MyService)` | `single<MyService>()` |
| `single { MyService(get(), get()) }` | `single<MyService>()` |
| `factoryOf(::MyRepo)` | `factory<MyRepo>()` |
| `viewModelOf(::MyVM)` | `viewModel<MyVM>()` |
| `scopedOf(::MyPresenter)` | `scoped<MyPresenter>()` |
| `workerOf(::MyWorker)` | `worker<MyWorker>()` |

### 3. 編譯期安全性

Koin 編譯器外掛程式為 DSL 與註解提供**編譯期相依性驗證**：

- **A2 — 每個模組：** 根據可見範圍驗證定義（早期回饋）
- **A3 — 完整圖譜：** 在 `startKoin<T>()` 時驗證完整的組裝圖譜
- **A4 — 呼叫點：** 驗證每個 `get<T>()`、`inject<T>()`、`koinViewModel<T>()` 呼叫

如果程式碼通過編譯，則每個相依性與每個注入呼叫點都已滿足。這取代了 `verify()` 與 `checkModules()` — 無需執行期測試套件。

請參閱[編譯期安全性](/docs/reference/koin-compiler/compile-safety)了解完整詳細資訊。

### 4. DSL 與註解 — 兩者同樣強大

使用您偏好的風格 — 同一個外掛程式為兩者提供相同的功能：

**DSL 風格：**
```kotlin
val appModule = module {
    single<Database>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

:::info DSL + 參數註解
使用 DSL 風格時，您仍然可以在類別上使用**參數註解**來引導外掛程式：

```kotlin
class UserPresenter(
    @InjectedParam val userId: String,      // 執行期參數
    @Named("api") val client: ApiClient,    // 限定相依性
    val repository: UserRepository          // 自動解析
)

val appModule = module {
    factory<UserPresenter>()  // 外掛程式會讀取類別中的註解
}
```

DSL 定義了相依性在**何處**註冊。參數註解則定義了它們**如何**被解析。
:::

**註解風格：**
```kotlin
@Singleton
class Database

@Singleton
class UserRepository(private val database: Database)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

## 快速入門

### 設定

將編譯器外掛程式新增至您的專案。

:::info
    請參閱 **[編譯器外掛程式設定指南](/docs/setup/compiler-plugin)** 了解詳細指示。
:::

### 使用編譯器外掛程式 DSL

從編譯器外掛程式封裝匯入：

```kotlin
import org.koin.plugin.module.dsl.*
import org.koin.dsl.module

val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

:::note
編譯器外掛程式 DSL 位於 `org.koin.plugin.module.dsl` 中。經典 DSL 仍保留在 `org.koin.dsl` 中。
:::

### 使用註解

註解的使用方式與之前相同：

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

@Module
@ComponentScan("com.myapp")
class AppModule
```

## 運作原理

編譯器外掛程式分為兩個階段運作：

### 1. FIR 階段（分析）

在前端中間表示（Frontend Intermediate Representation）階段，外掛程式會：
- 分析您的模組定義
- 偵測建構函式參數
- 驗證相依性宣告

### 2. IR 階段（轉換）

在中間表示（Intermediate Representation）階段，外掛程式會：
- 為每個參數產生正確的 `get()` 呼叫
- 處理限定符 (`@Named`)
- 處理注入參數 (`@InjectedParam`)
- 處理可 null 與 Lazy 類型

### 產生的內容

當您撰寫：

```kotlin
single<UserRepository>()
```

外掛程式會將其轉換為：

```kotlin
single { UserRepository(get(), get()) }  // 自動偵測參數
```

針對更複雜的情況：

```kotlin
// 您的程式碼
@Singleton
class MyService(
    val required: RequiredDep,
    val optional: OptionalDep?,
    @Named("special") val named: NamedDep,
    val lazy: Lazy<LazyDep>,
    @InjectedParam val param: String
)
```

外掛程式會為每種參數型別產生正確的處理方式：
- 必填 (Required)：`get()`
- 選填 (Optional)：`getOrNull()`
- 具名 (Named)：`get(named("special"))`
- 延遲 (Lazy)：`inject()`
- 注入參數 (InjectedParam)：`params.get()`

## 編譯器外掛程式 DSL 參考

### 定義類型

```kotlin
import org.koin.plugin.module.dsl.*

val appModule = module {
    // Singleton - 單一執行個體
    single<MyService>()

    // Factory - 每次都是新的執行個體
    factory<MyPresenter>()

    // Scoped - 每個作用域一個執行個體
    scope<MyActivity> {
        scoped<ActivityPresenter>()
    }

    // ViewModel
    viewModel<MyViewModel>()

    // Worker (Android WorkManager)
    worker<MyWorker>()
}
```

### 使用 `create()` 安全地建立執行個體

在定義 lambda 內部使用 `create(::T)`，以透過自動解析的建構函式相依性安全地建置執行個體：

```kotlin
val appModule = module {
    single { create(::MyService) }
}
```

編譯器外掛程式會將 `create(::MyService)` 轉換為 `MyService(get(), get(), ...)`，自動裝配所有建構函式參數。

### 使用限定符

在您的類別上使用 `@Named` 來定義限定符，並在參數上指定要注入哪個相依性：

```kotlin
// 使用 @Named 限定符定義實作
@Named("local")
class LocalDatabase : Database

@Named("remote")
class RemoteDatabase : Database

// 在參數上使用 @Named 指定要注入哪一個
class SyncService(
    @Named("local") val localDb: Database,
    @Named("remote") val remoteDb: Database
)

// DSL - 外掛程式會從類別與參數中讀取 @Named
val appModule = module {
    single<LocalDatabase>()
    single<RemoteDatabase>()
    single<SyncService>()
}
```

您也可以使用 `@Qualifier` 建立自訂限定符：

```kotlin
@Qualifier
annotation class LocalDb

@Qualifier
annotation class RemoteDb

@LocalDb
class LocalDatabase : Database

@RemoteDb
class RemoteDatabase : Database

class SyncService(
    @LocalDb val localDb: Database,
    @RemoteDb val remoteDb: Database
)
```

### 使用參數

在您的類別上使用 `@InjectedParam` 來標記在注入時傳遞的參數：

```kotlin
// 類別上的註解 - 告訴外掛程式如何處理此參數
class UserPresenter(
    @InjectedParam val userId: String,    // 透過 parametersOf() 傳遞
    val repository: UserRepository        // 由 Koin 自動解析
)

// 模組中的 DSL - 告訴 Koin 在何處註冊
val appModule = module {
    factory<UserPresenter>()
}

// 用法 - 傳遞執行期參數
val presenter: UserPresenter = get { parametersOf("user123") }
```

### 介面繫結

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class

    // 或多重繫結
    single<MyServiceImpl>() binds arrayOf(
        ServiceA::class,
        ServiceB::class
    )
}
```

## 註解參考

### 定義註解

| 註解 | 描述 |
|------------|-------------|
| `@Singleton` / `@Single` | 單一執行個體 |
| `@Factory` | 每次都是新的執行個體 |
| `@Scoped` | 每個作用域一個執行個體 |
| `@KoinViewModel` | Android ViewModel |
| `@KoinWorker` | Android WorkManager Worker |

### 參數註解

| 註解 | 描述 |
|------------|-------------|
| `@Named("qualifier")` | 具名限定符 |
| `@InjectedParam` | 執行期參數（透過 `parametersOf()`） |
| `@Property("key")` | Koin 屬性值 |
| `@Provided` | 外部相依性（跳過驗證） |

### 模組註解

| 註解 | 描述 |
|------------|-------------|
| `@Module` | 宣告一個 Koin 模組 |
| `@ComponentScan("package")` | 掃描套件中的註解類別 |
| `@Configuration` | 自動發現的模組 |

## 方式比較

| 方式 | 狀態 | 封裝 | 語法 |
|----------|--------|---------|--------|
| **編譯器外掛程式 DSL** | 推薦 | 位於 Koin **`org.koin.plugin.module.dsl`** | `single<MyService>()`, `factory<MyRepo>()`, `viewModel<MyVM>()` |
| **編譯器外掛程式註解** | 推薦 | 註解位於 **`koin-annotations`** | `@Singleton`, `@Factory`, `@KoinViewModel ` |
| **經典 DSL** | 完全支援 | `org.koin.dsl` | `singleOf(::MyService)`, `single { MyService(get()) }`, `viewModelOf(::MyVM)` |
| **KSP 處理器** | 已棄用 | `koin-ksp-compiler` | Koin 註解的舊版處理器 — 相同的註解，**請遷移至編譯器外掛程式 ⚠️** |

### 編譯器外掛程式 DSL（推薦）

- 自動偵測相依性
- 編譯期分析
- 最簡潔的語法

### 編譯器外掛程式 註解（推薦）

- 自動偵測相依性
- 編譯期分析
- 熟悉的註解風格

### 經典 DSL（完全支援）

- 適用於任何 Kotlin 版本
- 完全控制裝配過程
- 準備就緒時可遷移至外掛程式 DSL

### KSP 處理器 `koin-ksp-compiler`（已棄用）

- `koin-annotations` 程式庫**並未棄用** — 它現在是 Koin 專案的一部分
- 僅棄用舊版的基於 KSP 的處理器 (`koin-ksp-compiler`)
- 請遷移至 Koin 編譯器外掛程式 — 您的註解保持不變
- `koin-ksp-compiler` 將在未來的 Koin 版本中移除

## 遷移

### 從經典 DSL 遷移

如果您正在使用經典 DSL，遷移是選用的，但建議進行：

1. 將編譯器外掛程式新增至 Gradle
2. 將匯入更新為 `org.koin.plugin.module.dsl.*`
3. 將 `singleOf(::Class)` 替換為 `single<Class>()`
4. 移除手動的 `get()` 呼叫

請參閱[編譯器外掛程式 DSL 參考](/docs/setup/compiler-plugin#dsl-style)以了解編譯期安全的語法。

### 從 KSP 處理器 (`koin-ksp-compiler`) 遷移

如果您正在使用帶有舊版 KSP 處理器的 Koin 註解，建議現在進行遷移：

1. 將 Kotlin 更新至 2.x
2. 將 `koin-ksp-compiler` 替換為 Koin 編譯器外掛程式
3. **您的註解保持不變** — 無需修改程式碼！
4. 刪除產生的檔案

請參閱[從 KSP 遷移至編譯器外掛程式](/docs/migration/from-ksp-to-compiler-plugin)。

## 需求

- **Kotlin 2.x** (K2 編譯器)
- Gradle 8.x+

## 組態選項

```kotlin
// build.gradle.kts
koinCompiler {
    // 選項將在此處說明
}
```

## 經典 DSL：仍完全支援

編譯器外掛程式並非取代經典 DSL — 它是在其之上增加了分析與產生功能。經典 DSL 仍完全支援：

```kotlin
// 仍然可以完美運作
val appModule = module {
    singleOf(::Database)
    singleOf(::ApiClient)
    single { CustomService(get(), get(), configValue) }  // 自訂邏輯
    viewModelOf(::UserViewModel)
}
```

在以下情況使用經典 DSL：
- 自訂工廠邏輯
- 針對選填相依性使用 `getOrNull()`
- 條件式具現化
- 與 Kotlin 1.x 的回溯相容性

## 後續步驟

- **[設定指南](/docs/setup/compiler-plugin)** — 詳細設定說明
- **[DSL 參考](/docs/reference/dsl-reference)** — 完整的 DSL 文件
- **[註解參考](/docs/reference/annotations-reference)** — 完整的註解文件
- **[遷移指南](/docs/migration/from-ksp-to-compiler-plugin)** — 升級您的專案