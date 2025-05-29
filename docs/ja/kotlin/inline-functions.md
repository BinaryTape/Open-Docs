[//]: # (title: インライン関数)

[高階関数](lambdas.md)を使用すると、いくつかの実行時ペナルティが発生します。各関数はオブジェクトであり、クロージャをキャプチャするからです。クロージャは、関数の本体でアクセスできる変数のスコープです。
メモリ割り当て（関数オブジェクトとクラスの両方）と仮想呼び出しは、実行時オーバーヘッドを発生させます。

しかし、多くの場合、この種のオーバーヘッドはラムダ式のインライン化によって解消できることがわかっています。
以下の関数は、この状況の良い例です。`lock()`関数は呼び出し箇所（コールサイト）で簡単にインライン化できます。
次のケースを考えてみましょう。

```kotlin
lock(l) { foo() }
```

パラメータの関数オブジェクトを作成して呼び出しを生成する代わりに、コンパイラは次のコードを生成できます。

```kotlin
l.lock()
try {
    foo()
} finally {
    l.unlock()
}
```

コンパイラにこれを行わせるには、`lock()`関数を`inline`修飾子でマークします。

```kotlin
inline fun <T> lock(lock: Lock, body: () -> T): T { ... }
```

`inline`修飾子は、関数自体とその関数に渡されるラムダの両方に影響を与え、それらすべてが呼び出し箇所にインライン化されます。

インライン化によって生成されるコードが増大する可能性があります。ただし、適切な方法で（大規模な関数のインライン化を避けて）行えば、パフォーマンスが向上し、特にループ内の「メガモルフィック」な呼び出し箇所で効果を発揮します。

## noinline

インライン関数に渡されるすべてのラムダがインライン化されることを望まない場合、関数の一部のパラメータを`noinline`修飾子でマークします。

```kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) { ... }
```

インライン化可能なラムダは、インライン関数内で呼び出すか、インライン化可能な引数として渡すことしかできません。
しかし、`noinline`ラムダは、フィールドに保存したり、あちこちに渡したりするなど、好きなように操作できます。

> インライン関数にインライン化可能な関数パラメータがなく、[実体化された型パラメータ](#reified-type-parameters)もない場合、コンパイラは警告を発します。そのような関数のインライン化は、ほとんどの場合、有益ではないためです（インライン化が必要であると確信している場合は、`@Suppress("NOTHING_TO_INLINE")`アノテーションを使用して警告を抑制できます）。
>
{style="note"}

## 非ローカルジャンプ式

### Returns

Kotlinでは、通常の非修飾`return`は、名前付き関数または匿名関数を終了するためにのみ使用できます。
ラムダを終了するには、[ラベル](returns.md#return-to-labels)を使用します。ラムダ内での裸の`return`は禁止されています。ラムダが囲む関数を`return`させることができないためです。

```kotlin
fun ordinaryFunction(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    ordinaryFunction {
        return // ERROR: `foo`をここでreturnさせることはできません
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true" validate="false"}

しかし、ラムダが渡される関数がインライン化される場合、`return`もインライン化できます。したがって、これは許可されます。

```kotlin
inline fun inlined(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    inlined {
        return // OK: ラムダがインライン化されます
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true"}

このような`return`（ラムダ内に配置されているが、囲む関数を終了するもの）は、*非ローカルリターン*と呼ばれます。この種の構成は、インライン関数がよく囲むループ内で通常発生します。

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // hasZerosからreturnします
    }
    return false
}
```

一部のインライン関数は、パラメータとして渡されたラムダを関数の本体から直接ではなく、ローカルオブジェクトやネストされた関数など、別の実行コンテキストから呼び出す場合があることに注意してください。そのような場合、ラムダ内で非ローカル制御フローは許可されません。インライン関数のラムダパラメータが非ローカルリターンを使用できないことを示すには、ラムダパラメータを`crossinline`修飾子でマークします。

```kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

### Breakとcontinue

> この機能は現在[プレビュー中](kotlin-evolution-principles.md#pre-stable-features)です。
> 将来のリリースで安定化する予定です。
> 有効にするには、`-Xnon-local-break-continue`コンパイラオプションを使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-1436)でのフィードバックをお待ちしております。
>
{style="warning"}

非ローカルな`return`と同様に、ループを囲むインライン関数への引数として渡されるラムダ内で`break`および`continue`[ジャンプ式](returns.md)を適用できます。

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

## 実体化された型パラメータ

場合によっては、パラメータとして渡された型にアクセスする必要があります。

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

ここでは、ツリーをたどり、リフレクションを使用してノードが特定の型であるかどうかを確認しています。
これでも問題ありませんが、呼び出し箇所はあまりきれいではありません。

```kotlin
treeNode.findParentOfType(MyTreeNode::class.java)
```

より良い解決策は、単にこの関数に型を渡すことです。次のように呼び出すことができます。

```kotlin
treeNode.findParentOfType<MyTreeNode>()
```

これを可能にするために、インライン関数は*実体化された型パラメータ*をサポートしているため、次のように書くことができます。

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

上記のコードは、`reified`修飾子で型パラメータを修飾し、まるで通常のクラスであるかのように関数内でアクセスできるようにします。
関数がインライン化されるため、リフレクションは必要なく、`!is`や`as`などの通常の演算子を使用できるようになります。
また、上記のように`myTree.findParentOfType<MyTreeNodeType>()`と関数を呼び出すことができます。

多くの場合、リフレクションは必要ないかもしれませんが、実体化された型パラメータと組み合わせて使用することはできます。

```kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("
"))
}
```

通常の関数（インラインとしてマークされていない関数）は、実体化されたパラメータを持つことはできません。
実行時表現を持たない型（たとえば、実体化されていない型パラメータや`Nothing`のような架空の型）は、実体化された型パラメータの引数として使用できません。

## インラインプロパティ

`inline`修飾子は、[バッキングフィールド](properties.md#backing-fields)を持たないプロパティのアクセサで使用できます。
個々のプロパティアクセサにアノテーションを付けることができます。

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }
```

プロパティ全体にアノテーションを付けることもでき、その場合は両方のアクセサが`inline`としてマークされます。

```kotlin
inline var bar: Bar
    get() = ...
    set(v) { ... }
```

呼び出し箇所では、インラインアクセサは通常のインライン関数と同様にインライン化されます。

## public APIインライン関数の制限

インライン関数が`public`または`protected`であり、かつ`private`または`internal`宣言の一部でない場合、それは[モジュール](visibility-modifiers.md#modules)のpublic APIとみなされます。
それは他のモジュールから呼び出すことができ、そのような呼び出し箇所でもインライン化されます。

これは、呼び出し元のモジュールが変更後に再コンパイルされない場合に、インライン関数を宣言するモジュールでの変更によってバイナリ互換性のリスクをもたらします。

モジュールの*非*public APIの変更によってこのような非互換性が導入されるリスクを排除するために、public APIインライン関数は、`private`および`internal`宣言とその一部である非public API宣言をその本体で使用することはできません。

`internal`宣言には`@PublishedApi`をアノテーションとして付けることができ、これによりpublic APIインライン関数での使用が許可されます。
`internal`インライン関数が`@PublishedApi`としてマークされている場合、その本体もpublicであるかのようにチェックされます。