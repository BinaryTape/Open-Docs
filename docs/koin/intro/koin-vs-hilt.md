---
title: Koin vs Hilt/Dagger
---

# Koin vs Hilt/Dagger

本页面将 Koin 与 Hilt 和 Dagger 进行对比，帮助您了解它们之间的差异，并决定哪种框架更符合您的需求。

:::info
Koin 同时支持 **DSL 与注解 (Annotations)** —— 您可以根据团队偏好进行选择。两者均为一等公民，功能同样强大，且均由同一个编译器插件驱动。为了与 Hilt 进行公平对比，本对比示例使用了注解形式，但 Koin 的 DSL 提供了同等的功能，且模板代码更少。
:::

## 哲学差异

| 维度 | Koin | Hilt/Dagger |
|--------|------|-------------|
| **学习曲线** | 数分钟即可上手 | 需要数小时或数天才能掌握 |
| **代码复杂度** | 简单的 DSL 或注解 | 复杂的注解规则 |
| **调试** | 错误清晰，没有代码生成迷宫 | 生成的代码可能难以跟踪 |
| **设置** | 一个插件，极简配置 | 多个注解，严格的规则 |
| **编译时安全** | ✅ 搭配编译器插件 | ✅ 始终支持 |
| **运行时灵活性** | ✅ 动态功能 | ❌ 仅静态 |

## 注解对比

即使是注解，Koin 也更为简洁：

| 任务 | Koin | Hilt |
|------|------|------|
| **单例 (Singleton)** | `@Singleton class MyService` | `@Singleton class MyService @Inject constructor(...)` |
| **接口绑定** | 自动 | 需要在抽象模块中使用 `@Binds` |
| **组件扫描** | `@ComponentScan("package")` | 不支持 |
| **模块发现** | `@Configuration` - 自动发现 | 每个模块需手动标注 `@InstallIn` |
| **提供第三方库** | `@Singleton fun provide()` | `@Module` 中的 `@Provides` + `@InstallIn` |
| **ViewModel** | `@KoinViewModel class MyVM` | `@HiltViewModel class MyVM @Inject constructor` |

## 代码对比

### 简单单例

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

### 接口绑定

**Koin - 自动绑定：**
```kotlin
@Singleton
class UserRepositoryImpl(val db: Database) : UserRepository

// 就这样！Koin 会自动绑定到 UserRepository 接口
```

**Hilt - 需要显式绑定：**
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

### 多模块应用

**Koin - 模块自动发现：**
```kotlin
// feature/auth/AuthModule.kt
@Module
@ComponentScan
@Configuration  // 自动发现！
class AuthModule

// feature/profile/ProfileModule.kt
@Module
@ComponentScan
@Configuration  // 自动发现！
class ProfileModule

// app/MyApp.kt
@KoinApplication  // 无需列出模块
class MyApp
```

**Hilt - 必须手动安装每个模块：**
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
class MyApp  // 仍然需要在各处使用正确的 @InstallIn
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

### 提供第三方库

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

## 动态功能：Koin 的独特优势

Koin **基于运行时，但具备高性能且编译时安全**。这使其能够提供 Hilt 无法实现的动态功能：

| 动态功能 | Koin | Hilt |
|-----------------|------|------|
| 在运行时加载模块 | ✅ `loadKoinModules()` | ❌ 不可能 |
| 卸载模块 | ✅ `unloadKoinModules()` | ❌ 不可能 |
| 延迟后台加载 | ✅ `lazyModules()` | ❌ 不可能 |
| 功能标志注入 | ✅ 简单实现 | ⚠️ 复杂的变通方法 |
| 插件架构 | ✅ 天然契合 | ❌ 非常困难 |
| A/B 测试实现 | ✅ 运行时切换 | ⚠️ 仅限编译时 |
| 动态配置 | ✅ 支持 | ❌ 不支持，必须重新编译 |

### 示例：动态模块加载

```kotlin
// KOIN - 动态模块加载
if (userHasPremium) {
    loadKoinModules(premiumFeatureModule)
}

// 稍后，如果订阅到期
unloadKoinModules(premiumFeatureModule)

// 延迟加载以实现更快的启动
startKoin {
    modules(coreModule)
    lazyModules(
        analyticsModule,  // 在后台加载
        heavyFeatureModule
    )
}
```

**这在 Hilt 中是不可能实现的** —— 所有依赖关系都在编译时固定。

### 示例：功能标志 (Feature Flags)

```kotlin
// KOIN - 在运行时切换实现
val featureModule = module {
    if (FeatureFlags.useNewApi) {
        single<ApiService> { NewApiService() }
    } else {
        single<ApiService> { LegacyApiService() }
    }
}

// 或动态地
fun updateApiImplementation(useNew: Boolean) {
    unloadKoinModules(apiModule)
    loadKoinModules(if (useNew) newApiModule else legacyApiModule)
}
```

## 设置对比

### Koin 设置

有关详细说明，请参阅 **[编译器插件设置指南](/docs/setup/compiler-plugin)**。

### Hilt 设置

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

## 错误消息

### Koin

```
org.koin.core.error.NoBeanDefFoundException:
No definition found for class 'com.app.UserRepository'.
Check your module definitions.
```

清晰直观，直接指出问题所在。

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

较为冗长，需要理解组件图 (component graph)。

## 如何选择

### 在以下情况选择 Koin：

- 您重视 **开发效率与简单性**
- 您需要 **运行时灵活性**（动态模块、功能标志）
- 您正在构建 **Kotlin 多平台** 应用
- 您的团队希望 **快速上手**
- 您更喜欢 **更少的模板代码**
- 您希望 **更容易调试**

### 在以下情况选择 Hilt：

- 您的团队 **已经熟悉 Dagger**
- 您需要与 **Google 优先的生态系统** 保持兼容
- 您需要 **Dagger 的特定功能**

## 从 Hilt 迁移到 Koin

如果您正在考虑迁移：

### 概念映射

| Hilt | Koin |
|------|------|
| `@HiltAndroidApp` | `@KoinApplication` 和 `startKoin<T> { }` |
| `@AndroidEntryPoint` | `by inject()` |
| `@HiltViewModel` 配合 `by viewModels()` | `@KoinViewModel` 配合 `by viewModel()` |
| `@Inject constructor` | 直接使用构造函数（自动检测） |
| `@Binds` | 自动绑定或 `bind` |
| `@InstallIn(SingletonComponent)` | `@Configuration` |
| 函数上的 `@Provides` | 函数上的 `@Factory` |

### 渐进式迁移

您可以进行增量迁移：

1. 将 Koin 添加到您的项目中
2. 每次迁移一个功能模块
3. 在过渡期间，两个 DI 框架可以共存（Koin 可以通过 `@ComponentScan` 扫描目标包）
4. 迁移完成后移除 Hilt

请参阅 [从 Hilt 迁移](/docs/migration/from-hilt) 了解详细步骤。

## 总结

**Koin：简单且强大**

- 像 Hilt 一样具备 **编译时安全**（配合编译器插件）
- **DSL 或注解** —— 两者同样强大，任您选择
- 拥有 Hilt 无法比拟的 **简单性与开发效率**
- 支持 Hilt 无法实现的 **动态运行时功能**

您不必在安全性与简单性之间做选择。使用 Koin，您可以两者兼得。

## 后续步骤

- **[什么是 Koin？](/docs/intro/what-is-koin)** —— 进一步了解 Koin
- **[设置指南](/docs/setup/gradle)** —— 将 Koin 添加到您的项目
- **[从 Hilt 迁移](/docs/migration/from-hilt)** —— 逐步迁移指南