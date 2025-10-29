# Koin 注解清单

本文档提供了所有 Koin 注解、它们的参数、行为和使用示例的全面清单。

## 目录

- [定义注解](#definition-annotations)
  - [@Single](#single)
  - [@Factory](#factory)
  - [@Scoped](#scoped)
- [Scope 注解](#scope-annotations)
  - [@Scope](#scope)
  - [@ViewModelScope](#viewmodelscope)
  - [@ActivityScope](#activityscope)
  - [@ActivityRetainedScope](#activityretainedscope)
  - [@FragmentScope](#fragmentscope)
  - [@ScopeId](#scopeid)
- [ViewModel 与 Android 特有注解](#viewmodel--android-specific-annotations)
  - [@KoinViewModel](#koinviewmodel)
  - [@KoinWorker](#koinworker)
- [限定符注解](#qualifier-annotations)
  - [@Named](#named)
  - [@Qualifier](#qualifier)
- [属性注解](#property-annotations)
  - [@Property](#property)
  - [@PropertyValue](#propertyvalue)
- [模块与应用程序注解](#module--application-annotations)
  - [@Module](#module)
  - [@ComponentScan](#componentscan)
  - [@Configuration](#configuration)
  - [@KoinApplication](#koinapplication)
- [监控注解](#monitoring-annotations)
  - [@Monitor](#monitor)
- [元注解 (内部)](#meta-annotations-internal)
  - [@ExternalDefinition](#externaldefinition)
  - [@MetaDefinition](#metadefinition)
  - [@MetaModule](#metamodule)
  - [@MetaApplication](#metaapplication)

---

## 定义注解

### @Single

**包：** `org.koin.core.annotation`

**目标：** `CLASS`、`FUNCTION`

**描述：** 在 Koin 中将类型或函数声明为 `single`（单例）定义。单一实例在整个应用程序中创建并共享。

**参数：**
- `binds: Array<KClass<*>> = [Unit::class]` - 明确绑定到此定义的类型。超类型会自动检测到。
- `createdAtStart: Boolean = false` - 如果为 `true`，则实例在 Koin 启动时创建。

**行为：**
所有依赖项均通过构造函数注入填充。

**示例：**
```kotlin
@Single
class MyClass(val d : MyDependency)
```

**生成的 Koin DSL：**
```kotlin
single { MyClass(get()) }
```

**带显式绑定：**
```kotlin
@Single(binds = [MyInterface::class])
class MyClass(val d : MyDependency) : MyInterface
```

**启动时创建：**
```kotlin
@Single(createdAtStart = true)
class MyClass(val d : MyDependency)
```

---

### @Factory

**包：** `org.koin.core.annotation`

**目标：** `CLASS`、`FUNCTION`

**描述：** 在 Koin 中将类型或函数声明为 `factory` 定义。每次请求时都会创建一个新实例。

**参数：**
- `binds: Array<KClass<*>> = [Unit::class]` - 明确绑定到此定义的类型。超类型会自动检测到。

**行为：**
所有依赖项均通过构造函数注入填充。每次请求都会创建一个新实例。

**示例：**
```kotlin
@Factory
class MyClass(val d : MyDependency)
```

**生成的 Koin DSL：**
```kotlin
factory { MyClass(get()) }
```

---

### @Scoped

**包：** `org.koin.core.annotation`

**目标：** `CLASS`、`FUNCTION`

**描述：** 在 Koin 中将类型或函数声明为 `scoped` 定义。必须与 `@Scope` 注解关联。实例在特定 Scope 内共享。

**参数：**
- `binds: Array<KClass<*>> = [Unit::class]` - 明确绑定到此定义的类型。超类型会自动检测到。

**行为：**
创建一个作用于 Scope 的实例，其生命周期与定义的 Scope 相同。

**示例：**
```kotlin
@Scope(MyScope::class)
@Scoped
class MyClass(val d : MyDependency)
```

**另请参见：** [@Scope](#scope)

---

## Scope 注解

### @Scope

**包：** `org.koin.core.annotation`

**目标：** `CLASS`、`FUNCTION`

**描述：** 在 Koin Scope 中声明一个类。Scope 名称由 `value`（类）或 `name`（字符串）描述。默认情况下，声明一个 `scoped` 定义。可以通过 `@Scoped`、`@Factory`、`@KoinViewModel` 注解覆盖以进行显式绑定。

**参数：**
- `value: KClass<*> = Unit::class` - Scope 类值
- `name: String = ""` - Scope 字符串值

**行为：**
创建一个与指定 Scope 类型或名称关联的 Scope 定义。

**类示例：**
```kotlin
@Scope(MyScope::class)
class MyClass(val d : MyDependency)
```

**生成的 Koin DSL：**
```kotlin
scope<MyScope> {
    scoped { MyClass(get()) }
}
```

**字符串名称示例：**
```kotlin
@Scope(name = "my_custom_scope")
class MyClass(val d : MyDependency)
```

---

### @ViewModelScope

**包：** `org.koin.core.annotation`

**目标：** `CLASS`、`FUNCTION`

**描述：** 在 ViewModelScope Koin Scope 中声明一个类。这是为应在 ViewModel 生命周期内存在的组件设计的 Scope 原型。

**参数：** 无

**行为：**
在 `viewModelScope` 中创建一个作用于 Scope 的定义。

**示例：**
```kotlin
@ViewModelScope
class MyClass(val d : MyDependency)
```

**生成的 Koin DSL：**
```kotlin
viewModelScope {
    scoped { MyClass(get()) }
}
```

**用法：**
带有标签的类旨在与 ViewModel 和 `viewModelScope` 函数一起使用以激活该 Scope。

---

### @ActivityScope

**包：** `org.koin.android.annotation`

**目标：** `CLASS`、`FUNCTION`

**描述：** 在 Activity Koin Scope 中声明一个类。

**参数：** 无

**行为：**
在 `activityScope` 中创建一个作用于 Scope 的定义。

**示例：**
```kotlin
@ActivityScope
class MyClass(val d : MyDependency)
```

**生成的 Koin DSL：**
```kotlin
activityScope {
    scoped { MyClass(get()) }
}
```

**用法：**
带有标签的类旨在与 Activity 和 `activityScope` 函数一起使用以激活该 Scope。

---

### @ActivityRetainedScope

**包：** `org.koin.android.annotation`

**目标：** `CLASS`、`FUNCTION`

**描述：** 在 Activity Koin Scope 中声明一个类，但跨配置更改保留。

**参数：** 无

**行为：**
在 `activityRetainedScope` 中创建一个作用于 Scope 的定义。

**示例：**
```kotlin
@ActivityRetainedScope
class MyClass(val d : MyDependency)
```

**生成的 Koin DSL：**
```kotlin
activityRetainedScope {
    scoped { MyClass(get()) }
}
```

**用法：**
带有标签的类旨在与 Activity 和 `activityRetainedScope` 函数一起使用以激活该 Scope。

---

### @FragmentScope

**包：** `org.koin.android.annotation`

**目标：** `CLASS`、`FUNCTION`

**描述：** 在 Fragment Koin Scope 中声明一个类。

**参数：** 无

**行为：**
在 `fragmentScope` 中创建一个作用于 Scope 的定义。

**示例：**
```kotlin
@FragmentScope
class MyClass(val d : MyDependency)
```

**生成的 Koin DSL：**
```kotlin
fragmentScope {
    scoped { MyClass(get()) }
}
```

**用法：**
带有标签的类旨在与 Fragment 和 `fragmentScope` 函数一起使用以激活该 Scope。

---

### @ScopeId

**包：** `org.koin.core.annotation`

**目标：** `VALUE_PARAMETER`

**描述：** 注解类构造函数或函数中的形参，以请求解析具有 Scope ID 的给定 Scope。

**参数：**
- `value: KClass<*> = Unit::class` - Scope 类型
- `name: String = ""` - Scope 字符串标识符

**行为：**
从由类型或名称标识的特定 Scope 解析依赖项。

**字符串名称示例：**
```kotlin
@Factory
class MyClass(@ScopeId(name = "my_scope_id") val d : MyDependency)
```

**生成的 Koin DSL：**
```kotlin
factory { MyClass(getScope("my_scope_id").get()) }
```

**类型示例：**
```kotlin
@Factory
class MyClass(@ScopeId(MyScope::class) val d : MyDependency)
```

---

## ViewModel 与 Android 特有注解

### @KoinViewModel

**包：** `org.koin.android.annotation`

**目标：** `CLASS`、`FUNCTION`

**描述：** Koin 定义的 ViewModel 注解。在 Koin 中将类型或函数声明为 `viewModel` 定义。

**平台支持：**
- ✅ Android
- ✅ Kotlin 多平台 (KMP)
- ✅ Compose 多平台 (CMP)

**参数：**
- `binds: Array<KClass<*>> = []` - 明确绑定到此定义的类型。超类型会自动检测到。

**行为：**
所有依赖项均通过构造函数注入填充。创建一个由 Koin 管理的 ViewModel 实例。当使用 Compose Multiplatform 时，可在包括 Android、iOS、桌面和 Web 在内的所有平台上运行。

**示例 (Android/CMP)：**
```kotlin
@KoinViewModel
class MyViewModel(val d : MyDependency) : ViewModel()
```

**示例 (KMP/CMP 共享)：**
```kotlin
@KoinViewModel
class SharedViewModel(
    val repository: Repository,
    val analytics: Analytics
) : ViewModel()
```

**生成的 Koin DSL：**
```kotlin
viewModel { MyViewModel(get()) }
```

---

### @KoinWorker

**包：** `org.koin.android.annotation`

**目标：** `CLASS`、`FUNCTION`

**描述：** Koin 定义的 Worker 注解。将类型声明为 WorkManager Worker 的 `worker` 定义。

**参数：**
- `binds: Array<KClass<*>> = []` - 明确绑定到此定义的类型。

**行为：**
为 Android WorkManager 集成创建一个 Worker 定义。

**示例：**
```kotlin
@KoinWorker
class MyWorker() : Worker()
```

---

## 限定符注解

### @Named

**包：** `org.koin.core.annotation`

**目标：** `CLASS`、`FUNCTION`、`VALUE_PARAMETER`

**描述：** 为给定定义定义一个限定符。生成 `StringQualifier("...")` 或基于类型的限定符。

**参数：**
- `value: String = ""` - 字符串限定符
- `type: KClass<*> = Unit::class` - 类限定符

**行为：**
用于区分同一类型的多个定义。

**字符串示例：**
```kotlin
@Single
@Named("special")
class MyClass(val d : MyDependency)
```

**在形参中的用法：**
```kotlin
@Single
class Consumer(@Named("special") val myClass: MyClass)
```

**类型示例：**
```kotlin
@Single
@Named(type = MyType::class)
class MyClass(val d : MyDependency)
```

---

### @Qualifier

**包：** `org.koin.core.annotation`

**目标：** `CLASS`、`FUNCTION`、`VALUE_PARAMETER`

**描述：** 为给定定义定义一个限定符。类似于 `@Named`，但形参优先级颠倒。

**参数：**
- `value: KClass<*> = Unit::class` - 类限定符
- `name: String = ""` - 字符串限定符

**行为：**
用于区分同一类型的多个定义。

**示例：**
```kotlin
@Single
@Qualifier(name = "special")
class MyClass(val d : MyDependency)
```

---

## 属性注解

### @Property

**包：** `org.koin.core.annotation`

**目标：** `VALUE_PARAMETER`

**描述：** 注解构造函数形参或函数形参以解析为 Koin 属性。

**参数：**
- `value: String` - 属性名称

**行为：**
从 Koin 属性而不是依赖注入中解析形参值。

**示例：**
```kotlin
@Factory
class MyClass(@Property("name") val name : String)
```

**生成的 Koin DSL：**
```kotlin
factory { MyClass(getProperty("name")) }
```

**带默认值：**
```kotlin
@PropertyValue("name")
val defaultName = "MyName"

@Factory
class MyClass(@Property("name") val name : String)
```

**生成的 Koin DSL：**
```kotlin
factory { MyClass(getProperty("name", defaultName)) }
```

---

### @PropertyValue

**包：** `org.koin.core.annotation`

**目标：** `FIELD`

**描述：** 注解将作为 Property 默认值的字段值。

**参数：**
- `value: String` - 属性名称

**行为：**
为属性定义一个默认值，当找不到该属性时可以使用。

**示例：**
```kotlin
@PropertyValue("name")
val defaultName = "MyName"

@Factory
class MyClass(@Property("name") val name : String)
```

**生成的 Koin DSL：**
```kotlin
factory { MyClass(getProperty("name", defaultName)) }
```

---

## 模块与应用程序注解

### @Module

**包：** `org.koin.core.annotation`

**目标：** `CLASS`

**描述：** 类注解，用于帮助在 Koin 模块中收集定义。每个函数都可以用 Koin 定义注解进行注解。

**参数：**
- `includes: Array<KClass<*>> = []` - 要包含的模块类
- `createdAtStart: Boolean = false` - 如果为 `true`，则模块实例在启动时创建

**行为：**
收集模块中所有带有注解的函数和类。

**示例：**
```kotlin
@Module
class MyModule {
    @Single
    fun myClass(d : MyDependency) = MyClass(d)
}
```

**生成的 Koin DSL：**
```kotlin
val MyModule.module = module {
    val moduleInstance = MyModule()
    single { moduleInstance.myClass(get()) }
}
```

**带包含项：**
```kotlin
@Module(includes = [OtherModule::class])
class MyModule {
    // definitions
}
```

---

### @ComponentScan

**包：** `org.koin.core.annotation`

**目标：** `CLASS`、`FIELD`

**描述：** 收集用 Koin 定义注解声明的定义。扫描当前包或显式包名。

**参数：**
- `value: vararg String = []` - 要扫描的包（支持 glob 模式）

**行为：**
扫描指定包中带有注解的类。支持精确包名和 glob 模式。

**Glob 模式支持：**

1.  **精确包名（无通配符）：**
    - `com.example.service` - 扫描包及所有子包（等同于 `com.example**`）

2.  **包含根的多级扫描：**
    - `com.example**` - 扫描 `com.example` 及所有子包

3.  **不包含根的多级扫描：**
    - `com.example.**` - 仅扫描 `com.example` 的子包，不包括根包

4.  **单级通配符：**
    - `com.example.*.service` - 精确匹配一个级别（例如，`com.example.user.service`）

5.  **组合通配符：**
    - `com.**.service.*data` - 复杂模式匹配
    - `com.*.service.**` - 扫描模式下的子包

**示例 - 扫描当前包：**
```kotlin
@ComponentScan
class MyApp
```

**示例 - 扫描特定包：**
```kotlin
@ComponentScan("com.example.services", "com.example.repositories")
class MyApp
```

**示例 - 带 glob 模式：**
```kotlin
@ComponentScan("com.example.**", "org.app.*.services")
class MyApp
```

---

### @Configuration

**包：** `org.koin.core.annotation`

**目标：** `CLASS`、`FIELD`

**描述：** 应用于 `@Module` 类，以将其与一个或多个配置（标签/变体）关联。

**参数：**
- `value: vararg String = []` - 配置名称

**行为：**
模块可以分组到配置中，以实现条件加载。

**默认配置：**
```kotlin
@Module
@Configuration
class MyModule
```
此模块属于“default”配置。

**多个配置：**
```kotlin
@Module
@Configuration("prod", "test")
class MyModule
```
此模块在“prod”和“test”配置中均可用。

**带默认值：**
```kotlin
@Module
@Configuration("default", "test")
class MyModule
```
在默认和测试配置中可用。

**注意：** `@Configuration("default")` 等同于 `@Configuration`

---

### @KoinApplication

**包：** `org.koin.core.annotation`

**目标：** `CLASS`

**描述：** 将一个类标记为 Koin 应用程序的入口点。使用 `startKoin()` 或 `koinApplication()` 函数生成 Koin 应用程序的引导。

**参数：**
- `configurations: Array<String> = []` - 要扫描的配置名称列表
- `modules: Array<KClass<*>> = [Unit::class]` - 除了配置之外要加载的模块列表

**行为：**
生成引导函数，用于扫描配置和包含的模块。

**示例 - 默认配置：**
```kotlin
@KoinApplication
class MyApp
```

**生成的函数：**
```kotlin
MyApp.startKoin()
MyApp.koinApplication()
```

**示例 - 特定配置：**
```kotlin
@KoinApplication(configurations = ["default", "prod"])
class MyApp
```

**示例 - 带模块：**
```kotlin
@KoinApplication(
    configurations = ["default"],
    modules = [CoreModule::class, ApiModule::class]
)
class MyApp
```

**带自定义配置的用法：**
```kotlin
MyApp.startKoin {
    printLogger()
    // additional configuration
}
```

---

## 监控注解

### @Monitor

**包：** `org.koin.core.annotation`

**目标：** `CLASS`、`FUNCTION`

**描述：** 标记一个类或函数，以便通过 Kotzilla Platform（Koin 的官方工具平台）进行自动监控和性能追踪。

**参数：** 无

**行为：**
- 当应用于类时：生成一个 Koin 代理，监控所有公共方法调用
- 当应用于函数时：监控 Koin 管理组件中的特定方法
- 自动捕获性能指标、错误率和使用模式
- 将数据发送到 Kotzilla 工作区进行实时分析

**要求：**
- `implementation 'io.kotzilla:kotzilla-core:latest.version'`
- 有效的 Kotzilla Platform 账户和 API 密钥

**示例：**
```kotlin
@Monitor
class UserService(private val userRepository: UserRepository) {
    fun findUser(id: String): User? = userRepository.findById(id)
}
```

**资源：**
- [Kotzilla Platform](https://kotzilla.io)
- [完整文档](https://doc.kotzilla.io)
- [最新版本](https://doc.kotzilla.io/docs/releaseNotes/changelogSDK)

**始于：** Kotzilla 1.2.1

---

## 元注解 (内部)

这些注解仅供 Koin 编译器和代码生成内部使用。

### @ExternalDefinition

**包：** `org.koin.meta.annotations`

**目标：** `CLASS`、`FIELD`、`FUNCTION`

**描述：** 内部用于在生成的包中发现组件。

**参数：**
- `value: String = ""` - 声明定义的包

---

### @MetaDefinition

**包：** `org.koin.meta.annotations`

**目标：** `CLASS`、`FUNCTION`、`PROPERTY`

**描述：** 元定义注解，用于帮助表示定义元数据。

**参数：**
- `value: String = ""` - 定义完整路径
- `moduleTagId: String = ""` - 模块标签 + ID (格式: "module_id:module_tag")
- `dependencies: Array<String> = []` - 要检测的形参标签
- `binds: Array<String> = []` - 绑定类型
- `qualifier: String = ""` - 限定符
- `scope: String = ""` - 声明它的 Scope

---

### @MetaModule

**包：** `org.koin.meta.annotations`

**目标：** `CLASS`

**描述：** 元模块注解，用于帮助表示模块元数据。

**参数：**
- `value: String = ""` - 模块完整路径
- `id: String = ""` - 模块 ID
- `includes: Array<String> = []` - 要检测的包含模块标签
- `configurations: Array<String> = []` - 要检测的模块配置
- `isObject: Boolean = false` - 模块是否为对象

---

### @MetaApplication

**包：** `org.koin.meta.annotations`

**目标：** `CLASS`

**描述：** 元应用程序注解，用于帮助表示应用程序元数据。

**参数：**
- `value: String = ""` - 应用程序完整路径
- `includes: Array<String> = []` - 要检测的已使用的模块标签
- `configurations: Array<String> = []` - 要检测的已使用的配置模块

---

## 已弃用注解

### @Singleton

**包：** `org.koin.core.annotation`

**状态：** 已弃用 - 错误级别

**替代方案：** 请使用 `koin-jsr330` 包中的 `@Singleton`

**描述：** 与 `@Single` 相同，但为符合 JSR-330 已弃用。

---

## 汇总表

| 注解 | 包 | 用途 | 常见用例 |
|---|---|---|---|
| `@Single` | `org.koin.core.annotation` | 单例定义 | 共享应用程序服务 |
| `@Factory` | `org.koin.core.annotation` | Factory 定义 | 每次请求的新实例 |
| `@Scoped` | `org.koin.core.annotation` | Scoped 定义 | Scope 特有的实例 |
| `@Scope` | `org.koin.core.annotation` | Scope 声明 | 自定义 Scope |
| `@ViewModelScope` | `org.koin.core.annotation` | ViewModel Scope | ViewModel Scope 特有的依赖项 |
| `@ActivityScope` | `org.koin.android.annotation` | Activity Scope | Activity Scope 特有的依赖项 |
| `@ActivityRetainedScope` | `org.koin.android.annotation` | 保留的 Activity Scope | 跨配置更改保留的依赖项 |
| `@FragmentScope` | `org.koin.android.annotation` | Fragment Scope | Fragment Scope 特有的依赖项 |
| `@ScopeId` | `org.koin.core.annotation` | Scope 解析 | 从特定 Scope 解析 |
| `@KoinViewModel` | `org.koin.android.annotation` | ViewModel 定义 | Android/KMP/CMP ViewModel |
| `@KoinWorker` | `org.koin.android.annotation` | Worker 定义 | WorkManager Worker |
| `@Named` | `org.koin.core.annotation` | 字符串/类型限定符 | 区分同类型 Bean |
| `@Qualifier` | `org.koin.core.annotation` | 类型/字符串限定符 | 区分同类型 Bean |
| `@Property` | `org.koin.core.annotation` | 属性注入 | 配置值 |
| `@PropertyValue` | `org.koin.core.annotation` | 属性默认值 | 默认配置值 |
| `@Module` | `org.koin.core.annotation` | 模块声明 | 分组定义 |
| `@ComponentScan` | `org.koin.core.annotation` | 包扫描 | 自动发现定义 |
| `@Configuration` | `org.koin.core.annotation` | 模块配置 | 构建变体/版本 |
| `@KoinApplication` | `org.koin.core.annotation` | 应用程序入口点 | 引导 Koin |
| `@Monitor` | `org.koin.core.annotation` | 性能监控 | 生产环境监控 |

---

**文档版本：** 1.0
**最近更新：** 2025-10-20
**Koin Annotations 版本：** 2.2.x+