---
title: Koin Annotationsにおけるスコープ
---

定義やモジュールを使用する際、特定の空間や時間の解像度に対してスコープを定義する必要がある場合があります。

## @Scopeによるスコープの定義

Koinではスコープを使用することができます。基本の詳細については、[Koin Scopes](/docs/reference/koin-core/scopes) セクションを参照してください。

アノテーションでスコープを宣言するには、次のようにクラスに `@Scope` アノテーションを使用します。

```kotlin
@Scope
class MyScopeClass
```

> これは以下のスコープセクションと同等になります：
> ```kotlin
> scope<MyScopeClass> {
> 
>}
> ```

また、型ではなくスコープ名が必要な場合は、`name` パラメータを使用して `@Scope(name = )` アノテーションをクラスに付与します。

```kotlin
@Scope(name = "my_scope_name")
class MyScopeClass
```

> これは以下と同等になります。
>
>```kotlin
>scope<named("my_scope_name")> {
>
>}
>```

## @Scopedによるスコープ内での定義の追加

（アノテーションで定義されているかどうかにかかわらず）スコープ内に定義を宣言するには、クラスに `@Scope` と `@Scoped` アノテーションを付与します。

```kotlin
@Scope(name = "my_scope_name")
@Scoped
class MyScopedComponent
```

これにより、スコープセクション内に適切な定義が生成されます。

```kotlin
scope<named("my_scope_name")> {
  scoped { MyScopedComponent() }
}
```

:::info
  必要なスコープ空間（`@Scope`による）と、定義するコンポーネントの種類（`@Scoped`による）の両方を示すために、両方のアノテーションが必要です。
:::

## スコープからの依存関係の解決

スコープ内の定義からは、自身の内部スコープおよび親スコープからの定義を解決できます。

例えば、以下のケースは動作します。

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

`MySingle` コンポーネントは、ルートに `single` 定義として定義されています。`MyScopedComponent` と `MyOtherScopedComponent` は "my_scope_name" スコープ内に定義されています。
`MyScopedComponent` からの依存関係解決では、`MySingle` インスタンスのためにKoinルートにアクセスし、現在の "my_scope_name" スコープから `MyOtherScopedComponent` のスコープインスタンスにアクセスします。

## @ScopeIdを使用したスコープ外での解決 (1.3.0以降)

自分のスコープから直接アクセスできない別のスコープからコンポーネントを解決する必要がある場合があります。この場合、依存関係に `@ScopeId` アノテーションを付与して、指定されたスコープIDのスコープ内でこの依存関係を探すようKoinに指示します。

```kotlin
@Factory
class MyFactory(
  @ScopeId("my_scope_id") val myScopedComponent :MyScopedComponent
)
```

上記のコードは、以下のように生成されるものと同等です。

```kotlin
factory { Myfactory(getScope("my_scope_id").get()) }
```

この例は、`MyFactory` コンポーネントが、ID "my_scope_id" を持つスコープインスタンスから `MyScopedComponent` コンポーネントを解決することを示しています。この "my_scope_id" で作成されたスコープは、適切なスコープ定義に基づいて作成されている必要があります。

:::info
  `MyScopedComponent` コンポーネントはスコープセクションで定義されている必要があり、スコープインスタンスは "my_scope_id" というIDで作成されている必要があります。 
:::

## スコープ・アーキタイプ・アノテーション

Koin Annotationsは、一般的なスコープパターン向けに事前定義されたスコープ・アーキタイプ（archetype）アノテーションを提供しており、スコープ型を手動で宣言する必要をなくします。これらのアノテーションは、スコープの宣言とコンポーネントの定義を単一のアノテーションで組み合わせたものです。

### Android スコープ・アーキタイプ

Android開発では、以下の事前定義されたスコープアノテーションを使用できます。

#### @ActivityScope

Activityスコープでコンポーネントを宣言します。

```kotlin
@ActivityScope
class ActivityScopedComponent(val dependency: MyDependency)
```

これは以下を生成します。
```kotlin
activityScope {
    scoped { ActivityScopedComponent(get()) }
}
```

**使用法:** アノテーションが付与されたクラスは、Activityおよび `activityScope` 関数と一緒に使用して、スコープを有効にすることを意図しています。

#### @ActivityRetainedScope

Activity Retainedスコープ（構成の変更をまたいで存続するスコープ）でコンポーネントを宣言します。

```kotlin
@ActivityRetainedScope
class RetainedComponent(val repository: MyRepository)
```

これは以下を生成します。
```kotlin
activityRetainedScope {
    scoped { RetainedComponent(get()) }
}
```

**使用法:** アノテーションが付与されたクラスは、Activityおよび `activityRetainedScope` 関数と一緒に使用して、スコープを有効にすることを意図しています。

#### @FragmentScope

Fragmentスコープでコンポーネントを宣言します。

```kotlin
@FragmentScope
class FragmentScopedComponent(val service: MyService)
```

これは以下を生成します。
```kotlin
fragmentScope {
    scoped { FragmentScopedComponent(get()) }
}
```

**使用法:** アノテーションが付与されたクラスは、Fragmentおよび `fragmentScope` 関数と一緒に使用して、スコープを有効にすることを意図しています。

### Core スコープ・アーキタイプ

#### @ViewModelScope

ViewModelスコープでコンポーネントを宣言します。このアノテーションは **Kotlin Multiplatform (KMP) 互換**であり、AndroidのViewModelとCompose MultiplatformのViewModelの両方で動作します。

```kotlin
@ViewModelScope
class ViewModelScopedRepository(val apiService: ApiService)

@ViewModelScope  
class ViewModelScopedUseCase(
    val repository: ViewModelScopedRepository,
    val analytics: AnalyticsService
)
```

これは以下を生成します。
```kotlin
viewModelScope {
    scoped { ViewModelScopedRepository(get()) }
    scoped { ViewModelScopedUseCase(get(), get()) }
}
```

**使用法:** アノテーションが付与されたクラスは、ViewModelおよび `viewModelScope` 関数と一緒に使用して、スコープを有効にすることを意図しています。

**KMPサポート:** Android、iOS、デスクトップ、およびViewModelが使用されるWebプラットフォームを含む、すべてのKotlin Multiplatformターゲットでシームレスに動作します。

### スコープ・アーキタイプの使用

スコープ・アーキタイプ・アノテーションは、通常のKoinスコープ機能とシームレスに連携します。

```kotlin
// 通常のコンポーネント
@Single
class GlobalService

// アーキタイプを使用したスコープ付きコンポーネント
@ActivityScope
class ActivityService(val global: GlobalService)

@FragmentScope  
class FragmentService(
    val global: GlobalService,
    val activity: ActivityService
)
```

### 関数定義との組み合わせ

スコープ・アーキタイプは、モジュール内の関数にも使用できます。

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
スコープ・アーキタイプ・アノテーションは、適切なスコープ定義とスコープされたコンポーネント宣言を自動的に作成し、一般的なスコープパターンのボイラープレートコードを削減します。
:::