---
title: Koin 註解中的作用域
---

當使用定義與模組時，你可能需要為特定的空間與時間解析定義作用域。

## 使用 @Scope 定義作用域

Koin 允許使用作用域，請參考 [Koin 作用域](/docs/reference/koin-core/scopes.md) 章節以獲取更多基本資訊。

若要使用註解宣告作用域，只需在類別上使用 `@Scope` 註解，如下所示：

```kotlin
@Scope
class MyScopeClass
```

> 這將等同於以下作用域區塊：
> ```kotlin
> scope<MyScopeClass> {
>
>}
> ```

此外，如果你需要作用域名稱而非型別，你需要使用 `@Scope(name = )` 註解，並利用 `name` 參數標記類別：

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

若要在作用域（無論是否使用註解定義）中宣告定義，只需使用 `@Scope` 和 `@Scoped` 註解標記類別：

```kotlin
@Scope(name = "my_scope_name")
@Scoped
class MyScopedComponent
```

這將在作用域區塊中生成正確的定義：

```kotlin
scope<named("my_scope_name")> {
  scoped { MyScopedComponent() }
}
```

:::info
  你需要這兩個註解，以指示所需的作用域空間（使用 `@Scope`）以及要定義的元件類型（使用 `@Scoped`）。
:::

## 從作用域解析依賴項

從一個作用域定義中，你可以解析來自內部作用域及父作用域的任何定義。

例如，以下情況將會生效：

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

元件 `MySingle` 在根（root）中定義為 `single` 定義。`MyScopedComponent` 和 `MyOtherScopedComponent` 定義在 "my_scope_name" 作用域中。
`MyScopedComponent` 的依賴項解析會透過 `MySingle` 實例存取 Koin 根，並從當前的 "my_scope_name" 作用域取得 `MyOtherScopedComponent` 的作用域實例。

## 使用 @ScopeId 在作用域外部解析 (自 1.3.0 起)

你可能需要從另一個作用域解析元件，而該作用域無法直接從你的作用域存取。為此，你需要使用 `@ScopeId` 註解標記你的依賴項，以告知 Koin 在給定作用域 ID 的作用域中尋找此依賴項。

```kotlin
@Factory
class MyFactory(
  @ScopeId("my_scope_id") val myScopedComponent :MyScopedComponent
)
```

上述程式碼等同於生成的：

```kotlin
factory { Myfactory(getScope("my_scope_id").get()) }
```

這個範例顯示 `MyFactory` 元件將從 ID 為 "my_scope_id" 的作用域實例解析 `MyScopedComponent` 元件。這個以 "my_scope_id" 為 ID 建立的作用域需要以正確的作用域定義來建立。

:::info
  `MyScopedComponent` 元件需要在作用域區塊中定義，並且作用域實例需要以 "my_scope_id" 為 ID 建立。
:::