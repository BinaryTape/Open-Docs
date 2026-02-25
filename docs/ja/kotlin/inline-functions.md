[//]: # (title: インライン関数)

[高階関数](lambdas.md)を使用すると、実行時に一定のペナルティが発生します。各関数はオブジェクトであり、クロージャをキャプチャします。クロージャとは、関数の本体内でアクセスできる変数のスコープのことです。
メモリの割り当て（関数オブジェクトとクラスの両方）および仮想呼び出しは、実行時のオーバーヘッドをもたらします。

しかし、多くの場合、ラムダ式をインライン化することで、この種のオーバーヘッドを排除できることがわかっています。
以下に示す関数は、この状況の好例です。`lock()` 関数は、呼び出し箇所で簡単にインライン化できます。
次のケースを考えてみましょう。

```kotlin
lock(l) { foo() }
```

パラメータ用に関数オブジェクトを作成して呼び出しを生成する代わりに、コンパイラは次のようなコードを出力できます。

```kotlin
l.lock()
try {
    foo()
} finally {
    l.unlock()
}
```

コンパイラにこれを実行させるには、`lock()` 関数に `inline` 修飾子を付与します。

```kotlin
inline fun <T> lock(lock: Lock, body: () -> T): T { ... }
```

`inline` 修飾子は、関数自体とその関数に渡されるラムダの両方に影響します。これらすべてが呼び出し箇所にインライン化されます。

インライン化により、生成されるコードが肥大化する可能性があります。しかし、合理的な方法で（大きな関数のインライン化を避けるなど）行えば、特にループ内の「メガモーフィック（megamorphic）」な呼び出し箇所において、パフォーマンス面で報われることになります。

## noinline

インライン関数に渡されるすべてのラムダをインライン化したくない場合は、関数パラメータの一部に `noinline` 修飾子を付与します。

```kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) { ... }
```

インライン化可能なラムダは、インライン関数内でのみ呼び出すか、インライン化可能な引数として渡すことしかできません。一方、`noinline` ラムダは、フィールドに保持したり、あちこちへ受け渡したりするなど、自由に使用できます。

> インライン関数にインライン化可能な関数パラメータがなく、[実体化された型パラメータ（reified type parameters）](#reified-type-parameters)もない場合、コンパイラは警告を出します。そのような関数をインライン化してもメリットがある可能性は非常に低いためです（インライン化が必要であると確信している場合は、`@Suppress("NOTHING_TO_INLINE")` アノテーションを使用して警告を抑制できます）。
>
{style="note"}

## 非ローカルなジャンプ式

### Return

Kotlinでは、名前付き関数または匿名関数を終了するためにのみ、通常の修飾子のない `return` を使用できます。
ラムダを終了するには、[ラベル](returns.md#return-to-labels)を使用する必要があります。ラムダ内では、ラムダがそれを囲んでいる関数を `return` させることができないため、単独の `return` は禁止されています。

```kotlin
fun ordinaryFunction(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    ordinaryFunction {
        return // エラー: ここで `foo` を return させることはできません
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true" validate="false"}

しかし、ラムダが渡される関数がインライン化されている場合、returnも同様にインライン化できます。そのため、以下のような記述が許可されます。

```kotlin
inline fun inlined(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    inlined {
        return // OK: ラムダがインライン化されているため
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true"}

このような（ラムダ内に配置されているが、囲んでいる関数を終了させる）returnは、*非ローカル（non-local）* リターンと呼ばれます。この種の構造は通常、インライン関数が囲んでいることが多いループ内で発生します。

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // hasZeros から return する
    }
    return false
}
```

一部のインライン関数は、パラメータとして渡されたラムダを関数本体から直接呼び出すのではなく、ローカルオブジェクトやネストされた関数などの別の実行コンテキストから呼び出す場合があることに注意してください。そのような場合、ラムダ内での非ローカルな制御フローも許可されません。インライン関数のラムダパラメータが非ローカルリターンを使用できないことを示すには、ラムダパラメータに `crossinline` 修飾子を付与します。

```kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

### Break と continue

非ローカルな `return` と同様に、ループを囲むインライン関数に引数として渡されるラムダ内で、`break` および `continue` [ジャンプ式](returns.md)を使用することもできます。

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

## 実体化された型パラメータ (Reified type parameters)

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

ここでは、ツリーをさかのぼり、リフレクションを使用してノードが特定の型であるかどうかを確認しています。
これ自体は問題ありませんが、呼び出し側があまり綺麗ではありません。

```kotlin
treeNode.findParentOfType(MyTreeNode::class.java)
```

より良い解決策は、単に型をこの関数に渡すことです。次のように呼び出すことができます。

```kotlin
treeNode.findParentOfType<MyTreeNode>()
```

これを可能にするために、インライン関数は*実体化された型パラメータ（reified type parameters）*をサポートしています。そのため、次のように書くことができます。

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

上記のコードでは、型パラメータに `reified` 修飾子を付与して、あたかも通常のクラスであるかのように関数内部でアクセスできるようにしています。関数がインライン化されるため、リフレクションは不要であり、`!is` や `as` のような通常の演算子が使用可能になります。また、上述のように `myTree.findParentOfType<MyTreeNodeType>()` という形式で関数を呼び出すことができます。

多くの場合リフレクションは不要かもしれませんが、実体化された型パラメータでリフレクションを使用することも可能です。

```kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("
"))
}
```

通常の関数（`inline` とマークされていない関数）は、実体化された（reified）パラメータを持つことはできません。
実行時の表現を持たない型（例えば、実体化されていない型パラメータや、`Nothing` のような架空の型）は、実体化された型パラメータの引数として使用することはできません。

## インラインプロパティ

`inline` 修飾子は、[バッキングフィールド](properties.md#backing-fields)を持たないプロパティのアクセサに使用できます。
個々のプロパティアクセサにアノテーションを付けることができます。

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }
```

プロパティ全体にアノテーションを付けることもでき、その場合は両方のアクセサが `inline` としてマークされます。

```kotlin
inline var bar: Bar
    get() = ...
    set(v) { ... }
```

呼び出し箇所では、インラインアクセサは通常のインライン関数と同様にインライン化されます。

## 公開APIインライン関数の制限

インライン関数が `public` または `protected` であり、かつ `private` または `internal` な宣言の一部ではない場合、それは[モジュール](visibility-modifiers.md#modules)の公開APIと見なされます。これは他のモジュールからも呼び出すことができ、それらの呼び出し箇所でも同様にインライン化されます。

これにより、インライン関数を宣言しているモジュールが変更され、呼び出し側のモジュールが変更後に再コンパイルされない場合に、バイナリの不整合が生じるリスクが生じます。

モジュールの*非*公開APIの変更によってこのような不整合が生じるリスクを排除するため、公開APIインライン関数の本体では、非公開APIの宣言（すなわち `private` および `internal` な宣言、およびそれらの一部）を使用することは許可されていません。

`internal` な宣言に `@PublishedApi` を付与すると、公開APIインライン関数での使用が許可されます。`internal` インライン関数が `@PublishedApi` としてマークされている場合、その本体も公開されているかのようにチェックされます。