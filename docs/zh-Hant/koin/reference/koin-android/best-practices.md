---
title: Android 最佳實務
---

本指南涵蓋了針對 Android 的記憶體管理、安全性以及從 Hilt 遷移的專屬最佳實務。

:::info
關於一般的模組概念，請參閱 **[模組 (Modules)](/docs/reference/koin-core/modules)**。關於作用域，請參閱 **[作用域 (Scopes)](/docs/reference/koin-core/scopes)** 與 **[Android 作用域 (Android Scopes)](/docs/reference/koin-android/scope)**。
:::

## 記憶體管理

### 避免 Activity/Fragment 洩漏

```kotlin
// ❌ 錯誤 - Activity 洩漏
module {
    single { SomeService(get<Activity>()) }  // 在單例中持有 Activity 參考！
}

// ✅ 正確 - 使用 Application 上下文
module {
    single { SomeService(androidContext()) }  // Application 上下文，安全
}

// ✅ 正確 - 使用 activity 作用域
module {
    activityScope {
        scoped { SomeService(/* activity-scoped dependencies */) }
    }
}
```

### 正確關閉作用域

```kotlin
// ✅ 正確 - 自動化作用域管理
class MyActivity : ScopeActivity() {
    override val scope: Scope by activityScope()
    // 作用域會在 onDestroy 中自動關閉
}

// ❌ 錯誤 - 手動作用域且未清理
class MyActivity : AppCompatActivity() {
    private val myScope = createScope<MyActivity>()
    // 作用域永遠不會關閉 - 記憶體洩漏！
}

// ✅ 正確 - 手動作用域並進行清理
class MyActivity : AppCompatActivity() {
    private lateinit var myScope: Scope

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        myScope = createScope<MyActivity>()
    }

    override fun onDestroy() {
        myScope.close()
        super.onDestroy()
    }
}
```

### 清除長生命週期物件中的參考

```kotlin
// ❌ 錯誤 - 持有對 UI 的參考
class UserRepository {
    private val listeners = mutableListOf<UserUpdateListener>()  // 可能會持有 Activity 參考

    fun addListener(listener: UserUpdateListener) {
        listeners.add(listener)
    }
}

// ✅ 正確 - 弱參考或手動清理
class UserRepository {
    private val listeners = mutableListOf<WeakReference<UserUpdateListener>>()

    fun addListener(listener: UserUpdateListener) {
        listeners.add(WeakReference(listener))
    }

    fun removeListener(listener: UserUpdateListener) {
        listeners.removeAll { it.get() == listener || it.get() == null }
    }
}
```

## Android 偵錯

### 啟用 Android 記錄器

```kotlin
startKoin {
    androidLogger(Level.DEBUG)  // 查看所有 Koin 操作
    androidContext(this@MyApplication)
    modules(appModules)
}
```

### 在偵錯組建中驗證模組

```kotlin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidContext(this@MyApplication)
            modules(allModules)
        }

        // 改為在單元測試中使用 verify()
        // appModule.verify()
    }
}
```

### 用於偵錯的作用域回呼

```kotlin
class DebugActivity : ScopeActivity() {
    override val scope: Scope by activityScope()

    init {
        scope.registerCallback(object : ScopeCallback {
            override fun onScopeClose(scope: Scope) {
                Log.d("Koin", "Scope ${scope.id} closing")
            }
        })
    }
}
```

## 安全性最佳實務

### 不要在模組中儲存機密資訊

```kotlin
// ❌ 錯誤 - 硬編碼機密資訊
module {
    single {
        Retrofit.Builder()
            .addInterceptor { chain ->
                chain.proceed(
                    chain.request().newBuilder()
                        .header("API-Key", "super-secret-key")  // 不可以！
                        .build()
                )
            }
            .build()
    }
}

// ✅ 正確 - 來自安全儲存空間的機密資訊
module {
    single {
        val securePrefs = get<SecurePreferences>()
        Retrofit.Builder()
            .addInterceptor(AuthInterceptor(securePrefs))
            .build()
    }
}
```

## 從 Dagger/Hilt 遷移

:::info
Koin 支援來自 `jakarta.inject` 的 JSR-330 註解（`@Singleton`、`@Inject`、`@Named`）。您可以繼續使用熟悉的註解。請參閱 [JSR-330 相容性](/docs/reference/koin-android/jsr330)。
:::

### 註解對應

| Hilt | Koin 註解 |
|------|------------------|
| `@Singleton` | `@Singleton` (相容 JSR-330) |
| `@Provides` | `@Factory` |
| `@Binds` | `@Singleton ... bind Interface::class` |
| `@Inject` | `@Inject` (相容 JSR-330) |
| `@HiltViewModel` | `@KoinViewModel` |
| `@InstallIn(SingletonComponent)` | `@Module` + `@ComponentScan` |
| `@InstallIn(ActivityComponent)` | `@Scope(ActivityScope::class)` |

### 遷移範例

```kotlin
// 之前 (Hilt)
@HiltViewModel
class HomeViewModel @Inject constructor(
    private val repository: UserRepository
) : ViewModel()

@Singleton
class UserRepositoryImpl @Inject constructor(
    private val api: ApiService
) : UserRepository

// 之後 (Koin) - 變動極小！
@KoinViewModel
class HomeViewModel(
    private val repository: UserRepository
) : ViewModel()

@Singleton  // 繼續使用 JSR-330
class UserRepositoryImpl(
    private val api: ApiService
) : UserRepository
```

### 模組遷移

```kotlin
// 之前 (Hilt)
@InstallIn(SingletonComponent::class)
@Module
object NetworkModule {
    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder().build()
}

// 之後 (Koin 註解)
@Module
class NetworkModule {
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder().build()
}
```

### 漸進式遷移

```kotlin
// 步驟 1：針對新功能在 Hilt 旁加入 Koin
@KoinViewModel
class NewFeatureViewModel(
    private val repository: NewFeatureRepository
) : ViewModel()

@Singleton
class NewFeatureRepository(private val api: ApiService)

// 步驟 2：逐一遷移現有功能
@Singleton
class MigratedRepository(private val api: ApiService) : UserRepository

// 步驟 3：遷移完成後移除 Hilt
```

## 延伸閱讀

- **[作用域 (Scopes)](/docs/reference/koin-core/scopes)** - 核心作用域概念
- **[Android 作用域 (Android Scopes)](/docs/reference/koin-android/scope)** - Android 生命週期作用域
- **[測試 (Testing)](/docs/reference/koin-android/instrumented-testing)** - Android 測試指南
- **[多模組應用程式 (Multi-Module Apps)](/docs/reference/koin-android/multi-module)** - 組織 Android 模組