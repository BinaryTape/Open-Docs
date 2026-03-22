---
title: 模块
---

# 模块

Koin 模块是组织依赖注入配置的构建块。

## 什么是模块？

模块是一个用于对相关定义进行分组的逻辑容器：

```kotlin
val appModule = module {
    single<Database>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

模块可以帮助您：
- 按功能或层级**组织**定义
- **封装**相关的依赖项
- 在不同上下文之间**复用**配置
- 在多模块项目中**控制可见性**

## 创建模块

### 使用编译器插件 DSL

```kotlin
import org.koin.plugin.module.dsl.*

val networkModule = module {
    single<ApiClient>()
    single<TokenManager>()
}

val databaseModule = module {
    single<Database>()
    single<UserDao>()
}
```

### 使用注解

```kotlin
@Module
@ComponentScan("com.myapp.network")
class NetworkModule

@Module
@ComponentScan("com.myapp.database")
class DatabaseModule
```

### 使用经典 DSL

```kotlin
val networkModule = module {
    singleOf(::ApiClient)
    singleOf(::TokenManager)
}
```

## 使用多个模块

依赖项可以引用来自其他模块的定义：

```kotlin
// 数据层
val dataModule = module {
    single<Database>()
    single<UserRepository>()  // 可以使用此模块中的 Database
}

// 表示层
val viewModelModule = module {
    viewModel<UserViewModel>()  // 可以使用来自 dataModule 的 UserRepository
}

// 加载两者
startKoin {
    modules(dataModule, viewModelModule)
}
```

:::info
Koin 会自动解析所有已加载模块中的依赖项。不需要显式导入。
:::

:::note
虽然直接列出模块是可行的，但请考虑使用 [`includes()`](#module-composition-with-includes) 将您的模块组织成层次结构，以获得更好的结构和优化的加载。
:::

## 使用 `includes()` 进行模块组合

`includes()` 函数是组织模块的**推荐方式**。它提供：

- **模块层次结构** – 以清晰的父子关系组织您的模块
- **优化加载** – Koin 会对包含的模块进行去重，防止重复注册
- **更整洁的启动** – 加载单个根模块而不是一个长列表
- **封装** – 内部模块可以隐藏在公共 API 模块之后

:::tip
**最佳做法：** 使用 `includes()` 构建模块层次结构，而不是在 `startKoin` 中列出所有模块。这可以改善组织结构并确保高效的模块加载。
:::

```kotlin
val networkModule = module {
    single<ApiClient>()
}

val storageModule = module {
    single<Database>()
}

// 父模块包含子模块
val dataModule = module {
    includes(networkModule, storageModule)
    single<UserRepository>()
}

// ✅ 推荐：加载带有 includes 的根模块
startKoin {
    modules(dataModule)
}

// ❌ 避免：平铺模块列表
startKoin {
    modules(networkModule, storageModule, dataModule)
}
```

### `includes()` 如何优化加载

当模块被多次包含时，Koin 仅加载它们一次：

```kotlin
val commonModule = module {
    single<Logger>()
}

val featureAModule = module {
    includes(commonModule)
    single<FeatureA>()
}

val featureBModule = module {
    includes(commonModule)  // 也包含 commonModule
    single<FeatureB>()
}

val appModule = module {
    includes(featureAModule, featureBModule)
}

// 即使 commonModule 被包含了两次，它也只会被加载一次
startKoin {
    modules(appModule)
}
```

### 多模块项目

使用可见性修饰符来控制暴露的内容：

```kotlin
// :feature:user 模块

// 私有 - 对其他模块隐藏
private val userDataModule = module {
    single<UserDao>()
    single<UserCache>()
}

// 公共 API
val userFeatureModule = module {
    includes(userDataModule)
    viewModel<UserViewModel>()
}
```

```kotlin
// :app 模块
startKoin {
    modules(userFeatureModule)  // 只有这个是可访问的
}
```

## 模块重写

### 默认行为

默认情况下，**最后加载的定义优先**：

```kotlin
val productionModule = module {
    single<ApiService> { ProductionApi() }
}

val debugModule = module {
    single<ApiService> { DebugApi() }
}

startKoin {
    modules(productionModule, debugModule)  // DebugApi 胜出
}
```

### 严格模式

在生产环境中禁用重写：

```kotlin
startKoin {
    allowOverride(false)  // 尝试重写时抛出异常
    modules(productionModule)
}
```

### 显式重写

在严格模式下允许特定的重写：

```kotlin
val testModule = module {
    single<ApiService> { MockApi() }.override()  // 允许重写
}

startKoin {
    allowOverride(false)
    modules(productionModule, testModule)
}
```

## 预先创建模块 (Eager Module Creation)

在启动时立即创建单例：

```kotlin
val coreModule = module(createdAtStart = true) {
    single<ConfigManager>()
    single<LoggingSystem>()
}
```

## 参数化模块

动态创建模块：

```kotlin
fun featureModule(debug: Boolean) = module {
    single<Logger> {
        if (debug) DebugLogger() else ProductionLogger()
    }
}

startKoin {
    modules(featureModule(debug = BuildConfig.DEBUG))
}
```

## 策略模式

使用模块来切换实现：

```kotlin
val repositoryModule = module {
    single<UserRepository>()  // 依赖于 Datasource
}

// 策略选项
val localDatasourceModule = module {
    single<Datasource> { LocalDatasource() }
}

val remoteDatasourceModule = module {
    single<Datasource> { RemoteDatasource() }
}

// 生产环境
startKoin {
    modules(repositoryModule, remoteDatasourceModule)
}

// 离线模式
startKoin {
    modules(repositoryModule, localDatasourceModule)
}
```

## 注解模块

Koin 支持基于注解的模块配置，作为 DSL 的替代方案。

```kotlin
@Module
@ComponentScan("com.myapp.data")
class DataModule

@Module
@ComponentScan("com.myapp.network")
class NetworkModule

// 包含其他模块
@Module(includes = [DataModule::class, NetworkModule::class])
class AppModule
```

主要特性：
- `@Module` 将一个类标记为 Koin 模块
- `@ComponentScan` 自动发现软件包中带有注解的类
- `@Configuration` 在启动时启用自动发现
- 模块函数提供外部库实例

:::info
有关注解模块的完整文档，请参阅 [注解参考 - 模块](/docs/reference/koin-annotations/modules)。
:::

## 最佳做法

### 组织结构

1. **按功能/层分组**
   ```kotlin
   val authModule = module { /* 身份验证功能 */ }
   val networkModule = module { /* 网络层 */ }
   ```

2. **使用 `includes()` 构建模块层次结构**（推荐）
   ```kotlin
   // 创建一个包含所有功能的根模块
   val appModule = module {
       includes(
           coreModule,
           networkModule,
           featureAModule,
           featureBModule
       )
   }

   // 通过单个模块实现整洁启动
   startKoin {
       modules(appModule)
   }
   ```

3. **保持模块专注** – 每个模块单一职责

### 命名

- 使用描述性名称：`networkModule`、`userFeatureModule`
- 相关分组：`authDataModule`、`authDomainModule`

### 多模块项目

1. **每个功能一个公共模块**
2. **对实现模块使用 `private`/`internal`**
3. **将共享模块放在 `:core` 中**

## 后续步骤

- **[定义](/docs/reference/koin-core/definitions)** – 创建定义
- **[限定符](/docs/reference/koin-core/qualifiers)** – 命名和类型限定符
- **[作用域](/docs/reference/koin-core/scopes)** – 使用作用域管理生命周期
- **[故障排除](/docs/reference/koin-core/troubleshooting)** – 调试并修复常见问题