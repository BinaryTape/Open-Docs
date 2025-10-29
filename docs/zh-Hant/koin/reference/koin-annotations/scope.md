---
title: Koin 註解中的作用域
---

當使用定義與模組時，你可能需要為特定的空間與時間解析定義作用域。

## 使用 @Scope 定義作用域

Koin 允許使用作用域。請參考 [Koin 作用域](/docs/reference/koin-core/scopes.md) 章節以獲取更多基本資訊。

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

## 作用域原型註解

Koin Annotations 提供了預先定義的作用域原型註解，用於常見的作用域模式，從而無需手動宣告作用域類型。這些註解將作用域宣告和元件定義結合在單一註解中。

### Android 作用域原型

對於 Android 開發，你可以使用這些預先定義的作用域註解：

#### @ActivityScope

在 Activity 作用域中宣告一個元件：

```kotlin
@ActivityScope
class ActivityScopedComponent(val dependency: MyDependency)
```

這會生成：
```kotlin
activityScope {
    scoped { ActivityScopedComponent(get()) }
}
```

**用法：** 被標記的類別旨在與 Activity 和 `activityScope` 函式一起使用以啟用作用域。

#### @ActivityRetainedScope

在 Activity Retained 作用域中宣告一個元件（可在設定變更後保留）：

```kotlin
@ActivityRetainedScope
class RetainedComponent(val repository: MyRepository)
```

這會生成：
```kotlin
activityRetainedScope {
    scoped { RetainedComponent(get()) }
}
```

**用法：** 被標記的類別旨在與 Activity 和 `activityRetainedScope` 函式一起使用以啟用作用域。

#### @FragmentScope

在 Fragment 作用域中宣告一個元件：

```kotlin
@FragmentScope
class FragmentScopedComponent(val service: MyService)
```

這會生成：
```kotlin
fragmentScope {
    scoped { FragmentScopedComponent(get()) }
}
```

**用法：** 被標記的類別旨在與 Fragment 和 `fragmentScope` 函式一起使用以啟用作用域。

### 核心作用域原型

#### @ViewModelScope

在 ViewModel 作用域中宣告一個元件。這個註解是 **Kotlin 多平台 (KMP) 相容的**，並且適用於 Android ViewModels 和 Compose Multiplatform ViewModels：

```kotlin
@ViewModelScope
class ViewModelScopedRepository(val apiService: ApiService)

@ViewModelScope  
class ViewModelScopedUseCase(
    val repository: ViewModelScopedRepository,
    val analytics: AnalyticsService
)
```

這會生成：
```kotlin
viewModelScope {
    scoped { ViewModelScopedRepository(get()) }
    scoped { ViewModelScopedUseCase(get(), get()) }
}
```

**用法：** 被標記的類別旨在與 ViewModel 和 `viewModelScope` 函式一起使用以啟用作用域。

**KMP 支援：** 無縫地適用於所有 Kotlin 多平台目標，包括使用 ViewModel 的 Android、iOS、桌面和網路平台。

### 使用作用域原型

作用域原型註解可與常規 Koin 作用域無縫協作：

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

### 與函式定義結合

作用域原型也可以在模組內的函式上使用：

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
作用域原型註解自動建立適當的作用域定義和作用域元件宣告，減少了常見作用域模式的樣板程式碼。
:::