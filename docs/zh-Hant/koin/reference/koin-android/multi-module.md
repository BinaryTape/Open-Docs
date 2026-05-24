---
title: 多模組 Android 應用程式
---

本指南涵蓋使用 Koin 進行多模組架構的 Android 特定面向。

:::info
關於核心模組概念（`includes()`、組織、覆寫），請參閱 [Modules](/docs/reference/koin-core/modules)。
:::

## Android 應用程式設定

### 使用註解

```kotlin
@KoinApplication(AppModule::class)
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin<MyApplication> {
            androidLogger()
            androidContext(this@MyApplication)
        }
    }
}

// 根模組包含所有功能
@Module(includes = [LoginModule::class, HomeModule::class, ProfileModule::class])
class AppModule
```

### 使用 DSL

```kotlin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MyApplication)
            modules(appModule)  // 單一根模組
        }
    }
}

// 根模組包含所有功能
val appModule = module {
    includes(
        loginModule,
        homeModule,
        profileModule
    )
}
```

## 功能模組範例

```kotlin
// :feature:login 模組
@KoinViewModel
class LoginViewModel(
    private val loginUseCase: LoginUseCase,
    private val userRepository: UserRepository
) : ViewModel()

@Factory
class LoginUseCase(private val authService: AuthService)

@Module(includes = [DataModule::class])
@ComponentScan("com.app.feature.login")
class LoginModule
```

```kotlin
// 對應的 DSL
val loginModule = module {
    includes(dataModule)
    viewModel<LoginViewModel>()
    factory<LoginUseCase>()
}
```

## 動態功能載入

透過 Activity 生命週期按需求載入功能模組：

```kotlin
class FeatureActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        loadKoinModules(featureModule)
        super.onCreate(savedInstanceState)
    }

    override fun onDestroy() {
        super.onDestroy()
        unloadKoinModules(featureModule)
    }
}
```

## Koin 與 Hilt 比較

| Hilt | Koin |
|------|------|
| `@HiltAndroidApp` | `startKoin { androidContext() }` |
| `@InstallIn(SingletonComponent)` | 在 `startKoin {}` 中載入的模組 |
| 用於跨模組的 `@EntryPoint` | 自動解析 |
| 組建相依性 | `includes()` |
| `@ApplicationContext` | `androidContext()` (自動) |

:::info
**Koin 優勢：** 不需要 `@EntryPoint` 介面。只要所有模組皆已載入，相依性會自動在模組間解析。
:::

## Android 測試

### 隔離測試模組

```kotlin
class LoginViewModelTest : KoinTest {

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        modules(
            loginModule,
            module {
                single<UserRepository> { mockk() }
                single<AuthService> { mockk() }
            }
        )
    }

    private val viewModel: LoginViewModel by inject()

    @Test
    fun `test login`() {
        // 使用模擬的相依性進行測試
    }
}
```

### 驗證所有模組

:::tip
Koin 編譯器外掛程式現在會在編譯時驗證您的完整相依圖，取代了對執行階段驗證的需求。請參閱 [Compile-Time Safety](/docs/reference/koin-compiler/compile-safety)。
:::

如果您未使用編譯器外掛程式，您可以在執行階段驗證模組：

```kotlin
class ModuleCheckTest : KoinTest {

    @Test
    fun `verify all modules`() {
        appModule.verify()  // 同時驗證包含的模組
    }
}
```

## 延伸閱讀

- **[Modules](/docs/reference/koin-core/modules)** - 包含 `includes()` 的核心模組概念
- **[Android Module Loading](/docs/reference/koin-android/modules-android)** - 動態模組載入
- **[Lazy Modules](/docs/reference/koin-core/lazy-modules)** - 背景模組載入
- **[Testing](/docs/reference/koin-android/instrumented-testing)** - Android 測試指南