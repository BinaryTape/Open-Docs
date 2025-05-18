---
title: "Koin Annotations 中的作用域 (Scopes)"
---
在使用定義和模組時，您可能需要為特定的空間和時間解析度定義作用域（Scope）。

## 使用 @Scope 定義作用域

Koin 允許使用作用域（Scope），有關基礎知識的更多詳細訊息，請參閱 [Koin Scopes](/reference/koin-core/scopes.md) 部分。

要使用註解宣告作用域，只需在類別上使用 `@Scope` 註解，如下所示：

```kotlin
@Scope
class MyScopeClass
```

> 這將等同於以下作用域部分：
> ```kotlin
> scope<MyScopeClass> {
> 
>}
> ```

或者，如果您需要的不僅僅是型別的作用域名稱，則需要使用 `name` 參數，使用 `@Scope(name = )` 註解來標記類別：

```kotlin
@Scope(name = "my_scope_name")
class MyScopeClass
```

> 這將等同於
>
>```kotlin
>scope<named("my_scope_name")> {
>
>}
>```

## 使用 @Scoped 在作用域中新增定義

要在作用域內（無論是否使用註解定義）宣告定義，只需使用 `@Scope` 和 `@Scoped` 註解來標記類別：

```kotlin
@Scope(name = "my_scope_name")
@Scoped
class MyScopedComponent
```

這將在作用域部分中生成正確的定義：

```kotlin
scope<named("my_scope_name")> {
  scoped { MyScopedComponent() }
}
```

:::info
您需要這兩個註解，以指示所需的作用域空間（使用 `@Scope`）和要定義的元件種類（使用 `@Scoped`）。
:::

## 從作用域解析依賴項

從作用域定義中，您可以解析來自內部作用域和父作用域的任何定義。

例如，以下案例將起作用：

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

元件 `MySingle` 定義為根目錄中的 `single` 定義。 `MyScopedComponent` 和 `MyOtherScopedComponent` 在作用域 "my_scope_name" 中定義。
從 `MyScopedComponent` 解析依賴項會使用 `MySingle` 實例存取 Koin 根目錄，並從當前 "my_scope_name" 作用域存取 `MyOtherScopedComponent` 作用域實例。

## 使用 @ScopeId 從作用域外部解析 (自 1.3.0 起)

您可能需要從另一個作用域解析元件，而您的作用域無法直接存取該作用域。 為此，您需要使用 `@ScopeId` 註解來標記您的依賴項，以告知 Koin 在給定作用域 ID 的作用域中尋找此依賴項。

```kotlin
@Factory
class MyFactory(
  @ScopeId("my_scope_id") val myScopedComponent :MyScopedComponent
)
```

上面的程式碼等同於產生的程式碼：

```kotlin
factory { Myfactory(getScope("my_scope_id").get()) }
```

此範例顯示 `MyFactory` 元件將從具有 id "my_scope_id" 的作用域實例解析 `MyScopedComponent` 元件。 需要使用正確的作用域定義來建立使用 id "my_scope_id" 建立的此作用域。

:::info
`MyScopedComponent` 元件需要在 Scope 部分中定義，並且需要使用 id "my_scope_id" 建立作用域實例。
:::