---
title: 多模块 Android 应用
---

这篇指南涵盖了使用 Koin 构建多模块架构中 Android 特有的内容。

:::info
有关核心模块概念（`includes()`、组织方式、重写），请参阅 [模块](/docs/reference/koin-core/modules)。
:::

## Android 应用程序设置

### 使用注解

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

// 根模块包含所有功能
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
            modules(appModule)  // 单个根模块
        }
    }
}

// 根模块包含所有功能
val appModule = module {
    includes(
        loginModule,
        homeModule,
        profileModule
    )
}
```

## 功能模块示例

```kotlin
// :feature:login 模块
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
// DSL 等效实现
val loginModule = module {
    includes(dataModule)
    viewModel<LoginViewModel>()
    factory<LoginUseCase>()
}
```

## 动态功能加载

根据 Activity 生命周期按需加载功能模块：

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

## Koin 与 Hilt 对比

| Hilt | Koin |
|------|------|
| `@HiltAndroidApp` | `startKoin { androidContext() }` |
| `@InstallIn(SingletonComponent)` | 在 `startKoin {}` 中加载模块 |
| 用于跨模块的 `@EntryPoint` | 自动解析 |
| 组件依赖项 | `includes()` |
| `@ApplicationContext` | `androidContext()`（自动） |

:::info
**Koin 优势：** 不需要 `@EntryPoint` 接口。只要加载了所有模块，依赖项就会在模块间自动解析。
:::

## Android 测试

### 隔离测试模块

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
        // 使用模拟的依赖项进行测试
    }
}
```

### 验证所有模块

:::tip
Koin 编译器插件现在可以在编译时验证完整的依赖图，从而取代了运行时验证的需求。请参阅 [编译时安全](/docs/reference/koin-compiler/compile-safety)。
:::

如果您没有使用编译器插件，可以在运行时验证模块：

```kotlin
class ModuleCheckTest : KoinTest {

    @Test
    fun `verify all modules`() {
        appModule.verify()  // 也会验证包含的模块
    }
}
```

## 另请参阅

- **[模块](/docs/reference/koin-core/modules)** - 包含 `includes()` 的核心模块概念
- **[Android 模块加载](/docs/reference/koin-android/modules-android)** - 动态模块加载
- **[延迟加载模块](/docs/reference/koin-core/lazy-modules)** - 后台模块加载
- **[测试](/docs/reference/koin-android/instrumented-testing)** - Android 测试指南