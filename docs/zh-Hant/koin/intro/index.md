---
title: 簡介
---

# 歡迎來到 Koin

**務實的 Kotlin 相依注入架構 - 簡約且強大**

Koin 是一個為 Kotlin 開發人員打造的輕量級相依注入架構。無論您是在建構 Android 應用程式、Kotlin 多平台專案、使用 Ktor 的後端服務，或是任何 Kotlin 應用程式，Koin 都能讓相依注入變得直覺且簡單。

## 為什麼選擇 Koin？

Koin 的設計理念非常明確：**您不應該在簡約與功能之間做選擇**。使用 Koin，您可以兼得兩者。

### DSL 與註解 - 隨心所欲選擇

Koin 在這兩種方法上都非常強大。喜歡純淨的 Kotlin DSL 嗎？沒問題。喜歡註解嗎？也沒問題。兩者都是一等公民，功能同樣強大。

| 價值 | 意義 |
|-------|---------------|
| **高效率** | 易於學習、易於撰寫。在幾分鐘內完成 DI，而非數小時 |
| **開發者友善** | DSL 或註解 — 由您選擇。清晰的錯誤提示、易於偵錯，最佳的 DX |
| **可擴充** | 支援具有複雜相依圖的大型企業級應用程式 |
| **安全** | 透過 Koin 編譯器外掛程式確保編譯時期安全 |
| **動態** | 執行時期彈性：動態載入模組、延遲載入、功能旗標 |

## 從何處開始？

根據您的經驗程度選擇路徑：

### 初次接觸相依注入？

從基礎知識開始：
- **[什麼是相依注入？](/docs/intro/what-is-dependency-injection)** - 了解核心概念

### 了解 DI，但初次接觸 Koin？

直接深入了解 Koin：
- **[什麼是 Koin？](/docs/intro/what-is-koin)** - 探索 Koin 的 DI 方法
- **[Koin 編譯器外掛程式](/docs/intro/koin-compiler-plugin)** - 建議使用且更安全的 Koin 使用方式

### 從 Hilt/Dagger 遷移？

查看 Koin 的比較：
- **[Koin 與 Hilt/Dagger 的比較](/docs/intro/koin-vs-hilt)** - 了解差異與遷移路徑

### 準備好開始編碼了嗎？

- **[安裝指南](/docs/setup/gradle)** - 將 Koin 加入您的專案
- **[教學](/docs/tutorials/your-first-app)** - 建構您的第一個 Koin 應用程式
- **[Koin IDE 外掛程式](https://plugins.jetbrains.com/plugin/26131-koin-dependency-injection-official-)** - 為 Android Studio 與 IntelliJ IDEA 安裝官方外掛程式 — 包含程式碼導覽、即時安全檢查、相依圖視覺化

## Koin 的方法

Koin 在定義相依性方面提供極大的靈活性：

| 方法 | 狀態 | 描述 |
|----------|--------|-------------|
| **Koin 編譯器外掛程式** (Kotlin 2.x) | 建議使用 | DSL：`single<MyService>()`、`factory<MyRepo>()`、`viewModel<MyVM>()`。 |
| **Koin 編譯器外掛程式** (Kotlin 2.x) | 建議使用 | 註解：`@Singleton`、`@Factory`、`@KoinViewModel`。自動偵測相依性，編譯時期安全。 |
| **傳統 DSL** | 完全支援 | `singleOf(::MyService)`、`single { MyService(get()) }`。適用於任何 Kotlin 版本。準備好後，編譯器外掛程式可在此基礎上增加安全性。 |
| **KSP 處理器** (`koin-ksp-compiler`) | 已棄用 | Koin 註解的舊版處理器。請遷移至編譯器外掛程式 — 使用相同的註解，並具備原生編譯器整合。 |

在 [什麼是 Koin？](/docs/intro/what-is-koin) 與 [Koin 編譯器外掛程式](/docs/intro/koin-compiler-plugin) 中了解更多資訊。

## 平台支援

Koin 支援所有執行 Kotlin 的平台：

| 平台 | 套件 | 狀態 |
|----------|---------|--------|
| **Kotlin/JVM** | `koin-core` | ✅ 完全支援 |
| **Android** | `koin-android` | ✅ 完全支援 |
| **Compose (Android 與多平台)** | `koin-compose` | ✅ 完全支援 |
| **iOS** | `koin-core` | ✅ 完全支援 |
| **桌面** | `koin-core` | ✅ 完全支援 |
| **Web (JS/Wasm)** | `koin-core` | ✅ 完全支援 |
| **Ktor** | `koin-ktor` | ✅ 完全支援 |

## 快速範例

以下是 Koin 的簡單範例：

```kotlin
// 定義您的類別
class UserRepository(private val api: ApiService)
class UserViewModel(private val repository: UserRepository) : ViewModel()

// 使用編譯器外掛程式 DSL 定義您的模組
val appModule = module {
    single<ApiService>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}

// 啟動 Koin
startKoin {
    modules(appModule)
}

// 在您的 Activity 中注入
class MainActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModel()
}
```

或是使用註解：

```kotlin
@Singleton
class UserRepository(private val api: ApiService)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

準備好開始了嗎？前往 [安裝指南](/docs/setup/gradle)。