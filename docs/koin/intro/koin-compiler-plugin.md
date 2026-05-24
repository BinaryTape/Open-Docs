---
title: Koin 编译器插件
---

# Koin 编译器插件

**Koin 编译器插件**是所有新 Kotlin 2.x 项目的推荐方案。它是一个原生的 Kotlin 编译器插件，为 **DSL 和注解**提供自动装配、编译时安全以及更简洁的语法支持。

## 什么是编译器插件？

Koin 编译器插件是一个**原生 Kotlin 编译器插件 (K2)** —— 而非 KSP 或注解处理。它直接与 Kotlin 编译器集成，旨在：

- **自动检测构造函数形参** —— 无需手动调用 `get()`
- **在编译时转换代码** —— 在构建期间捕获错误
- **同时支持 DSL 和注解** —— 随心选择您的样式
- **不生成可见文件** —— 项目结构更整洁

## 为什么要使用编译器插件？

### 1. 更安全的代码

该插件会自动检测构造函数依赖项，从而减少手动装配错误：

```kotlin
// 不使用编译器插件 —— 容易出错
val appModule = module {
    single { UserService(get(), get(), get()) }  // 希望你的顺序是对的！
}

// 使用编译器插件 —— 自动装配
val appModule = module {
    single<UserService>()  // 插件会自动检测所有构造函数形参
}
```

### 2. 更简洁的语法

更少的模板代码，更高的可读性：

| 经典 DSL | 编译器插件 DSL |
|-------------|---------------------|
| `singleOf(::MyService)` | `single<MyService>()` |
| `single { MyService(get(), get()) }` | `single<MyService>()` |
| `factoryOf(::MyRepo)` | `factory<MyRepo>()` |
| `viewModelOf(::MyVM)` | `viewModel<MyVM>()` |
| `scopedOf(::MyPresenter)` | `scoped<MyPresenter>()` |
| `workerOf(::MyWorker)` | `worker<MyWorker>()` |

### 3. 编译时安全

Koin 编译器插件为 DSL 和注解提供**编译时依赖项验证**：

- **A2 — 按模块 (Per-Module)：** 根据可见作用域验证定义（早期反馈）
- **A3 — 完整图 (Full Graph)：** 在 `startKoin<T>()` 时验证完整的组装图
- **A4 — 调用站点 (Call-Site)：** 验证每个 `get<T>()`、`inject<T>()`、`koinViewModel<T>()` 调用

如果编译通过，则每个依赖项和每个注入调用站点都已满足。这取代了 `verify()` 和 `checkModules()` —— 无需运行时测试工具。

详情请参阅[编译时安全](/docs/reference/koin-compiler/compile-safety)。

### 4. DSL 与注解 —— 两者同样强大

使用您喜欢的任何样式 —— 同一个插件为两者提供完全相同的功能：

**DSL 样式：**
```kotlin
val appModule = module {
    single<Database>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

:::info DSL + 形参注解
使用 DSL 样式时，您仍可以在类上使用**形参注解**来引导插件：

```kotlin
class UserPresenter(
    @InjectedParam val userId: String,      // 运行时参数
    @Named("api") val client: ApiClient,    // 限定依赖
    val repository: UserRepository          // 自动解析
)

val appModule = module {
    factory<UserPresenter>()  // 插件从类中读取注解
}
```

DSL 定义了依赖项在**哪里**注册。形参注解定义了它们**如何**解析。
:::

**注解样式：**
```kotlin
@Singleton
class Database

@Singleton
class UserRepository(private val database: Database)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

## 快速入门

### 设置

将编译器插件添加到您的项目中。 

:::info
    请参阅**[编译器插件设置指南](/docs/setup/compiler-plugin)**了解详细说明。
:::

### 使用编译器插件 DSL

从编译器插件包中导入：

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
编译器插件 DSL 位于 `org.koin.plugin.module.dsl` 中。经典 DSL 仍保留在 `org.koin.dsl` 中。
:::

### 使用注解

注解的使用方式与之前相同：

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

## 工作原理

编译器插件分为两个阶段运行：

### 1. FIR 阶段 (分析)

在前端中间表示 (Frontend Intermediate Representation) 阶段，插件会：
- 分析您的模块定义
- 检测构造函数形参
- 验证依赖项声明

### 2. IR 阶段 (转换)

在中间表示 (Intermediate Representation) 阶段，插件会：
- 为每个形参生成适当的 `get()` 调用
- 处理限定符 (`@Named`)
- 处理注入形参 (`@InjectedParam`)
- 处理可为 null 类型和 Lazy 类型

### 生成的内容

当您编写：

```kotlin
single<UserRepository>()
```

插件会将其转换为：

```kotlin
single { UserRepository(get(), get()) }  // 自动检测形参
```

对于更复杂的情况：

```kotlin
// 您的代码
@Singleton
class MyService(
    val required: RequiredDep,
    val optional: OptionalDep?,
    @Named("special") val named: NamedDep,
    val lazy: Lazy<LazyDep>,
    @InjectedParam val param: String
)
```

插件会为每种形参类型生成相应的处理逻辑：
- 必填 (Required)：`get()`
- 可选 (Optional)：`getOrNull()`
- 命名 (Named)：`get(named("special"))`
- Lazy：`inject()`
- 注入形参 (InjectedParam)：`params.get()`

## 编译器插件 DSL 参考

### 定义类型

```kotlin
import org.koin.plugin.module.dsl.*

val appModule = module {
    // 单例 —— 一个实例
    single<MyService>()

    // 工厂 —— 每次都是新实例
    factory<MyPresenter>()

    // 作用域 —— 每个作用域一个实例
    scope<MyActivity> {
        scoped<ActivityPresenter>()
    }

    // ViewModel
    viewModel<MyViewModel>()

    // Worker (Android WorkManager)
    worker<MyWorker>()
}
```

### 使用 `create()` 安全创建实例

在定义 lambda 内部使用 `create(::T)` 来安全地构建一个带有自动解析构造函数依赖项的实例：

```kotlin
val appModule = module {
    single { create(::MyService) }
}
```

编译器插件会将 `create(::MyService)` 转换为 `MyService(get(), get(), ...)`，自动装配所有构造函数形参。

### 使用限定符

在类上使用 `@Named` 来定义限定符，并在形参上指定要注入哪个依赖项：

```kotlin
// 使用 @Named 限定符定义实现
@Named("local")
class LocalDatabase : Database

@Named("remote")
class RemoteDatabase : Database

// 在形参上使用 @Named 指定要注入哪一个
class SyncService(
    @Named("local") val localDb: Database,
    @Named("remote") val remoteDb: Database
)

// DSL —— 插件从类和形参中读取 @Named
val appModule = module {
    single<LocalDatabase>()
    single<RemoteDatabase>()
    single<SyncService>()
}
```

您还可以使用 `@Qualifier` 创建自定义限定符：

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

### 使用参数

在类上使用 `@InjectedParam` 来标记在注入时传递的参数：

```kotlin
// 类上的注解 —— 告诉插件如何处理此形参
class UserPresenter(
    @InjectedParam val userId: String,    // 通过 parametersOf() 传递
    val repository: UserRepository        // 由 Koin 自动解析
)

// 模块中的 DSL —— 告诉 Koin 在哪里注册
val appModule = module {
    factory<UserPresenter>()
}

// 用法 —— 传递运行时参数
val presenter: UserPresenter = get { parametersOf("user123") }
```

### 接口绑定

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class

    // 或多个绑定
    single<MyServiceImpl>() binds arrayOf(
        ServiceA::class,
        ServiceB::class
    )
}
```

## 注解参考

### 定义注解

| 注解 | 描述 |
|------------|-------------|
| `@Singleton` / `@Single` | 单个实例 |
| `@Factory` | 每次都是新实例 |
| `@Scoped` | 每个作用域一个实例 |
| `@KoinViewModel` | Android ViewModel |
| `@KoinWorker` | Android WorkManager Worker |

### 形参注解

| 注解 | 描述 |
|------------|-------------|
| `@Named("qualifier")` | 命名限定符 |
| `@InjectedParam` | 运行时参数 (通过 `parametersOf()`) |
| `@Property("key")` | Koin 属性值 |
| `@Provided` | 外部依赖项（跳过验证） |

### 模块注解

| 注解 | 描述 |
|------------|-------------|
| `@Module` | 声明一个 Koin 模块 |
| `@ComponentScan("package")` | 扫描包中的注解类 |
| `@Configuration` | 自动发现的模块 |

## 方案对比

| 方案 | 状态 | 软件包 | 语法 |
|----------|--------|---------|--------|
| **编译器插件 DSL** | 推荐 | 已位于 Koin **`org.koin.plugin.module.dsl`** | `single<MyService>()`, `factory<MyRepo>()`, `viewModel<MyVM>()` |
| **编译器插件注解** | 推荐 | 注解位于 **`koin-annotations`** | `@Singleton`, `@Factory`, `@KoinViewModel ` |
| **经典 DSL** | 完全支持 | `org.koin.dsl` | `singleOf(::MyService)`, `single { MyService(get()) }`, `viewModelOf(::MyVM)` |
| **KSP 处理器** | 已弃用 | `koin-ksp-compiler` | Koin 注解的旧版处理器 —— 注解相同，**请迁移至编译器插件 ⚠️** |

### 编译器插件 DSL (推荐)

- 自动检测依赖项
- 编译时分析
- 最简洁的语法

### 编译器插件注解 (推荐)

- 自动检测依赖项
- 编译时分析
- 熟悉的注解样式

### 经典 DSL (完全支持)

- 适用于任何 Kotlin 版本
- 对装配拥有完全控制权
- 准备就绪后可迁移至插件 DSL

### KSP 处理器 `koin-ksp-compiler` (已弃用)

- `koin-annotations` 库**并未弃用** —— 它现在是 Koin 项目的一部分
- 仅弃用了旧的基于 KSP 的处理器 (`koin-ksp-compiler`)
- 请迁移到 Koin 编译器插件 —— 您的注解保持不变
- `koin-ksp-compiler` 将在未来的 Koin 版本中移除

## 迁移

### 从经典 DSL 迁移

如果您正在使用经典 DSL，迁移是可选的但建议执行：

1. 将编译器插件添加到 Gradle
2. 将导入更新为 `org.koin.plugin.module.dsl.*`
3. 将 `singleOf(::Class)` 替换为 `single<Class>()`
4. 移除手动的 `get()` 调用

有关编译时安全语法的说明，请参阅[编译器插件 DSL 参考](/docs/setup/compiler-plugin#dsl-style)。

### 从 KSP 处理器 (`koin-ksp-compiler`) 迁移

如果您正在使用 Koin 注解和旧版 KSP 处理器，现在建议进行迁移：

1. 将 Kotlin 更新至 2.x
2. 用 Koin 编译器插件替换 `koin-ksp-compiler`
3. **您的注解保持不变** —— 无需更改代码！
4. 删除生成的文件

请参阅[从 KSP 迁移到编译器插件](/docs/migration/from-ksp-to-compiler-plugin)。

## 要求

- **Kotlin 2.x** (K2 编译器)
- Gradle 8.x+

## 配置选项

```kotlin
// build.gradle.kts
koinCompiler {
    // 选项将在此处记录
}
```

## 经典 DSL：仍受完全支持

编译器插件并非取代经典 DSL —— 它是在其基础上增加了分析和生成功能。经典 DSL 仍受完全支持：

```kotlin
// 仍然可以完美运行
val appModule = module {
    singleOf(::Database)
    singleOf(::ApiClient)
    single { CustomService(get(), get(), configValue) }  // 自定义逻辑
    viewModelOf(::UserViewModel)
}
```

在以下情况下请使用经典 DSL：
- 自定义工厂逻辑
- 针对可选依赖项使用 `getOrNull()`
- 条件实例化
- 与 Kotlin 1.x 的向后兼容性

## 后续步骤

- **[设置指南](/docs/setup/compiler-plugin)** —— 详细的设置说明
- **[DSL 参考](/docs/reference/dsl-reference)** —— 完整的 DSL 文档
- **[注解参考](/docs/reference/annotations-reference)** —— 完整的注解文档
- **[迁移指南](/docs/migration/from-ksp-to-compiler-plugin)** —— 升级您的项目