---
title: スコープ
---

Koinは、特定のライフタイムに紐付けられたインスタンスを定義するためのシンプルなAPIを提供します。

## スコープとは？

スコープとは、オブジェクトが存在する固定された期間、またはメソッド呼び出しのことです。
別の見方をすれば、スコープとはオブジェクトの状態が持続する期間と考えることができます。
スコープコンテキストが終了すると、そのスコープにバインドされたオブジェクトは再度インジェクトできなくなります（コンテナから破棄されます）。

## スコープ定義

Koinでは、デフォルトで以下の3種類のスコープがあります。

- `single` 定義：コンテナ全体のライフタイムを通して永続するオブジェクトを作成します（破棄されません）。
- `factory` 定義：毎回新しいオブジェクトを作成します。短命です。コンテナ内に永続しません（共有できません）。
- `scoped` 定義：関連付けられたスコープのライフタイムに紐付けられて永続するオブジェクトを作成します。

スコープ定義を宣言するには、以下のように `scoped` 関数を使用します。スコープは、スコープ定義を時間の論理単位としてまとめます。

特定の型に対してスコープを宣言するには、`scope` キーワードを使用する必要があります。

```kotlin
module {
    scope<MyType>{
        scoped { Presenter() }
        // ...
    }
}
```

### スコープIDとスコープ名

Koinスコープは、以下の要素によって定義されます。

- スコープ名 - スコープの修飾子
- スコープID - スコープインスタンスの一意の識別子

:::note
 `scope<A> { }` は `scope(named<A>()){ } ` と同等ですが、より便利に記述できます。また、`scope(named("SCOPE_NAME")) { }` のように文字列の修飾子を使用することもできます。
:::

`Koin` インスタンスから、以下にアクセスできます。

- `createScope(id : ScopeID, scopeName : Qualifier)` - 指定されたIDとスコープ名で閉じたスコープインスタンスを作成します。
- `getScope(id : ScopeID)` - 指定されたIDで以前に作成されたスコープを取得します。
- `getOrCreateScope(id : ScopeID, scopeName : Qualifier)` - 指定されたIDとスコープ名で、閉じたスコープインスタンスを作成、または既に作成されている場合は取得します。

:::note
 デフォルトでは、オブジェクトに対して `createScope` を呼び出しても、スコープの「ソース」は渡されません。`T.createScope(<source>)` のようにパラメータとして渡す必要があります。
:::

### スコープコンポーネント: スコープをコンポーネントに関連付ける [2.2.0]

Koinには、`KoinScopeComponent` という概念があり、スコープインスタンスをそのクラスに持ち込むのに役立ちます。

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { createScope(this) }
}

class B
```

`KoinScopeComponent` インターフェースは、いくつかの拡張を提供します。
- `createScope` - 現在のコンポーネントのスコープIDと名前からスコープを作成します。
- `get`、`inject` - スコープからインスタンスを解決します（`scope.get()` および `scope.inject()` と同等です）。

Aに対してスコープを定義し、Bを解決してみましょう。

```kotlin
module {
    scope<A> {
        scoped { B() } // Tied to A's scope
    }
}
```

その後、`org.koin.core.scope` の `get` および `inject` 拡張機能のおかげで、`B` のインスタンスを直接解決できます。

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { newScope(this) }

    // Bをインジェクトとして解決
    val b : B by inject() // スコープからインジェクト

    // Bを解決
    fun doSomething(){
        val b = get<B>()
    }

    fun close(){
        scope.close() // 現在のスコープを閉じ忘れないでください
    }
}
```

### スコープ内での依存関係の解決

スコープの `get` および `inject` 関数を使用して依存関係を解決するには、`val presenter = scope.get<Presenter>()` のように記述します。

スコープの利点は、スコープ定義に対して共通の時間の論理単位を定義することです。また、指定されたスコープ内から定義を解決することも可能です。

```kotlin
// クラスが与えられた場合
class ComponentA
class ComponentB(val a : ComponentA)

// スコープを含むモジュール
module {
    
    scope<A> {
        scoped { ComponentA() }
        // 現在のスコープインスタンスから解決されます
        scoped { ComponentB(get()) }
    }
}
```

依存関係の解決は非常に簡単です。

```kotlin
// スコープを作成
val myScope = koin.createScope<A>()

// 同じスコープから
val componentA = myScope.get<ComponentA>()
val componentB = myScope.get<ComponentB>()
```

:::info
 デフォルトでは、現在のスコープで定義が見つからない場合、すべてのスコープはメインスコープで解決するようにフォールバックします。
:::

### スコープを閉じる

スコープインスタンスが終了したら、`close()` 関数で閉じます。

```kotlin
// KoinComponentから
val scope = getKoin().createScope<A>()

// 使用します ...

// 閉じます
scope.close()
```

:::info
 閉じたスコープからは、もうインスタンスをインジェクトできないことに注意してください。
:::

### スコープのソース値の取得

Koin Scope API 2.1.4 では、定義内でスコープの元のソースを渡すことができます。以下の例を見てみましょう。
シングルトンインスタンス `A` を持ちましょう。

```kotlin
class A
class BofA(val a : A)

module {
    single { A() }
    scope<A> {
        scoped { BofA(getSource() /* or even get() */) }

    }
}
```

Aのスコープを作成することで、スコープのソース（Aインスタンス）の参照を、スコープの基になる定義に転送できます。例えば、`scoped { BofA(getSource()) }` や `scoped { BofA(get()) }` のようにです。

これは、連鎖的なパラメータインジェクションを避け、スコープ定義内でソース値を直接取得するために行われます。

```kotlin
val a = koin.get<A>()
val b = a.scope.get<BofA>()
assertTrue(b.a == a)
```

:::note
 `getSource()` と `get()` の違い：`getSource()` はソース値を直接取得します。`get()` はあらゆる定義を解決しようとし、可能であればソース値にフォールバックします。そのため、`getSource()` はパフォーマンスの観点からより効率的です。
:::

### スコープのリンク

Koin Scope API 2.1 では、あるスコープを別のスコープにリンクし、結合された定義空間を解決できるようになります。例を見てみましょう。
ここでは、2つのスコープ空間、A用のスコープとB用のスコープを定義しています。Aのスコープでは、C（Bのスコープで定義されている）にアクセスできません。

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

スコープリンクAPIを使用すると、BのスコープインスタンスCを、Aのスコープから直接解決できるようになります。このために、スコープインスタンスで `linkTo()` を使用します。

```kotlin
val a = koin.get<A>()
// AのスコープからBを取得しましょう
val b = a.scope.get<B>()
// AのスコープをBのスコープにリンクしましょう
a.scope.linkTo(b.scope)
// AまたはBのスコープから同じCインスタンスを取得できます
assertTrue(a.scope.get<C>() == b.scope.get<C>())
```

### スコープアーキタイプ

スコープ「アーキタイプ」は、汎用的な種類のクラスのためのスコープ空間です。例えば、Android（Activity、Fragment、ViewModel）やKtor（RequestScope）用のスコープアーキタイプを持つことができます。
スコープアーキタイプは、特定のスコープ空間を要求するために、Koinの`TypeQualifier`が様々なAPIに渡されるものです。

アーキタイプは以下から構成されます。
- 特定の型に対してスコープを宣言するための、モジュールDSL拡張：
```kotlin
// ActivityScopeArchetype (TypeQualifier(AppCompatActivity::class)) のスコープアーキタイプを宣言
fun Module.activityScope(scopeSet: ScopeDSL.() -> Unit) {
    val qualifier = ActivityScopeArchetype
    ScopeDSL(qualifier, this).apply(scopeSet)
}
```
- 指定された特定のスコープアーキタイプ `TypeQualifier` を持つスコープを要求するAPI：
```kotlin
// ActivityScopeArchetype アーキタイプでスコープを作成
val scope = getKoin().createScope(getScopeId(), getScopeName(), this, ActivityScopeArchetype)