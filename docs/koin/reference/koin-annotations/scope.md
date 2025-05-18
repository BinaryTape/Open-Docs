---
title: "Koin 注解中的作用域 (Scopes)"
---
在使用定义（definitions）和模块（modules）时，您可能需要为特定的空间和时间分辨率定义作用域（scopes）。

## 使用 @Scope 定义作用域

Koin 允许使用作用域，有关基础知识的更多详细信息，请参阅 [Koin 作用域](/reference/koin-core/scopes.md) 部分。

要使用注解（annotations）声明作用域，只需在类上使用 `@Scope` 注解，如下所示：

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

另外，如果您需要的不是类型而是作用域名称，则需要使用 `name` 参数使用 `@Scope(name = )` 注解标记一个类：

```kotlin
@Scope(name = "my_scope_name")
class MyScopeClass
```

> 这将等同于
>
> ```kotlin
>scope<named("my_scope_name")> {
>
>}
>```

## 使用 @Scoped 在作用域中添加定义

要在作用域内（无论是否使用注解定义）声明定义，只需使用 `@Scope` 和 `@Scoped` 注解标记一个类：

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
您需要同时使用这两个注解，以指示所需的作用域空间（使用 `@Scope`）和要定义的组件类型（使用 `@Scoped`）。
:::

## 从作用域解析依赖

从作用域定义中，您可以解析来自内部作用域和父作用域的任何定义。

例如，以下情况可以正常工作：

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

组件 `MySingle` 在根作用域中定义为 `single` 定义。`MyScopedComponent` 和 `MyOtherScopedComponent` 在 "my_scope_name" 作用域中定义。
从 `MyScopedComponent` 进行依赖解析时，会使用 `MySingle` 实例访问 Koin 根作用域，并从当前的 "my_scope_name" 作用域访问 `MyOtherScopedComponent` 的作用域实例。

## 使用 @ScopeId 从作用域外部解析 (since 1.3.0)

您可能需要从另一个作用域解析组件，而您的作用域无法直接访问该组件。为此，您需要使用 `@ScopeId` 注解标记您的依赖项，以告知 Koin 在给定作用域 ID 的作用域中查找此依赖项。

```kotlin
@Factory
class MyFactory(
  @ScopeId("my_scope_id") val myScopedComponent :MyScopedComponent
)
```

上面的代码等效于生成的代码：

```kotlin
factory { MyFactory(getScope("my_scope_id").get()) }
```

此示例表明 `MyFactory` 组件将从具有 id "my_scope_id" 的作用域实例解析 `MyScopedComponent` 组件。需要使用正确的作用域定义创建使用 id "my_scope_id" 创建的此作用域。

:::info
`MyScopedComponent` 组件需要在 Scope 部分中定义，并且需要使用 id "my_scope_id" 创建作用域实例。
:::