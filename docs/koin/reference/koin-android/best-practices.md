---
title: Android 最佳实践
---

本指南涵盖了针对 Android 特定的内存管理、安全以及从 Hilt 迁移的最佳实践。

:::info
有关通用模块概念，请参阅 **[模块](/docs/reference/koin-core/modules)**。有关作用域，请参阅 **[作用域](/docs/reference/koin-core/scopes)** 和 **[Android 作用域](/docs/reference/koin-android/scope)**。
:::

## 内存管理

### 避免 Activity/Fragment 内存泄漏

```kotlin
// ❌ 错误 - Activity 内存泄漏
module {
    single { SomeService(get<Activity>()) }  // 在单例中持有 Activity 引用！
}

// ✅ 正确 - 使用 Application 上下文
module {
    single { SomeService(androidContext()) }  // Application 上下文，安全
}

// ✅ 正确 - 使用 activity 作用域
module {
    activityScope {
        scoped { SomeService(/* activity 作用域的依赖项 */) }
    }
}
```

### 正确关闭作用域

```kotlin
// ✅ 正确 - 自动作用域管理
class MyActivity : ScopeActivity() {
    override val scope: Scope by activityScope()
    // 作用域会在 onDestroy 中自动关闭
}

// ❌ 错误 - 手动创建作用域但未清理
class MyActivity : AppCompatActivity() {
    private val myScope = createScope<MyActivity>()
    // 作用域从未关闭 - 导致内存泄漏！
}

// ✅ 正确 - 手动创建作用域并进行清理
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

### 在长生命周期对象中清除引用

```kotlin
// ❌ 错误 - 持有 UI 引用
class UserRepository {
    private val listeners = mutableListOf<UserUpdateListener>()  // 可能持有 Activity 引用

    fun addListener(listener: UserUpdateListener) {
        listeners.add(listener)
    }
}

// ✅ 正确 - 使用弱引用或手动清理
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

## Android 调试

### 启用 Android 日志记录器

```kotlin
startKoin {
    androidLogger(Level.DEBUG)  // 查看所有 Koin 操作
    androidContext(this@MyApplication)
    modules(appModules)
}
```

### 在 Debug 构建中验证模块

```kotlin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidContext(this@MyApplication)
            modules(allModules)
        }

        // 使用 Koin 编译器插件进行编译时验证
        // 或在单元测试中使用 verify()：appModule.verify()
    }
}
```

### 用于调试的作用域回调

```kotlin
class DebugActivity : ScopeActivity() {
    override val scope: Scope by activityScope()

    init {
        scope.registerCallback(object : ScopeCallback {
            override fun onScopeClose(scope: Scope) {
                Log.d("Koin", "作用域 ${scope.id} 正在关闭")
            }
        })
    }
}
```

## 安全最佳实践

### 不要在模块中存储机密信息

```kotlin
// ❌ 错误 - 硬编码机密信息
module {
    single {
        Retrofit.Builder()
            .addInterceptor { chain ->
                chain.proceed(
                    chain.request().newBuilder()
                        .header("API-Key", "super-secret-key")  // 禁止！
                        .build()
                )
            }
            .build()
    }
}

// ✅ 正确 - 从安全存储中获取机密信息
module {
    single {
        val securePrefs = get<SecurePreferences>()
        Retrofit.Builder()
            .addInterceptor(AuthInterceptor(securePrefs))
            .build()
    }
}
```

## 从 Dagger/Hilt 迁移

:::info
Koin 支持来自 `jakarta.inject` 的 JSR-330 注解（`@Singleton`、`@Inject`、`@Named`）。您可以继续使用熟悉的注解。请参阅 [JSR-330 兼容性](/docs/reference/koin-android/jsr330)。
:::

### 注解映射

| Hilt | Koin 注解 |
|------|------------------|
| `@Singleton` | `@Singleton` (兼容 JSR-330) |
| `@Provides` | `@Factory` |
| `@Binds` | `@Singleton ... bind Interface::class` |
| `@Inject` | `@Inject` (兼容 JSR-330) |
| `@HiltViewModel` | `@KoinViewModel` |
| `@InstallIn(SingletonComponent)` | `@Module` + `@ComponentScan` |
| `@InstallIn(ActivityComponent)` | `@Scope(ActivityScope::class)` |

### 迁移示例

```kotlin
// 迁移前 (Hilt)
@HiltViewModel
class HomeViewModel @Inject constructor(
    private val repository: UserRepository
) : ViewModel()

@Singleton
class UserRepositoryImpl @Inject constructor(
    private val api: ApiService
) : UserRepository

// 迁移后 (Koin) - 改动极小！
@KoinViewModel
class HomeViewModel(
    private val repository: UserRepository
) : ViewModel()

@Singleton  // 继续使用 JSR-330
class UserRepositoryImpl(
    private val api: ApiService
) : UserRepository
```

### 模块迁移

```kotlin
// 迁移前 (Hilt)
@InstallIn(SingletonComponent::class)
@Module
object NetworkModule {
    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder().build()
}

// 迁移后 (Koin 注解)
@Module
class NetworkModule {
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder().build()
}
```

### 逐步迁移

```kotlin
// 第 1 步：在现有 Hilt 项目中为新功能添加 Koin
@KoinViewModel
class NewFeatureViewModel(
    private val repository: NewFeatureRepository
) : ViewModel()

@Singleton
class NewFeatureRepository(private val api: ApiService)

// 第 2 步：逐个迁移现有功能
@Singleton
class MigratedRepository(private val api: ApiService) : UserRepository

// 第 3 步：迁移完成后移除 Hilt
```

## 另请参阅

- **[作用域](/docs/reference/koin-core/scopes)** - 核心作用域概念
- **[Android 作用域](/docs/reference/koin-android/scope)** - Android 生命周期作用域
- **[测试](/docs/reference/koin-android/instrumented-testing)** - Android 测试指南
- **[多模块应用](/docs/reference/koin-android/multi-module)** - 组织 Android 模块