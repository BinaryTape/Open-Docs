---
title: Koin 注解中的作用域
---

在使用定义和模块时，你可能需要为特定的空间和时间解析定义作用域。

## 使用 @Scope 定义作用域

Koin 允许使用作用域。有关其基础知识的更多详细信息，请参阅 [Koin 作用域](/docs/reference/koin-core/scopes.md) 部分。

要使用注解声明作用域，只需在类上使用 `@Scope` 注解，如下所示：

```kotlin
@Scope
class MyScopeClass
```

> 这等效于以下作用域段落：
> ```kotlin
> scope<MyScopeClass> {
> 
>}
> ```

此外，如果你更需要一个作用域名称而不是类型，你需要使用 `@Scope(name = )` 注解，并通过 `name` 形参来标记一个类：

```kotlin
@Scope(name = "my_scope_name")
class MyScopeClass
```

> 这等效于：
>
>```kotlin
>scope<named("my_scope_name")> {
>
>}
>```

## 使用 @Scoped 在作用域中添加定义

要在作用域内声明定义（无论是否使用注解定义），只需使用 `@Scope` 和 `@Scoped` 注解标记一个类：

```kotlin
@Scope(name = "my_scope_name")
@Scoped
class MyScopedComponent
```

这将在作用域段落中生成正确的定义：

```kotlin
scope<named("my_scope_name")> {
  scoped { MyScopedComponent() }
}
```

:::info
  你需要这两个注解，以指示所需的作用域空间（通过 `@Scope`）以及要定义的组件类型（通过 `@Scoped`）。
:::

## 从作用域解析依赖

从一个作用域定义中，你可以解析你的内部作用域和父作用域中的任何定义。

例如，以下情况将起作用：

```kotlin
@Single
class MySingle

@Scope(name = "my_scope_name")
@Scoped
class MyScopedComponent(
  val mySingle : MySingle,
  val myOtherScopedComponent :MyOtherScopedComponent
)

@Scope(name = "my_scope_name")
@Scoped
class MyOtherScopedComponent(
  val mySingle : MySingle
)
```

组件 `MySingle` 被定义为根作用域中的 `single` 定义。`MyScopedComponent` 和 `MyOtherScopedComponent` 定义在 "my_scope_name" 作用域中。
从 `MyScopedComponent` 解析依赖时，会通过 `MySingle` 实例访问 Koin 根作用域，并从当前 "my_scope_name" 作用域访问 `MyOtherScopedComponent` 的作用域实例。

## 使用 @ScopeId 从作用域外部解析 (自 1.3.0 起)

你可能需要从另一个作用域解析组件，该作用域无法直接被你的作用域访问。为此，你需要使用 `@ScopeId` 注解标记你的依赖，以告知 Koin 在给定作用域 ID 的作用域中查找此依赖。

```kotlin
@Factory
class MyFactory(
  @ScopeId("my_scope_id") val myScopedComponent :MyScopedComponent
)
```

以上代码等效于生成的：

```kotlin
factory { Myfactory(getScope("my_scope_id").get()) }
```

此示例表明 `MyFactory` 组件将从 ID 为 "my_scope_id" 的作用域实例中解析 `MyScopedComponent` 组件。这个以 "my_scope_id" 为 ID 创建的作用域需要使用正确的作用域定义来创建。

:::info
  `MyScopedComponent` 组件需要在作用域段落中定义，并且作用域实例需要以 "my_scope_id" 为 ID 创建。
:::

## 作用域原型注解

Koin Annotations 提供了预定义的作用域原型注解，用于常见的作用域模式，无需手动声明作用域类型。这些注解在一个注解中结合了作用域声明和组件定义。

### Android 作用域原型

对于 Android 开发，你可以使用这些预定义的作用域注解：

#### @ActivityScope

在 Activity 作用域中声明一个组件：

```kotlin
@ActivityScope
class ActivityScopedComponent(val dependency: MyDependency)
```

这将生成：
```kotlin
activityScope {
    scoped { ActivityScopedComponent(get()) }
}
```

**用法：** 此标记类旨在与 Activity 和 `activityScope` 函数一起使用，以激活作用域。

#### @ActivityRetainedScope

在 Activity Retained 作用域中声明一个组件（可在配置更改时保留）：

```kotlin
@ActivityRetainedScope
class RetainedComponent(val repository: MyRepository)
```

这将生成：
```kotlin
activityRetainedScope {
    scoped { RetainedComponent(get()) }
}
```

**用法：** 此标记类旨在与 Activity 和 `activityRetainedScope` 函数一起使用，以激活作用域。

#### @FragmentScope

在 Fragment 作用域中声明一个组件：

```kotlin
@FragmentScope
class FragmentScopedComponent(val service: MyService)
```

这将生成：
```kotlin
fragmentScope {
    scoped { FragmentScopedComponent(get()) }
}
```

**用法：** 此标记类旨在与 Fragment 和 `fragmentScope` 函数一起使用，以激活作用域。

### 核心作用域原型

#### @ViewModelScope

在 ViewModel 作用域中声明一个组件。此注解**兼容 Kotlin Multiplatform (KMP)**，并且适用于 Android ViewModel 和 Compose Multiplatform ViewModel：

```kotlin
@ViewModelScope
class ViewModelScopedRepository(val apiService: ApiService)

@ViewModelScope  
class ViewModelScopedUseCase(
    val repository: ViewModelScopedRepository,
    val analytics: AnalyticsService
)
```

这将生成：
```kotlin
viewModelScope {
    scoped { ViewModelScopedRepository(get()) }
    scoped { ViewModelScopedUseCase(get(), get()) }
}
```

**用法：** 此标记类旨在与 ViewModel 和 `viewModelScope` 函数一起使用，以激活作用域。

**KMP 支持：** 可在所有 Kotlin Multiplatform 目标平台（包括使用 ViewModel 的 Android、iOS、桌面和 Web 平台）上无缝工作。

### 使用作用域原型

作用域原型注解可与常规 Koin 作用域无缝协作：

```kotlin
// Regular components
@Single
class GlobalService

// Scoped components using archetypes
@ActivityScope
class ActivityService(val global: GlobalService)

@FragmentScope  
class FragmentService(
    val global: GlobalService,
    val activity: ActivityService
)
```

### 与函数定义结合使用

作用域原型也可以在模块内的函数上使用：

```kotlin
@Module
class MyModule {
    
    @ActivityScope
    fun activityComponent(dep: MyDependency) = MyActivityComponent(dep)
    
    @FragmentScope
    fun fragmentComponent(dep: MyDependency) = MyFragmentComponent(dep)
}
```

:::info
作用域原型注解会自动创建适当的作用域定义和作用域组件声明，从而减少常见作用域模式的样板代码。
:::