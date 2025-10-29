[//]: # (title: 関数型（SAM）インターフェース)

抽象メンバ関数を1つだけ持つインターフェースは、_関数型インターフェース_、または_Single Abstract Method (SAM) インターフェース_と呼ばれます。関数型インターフェースは、複数の非抽象メンバ関数を持つことができますが、抽象メンバ関数は1つだけです。

Kotlinで関数型インターフェースを宣言するには、`fun`修飾子を使用します。

```kotlin
fun interface KRunnable {
    fun invoke()
}
```

## SAM変換

関数型インターフェースでは、[ラムダ式](lambdas.md#lambda-expressions-and-anonymous-functions)を使用することでコードをより簡潔かつ読みやすくするのに役立つSAM変換を使用できます。

関数型インターフェースを実装するクラスを手動で作成する代わりに、ラムダ式を使用できます。SAM変換を使用すると、Kotlinはインターフェースの単一メソッドのシグネチャと一致する任意のラムダ式を、インターフェース実装を動的にインスタンス化するコードに変換できます。

例えば、次のKotlin関数型インターフェースを考えてみましょう。

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}
```

SAM変換を使用しない場合、次のようなコードを書く必要があります。

```kotlin
// Creating an instance of a class
val isEven = object : IntPredicate {
    override fun accept(i: Int): Boolean {
        return i % 2 == 0
    }
}
```

KotlinのSAM変換を活用することで、代わりに次の同等のコードを書くことができます。

```kotlin
// Creating an instance using lambda
val isEven = IntPredicate { it % 2 == 0 }
```

短いラムダ式が不要なコードをすべて置き換えます。

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() {
    println("Is 7 even? - ${isEven.accept(7)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

また、[JavaインターフェースのためのSAM変換](java-interop.md#sam-conversions)を使用することもできます。

## コンストラクタ関数を持つインターフェースから関数型インターフェースへの移行

1.6.20以降、Kotlinは関数型インターフェースコンストラクタへの[呼び出し可能参照](reflection.md#callable-references)をサポートしており、これにより、コンストラクタ関数を持つインターフェースから関数型インターフェースへの移行において、ソース互換性のある方法が追加されます。
次のコードを考えてみましょう。

```kotlin
interface Printer { 
    fun print() 
}

fun Printer(block: () -> Unit): Printer = object : Printer {
    override fun print() = block()
}
```

関数型インターフェースコンストラクタへの呼び出し可能参照が有効になっている場合、このコードは関数型インターフェース宣言だけで置き換えることができます。

```kotlin
fun interface Printer { 
    fun print()
}
```

そのコンストラクタは暗黙的に作成され、`::Printer`関数参照を使用するすべてのコードはコンパイルされます。例えば：

```kotlin
documentsStorage.addPrinter(::Printer)
```

バイナリ互換性を保つために、レガシーな関数`Printer`を`DeprecationLevel.HIDDEN`を持つ[`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)アノテーションでマークします。

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

## 関数型インターフェースと型エイリアス

上記を単に、関数型に対する[型エイリアス](type-aliases.md)を使用して書き換えることもできます。

```kotlin
typealias IntPredicate = (i: Int) -> Boolean

val isEven: IntPredicate = { it % 2 == 0 }

fun main() {
    println("Is 7 even? - ${isEven(7)}")
}
```

しかし、関数型インターフェースと[型エイリアス](type-aliases.md)は異なる目的を果たします。
型エイリアスは既存の型に付けられた単なる名前であり、新しい型を作成しませんが、関数型インターフェースは新しい型を作成します。
特定の関数型インターフェースに特有の拡張機能を提供でき、これらは通常の関数やその型エイリアスには適用されません。

型エイリアスは1つのメンバしか持つことができませんが、関数型インターフェースは複数の非抽象メンバ関数と1つの抽象メンバ関数を持つことができます。
関数型インターフェースは他のインターフェースを実装したり拡張したりすることもできます。

関数型インターフェースは型エイリアスよりも柔軟で、より多くの機能を提供しますが、特定のインターフェースへの変換が必要になる場合があるため、構文的にも実行時にもコストがかかる可能性があります。
コードでどちらを使用するかを選択する際には、ニーズを考慮してください。
* APIが特定の引数型と戻り値型を持つ関数（任意の関数）を受け入れる必要がある場合、単純な関数型を使用するか、対応する関数型に短い名前を付けるために型エイリアスを定義します。
* APIが関数よりも複雑なエンティティを受け入れる場合（例えば、自明でない契約や、関数型のシグネチャでは表現できない操作がある場合）、そのための独立した関数型インターフェースを宣言します。