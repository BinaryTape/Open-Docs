---
title: Koinアノテーションにおけるスコープ
---

定義やモジュールを使用する際、特定の空間と時間の解決のためにスコープを定義する必要があるかもしれません。

## @Scopeでスコープを定義する

Koinはスコープの使用を許可しています。基本的な詳細については、[Koin Scopes](/docs/reference/koin-core/scopes.md)セクションを参照してください。

アノテーションでスコープを宣言するには、次のようにクラスに`@Scope`アノテーションを使用します。

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

そうでなく、型よりもスコープ名が必要な場合は、`name`パラメータを使用して`@Scope(name = )`アノテーションでクラスにタグ付けする必要があります。

```kotlin
@Scope(name = "my_scope_name")
class MyScopeClass
```

> これは以下と同等になります：
>
>```kotlin
>scope<named("my_scope_name")> {
>
>}
>```

## @Scopedでスコープ内に定義を追加する

スコープ内（アノテーションで定義されているか否かに関わらず）に定義を宣言するには、`@Scope`と`@Scoped`アノテーションでクラスにタグ付けするだけです。

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
  スコープ空間（`@Scope`を使用）と定義するコンポーネントの種類（`@Scoped`を使用）を示すために、両方のアノテーションが必要です。
:::

## スコープからの依存関係の解決

スコープ化された定義からは、内部スコープと親スコープからの任意の定義を解決できます。

例えば、次のケースは機能します。

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

コンポーネント`MySingle`はルートで`single`定義として定義されています。`MyScopedComponent`と`MyOtherScopedComponent`は"my_scope_name"スコープで定義されています。
`MyScopedComponent`からの依存関係の解決は、`MySingle`インスタンスでKoinのルートにアクセスし、現在の"my_scope_name"スコープから`MyOtherScopedComponent`スコープインスタンスにアクセスします。

## @ScopeIdを用いたスコープ外からの解決 (バージョン1.3.0以降)

別のスコープから、自身のスコープから直接アクセスできないコンポーネントを解決する必要があるかもしれません。そのためには、依存関係に`@ScopeId`アノテーションを付加し、Koinに指定されたスコープIDのスコープ内でこの依存関係を見つけるように指示する必要があります。

```kotlin
@Factory
class MyFactory(
  @ScopeId("my_scope_id") val myScopedComponent :MyScopedComponent
)
```

上記のコードは、生成されたものと同等です。

```kotlin
factory { Myfactory(getScope("my_scope_id").get()) }
```

この例は、`MyFactory`コンポーネントが`my_scope_id`というIDを持つスコープインスタンスから`MyScopedComponent`コンポーネントを解決することを示しています。`my_scope_id`というIDで作成されたこのスコープは、適切なスコープ定義で作成される必要があります。

:::info
  `MyScopedComponent`コンポーネントはスコープセクション内で定義されている必要があり、スコープインスタンスは"my_scope_id"というIDで作成されている必要があります。
:::

## スコープアーキタイプアノテーション

Koin Annotationsは、一般的なスコープパターンに対応する定義済みのスコープアーキタイプアノテーションを提供し、スコープタイプを手動で宣言する手間を省きます。これらのアノテーションは、スコープ宣言とコンポーネント定義を単一のアノテーションにまとめます。

### Androidスコープアーキタイプ

Android開発では、これらの定義済みスコープアノテーションを使用できます。

#### @ActivityScope

Activityスコープでコンポーネントを宣言します。

```kotlin
@ActivityScope
class ActivityScopedComponent(val dependency: MyDependency)
```

これは以下を生成します:
```kotlin
activityScope {
    scoped { ActivityScopedComponent(get()) }
}
```

**使用方法:** タグ付けされたクラスは、Activityと`activityScope`関数を使用してスコープをアクティブ化することを意図しています。

#### @ActivityRetainedScope

Activity Retainedスコープでコンポーネントを宣言します（構成変更後も存続します）：

```kotlin
@ActivityRetainedScope
class RetainedComponent(val repository: MyRepository)
```

これは以下を生成します:
```kotlin
activityRetainedScope {
    scoped { RetainedComponent(get()) }
}
```

**使用方法:** タグ付けされたクラスは、Activityと`activityRetainedScope`関数を使用してスコープをアクティブ化することを意図しています。

#### @FragmentScope

Fragmentスコープでコンポーネントを宣言します。

```kotlin
@FragmentScope
class FragmentScopedComponent(val service: MyService)
```

これは以下を生成します:
```kotlin
fragmentScope {
    scoped { FragmentScopedComponent(get()) }
}
```

**使用方法:** タグ付けされたクラスは、Fragmentと`fragmentScope`関数を使用してスコープをアクティブ化することを意図しています。

### コアスコープアーキタイプ

#### @ViewModelScope

ViewModelスコープでコンポーネントを宣言します。このアノテーションは**Kotlin Multiplatform (KMP) と互換性があり**、Android ViewModelとCompose Multiplatform ViewModelの両方で動作します。

```kotlin
@ViewModelScope
class ViewModelScopedRepository(val apiService: ApiService)

@ViewModelScope  
class ViewModelScopedUseCase(
    val repository: ViewModelScopedRepository,
    val analytics: AnalyticsService
)
```

これは以下を生成します:
```kotlin
viewModelScope {
    scoped { ViewModelScopedRepository(get()) }
    scoped { ViewModelScopedUseCase(get(), get()) }
}
```

**使用方法:** タグ付けされたクラスは、ViewModelと`viewModelScope`関数を使用してスコープをアクティブ化することを意図しています。

**KMPサポート:** ViewModelが使用されるAndroid、iOS、デスクトップ、Webプラットフォームを含むすべてのKotlin Multiplatformターゲットでシームレスに動作します。

### スコープアーキタイプの使用

スコープアーキタイプアノテーションは、通常のKoinスコープとシームレスに連携します。

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

### 関数定義との組み合わせ

スコープアーキタイプは、モジュール内の関数にも使用できます。

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
スコープアーキタイプアノテーションは、適切なスコープ定義とスコープ化されたコンポーネント宣言を自動的に作成し、一般的なスコープパターンにおけるボイラープレートコードを削減します。
:::