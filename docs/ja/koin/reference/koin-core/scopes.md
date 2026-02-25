---
title: スコープ
---

Koinは、特定の有効期限（ライフタイム）に紐付けられたインスタンスを定義するためのシンプルなAPIを提供します。

## スコープとは？

スコープとは、オブジェクトが存在する固定の期間、あるいはメソッド呼び出しの範囲のことです。
別の見方をすれば、スコープはオブジェクトの状態が持続する時間の長さと考えることができます。
スコープのコンテキストが終了すると、そのスコープにバインドされたオブジェクトは二度とインジェクトできなくなります（コンテナから破棄されます）。

## スコープの定義

Koinにはデフォルトで3種類のスコープがあります：

- `single` 定義：コンテナの全ライフタイムにわたって存続するオブジェクトを作成します（破棄できません）。
- `factory` 定義：毎回新しいオブジェクトを作成します。短命です。コンテナ内には保持されません（共有できません）。
- `scoped` 定義：関連付けられたスコープのライフタイムに紐付いて存続するオブジェクトを作成します。

スコープ定義を宣言するには、以下のように `scoped` 関数を使用します。スコープは、スコープ定義を論理的な時間の単位としてまとめます。

特定の型に対してスコープを宣言するには、`scope` キーワードを使用する必要があります：

```kotlin
module {
    scope<MyType>{
        scoped { Presenter() }
        // ...
    }
}
```

### スコープ ID とスコープ名

Koinのスコープは以下によって定義されます：

- スコープ名 (scope name) - スコープの限定子 (qualifier)
- スコープ ID (scope id) - スコープインスタンスの一意識別子

:::note
 `scope<A> { }` は `scope(named<A>()){ } ` と同等ですが、より簡潔に記述できます。また、`scope(named("SCOPE_NAME")) { }` のように文字列の限定子を使用することもできます。
:::

`Koin` インスタンスからは、以下にアクセスできます：

- `createScope(id : ScopeID, scopeName : Qualifier)` - 指定された ID とスコープ名で閉じられたスコープインスタンスを作成します。
- `getScope(id : ScopeID)` - 以前に作成された指定の ID を持つスコープを取得します。
- `getOrCreateScope(id : ScopeID, scopeName : Qualifier)` - 指定された ID とスコープ名で、閉じられたスコープインスタンスを作成、または既に作成されている場合は取得します。

:::note
デフォルトでは、オブジェクトに対して `createScope` を呼び出しても、スコープの「ソース (source)」は渡されません。パラメータとして渡す必要があります：`T.createScope(<source>)`
:::

### スコープコンポーネント：コンポーネントへのスコープの関連付け [2.2.0]

Koinには、スコープインスタンスをそのクラスに持たせるための `KoinScopeComponent` という概念があります：

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { createScope(this) }
}

class B
```

`KoinScopeComponent` インターフェースには、いくつかの拡張機能が含まれています：
- `createScope`：現在のコンポーネントのスコープ ID と名前からスコープを作成します。
- `get`, `inject`：スコープからインスタンスを解決します（`scope.get()` および `scope.inject()` と同等です）。

B を解決するために、A のスコープを定義してみましょう：

```kotlin
module {
    scope<A> {
        scoped { B() } // Aのスコープに紐付けられる
    }
}
```

これにより、`org.koin.core.scope` の `get` および `inject` 拡張機能のおかげで、`B` のインスタンスを直接解決できます：

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { newScope(this) }

    // injectとしてBを解決
    val b : B by inject() // スコープからインジェクト

    // Bを解決
    fun doSomething(){
        val b = get<B>()
    }

    fun close(){
        scope.close() // 現在のスコープを閉じるのを忘れないでください
    }
}
```

### スコープ内での依存関係の解決

スコープの `get` および `inject` 関数を使用して依存関係を解決するには： `val presenter = scope.get<Presenter>()` 

スコープの利点は、スコープ定義のための共通の論理的な時間の単位を定義することです。これにより、指定されたスコープ内から定義を解決することも可能になります。

```kotlin
// クラスの定義
class ComponentA
class ComponentB(val a : ComponentA)

// スコープを持つモジュール
module {
    
    scope<A> {
        scoped { ComponentA() }
        // 現在のスコープインスタンスから解決される
        scoped { ComponentB(get()) }
    }
}
```

依存関係の解決は非常にシンプルです：

```kotlin
// スコープの作成
val myScope = koin.createScope<A>()

// 同じスコープから取得
val componentA = myScope.get<ComponentA>()
val componentB = myScope.get<ComponentB>()
```

:::info
 デフォルトでは、現在のスコープで定義が見つからない場合、すべてのスコープはメインスコープでの解決にフォールバックします。
:::

### スコープを閉じる

スコープインスタンスを使い終わったら、`close()` 関数で閉じるだけです：

```kotlin
// KoinComponentから
val scope = getKoin().createScope<A>()

// 使用する ...

// 閉じる
scope.close()
```

:::info
 閉じたスコープからは、もうインスタンスをインジェクトできないことに注意してください。
:::

### スコープのソース値の取得

Koin 2.1.4 の Scope API では、定義の中でスコープの元のソース (source) を渡すことができます。以下の例を見てみましょう。
シングルトンインスタンス `A` があるとします：

```kotlin
class A
class BofA(val a : A)

module {
    single { A() }
    scope<A> {
        scoped { BofA(getSource() /* あるいは get() */) }

    }
}
```

A のスコープを作成することで、スコープのソース（A のインスタンス）への参照を、スコープ内の定義に転送できます：`scoped { BofA(getSource()) }` または `scoped { BofA(get()) }`

これは、パラメータのインジェクションが連鎖するのを避け、スコープ定義内でソースの値を直接取得するためです。

```kotlin
val a = koin.get<A>()
val b = a.scope.get<BofA>()
assertTrue(b.a == a)
```

:::note
 `getSource()` と `get()` の違い：`getSource` はソースの値を直接取得します。`get` は任意の定義の解決を試み、可能であればソースの値にフォールバックします。そのため、パフォーマンスの点では `getSource()` の方が効率的です。
:::

### スコープのリンク

Koin 2.1 の Scope API では、あるスコープを別のスコープにリンクさせることができ、結合された定義空間を解決できるようになります。例を見てみましょう。
ここでは、A のスコープと B のスコープという 2 つのスコープ空間を定義しています。A のスコープでは、（B のスコープで定義されている）C にはアクセスできません。

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

スコープリンク API を使用すると、A のスコープから直接 B のスコープのインスタンス C を解決できるようになります。これにはスコープインスタンスに対して `linkTo()` を使用します：

```kotlin
val a = koin.get<A>()
// AのスコープからBを取得
val b = a.scope.get<B>()
// AのスコープをBのスコープにリンク
a.scope.linkTo(b.scope)
// AまたはBのスコープから同じCインスタンスを取得できる
assertTrue(a.scope.get<C>() == b.scope.get<C>())
```

### スコープアーキタイプ

スコープ「アーキタイプ (Archetypes)」は、汎用的なクラスのためのスコープ空間です。例えば、Android（Activity, Fragment, ViewModel）や Ktor（RequestScope）用のスコープアーキタイプを持つことができます。
スコープアーキタイプは、特定のスコープ空間を要求するためにさまざまな API に渡される Koin の `TypeQualifier` です。

アーキタイプは以下で構成されます：
- 特定の型に対してスコープを宣言するためのモジュール DSL 拡張：
```kotlin
// ActivityScopeArchetype (TypeQualifier(AppCompatActivity::class)) 用のスコープアーキタイプを宣言
fun Module.activityScope(scopeSet: ScopeDSL.() -> Unit) {
    val qualifier = ActivityScopeArchetype
    ScopeDSL(qualifier, this).apply(scopeSet)
}
```
- 指定された特定のスコープアーキタイプの TypeQualifier を持つスコープを要求する API：
```kotlin
// ActivityScopeArchetype アーキタイプを使用してスコープを作成
val scope = getKoin().createScope(getScopeId(), getScopeName(), this, ActivityScopeArchetype)