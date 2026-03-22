# Koin 注解清单

本文档提供了所有 Koin 注解及其形参、行为和用法示例的详尽清单。

## 目录

- [定义注解](#definition-annotations)
  - [@Single](#single)
  - [@Factory](#factory)
  - [@Scoped](#scoped)
- [作用域注解](#scope-annotations)
  - [@Scope](#scope)
  - [@ViewModelScope](#viewmodelscope)
  - [@ActivityScope](#activityscope)
  - [@ActivityRetainedScope](#activityretainedscope)
  - [@FragmentScope](#fragmentscope)
  - [@ScopeId](#scopeid)
- [ViewModel 与 Android 特定注解](#viewmodel--android-specific-annotations)
  - [@KoinViewModel](#koinviewmodel)
  - [@KoinWorker](#koinworker)
- [限定符注解](#qualifier-annotations)
  - [@Named](#named)
  - [@Qualifier](#qualifier)
- [属性注解](#property-annotations)
  - [@Property](#property)
  - [@PropertyValue](#propertyvalue)
- [模块与应用注解](#module--application-annotations)
  - [@Module](#module)
  - [@ComponentScan](#componentscan)
  - [@Configuration](#configuration)
  - [@KoinApplication](#koinapplication)
- [监控注解](#monitoring-annotations)
  - [@Monitor](#monitor)
- [元注解（内部）](#meta-annotations-internal)
  - [@ExternalDefinition](#externaldefinition)
  - [@MetaDefinition](#metadefinition)
  - [@MetaModule](#metamodule)
  - [@MetaApplication](#metaapplication)

---

## 定义注解

### @Single

**软件包：** `org.koin.core.annotation`

**目标：** `CLASS`, `FUNCTION`

**描述：** 在 Koin 中将类型或函数声明为 `single`（单例）定义。一个单例实例会被创建并在整个应用程序中共享。

**形参：**
- `binds: Array<KClass<*>> = [Unit::class]` - 要绑定到此定义的显式类型。父类型会被自动检测。
- `createdAtStart: Boolean = false` - 如果为 `true`，则在 Koin 启动时创建实例。

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

**使用显式绑定：**
```kotlin
@Single(binds = [MyInterface::class])
class MyClass(val d : MyDependency) : MyInterface
```

**在启动时创建：**
```kotlin
@Single(createdAtStart = true)
class MyClass(val d : MyDependency)
```

---

### @Factory

**软件包：** `org.koin.core.annotation`

**目标：** `CLASS`, `FUNCTION`

**描述：** 在 Koin 中将类型或函数声明为 `factory`（工厂）定义。每次请求时都会创建一个新实例。

**形参：**
- `binds: Array<KClass<*>> = [Unit::class]` - 要绑定到此定义的显式类型。父类型会被自动检测。

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

**软件包：** `org.koin.core.annotation`

**目标：** `CLASS`, `FUNCTION`

**描述：** 在 Koin 中将类型或函数声明为 `scoped`（作用域）定义。必须与 `@Scope` 注解关联。实例在特定的作用域内共享。

**形参：**
- `binds: Array<KClass<*>> = [Unit::class]` - 要绑定到此定义的显式类型。父类型会被自动检测。

**行为：**
创建一个在定义的作用域生命周期内生存的作用域实例。

**示例：**
```kotlin
@Scope(MyScope::class)
@Scoped
class MyClass(val d : MyDependency)
```

**另请参阅：** [@Scope](#scope)

---

## 作用域注解

### @Scope

**软件包：** `org.koin.core.annotation`

**目标：** `CLASS`, `FUNCTION`

**描述：** 在 Koin 作用域中声明一个类。作用域名称由值（类）或名称（字符串）描述。默认情况下，声明一个 `scoped` 定义。可以使用 `@Scoped`、`@Factory`、`@KoinViewModel` 注解进行重写以实现显式绑定。

**形参：**
- `value: KClass<*> = Unit::class` - 作用域类值
- `name: String = ""` - 作用域字符串值

**行为：**
创建一个与指定的作用域类型或名称关联的作用域定义。

**使用类的示例：**
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

**使用字符串名称的示例：**
```kotlin
@Scope(name = "my_custom_scope")
class MyClass(val d : MyDependency)
```

---

### @ViewModelScope

**软件包：** `org.koin.core.annotation`

**目标：** `CLASS`, `FUNCTION`

**描述：** 在 ViewModelScope Koin 作用域中声明一个类。这是应在 ViewModel 生命周期内生存的组件的作用域原型。

**形参：** 无

**行为：**
在 `viewModelScope` 内创建一个作用域定义。

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
被标记的类旨在与 ViewModel 和 `viewModelScope` 函数一起使用以激活作用域。

---

### @ActivityScope

**软件包：** `org.koin.android.annotation`

**目标：** `CLASS`, `FUNCTION`

**描述：** 在 Activity Koin 作用域中声明一个类。

**形参：** 无

**行为：**
在 `activityScope` 内创建一个作用域定义。

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
被标记的类旨在与 Activity 和 `activityScope` 函数一起使用以激活作用域。

---

### @ActivityRetainedScope

**软件包：** `org.koin.android.annotation`

**目标：** `CLASS`, `FUNCTION`

**描述：** 在 Activity Koin 作用域中声明一个类，但在配置更改后仍保留。

**形参：** 无

**行为：**
在 `activityRetainedScope` 内创建一个作用域定义。

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
被标记的类旨在与 Activity 和 `activityRetainedScope` 函数一起使用以激活作用域。

---

### @FragmentScope

**软件包：** `org.koin.android.annotation`

**目标：** `CLASS`, `FUNCTION`

**描述：** 在 Fragment Koin 作用域中声明一个类。

**形参：** 无

**行为：**
在 `fragmentScope` 内创建一个作用域定义。

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
被标记的类旨在与 Fragment 和 `fragmentScope` 函数一起使用以激活作用域。

---

### @ScopeId

**软件包：** `org.koin.core.annotation`

**目标：** `VALUE_PARAMETER`

**描述：** 注解类构造函数或函数中的形参，以请求使用作用域 ID 对给定作用域进行解析。

**形参：**
- `value: KClass<*> = Unit::class` - 作用域类型
- `name: String = ""` - 作用域字符串标识符

**行为：**
从由类型或名称标识的特定作用域中解析依赖项。

**使用字符串名称的示例：**
```kotlin
@Factory
class MyClass(@ScopeId(name = "my_scope_id") val d : MyDependency)
```

**生成的 Koin DSL：**
```kotlin
factory { MyClass(getScope("my_scope_id").get()) }
```

**使用类型的示例：**
```kotlin
@Factory
class MyClass(@ScopeId(MyScope::class) val d : MyDependency)
```

---

## ViewModel 与 Android 特定注解

### @KoinViewModel

**软件包：** `org.koin.android.annotation`

**目标：** `CLASS`, `FUNCTION`

**描述：** Koin 定义的 ViewModel 注解。在 Koin 中将类型或函数声明为 `viewModel` 定义。

**平台支持：**
- ✅ Android
- ✅ Kotlin 多平台 (KMP)
- ✅ Compose 多平台 (CMP)

**形参：**
- `binds: Array<KClass<*>> = []` - 要绑定到此定义的显式类型。父类型会被自动检测。

**行为：**
所有依赖项均通过构造函数注入填充。创建一个由 Koin 管理的 ViewModel 实例。在使用 Compose 多平台时，适用于包括 Android、iOS、桌面和 Web 在内的所有平台。

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

**软件包：** `org.koin.android.annotation`

**目标：** `CLASS`, `FUNCTION`

**描述：** Koin 定义的 Worker 注解。将类型声明为 WorkManager worker 的 `worker` 定义。

**形参：**
- `binds: Array<KClass<*>> = []` - 要绑定到此定义的显式类型。

**行为：**
为 Android WorkManager 集成创建一个 worker 定义。

**示例：**
```kotlin
@KoinWorker
class MyWorker() : Worker()
```

---

## 限定符注解

### @Named

**软件包：** `org.koin.core.annotation`

**目标：** `CLASS`, `FUNCTION`, `VALUE_PARAMETER`

**描述：** 为给定定义定义限定符。生成 `StringQualifier("...")` 或基于类型的限定符。

**形参：**
- `value: String = ""` - 字符串限定符
- `type: KClass<*> = Unit::class` - 类限定符

**行为：**
用于区分相同类型的多个定义。

**使用字符串的示例：**
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

**使用类型的示例：**
```kotlin
@Single
@Named(type = MyType::class)
class MyClass(val d : MyDependency)
```

---

### @Qualifier

**软件包：** `org.koin.core.annotation`

**目标：** `CLASS`, `FUNCTION`, `VALUE_PARAMETER`

**描述：** 为给定定义定义限定符。与 `@Named` 类似，但形参优先级相反。

**形参：**
- `value: KClass<*> = Unit::class` - 类限定符
- `name: String = ""` - 字符串限定符

**行为：**
用于区分相同类型的多个定义。

**示例：**
```kotlin
@Single
@Qualifier(name = "special")
class MyClass(val d : MyDependency)
```

---

## 属性注解

### @Property

**软件包：** `org.koin.core.annotation`

**目标：** `VALUE_PARAMETER`

**描述：** 注解构造函数形参或函数形参，以作为 Koin 属性进行解析。

**形参：**
- `value: String` - 属性名称

**行为：**
从 Koin 属性而非依赖项注入中解析形参值。

**示例：**
```kotlin
@Factory
class MyClass(@Property("name") val name : String)
```

**生成的 Koin DSL：**
```kotlin
factory { MyClass(getProperty("name")) }
```

**带有默认值：**
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

**软件包：** `org.koin.core.annotation`

**目标：** `FIELD`

**描述：** 注解将作为属性默认值的字段值。

**形参：**
- `value: String` - 属性名称

**行为：**
为属性定义一个默认值，可在找不到该属性时使用。

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

## 模块与应用注解

### @Module

**软件包：** `org.koin.core.annotation`

**目标：** `CLASS`

**描述：** 类注解，辅助收集 Koin 模块内定义的定义。每个函数都可以使用 Koin 定义注解进行注解。

**形参：**
- `includes: Array<KClass<*>> = []` - 要包含的模块类
- `createdAtStart: Boolean = false` - 如果为 `true`，则在启动时创建模块实例

**行为：**
收集模块内所有带有注解的函数和类。

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

**包含其他模块：**
```kotlin
@Module(includes = [OtherModule::class])
class MyModule {
    // 定义
}
```

---

### @ComponentScan

**软件包：** `org.koin.core.annotation`

**目标：** `CLASS`, `FIELD`

**描述：** 收集使用 Koin 定义注解声明的定义。扫描当前软件包或显式软件包名称。

**形参：**
- `value: vararg String = []` - 要扫描的软件包（支持通配符模式）

**行为：**
扫描指定软件包中带有注解的类。支持精确软件包名称和通配符 (Glob) 模式。

**通配符 (Glob) 模式支持：**

1. **精确软件包名称（无通配符）：**
   - `com.example.service` - 扫描软件包及其所有子软件包（等同于 `com.example**`）

2. **包含根的多级扫描：**
   - `com.example**` - 扫描 `com.example` 及其所有子软件包

3. **排除根的多级扫描：**
   - `com.example.**` - 仅扫描 `com.example` 的子软件包，排除根

4. **单级通配符：**
   - `com.example.*.service` - 精确匹配一级（例如：`com.example.user.service`）

5. **组合通配符：**
   - `com.**.service.*data` - 复杂的模式匹配
   - `com.*.service.**` - 扫描模式下的子软件包

**示例 - 扫描当前软件包：**
```kotlin
@ComponentScan
class MyApp
```

**示例 - 扫描特定软件包：**
```kotlin
@ComponentScan("com.example.services", "com.example.repositories")
class MyApp
```

**示例 - 使用通配符模式：**
```kotlin
@ComponentScan("com.example.**", "org.app.*.services")
class MyApp
```

---

### @Configuration

**软件包：** `org.koin.core.annotation`

**目标：** `CLASS`, `FIELD`

**描述：** 应用于 `@Module` 类，以将其与一个或多个配置（标签/变体）关联。

**形参：**
- `value: vararg String = []` - 配置名称

**行为：**
模块可以分组到配置中，以便进行条件加载。

**默认配置：**
```kotlin
@Module
@Configuration
class MyModule
```
此模块是 "default" 配置的一部分。

**多个配置：**
```kotlin
@Module
@Configuration("prod", "test")
class MyModule
```
此模块在 "prod" 和 "test" 配置中均可用。

**带有默认配置：**
```kotlin
@Module
@Configuration("default", "test")
class MyModule
```
在默认配置和测试配置中可用。

**注意：** `@Configuration("default")` 等同于 `@Configuration`

---

### @KoinApplication

**软件包：** `org.koin.core.annotation`

**目标：** `CLASS`

**描述：** 将类标记为 Koin 应用程序入口点。通过 `startKoin()` 或 `koinApplication()` 函数生成 Koin 应用程序引导程序。

**形参：**
- `configurations: Array<String> = []` - 要扫描的配置名称列表
- `modules: Array<KClass<*>> = [Unit::class]` - 除配置外要加载的模块列表

**行为：**
生成扫描配置和所含模块的引导函数。

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

**示例 - 带有模块：**
```kotlin
@KoinApplication(
    configurations = ["default"],
    modules = [CoreModule::class, ApiModule::class]
)
class MyApp
```

**使用自定义配置：**
```kotlin
MyApp.startKoin {
    printLogger()
    // 额外配置
}
```

---

## 监控注解

### @Monitor

**软件包：** `org.koin.core.annotation`

**目标：** `CLASS`, `FUNCTION`

**描述：** 将类或函数标记为通过 Kotzilla 平台（Koin 的官方工具平台）进行自动监控和性能跟踪。

**形参：** 无

**行为：**
- 应用于类时：生成一个 Koin 代理，监控所有公开方法调用。
- 应用于函数时：在 Koin 管理的组件中监控该特定方法。
- 自动捕获性能指标、错误率和使用模式。
- 将数据发送到 Kotzilla 工作区进行实时分析。

**要求：**
- `implementation 'io.kotzilla:kotzilla-core:latest.version'`
- 有效的 Kotzilla 平台帐户和 API 密钥

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

## 元注解（内部）

这些注解仅供 Koin 编译器和代码生成内部使用。

### @ExternalDefinition

**软件包：** `org.koin.meta.annotations`

**目标：** `CLASS`, `FIELD`, `FUNCTION`

**描述：** 内部使用，用于在生成的软件包中发现组件。

**形参：**
- `value: String = ""` - 声明定义的软件包

---

### @MetaDefinition

**软件包：** `org.koin.meta.annotations`

**目标：** `CLASS`, `FUNCTION`, `PROPERTY`

**描述：** 元定义注解，辅助表示定义元数据。

**形参：**
- `value: String = ""` - 定义完整路径
- `moduleTagId: String = ""` - 模块标签 + ID（格式："module_id:module_tag"）
- `dependencies: Array<String> = []` - 要检查的形参标签
- `binds: Array<String> = []` - 绑定类型
- `qualifier: String = ""` - 限定符
- `scope: String = ""` - 声明它的作用域

---

### @MetaModule

**软件包：** `org.koin.meta.annotations`

**目标：** `CLASS`

**描述：** 元模块注解，辅助表示模块元数据。

**形参：**
- `value: String = ""` - 模块完整路径
- `id: String = ""` - 模块 ID
- `includes: Array<String> = []` - 要检查的包含模块标签
- `configurations: Array<String> = []` - 要检查的模块配置
- `isObject: Boolean = false` - 模块是否为对象

---

### @MetaApplication

**软件包：** `org.koin.meta.annotations`

**目标：** `CLASS`

**描述：** 元应用注解，辅助表示应用程序元数据。

**形参：**
- `value: String = ""` - 应用程序完整路径
- `includes: Array<String> = []` - 要检查的所用模块标签
- `configurations: Array<String> = []` - 要检查的所用配置模块

---

## 弃用的注解

### @Singleton

**软件包：** `org.koin.core.annotation`

**状态：** 已弃用 - ERROR 级别

**替代：** 请改用来自 `koin-jsr330` 软件包的 `@Singleton`

**描述：** 与 `@Single` 相同，但为了符合 JSR-330 标准而弃用。

---

## 摘要表

| 注解 | 软件包 | 用途 | 常见用例 |
|------------|---------|---------|-----------------|
| `@Single` | `org.koin.core.annotation` | 单例定义 | 共享的应用程序服务 |
| `@Factory` | `org.koin.core.annotation` | 工厂定义 | 每次请求的实例 |
| `@Scoped` | `org.koin.core.annotation` | 作用域定义 | 作用域特定的实例 |
| `@Scope` | `org.koin.core.annotation` | 作用域声明 | 自定义作用域 |
| `@ViewModelScope` | `org.koin.core.annotation` | ViewModel 作用域 | ViewModel 作用域内的依赖项 |
| `@ActivityScope` | `org.koin.android.annotation` | Activity 作用域 | Activity 作用域内的依赖项 |
| `@ActivityRetainedScope` | `org.koin.android.annotation` | 保留的 Activity 作用域 | 在配置更改后存续的依赖项 |
| `@FragmentScope` | `org.koin.android.annotation` | Fragment 作用域 | Fragment 作用域内的依赖项 |
| `@ScopeId` | `org.koin.core.annotation` | 作用域解析 | 从特定作用域解析 |
| `@KoinViewModel` | `org.koin.android.annotation` | ViewModel 定义 | Android/KMP/CMP ViewModels |
| `@KoinWorker` | `org.koin.android.annotation` | Worker 定义 | WorkManager worker |
| `@Named` | `org.koin.core.annotation` | 字符串/类型限定符 | 区分同类型的 bean |
| `@Qualifier` | `org.koin.core.annotation` | 类型/字符串限定符 | 区分同类型的 bean |
| `@Property` | `org.koin.core.annotation` | 属性注入 | 配置值 |
| `@PropertyValue` | `org.koin.core.annotation` | 属性默认值 | 默认配置值 |
| `@Module` | `org.koin.core.annotation` | 模块声明 | 分组定义 |
| `@ComponentScan` | `org.koin.core.annotation` | 软件包扫描 | 自动发现定义 |
| `@Configuration` | `org.koin.core.annotation` | 模块配置 | 构建变体/变体 |
| `@KoinApplication` | `org.koin.core.annotation` | 应用入口点 | 引导 Koin |
| `@Monitor` | `org.koin.core.annotation` | 性能监控 | 生产环境监控 |

---

**文档版本：** 1.0
**最后更新：** 2025-10-20
**Koin Annotations 版本：** 2.2.x+