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

`MySingle`コンポーネントはルートでシングルトン定義として定義されています。`MyScopedComponent`と`MyOtherScopedComponent`は"my_scope_name"スコープで定義されています。
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