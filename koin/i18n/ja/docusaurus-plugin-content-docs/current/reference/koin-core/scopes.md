---
title: "スコープ (Scopes)"
---
Koin は、有効期間が制限されたインスタンスを定義するためのシンプルな API を提供します。

## スコープとは？

スコープとは、オブジェクトが存在する一定期間またはメソッド呼び出しのことです。
別の言い方をすれば、スコープとはオブジェクトの状態が持続する時間のことです。
スコープのコンテキストが終了すると、そのスコープにバインドされたオブジェクトは再度インジェクションできなくなります (コンテナから削除されます)。

## スコープの定義

Koin では、デフォルトで 3 種類のスコープがあります。

- `single` 定義: コンテナのライフサイクル全体で永続化されるオブジェクトを作成します (削除できません)。
- `factory` 定義: 毎回新しいオブジェクトを作成します。短寿命です。コンテナに永続化されません (共有できません)。
- `scoped` 定義: 関連付けられたスコープのライフサイクルに結び付けられたオブジェクトを作成します。

スコープ定義を宣言するには、次のように `scoped` 関数を使用します。スコープは、スコープ定義を時間の論理単位として収集します。

特定の型に対してスコープを宣言するには、`scope` キーワードを使用する必要があります。

```kotlin
module {
    scope<MyType>{
        scoped { Presenter() }
        // ...
    }
}
```

### スコープ ID とスコープ名

Koin スコープは、以下のものによって定義されます。

- スコープ名 - スコープのクオリファイア (scope's qualifier)
- スコープ ID - スコープインスタンスの一意の識別子

:::note
`scope<A> { }` は `scope(named<A>()){ }` と同等ですが、記述がより簡便です。文字列クオリファイア (`scope(named("SCOPE_NAME")) { }`) も使用できることに注意してください。
:::

`Koin` インスタンスからは、以下にアクセスできます。

- `createScope(id : ScopeID, scopeName : Qualifier)` - 指定された ID とスコープ名でクローズドスコープインスタンスを作成します
- `getScope(id : ScopeID)` - 指定された ID で以前に作成されたスコープを取得します
- `getOrCreateScope(id : ScopeID, scopeName : Qualifier)` - 指定された ID とスコープ名で、クローズドスコープインスタンスを作成するか、既に作成されている場合は取得します

:::note
デフォルトでは、オブジェクトに対して `createScope` を呼び出しても、スコープの「ソース」は渡されません。パラメータとして渡す必要があります: `T.createScope(<source>)`
:::

### スコープコンポーネント: スコープをコンポーネントに関連付ける [2.2.0]

Koin には、スコープインスタンスをそのクラスに提供するのに役立つ `KoinScopeComponent` の概念があります。

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { createScope(this) }
}

class B
```

`KoinScopeComponent` インターフェイスは、いくつかの拡張機能を提供します。
- 現在のコンポーネントのスコープ ID と名前からスコープを作成する `createScope`
- スコープからインスタンスを解決する `get`、`inject` (`scope.get()` および `scope.inject()` と同等)

A のスコープを定義して、B を解決してみましょう。

```kotlin
module {
    scope<A> {
        scoped { B() } // A のスコープに結び付けられます
    }
}
```

`org.koin.core.scope` `get` および `inject` 拡張機能のおかげで、`B` のインスタンスを直接解決できます。

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { newScope(this) }

    // B をインジェクションとして解決します
    val b : B by inject() // スコープからインジェクション

    // B を解決します
    fun doSomething(){
        val b = get<B>()
    }

    fun close(){
        scope.close() // 現在のスコープを閉じることを忘れないでください
    }
}
```

### スコープ内で依存関係を解決する

スコープの `get` および `inject` 関数を使用して依存関係を解決するには: `val presenter = scope.get<Presenter>()`

スコープの利点は、スコープ定義の共通の論理時間単位を定義することです。また、特定のスコープ内から定義を解決することもできます。

```kotlin
// クラスが与えられた場合
class ComponentA
class ComponentB(val a : ComponentA)

// スコープを持つモジュール
module {
    
    scope<A> {
        scoped { ComponentA() }
        // 現在のスコープインスタンスから解決されます
        scoped { ComponentB(get()) }
    }
}
```

依存関係の解決は簡単です。

```kotlin
// スコープを作成します
val myScope = koin.createScope<A>()

// 同じスコープから
val componentA = myScope.get<ComponentA>()
val componentB = myScope.get<ComponentB>()
```

:::info
デフォルトでは、現在のスコープに定義が見つからない場合、すべてのスコープはメインスコープにフォールバックして解決します。
:::

### スコープを閉じる

スコープインスタンスが終了したら、`close()` 関数で閉じるだけです。

```kotlin
// KoinComponent から
val scope = getKoin().createScope<A>()

// 使用します...

// 閉じます
scope.close()
```

:::info
閉じられたスコープからはインスタンスをインジェクションできなくなることに注意してください。
:::

### スコープのソース値を取得する

Koin Scope API (2.1.4) では、定義内でスコープの元のソースを渡すことができます。以下の例を見てみましょう。
シングルトンインスタンス `A` があるとします。

```kotlin
class A
class BofA(val a : A)

module {
    single { A() }
    scope<A> {
        scoped { BofA(getSource() /* または get() */) }

    }
}
```

A のスコープを作成することにより、スコープのソース (A インスタンス) の参照を、スコープの基になる定義 (`scoped { BofA(getSource()) }` または `scoped { BofA(get()) }`) に転送できます。

これにより、カスケードパラメータインジェクションを回避し、スコープ定義でソース値を直接取得できます。

```kotlin
val a = koin.get<A>()
val b = a.scope.get<BofA>()
assertTrue(b.a == a)
```

:::note
`getSource()` と `get()` の違い: getSource はソース値を直接取得します。Get は任意の定義を解決しようとし、可能な場合はソース値にフォールバックします。`getSource()` はパフォーマンスの点でより効率的です。
:::

### スコープのリンク

Koin Scope API (2.1) では、スコープを別のスコープにリンクし、結合された定義空間を解決できるようにします。例を見てみましょう。
ここでは、2 つのスコープ空間 (A のスコープと B のスコープ) を定義しています。A のスコープでは、C (B のスコープで定義) にアクセスできません。

```kotlin
module {
    single { A() }
    scope<A> {
        scoped { B() }
    }
    scope<B> {
        scoped { C() }
    }
}
```

スコープリンク API を使用すると、B のスコープインスタンス C を A のスコープから直接解決できます。これには、スコープインスタンスで `linkTo()` を使用します。

```kotlin
val a = koin.get<A>()
// A のスコープから B を取得しましょう
val b = a.scope.get<B>()
// A のスコープを B のスコープにリンクしましょう
a.scope.linkTo(b.scope)
// A または B のスコープから同じ C インスタンスを取得しました
assertTrue(a.scope.get<C>() == b.scope.get<C>())
```