---
title: Koin Annotations 中的作用域
---

在使用定义和模块时，您可能需要为特定的空间和时间分辨率定义作用域。

## 使用 @Scope 定义作用域

Koin 允许使用作用域。请参阅 [Koin 作用域](/docs/reference/koin-core/scopes) 部分以了解更多基础细节。 

要使用注解声明作用域，只需在类上使用 `@Scope` 注解，如下所示：

```kotlin
@Scope
class MyScopeClass
```

> 这将等同于以下作用域部分：
> ```kotlin
> scope<MyScopeClass> {
> 
>}
> ```

否则，如果您需要一个作用域名称而不仅仅是类型，则需要使用 `name` 形参为类标记 `@Scope(name = )` 注解：

```kotlin
@Scope(name = "my_scope_name")
class MyScopeClass
```

> 这将等同于：
>
>```kotlin
>scope<named("my_scope_name")> {
>
>}
>```

## 使用 @Scoped 在作用域中添加定义

要在作用域（无论是否使用注解定义）内声明一个定义，只需为类标记 `@Scope` 和 `@Scoped` 注解：

```kotlin
@Scope(name = "my_scope_name")
@Scoped
class MyScopedComponent
```

这将在作用域部分中生成正确的定义：

```kotlin
scope<named("my_scope_name")> {
  scoped { MyScopedComponent() }
}
```

:::info
  您需要同时使用这两个注解来指示所需的作用域空间（使用 `@Scope`）和要定义的组件类型（使用 `@Scoped`）。
:::

## 作用域中的依赖项解析

在作用域定义中，您可以解析来自内部作用域和父作用域的任何定义。

例如，以下案例将正常工作：

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

组件 `MySingle` 在根节点中被定义为 `single` 定义。`MyScopedComponent` 和 `MyOtherScopedComponent` 定义在作用域 "my_scope_name" 中。
来自 `MyScopedComponent` 的依赖项解析正在访问带有 `MySingle` 实例的 Koin 根节点，以及来自当前 "my_scope_name" 作用域的 `MyOtherScopedComponent` 作用域实例。

## 使用 @ScopeId 在作用域外解析（自 1.3.0 起）

您可能需要从另一个作用域中解析一个您的作用域无法直接访问的组件。为此，您需要使用 `@ScopeId` 注解标记您的依赖项，以告知 Koin 在给定作用域 ID 的作用域中查找此依赖项。

使用字符串名称：

```kotlin
@Factory
class MyFactory(
  @ScopeId(name = "my_scope_id") val myScopedComponent : MyScopedComponent
)
```

或使用类型引用：

```kotlin
@Factory
class MyFactory(
  @ScopeId(MyScope::class) val myScopedComponent : MyScopedComponent
)
```

上述代码生成的等效代码如下：

```kotlin
factory { Myfactory(getScope("my_scope_id").get()) }
```

这个例子显示 `MyFactory` 组件将从 ID 为 "my_scope_id" 的作用域实例中解析 `MyScopedComponent` 组件。这个以 ID "my_scope_id" 创建的作用域需要使用正确的作用域定义来创建。

:::info
  `MyScopedComponent` 组件需要在作用域部分中定义，并且需要使用 ID "my_scope_id" 创建一个作用域实例。 
:::

## 作用域原型注解

Koin Annotations 为常见的作用域模式提供了预定义的作用域原型注解，从而无需手动声明作用域类型。这些注解在单个注解中结合了作用域声明和组件定义。

### Android 作用域原型

对于 Android 开发，您可以使用这些预定义的作用域注解：

#### @ActivityScope

在 Activity 作用域中声明组件：

```kotlin
@ActivityScope
class ActivityScopedComponent(val dependency: MyDependency)
```

这会生成：
```kotlin
activityScope {
    scoped { ActivityScopedComponent(get()) }
}
```

**用法：** 标记的类旨在与 Activity 以及 `activityScope` 函数配合使用以激活作用域。

#### @ActivityRetainedScope

在 Activity Retained 作用域（在配置更改后依然存在）中声明组件：

```kotlin
@ActivityRetainedScope
class RetainedComponent(val repository: MyRepository)
```

这会生成：
```kotlin
activityRetainedScope {
    scoped { RetainedComponent(get()) }
}
```

**用法：** 标记的类旨在与 Activity 以及 `activityRetainedScope` 函数配合使用以激活作用域。

#### @FragmentScope

在 Fragment 作用域中声明组件：

```kotlin
@FragmentScope
class FragmentScopedComponent(val service: MyService)
```

这会生成：
```kotlin
fragmentScope {
    scoped { FragmentScopedComponent(get()) }
}
```

**用法：** 标记的类旨在与 Fragment 以及 `fragmentScope` 函数配合使用以激活作用域。

### 核心作用域原型

#### @ViewModelScope

在 ViewModel 作用域中声明组件。此注解**兼容 Kotlin Multiplatform (KMP)**，适用于 Android ViewModel 和 Compose Multiplatform ViewModel：

```kotlin
@ViewModelScope
class ViewModelScopedRepository(val apiService: ApiService)

@ViewModelScope  
class ViewModelScopedUseCase(
    val repository: ViewModelScopedRepository,
    val analytics: AnalyticsService
)
```

这会生成：
```kotlin
viewModelScope {
    scoped { ViewModelScopedRepository(get()) }
    scoped { ViewModelScopedUseCase(get(), get()) }
}
```

**用法：** 标记的类旨在与 ViewModel 以及 `viewModelScope` 函数配合使用以激活作用域。

**KMP 支持：** 在使用 ViewModel 的所有 Kotlin Multiplatform 目标（包括 Android、iOS、桌面和 Web 平台）上无缝工作。

### 使用作用域原型

作用域原型注解可与常规 Koin 作用域无缝配合：

```kotlin
// 常规组件
@Single
class GlobalService

// 使用原型的作用域组件
@ActivityScope
class ActivityService(val global: GlobalService)

@FragmentScope  
class FragmentService(
    val global: GlobalService,
    val activity: ActivityService
)
```

### 与函数定义结合使用

作用域原型也可以用于模块内的函数：

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
作用域原型注解会自动创建适当的作用域定义和作用域组件声明，从而减少常见作用域模式的模板代码。
:::