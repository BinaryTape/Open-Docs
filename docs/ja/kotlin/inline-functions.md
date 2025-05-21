---
title: インライン関数
---
[高階関数](lambdas)を使用すると、特定のランタイムペナルティが発生します。各関数はオブジェクトであり、クロージャをキャプチャします。クロージャとは、関数本体内でアクセスできる変数のスコープです。メモリー割り当て（関数オブジェクトとクラスの両方）と仮想呼び出しにより、ランタイムオーバーヘッドが発生します。

しかし、多くの場合、この種のオーバーヘッドはラムダ式をインライン化することで解消できるようです。以下の関数は、この状況の良い例です。`lock()`関数は、呼び出し元で簡単にインライン化できます。次のケースを考えてみましょう。

```kotlin
lock(l) { foo() }
```

コンパイラは、パラメーターの関数オブジェクトを作成して呼び出しを生成する代わりに、次のコードを出力できます。

```kotlin
l.lock()
try {
    foo()
} finally {
    l.unlock()
}
```

コンパイラにこれを行わせるには、`inline`修飾子で`lock()`関数をマークします。

```kotlin
inline fun <T> lock(lock: Lock, body: () `->` T): T { ... }
```

`inline`修飾子は、関数自体とそれに渡されるラムダの両方に影響します。これらはすべて、呼び出し元にインライン化されます。

インライン化すると、生成されるコードが肥大化する可能性があります。ただし、妥当な方法で（大きな関数のインライン化を避ける）行えば、特にループ内の「メガモーフィック」な呼び出し元では、パフォーマンスが向上します。

## noinline

インライン関数に渡されるすべてのラムダをインライン化したくない場合は、一部の関数パラメーターを`noinline`修飾子でマークします。

```kotlin
inline fun foo(inlined: () `->` Unit, noinline notInlined: () `->` Unit) { ... }
```

インライン化可能なラムダは、インライン関数内でのみ呼び出すか、インライン化可能な引数として渡すことができます。ただし、`noinline`ラムダは、フィールドに格納したり、受け渡したりするなど、好きなように操作できます。

:::note
インライン関数にインライン化可能な関数パラメーターがなく、[再帰型パラメーター](#reified-type-parameters)もない場合、コンパイラは警告を発行します。これは、そのような関数のインライン化は有益である可能性が非常に低いからです（インライン化が必要であると確信している場合は、`@Suppress("NOTHING_TO_INLINE")`アノテーションを使用して警告を抑制できます）。

:::

## 非ローカルジャンプ式

### Returns

Kotlinでは、名前付き関数または匿名関数を終了するために、通常の無条件の`return`のみを使用できます。
ラムダを終了するには、[ラベル](returns#return-to-labels)を使用します。ラムダは囲んでいる関数を`return`できないため、ラムダ内では生の`return`は禁止されています。

```kotlin
fun ordinaryFunction(block: () `->` Unit) {
    println("hi!")
}

fun foo() {
    ordinaryFunction {
        return // ERROR: cannot make `foo` return here
    }
}

fun main() {
    foo()
}
```

ただし、ラムダが渡される関数がインライン化されている場合、returnもインライン化できます。したがって、許可されています。

```kotlin
inline fun inlined(block: () `->` Unit) {
    println("hi!")
}

fun foo() {
    inlined {
        return // OK: the lambda is inlined
    }
}

fun main() {
    foo()
}
```

このようなreturn（ラムダ内にあり、囲んでいる関数を終了する）は、*非ローカル*returnと呼ばれます。この種の構造は通常、ループで発生し、多くの場合、インライン関数で囲まれています。

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // returns from hasZeros
    }
    return false
}
```

一部のインライン関数は、パラメーターとして渡されたラムダを関数本体から直接ではなく、ローカルオブジェクトやネストされた関数などの別の実行コンテキストから呼び出す場合があることに注意してください。このような場合、ラムダでは非ローカル制御フローも許可されません。インライン関数のラムダパラメーターが非ローカルreturnを使用できないことを示すには、`crossinline`修飾子でラムダパラメーターをマークします。

```kotlin
inline fun f(crossinline body: () `->` Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

### Break and continue

:::caution
この機能は現在[プレビュー中](kotlin-evolution-principles#pre-stable-features)です。
今後のリリースで安定させる予定です。
オプトインするには、`-Xnon-local-break-continue`コンパイラオプションを使用します。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-1436)でご意見をお待ちしております。

:::

非ローカル`return`と同様に、ループを囲むインライン関数に引数として渡されるラムダで、`break`と`continue`の[ジャンプ式](returns)を適用できます。

```kotlin
fun processList(elements: List<Int>): Boolean {
    for (element in elements) {
        val variable = element.nullableMethod() ?: run {
            log.warning("Element is null or invalid, continuing...")
            continue
        }
        if (variable == 0) return true
    }
    return false
}
```

## 再帰型パラメーター

パラメーターとして渡された型にアクセスする必要がある場合があります。

```kotlin
fun <T> TreeNode.findParentOfType(clazz: Class<T>): T? {
    var p = parent
    while (p != null && !clazz.isInstance(p)) {
        p = p.parent
    }
    @Suppress("UNCHECKED_CAST")
    return p as T?
}
```

ここでは、ツリーを上に移動し、リフレクションを使用して、ノードに特定の型があるかどうかを確認します。
すべて問題ありませんが、呼び出し元はあまり見栄えがよくありません。

```kotlin
treeNode.findParentOfType(MyTreeNode::class.java)
```

より良い解決策は、この関数に型を単純に渡すことです。次のように呼び出すことができます。

```kotlin
treeNode.findParentOfType<MyTreeNode>()
```

これを有効にするために、インライン関数は*再帰型パラメーター*をサポートしているため、次のように記述できます。

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

上記のコードは、型パラメーターを`reified`修飾子で修飾して、関数内でアクセスできるようにします。まるで通常のクラスであるかのように。関数はインライン化されるため、リフレクションは必要ありません。`!is`や`as`のような通常の演算子を自由に使用できるようになりました。また、上記のように関数を呼び出すことができます。`myTree.findParentOfType<MyTreeNodeType>()`。

多くの場合、リフレクションは必要ないかもしれませんが、再帰型パラメーターでリフレクションを使用することもできます。

```kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("
"))
}
```

通常の関数（インラインとしてマークされていない）は、再帰型パラメーターを持つことができません。
ランタイム表現を持たない型（たとえば、非再帰型パラメーターや、`Nothing`のような架空の型）は、再帰型パラメーターの引数として使用できません。

## インラインプロパティ

`inline`修飾子は、[バッキングフィールド](properties#backing-fields)を持たないプロパティのアクセサーで使用できます。
個々のプロパティアクセサーにアノテーションを付けることができます。

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }
```

プロパティ全体にアノテーションを付けることもできます。これにより、両方のアクセサーが`inline`としてマークされます。

```kotlin
inline var bar: Bar
    get() = ...
    set(v) { ... }
```

呼び出し元では、インラインアクセサーは通常のインライン関数としてインライン化されます。

## パブリックAPIインライン関数の制限

インライン関数が`public`または`protected`であり、`private`または`internal`宣言の一部ではない場合、[モジュール](visibility-modifiers#modules)のパブリックAPIと見なされます。他のモジュールで呼び出すことができ、そのような呼び出し元でもインライン化されます。

これにより、インライン関数を宣言するモジュールでの変更によって引き起こされるバイナリ互換性のない特定の危険性が生じます。
呼び出し元のモジュールが変更後に再コンパイルされない場合です。

モジュールの*非*パブリックAPIの変更によってこのような非互換性が生じるリスクを排除するために、パブリックAPIインライン関数は、非パブリックAPI宣言、つまり`private`および`internal`宣言とその一部をその本体で使用することはできません。

`internal`宣言には`@PublishedApi`でアノテーションを付けることができ、これによりパブリックAPIインライン関数で使用できます。
`internal`インライン関数が`@PublishedApi`としてマークされている場合、その本体はパブリックであるかのようにチェックされます。