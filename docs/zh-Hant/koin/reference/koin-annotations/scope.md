---
title: Koin Annotations 中的作用域
---

在使用定義與模組時，您可能需要為特定的空間和時間解析定義作用域。

## 使用 @Scope 定義作用域

Koin 允許使用作用域。請參閱 [Koin 作用域](/docs/reference/koin-core/scopes.md) 章節以了解更多基礎細節。

要使用註解宣告作用域，只需在類別上使用 `@Scope` 註解，如下所示：

```kotlin
@Scope
class MyScopeClass
```

> 這將等同於以下作用域區段：
> ```kotlin
> scope<MyScopeClass> {
> 
>}
> ```

或者，如果您需要作用域名稱而不僅僅是型別，您需要使用 `name` 參數，為類別加上 `@Scope(name = )` 註解：

```kotlin
@Scope(name = "my_scope_name")
class MyScopeClass
```

> 這將等同於：
>
>```kotlin
>scope<named("my_scope_name")> {
>
>}
>```

## 使用 @Scoped 在作用域中新增定義

要在作用域內（無論是否使用註解定義）宣告定義，只需為類別加上 `@Scope` 和 `@Scoped` 註解：

```kotlin
@Scope(name = "my_scope_name")
@Scoped
class MyScopedComponent
```

這將在作用域區段內產生正確的定義：

```kotlin
scope<named("my_scope_name")> {
  scoped { MyScopedComponent() }
}
```

:::info
  您需要同時使用這兩個註解來指示所需的作用域空間（使用 `@Scope`）以及要定義的組建種類（使用 `@Scoped`）。
:::

## 從作用域進行相依性解析

從作用域定義中，您可以解析來自內部作用域以及父層作用域的任何定義。

例如，以下案例將可以運作：

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

`MySingle` 組建在根部被定義為 `single` 定義。`MyScopedComponent` 與 `MyOtherScopedComponent` 被定義在作用域 "my_scope_name" 中。
`MyScopedComponent` 的相依性解析正透過 `MySingle` 執行個體存取 Koin 根部，並從目前的 "my_scope_name" 作用域存取 `MyOtherScopedComponent` 的作用域執行個體。

## 使用 @ScopeId 在作用域外進行解析（自 1.3.0 起）

您可能需要解析來自另一個無法直接存取之作用域的組建。為此，您需要為相依性加上 `@ScopeId` 註解，告訴 Koin 在給定作用域 ID 的作用域中尋找此相依性。

```kotlin
@Factory
class MyFactory(
  @ScopeId("my_scope_id") val myScopedComponent :MyScopedComponent
)
```

上述程式碼等同於產生的：

```kotlin
factory { Myfactory(getScope("my_scope_id").get()) }
```

此範例顯示 `MyFactory` 組建將從 ID 為 "my_scope_id" 的作用域執行個體解析 `MyScopedComponent` 組建。這個以 ID "my_scope_id" 建立的作用域需要使用正確的作用域定義來建立。

:::info
  `MyScopedComponent` 組建需要在作用域區段中定義，且需要建立一個 ID 為 "my_scope_id" 的作用域執行個體。
:::

## 作用域原型註解 (Scope Archetype Annotations)

Koin Annotations 為常見的作用域模式提供了預定義的作用域原型註解，無需手動宣告作用域型別。這些註解在單個註解中結合了作用域宣告與組建定義。

### Android 作用域原型

對於 Android 開發，您可以使用這些預定義的作用域註解：

#### @ActivityScope

在 Activity 作用域中宣告組建：

```kotlin
@ActivityScope
class ActivityScopedComponent(val dependency: MyDependency)
```

這會產生：
```kotlin
activityScope {
    scoped { ActivityScopedComponent(get()) }
}
```

**使用情況：** 被標記的類別旨在與 Activity 及 `activityScope` 函式搭配使用以啟動作用域。

#### @ActivityRetainedScope

在 Activity Retained 作用域中宣告組建（在配置變更時保留）：

```kotlin
@ActivityRetainedScope
class RetainedComponent(val repository: MyRepository)
```

這會產生：
```kotlin
activityRetainedScope {
    scoped { RetainedComponent(get()) }
}
```

**使用情況：** 被標記的類別旨在與 Activity 及 `activityRetainedScope` 函式搭配使用以啟動作用域。

#### @FragmentScope

在 Fragment 作用域中宣告組建：

```kotlin
@FragmentScope
class FragmentScopedComponent(val service: MyService)
```

這會產生：
```kotlin
fragmentScope {
    scoped { FragmentScopedComponent(get()) }
}
```

**使用情況：** 被標記的類別旨在與 Fragment 及 `fragmentScope` 函式搭配使用以啟動作用域。

### 核心作用域原型

#### @ViewModelScope

在 ViewModel 作用域中宣告組建。此註解**與 Kotlin 多平台 (KMP) 相容**，可同時在 Android ViewModels 與 Compose Multiplatform ViewModels 運作：

```kotlin
@ViewModelScope
class ViewModelScopedRepository(val apiService: ApiService)

@ViewModelScope  
class ViewModelScopedUseCase(
    val repository: ViewModelScopedRepository,
    val analytics: AnalyticsService
)
```

這會產生：
```kotlin
viewModelScope {
    scoped { ViewModelScopedRepository(get()) }
    scoped { ViewModelScopedUseCase(get(), get()) }
}
```

**使用情況：** 被標記的類別旨在與 ViewModel 及 `viewModelScope` 函式搭配使用以啟動作用域。

**KMP 支援：** 在所有使用 ViewModel 的 Kotlin 多平台目標（包括 Android、iOS、Desktop 與 Web 平台）上無縫運作。

### 使用作用域原型

作用域原型註解可以與常規的 Koin 作用域無縫協作：

```kotlin
// 常規組建
@Single
class GlobalService

// 使用原型的作用域組建
@ActivityScope
class ActivityService(val global: GlobalService)

@FragmentScope  
class FragmentService(
    val global: GlobalService,
    val activity: ActivityService
)
```

### 與函式定義結合

作用域原型也可以用於模組內的函式：

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
作用域原型註解會自動建立適當的作用域定義與作用域組建宣告，減少常見作用域模式的樣板程式碼。
:::