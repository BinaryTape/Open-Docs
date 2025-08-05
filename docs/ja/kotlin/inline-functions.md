[//]: # (title: インライン関数)

[高階関数](lambdas.md)を使用すると、特定の実行時ペナルティが発生します。各関数はオブジェクトであり、クロージャをキャプチャします。
クロージャとは、関数の本体でアクセスできる変数のスコープです。
メモリ割り当て（関数オブジェクトとクラスの両方）と仮想呼び出しは、実行時オーバーヘッドを引き起こします。

しかし、多くの場合、この種のオーバーヘッドはラムダ式をインライン化することで解消できるようです。
以下の関数は、この状況の良い例です。`lock()`関数は、呼び出し箇所で簡単にインライン化できます。
次のケースを考えてみましょう。

```kotlin
lock(l) { foo() }
```

パラメータ用の関数オブジェクトを作成して呼び出しを生成する代わりに、コンパイラは次のコードを出力できます。

```kotlin
l.lock()
try {
    foo()
} finally {
    l.unlock()
}
```

コンパイラにこれをさせるには、`lock()`関数に`inline`修飾子を付けてマークします。

```kotlin
inline fun <T> lock(lock: Lock, body: () -> T): T { ... }
```

`inline`修飾子は、関数自体とそれに渡されるラムダの両方に影響を与えます。それらすべてが呼び出し箇所にインライン化されます。

インライン化によって生成されるコードが増大する可能性があります。しかし、合理的な方法（大きな関数のインライン化を避けるなど）で行えば、特にループ内の「メガモーフィックな」呼び出し箇所で、パフォーマンスに貢献するでしょう。

## noinline

インライン関数に渡されるすべてのラムダをインライン化したくない場合は、関数パラメータの一部を`noinline`修飾子でマークします。

```kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) { ... }
```

インライン化可能なラムダは、インライン関数内でのみ呼び出すか、インライン化可能な引数として渡すことができます。一方、`noinline`ラムダは、フィールドに格納したり、引き回したりするなど、あらゆる方法で操作できます。

> インライン関数にインライン化可能な関数パラメータがなく、かつ
> [実体化された型パラメータ](#reified-type-parameters)もない場合、コンパイラは警告を発行します。なぜなら、そのような関数のインライン化は
> ほとんど有益ではないためです（インライン化が必要であると確信している場合は、`@Suppress("NOTHING_TO_INLINE")`アノテーションを使用して警告を抑制できます）。
>
{style="note"}

## 非ローカルなジャンプ式

### Returns

Kotlinでは、名前付き関数または匿名関数を終了するために、通常の修飾なしの`return`のみを使用できます。
ラムダを終了するには、[ラベル](returns.md#return-to-labels)を使用します。無修飾の`return`は
ラムダ内で禁止されています。なぜなら、ラムダは囲んでいる関数を`return`させることができないためです。

```kotlin
fun ordinaryFunction(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    ordinaryFunction {
        return // エラー: ここで`foo`をreturnさせることはできません
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true" validate="false"}

しかし、ラムダが渡される関数がインライン化されている場合、その`return`もインライン化できます。したがって、これは許可されています。

```kotlin
inline fun inlined(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    inlined {
        return // OK: ラムダがインライン化されるため
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true"}

このようなリターン（ラムダ内にありながら、囲んでいる関数を終了する）は、*非ローカルなリターン*と呼ばれます。この種の構文は、インライン関数が頻繁に囲むループ内でよく発生します。

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // hasZeros から戻る
    }
    return false
}
```

一部のインライン関数は、パラメータとして渡されたラムダを関数本体から直接呼び出すのではなく、ローカルオブジェクトやネストされた関数など、別の実行コンテキストから呼び出す場合があります。このような場合、ラムダ内での非ローカルな制御フローは許可されません。インライン関数のラムダパラメータが非ローカルなリターンを使用できないことを示すには、ラムダパラメータを`crossinline`修飾子でマークします。

```kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

### Breakとcontinue

非ローカルな`return`と同様に、ループを囲むインライン関数に引数として渡されるラムダ内で`break`および`continue`[ジャンプ式](returns.md)を適用できます。

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

パラメータとして渡された型にアクセスする必要がある場合があります。

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

ここでは、ツリーをさかのぼり、リフレクションを使用してノードが特定の型であるかチェックしています。
これは問題ありませんが、呼び出し箇所があまりきれいではありません。

```kotlin
treeNode.findParentOfType(MyTreeNode::class.java)
```

より良い解決策は、単にこの関数に型を渡すことです。次のように呼び出すことができます。

```kotlin
treeNode.findParentOfType<MyTreeNode>()
```

これを可能にするために、インライン関数は*実体化された型パラメータ*をサポートしており、次のように記述できます。

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

上記のコードは、型パラメータを`reified`修飾子で修飾して、通常のクラスであるかのように関数内でアクセスできるようにしています。関数がインライン化されるため、リフレクションは不要になり、`!is`や`as`のような通常の演算子を使用できるようになります。また、上記のように`myTree.findParentOfType<MyTreeNodeType>()`と関数を呼び出すことができます。

多くの場合、リフレクションは不要かもしれませんが、実体化された型パラメータとともに使用することは可能です。

```kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("
"))
}
```

通常の関数（`inline`とマークされていない関数）は、実体化されたパラメータを持つことはできません。
実行時表現を持たない型（たとえば、非実体化型パラメータや`Nothing`のような仮想的な型）は、実体化された型パラメータの引数として使用できません。

## インラインプロパティ

`inline`修飾子は、[バッキングフィールド](properties.md#backing-fields)を持たないプロパティのアクセサーに使用できます。
個々のプロパティアクセサーにアノテーションを付与できます。

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }
```

プロパティ全体にアノテーションを付与することもでき、これにより両方のアクセサーが`inline`としてマークされます。

```kotlin
inline var bar: Bar
    get() = ...
    set(v) { ... }
```

呼び出し箇所では、インラインアクセサーは通常のインライン関数としてインライン化されます。

## パブリックAPIインライン関数の制限

インライン関数が`public`または`protected`であるが、`private`または`internal`宣言の一部ではない場合、
それは[モジュール](visibility-modifiers.md#modules)のパブリックAPIとみなされます。これは他のモジュールから呼び出すことができ、
そのような呼び出し箇所でもインライン化されます。

これにより、変更後に呼び出し元のモジュールが再コンパイルされない場合に、インライン関数を宣言するモジュールの変更によってバイナリ非互換性が発生するリスクが生じます。

モジュールの*非*パブリックAPIの変更によってこのような非互換性が導入されるリスクを排除するため、パブリックAPIインライン関数は、非パブリックAPI宣言、すなわち`private`および`internal`宣言とその一部をその本体で使用することは許可されていません。

`internal`宣言には`@PublishedApi`を付与できます。これにより、パブリックAPIインライン関数での使用が可能になります。
`internal`インライン関数が`@PublishedApi`とマークされている場合、その本体も、パブリックであるかのようにチェックされます。