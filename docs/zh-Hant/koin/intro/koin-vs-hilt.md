---
title: Koin vs Hilt/Dagger
---

# Koin vs Hilt/Dagger

本頁面將 Koin 與 Hilt 及 Dagger 進行比較，協助您了解其差異並決定哪個架構適合您的需求。

:::info
Koin 同時支援 **DSL 與註解 (Annotations)** — 請選擇適合您團隊的方式。兩者均為一等公民，功能同樣強大，且均由相同的編譯器外掛程式驅動。此比較顯示了註解範例，以便與 Hilt 進行公平比較，但 Koin 的 DSL 以更少的樣板程式碼提供了同等的功能。
:::

## 哲學差異

| 面向 | Koin | Hilt/Dagger |
|--------|------|-------------|
| **學習曲線** | 幾分鐘即可上手 | 需數小時或數天才能精通 |
| **程式碼複雜度** | 簡單的 DSL 或註解 | 複雜的註解規則 |
| **偵錯** | 錯誤訊息清晰，沒有產生的程式碼迷宮 | 產生的程式碼可能難以追蹤 |
| **設定** | 一個外掛程式，極簡配置 | 多個註解，嚴格規則 |
| **編譯期安全性** | ✅ 搭配編譯器外掛程式 | ✅ 始終具備 |
| **執行時彈性** | ✅ 動態功能 | ❌ 僅限靜態 |

## 註解比較

即使是註解，在 Koin 中也更為簡單：

| 任務 | Koin | Hilt |
|------|------|------|
| **Singleton** | `@Singleton class MyService` | `@Singleton class MyService @Inject constructor(...)` |
| **介面繫結** | 自動 | 需要在抽象模組中使用 `@Binds` |
| **組建掃描** | `@ComponentScan("package")` | 不可用 |
| **模組探索** | `@Configuration` — 自動探索 | 每個模組需手動使用 `@InstallIn` |
| **提供第三方庫** | `@Singleton fun provide()` | `@Module` 中的 `@Provides` + `@InstallIn` |
| **ViewModel** | `@KoinViewModel class MyVM` | `@HiltViewModel class MyVM @Inject constructor` |

## 程式碼比較

### 簡單的 Singleton

**Koin：**
```kotlin
@Singleton
class MyRepository(val api: ApiService)

@Module
@ComponentScan("com.app")
class AppModule
```

**Hilt：**
```kotlin
@Singleton
class MyRepository @Inject constructor(val api: ApiService)

@Module
@InstallIn(SingletonComponent::class)
abstract class AppModule {
    @Binds
    abstract fun bindRepository(impl: MyRepository): Repository
}
```

### 介面繫結

**Koin — 自動：**
```kotlin
@Singleton
class UserRepositoryImpl(val db: Database) : UserRepository

// 就這樣！Koin 會自動繫結到 UserRepository 介面
```

**Hilt — 需要明確繫結：**
```kotlin
@Singleton
class UserRepositoryImpl @Inject constructor(val db: Database) : UserRepository

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    @Binds
    abstract fun bindUserRepository(impl: UserRepositoryImpl): UserRepository
}
```

### 多模組應用程式

**Koin — 模組自動探索：**
```kotlin
// feature/auth/AuthModule.kt
@Module
@ComponentScan
@Configuration  // 自動探索！
class AuthModule

// feature/profile/ProfileModule.kt
@Module
@ComponentScan
@Configuration  // 自動探索！
class ProfileModule

// app/MyApp.kt
@KoinApplication  // 無需列出模組
class MyApp
```

**Hilt — 必須手動安裝每個模組：**
```kotlin
// feature/auth/AuthModule.kt
@Module
@InstallIn(SingletonComponent::class)
class AuthModule { ... }

// feature/profile/ProfileModule.kt
@Module
@InstallIn(SingletonComponent::class)
class ProfileModule { ... }

// app/MyApp.kt
@HiltAndroidApp
class MyApp  // 到處仍需正確的 @InstallIn
```

### ViewModel

**Koin：**
```kotlin
@KoinViewModel
class UserViewModel(
    private val repository: UserRepository,
    private val savedStateHandle: SavedStateHandle
) : ViewModel()

// 在 Activity/Fragment 中
val viewModel: UserViewModel by viewModel()

// 在 Compose 中
val viewModel: UserViewModel = koinViewModel()
```

**Hilt：**
```kotlin
@HiltViewModel
class UserViewModel @Inject constructor(
    private val repository: UserRepository,
    private val savedStateHandle: SavedStateHandle
) : ViewModel()

// 在 Activity/Fragment 中
val viewModel: UserViewModel by viewModels()

// 在 Compose 中
val viewModel: UserViewModel = hiltViewModel()
```

### 提供第三方程式庫

**Koin：**
```kotlin
@Module
class NetworkModule {
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder()
        .baseUrl("https://api.example.com")
        .build()

    @Singleton
    fun provideApi(retrofit: Retrofit): ApiService =
        retrofit.create(ApiService::class.java)
}
```

**Hilt：**
```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder()
        .baseUrl("https://api.example.com")
        .build()

    @Provides
    @Singleton
    fun provideApi(retrofit: Retrofit): ApiService =
        retrofit.create(ApiService::class.java)
}
```

## 動態功能：Koin 的獨特優勢

Koin 是 **基於執行時 (runtime-based) 的，但具備高效能且編譯期安全**。這實現了 Hilt 無法提供的動態功能：

| 動態功能 | Koin | Hilt |
|-----------------|------|------|
| 在執行時載入模組 | ✅ `loadKoinModules()` | ❌ 不可能 |
| 卸載模組 | ✅ `unloadKoinModules()` | ❌ 不可能 |
| 背景延遲載入 | ✅ `lazyModules()` | ❌ 不可能 |
| 功能旗標注入 | ✅ 簡單 | ⚠️ 複雜的變通方法 |
| 外掛程式架構 | ✅ 自然契合 | ❌ 非常困難 |
| A/B 測試實作 | ✅ 執行時切換 | ⚠️ 僅限編譯期 |
| 動態配置 | ✅ 支援 | ❌ 否，必須重新編譯 |

### 範例：動態模組載入

```kotlin
// KOIN - 動態模組載入
if (userHasPremium) {
    loadKoinModules(premiumFeatureModule)
}

// 稍後，如果訂閱過期
unloadKoinModules(premiumFeatureModule)

// 延遲載入以加快啟動速度
startKoin {
    modules(coreModule)
    lazyModules(
        analyticsModule,  // 在背景載入
        heavyFeatureModule
    )
}
```

**這在 Hilt 中是不可能的** — 所有相依性都在編譯時期完成連接。

### 範例：功能旗標

```kotlin
// KOIN - 在執行時切換實作
val featureModule = module {
    if (FeatureFlags.useNewApi) {
        single<ApiService> { NewApiService() }
    } else {
        single<ApiService> { LegacyApiService() }
    }
}

// 或動態地
fun updateApiImplementation(useNew: Boolean) {
    unloadKoinModules(apiModule)
    loadKoinModules(if (useNew) newApiModule else legacyApiModule)
}
```

## 設定比較

### Koin 設定

請參閱 **[編譯器外掛程式設定指南](/docs/setup/compiler-plugin)** 以取得詳細說明。

### Hilt 設定

```kotlin
// settings.gradle.kts
plugins {
    id("com.google.dagger.hilt.android") version "2.x" apply false
}

// app/build.gradle.kts
plugins {
    id("com.google.devtools.ksp")
    id("dagger.hilt.android.plugin")
}

dependencies {
    implementation("com.google.dagger:hilt-android:2.x")
    ksp("com.google.dagger:hilt-compiler:2.x")
}
```

## 錯誤訊息

### Koin

```
org.koin.core.error.NoBeanDefFoundException:
No definition found for class 'com.app.UserRepository'.
Check your module definitions.
```

清晰，直接指向問題所在。

### Hilt/Dagger

```
error: [Dagger/MissingBinding] com.app.UserRepository cannot be provided
without an @Inject constructor or an @Provides-annotated method.
com.app.UserRepository is injected at
    com.app.UserService(repository)
com.app.UserService is injected at
    com.app.UserActivity.service
com.app.UserActivity is injected at
    dagger.hilt.android.internal.managers.ActivityComponentManager.inject
```

較長，且需要理解組建圖 (component graph)。

## 如何選擇

### 選擇 Koin 的時機：

- 您重視 **生產力與簡潔性**
- 您需要 **執行時彈性**（動態模組、功能旗標）
- 您正在建置 **Kotlin Multiplatform** 應用程式
- 您的團隊希望 **快速上手**
- 您偏好 **較少的樣板程式碼**
- 您想要 **更輕鬆的偵錯**

### 選擇 Hilt 的時機：

- 您的團隊 **已經熟悉 Dagger**
- 您需要 **Google 優先的生態系統** 相容性
- 您需要 **Dagger 的特定功能**

## 從 Hilt 遷移到 Koin

如果您正在考慮遷移：

### 概念對應

| Hilt | Koin |
|------|------|
| `@HiltAndroidApp` | `@KoinApplication` 與 `startKoin<T> { }` |
| `@AndroidEntryPoint` | `by inject()` |
| 搭配 `by viewModels()` 的 `@HiltViewModel` | 搭配 `by viewModel()` 的 `@KoinViewModel` |
| `@Inject constructor` | 僅需建構函式（自動偵測） |
| `@Binds` | 自動或 `bind` |
| `@InstallIn(SingletonComponent)` | `@Configuration` |
| 函式上的 `@Provides` | 函式上的 `@Factory` |

### 漸進式遷移

您可以進行增量遷移：

1. 將 Koin 新增至您的專案
2. 一次遷移一個功能模組
3. 兩個 DI 架構可以在過渡期間共存（Koin 可以透過 `@ComponentScan` 掃描目標套件）
4. 遷移完成後移除 Hilt

請參閱 [從 Hilt 遷移](/docs/migration/from-hilt) 以了解詳細步驟。

## 總結

**Koin：簡潔且強大**

- 具備像 Hilt 一樣的 **編譯期安全性**（搭配編譯器外掛程式）
- **DSL 或註解** — 兩者同樣強大，任君選擇
- Hilt 無法企及的 **簡潔性與生產力**
- Hilt 無法實現的 **動態執行時功能**

您不必在安全性與簡潔性之間做出選擇。使用 Koin，您可以兩者兼得。

## 後續步驟

- **[什麼是 Koin？](/docs/intro/what-is-koin)** — 進一步了解 Koin
- **[設定指南](/docs/setup/gradle)** — 將 Koin 新增至您的專案
- **[從 Hilt 遷移](/docs/migration/from-hilt)** — 逐步遷移指南