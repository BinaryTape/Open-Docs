---
title: "Koin Annotations におけるスコープ (Scopes)"
---
定義とモジュールを使用する際に、特定の空間と時間分解能に対してスコープを定義する必要がある場合があります。

## @Scope でスコープを定義する

Koin ではスコープを使用できます。基本については、[Koin スコープ](/reference/koin-core/scopes.md)のセクションを参照してください。

アノテーションを使用してスコープを宣言するには、次のようにクラスに `@Scope` アノテーションを使用します。

```kotlin
@Scope
class MyScopeClass
```

> これは、次のスコープセクションと同等です。
> ```kotlin
> scope<MyScopeClass> {
> 
>}
> ```

または、型よりもスコープ名が必要な場合は、`name` パラメータを使用して、`@Scope(name = )` アノテーションでクラスをタグ付けする必要があります。

```kotlin
@Scope(name = "my_scope_name")
class MyScopeClass
```

> これは次と同等です。
>
>```kotlin
>scope<named("my_scope_name")> {
>
>}
>```

## @Scoped でスコープに定義を追加する

スコープ（アノテーションで定義されているかどうかにかかわらず）内に定義を宣言するには、`@Scope` および `@Scoped` アノテーションでクラスをタグ付けします。

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
必要なスコープ空間（`@Scope` を使用）と定義するコンポーネントの種類（`@Scoped` を使用）を示すために、両方のアノテーションが必要です。
:::

## スコープからの依存関係解決

スコープされた定義から、内部スコープおよび親スコープから任意の定義を解決できます。

たとえば、次のケースは機能します。

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

コンポーネント `MySingle` は、ルートで `single` 定義として定義されています。`MyScopedComponent` と `MyOtherScopedComponent` は、スコープ "my_scope_name" で定義されています。
`MyScopedComponent` からの依存関係解決は、`MySingle` インスタンスを使用して Koin ルートにアクセスし、現在の "my_scope_name" スコープから `MyOtherScopedComponent` スコープされたインスタンスにアクセスします。

## @ScopeId でスコープ外を解決する (1.3.0 以降)

スコープに直接アクセスできない別のスコープからコンポーネントを解決する必要がある場合があります。これを行うには、`@ScopeId` アノテーションで依存関係をタグ付けして、Koin に特定のスコープ ID のスコープでこの依存関係を見つけるように指示する必要があります。

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

この例は、`MyFactory` コンポーネントが、ID "my_scope_id" を持つスコープインスタンスから `MyScopedComponent` コンポーネントを解決することを示しています。ID "my_scope_id" で作成されたこのスコープは、適切なスコープ定義で作成する必要があります。

:::info
`MyScopedComponent` コンポーネントは Scope (スコープ) セクションで定義する必要があり、スコープインスタンスは ID "my_scope_id" で作成する必要があります。
:::