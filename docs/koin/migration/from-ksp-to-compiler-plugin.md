---
title: 将 Koin 注解从 KSP 迁移到编译器插件
---

# 迁移 Koin 注解：从 KSP 到编译器插件

本指南将帮助您将 Koin Annotations 项目从基于 KSP 的处理迁移到新的 Koin 编译器插件。

:::info 好消息！
**您的注解保持完全不变。** 只有构建配置和 Koin 启动代码需要更改。
:::

## 有何不同？

| 维度 | KSP 处理 | 编译器插件 |
|--------|----------------|-----------------|
| **处理方式** | KSP（独立步骤） | K2 编译器（集成） |
| **生成的项** | 在 `build/generated/ksp` 中可见 | 无 - 内联转换 |
| **构建速度** | 较慢 | 更快 |
| **KMP 设置** | 按平台配置 KSP | 应用单个插件 |
| **Koin 启动** | `modules(AppModule().module)` | `startKoin<MyApp>()` |
| **未来支持** | 已弃用 | 活跃开发中 |

## 要求

- **Kotlin 2.3.20+**（需要 K2 编译器）
- **Gradle 8.x+**

## 迁移步骤

### 第 1 步：更新 Kotlin 版本

编译器插件需要 Kotlin 2.3.20+：

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "2.3.20" // 最低要求 2.3.20
}
```

### 第 2 步：更新版本目录

**之前 (KSP)：**
```toml
[versions]
koin = "4.0.0"
koin-ksp = "2.0.0"  # KSP 注解的独立版本控制
ksp = "2.0.0-1.0.22"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin-ksp" }
koin-ksp-compiler = { module = "io.insert-koin:koin-ksp-compiler", version.ref = "koin-ksp" }

[plugins]
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
```

**之后 (编译器插件)：**
```toml
[versions]
koin = "4.2.0"
koin-plugin = "1.0.0"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin" }

[plugins]
koin-compiler = { id = "io.insert-koin.compiler.plugin", version.ref = "koin-plugin" }
```

:::note
`koin-annotations` 现在是 Koin 主项目的一部分，并使用与 `koin-core` 相同的版本。
:::

### 第 3 步：更新构建配置

**之前 (KSP)：**
```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)  // KSP 版本（独立版本控制）
    ksp(libs.koin.ksp.compiler)
}

ksp {
    arg("KOIN_CONFIG_CHECK", "true")
}
```

**之后 (编译器插件)：**
```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)  // 与 koin-core 版本相同
}

// 可选配置
koinCompiler {
    userLogs = true  // 记录组件检测日志
}
```

### 第 4 步：更新 Koin 启动代码

这是主要的程序代码更改。KSP 方法使用生成的 `.module` 扩展，而编译器插件将 `@KoinApplication` 与类型化 API 结合使用。

**之前 (KSP)：**
```kotlin
import org.koin.ksp.generated.*  // 生成的扩展

@Module
@ComponentScan("com.myapp")
class AppModule

fun main() {
    startKoin {
        modules(AppModule().module)  // 生成的 .module 扩展
    }
}
```

**之后 (编译器插件)：**

```kotlin
// 不需要生成的导入

@Module
@ComponentScan("com.myapp")
class AppModule

@KoinApplication(modules = [AppModule::class])
class MyApp

fun main() {
    startKoin<MyApp>()  // 类型化 API
}
```

#### Android 示例

**之前 (KSP)：**
```kotlin
import org.koin.ksp.generated.*

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            androidContext(this@MyApplication)
            modules(AppModule().module)
        }
    }
}
```

**之后 (编译器插件)：**
```kotlin
@KoinApplication(modules = [AppModule::class])
class MyApp

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin<MyApp> {
            androidContext(this@MyApplication)
        }
    }
}
```

### 第 5 步：清理

删除 KSP 生成的文件并重新构建：

```bash
rm -rf build/generated/ksp
./gradlew clean build
```

## 注解保持不变

您所有带注解的类都保持不变：

```kotlin
// 无需更改！
@Singleton
class UserRepository(private val database: Database)

@Factory
class GetUserUseCase(private val repository: UserRepository)

@KoinViewModel
class UserViewModel(private val useCase: GetUserUseCase) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

所有注解的工作方式完全相同。请参阅 **[注解参考](/docs/reference/koin-annotations/definitions)** 以获取完整列表。

### 导入更改：`@KoinViewModel`

`@KoinViewModel` 注解的包路径已更改：

```kotlin
// 之前 (KSP)
import org.koin.android.annotation.KoinViewModel

// 之后 (编译器插件)
import org.koin.core.annotation.KoinViewModel
```

### 顶级函数定义（新）

编译器插件支持对顶级函数使用注解，并可通过 `@ComponentScan` 发现：

```kotlin
@Singleton
fun provideDatabase(): DatabaseService = PostgresDatabase()

@Factory
fun provideCache(db: DatabaseService): CacheService = RedisCache(db)

@Module
@ComponentScan("com.myapp")
class AppModule
```

函数返回值类型决定绑定类型。函数形参作为依赖项注入。

## DSL 语法更改

如果您在注解的同时使用 Koin DSL 模块，编译器插件会引入更简洁的语法：

| KSP / 经典风格 | 编译器插件风格 |
|---------------------|----------------------|
| `singleOf(::MyService)` | `single<MyService>()` |
| `factoryOf(::MyRepo)` | `factory<MyRepo>()` |
| `viewModelOf(::MyVM)` | `viewModel<MyVM>()` |
| `scopedOf(::MyScoped)` | `scoped<MyScoped>()` |
| `workerOf(::MyWorker)` | `worker<MyWorker>()` |
| `single { fn(get()) }` | `single { create(::fn) }` |

```kotlin
// 之前
val myModule = module {
    singleOf(::MyService)
    factoryOf(::MyRepository)
    viewModelOf(::MyViewModel)
}

// 之后
import org.koin.plugin.module.dsl.*

val myModule = module {
    single<MyService>()
    factory<MyRepository>()
    viewModel<MyViewModel>()
}

// 函数构建器 — 用于外部库（Room、Retrofit 等）
fun createDatabase(context: Context): AppDatabase =
    Room.databaseBuilder(context, AppDatabase::class.java, "db").build()

val dbModule = module {
    single { create(::createDatabase) }
}
```

:::note
编译器插件 DSL 位于 **`org.koin.plugin.module.dsl`** 包中。经典 DSL 仍保留在 `org.koin.dsl` 中。
:::

## 跨模块发现

使用 `@Configuration` 在 Gradle 模块之间进行自动模块发现：

```kotlin
// 在 feature 模块中
@Module
@ComponentScan
@Configuration
class FeatureModule

// 在 app 模块中 - FeatureModule 会被自动发现
@KoinApplication
object MyApp

startKoin<MyApp>()  // FeatureModule 会被自动包含
```

## KMP 迁移

编译器插件极大地简化了 KMP 设置。

**之前 (KSP) - 按平台配置：**
```kotlin
// shared/build.gradle.kts
plugins {
    kotlin("multiplatform")
    id("com.google.devtools.ksp")
}

kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("io.insert-koin:koin-core:$koin_version")
            implementation("io.insert-koin:koin-annotations:$koin_ksp_version")  // 独立版本
        }
    }
}

dependencies {
    // 每个平台都需要 KSP 编译器
    add("kspAndroid", "io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
    add("kspIosX64", "io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
    add("kspIosArm64", "io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
    add("kspIosSimulatorArm64", "io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
}
```

**之后 (编译器插件) - 单个插件：**
```kotlin
// shared/build.gradle.kts
plugins {
    kotlin("multiplatform")
    alias(libs.plugins.koin.compiler)
}

kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation(libs.koin.core)
            implementation(libs.koin.annotations)
        }
    }
}
```

## 类型化启动 API

编译器插件提供了类型化 API：`startKoin<T>()`、`koinApplication<T>()`、`koinConfiguration<T>()`。

详情请参阅 **[使用注解启动](/docs/reference/koin-annotations/start)**。

## 配置标签（新）

编译器插件为条件模块加载增加了配置标签。

详情请参阅 **[模块 - 配置](/docs/reference/koin-annotations/modules)**。

## 编译器插件选项

请参阅 **[编译器插件选项](/docs/reference/koin-annotations/options)** 以获取所有配置选项。

## 故障排除

### 移除 KSP 后构建失败

1. `./gradlew clean`
2. `rm -rf build/generated/ksp`
3. 使 IDE 缓存失效
4. 重新构建

### 未检测到注解

启用日志记录：
```kotlin
koinCompiler {
    userLogs = true
}
```

### 运行时缺失依赖项

1. 检查 `@ComponentScan` 包
2. 验证 `@KoinApplication(modules = [...])` 中的模块
3. 对于外部依赖项使用 `@Provided`

## 迁移核对清单

- [ ] 将 Kotlin 更新到 2.3.20+
- [ ] 将 Koin 更新到 4.2.0+
- [ ] 移除 KSP 插件
- [ ] 移除 `koin-ksp-compiler` 依赖项
- [ ] 将 `koin-annotations` 更新到 Koin 主版本 (`io.insert-koin:koin-annotations:$koin_version`)
- [ ] 添加 Koin 编译器插件 (`io.insert-koin.compiler.plugin`)
- [ ] 将 `@KoinViewModel` 导入更新为 `org.koin.core.annotation`
- [ ] 创建 `@KoinApplication` 类，并将 `modules(X().module)` 替换为 `startKoin<MyApp>()`
- [ ] 如果使用 DSL 模块，请将 DSL 导入更新为 `org.koin.plugin.module.dsl.*`
- [ ] 更新 DSL 语法：`singleOf(::X)` → `single<X>()`
- [ ] 移除 `import org.koin.ksp.generated.*`
- [ ] 执行 Clean 并重新构建 (`rm -rf build/generated/ksp && ./gradlew clean build`)

## 另请参阅

- **[编译器插件设置](/docs/setup/compiler-plugin)** - 完整设置指南
- **[注解参考](/docs/reference/koin-annotations/start)** - 所有注解
- **[KSP 处理器设置（已弃用）](/docs/setup/annotations-ksp)** — 旧版 `koin-ksp-compiler` 参考