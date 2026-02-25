[//]: # (title: 関数型 (SAM) インターフェース)

抽象メンバ関数を1つだけ持つインターフェースは、*関数型インターフェース*、または *Single Abstract Method (SAM) インターフェース*と呼ばれます。関数型インターフェースは、複数の非抽象メンバ関数を持つことができますが、抽象メンバ関数は1つだけでなければなりません。

Kotlinで関数型インターフェースを宣言するには、`fun` 修飾子を使用します。

```kotlin
fun interface KRunnable {
    fun invoke()
}
```

## SAM変換

関数型インターフェースでは、[ラムダ式](lambdas.md#lambda-expressions-and-anonymous-functions)を使用することで、コードをより簡潔で読みやすくできるSAM変換を利用できます。

関数型インターフェースを実装するクラスを手動で作成する代わりに、ラムダ式を使用できます。SAM変換を使用すると、Kotlinは、インターフェースの単一メソッドのシグネチャと一致するラムダ式を、そのインターフェースの実装を動的にインスタンス化するコードへと変換できます。

例えば、次のようなKotlinの関数型インターフェースを考えてみましょう。

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}
```

SAM変換を使用しない場合、次のようなコードを書く必要があります。

```kotlin
// クラスのインスタンスを作成
val isEven = object : IntPredicate {
    override fun accept(i: Int): Boolean {
        return i % 2 == 0
    }
}
```

KotlinのSAM変換を活用することで、代わりに次のような同等のコードを書くことができます。

```kotlin
// ラムダを使用してインスタンスを作成
val isEven = IntPredicate { it % 2 == 0 }
```

短いラムダ式が、すべての不要なコードを置き換えます。

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

[Javaインターフェースに対してもSAM変換](java-interop.md#sam-conversions)を使用できます。

## コンストラクタ関数を持つインターフェースから関数型インターフェースへの移行

1.6.20から、Kotlinは関数型インターフェースのコンストラクタへの[呼び出し可能参照](reflection.md#callable-references)をサポートしています。これにより、コンストラクタ関数を持つインターフェースから関数型インターフェースへ、ソース互換性を保ったまま移行する方法が追加されました。
次のコードを考えてみましょう。

```kotlin
interface Printer { 
    fun print() 
}

fun Printer(block: () -> Unit): Printer = object : Printer {
    override fun print() = block()
}
```

関数型インターフェースのコンストラクタへの呼び出し可能参照を有効にすると、このコードは単に関数型インターフェースの宣言に置き換えることができます。

```kotlin
fun interface Printer { 
    fun print()
}
```

そのコンストラクタは暗黙的に作成され、`::Printer` 関数参照を使用しているコードはすべてコンパイルされます。例：

```kotlin
documentsStorage.addPrinter(::Printer)
```

レガシーな関数 `Printer` に [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) アノテーションを付け、`DeprecationLevel.HIDDEN` を指定することで、バイナリ互換性を維持します。

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

## 関数型インターフェースと型エイリアスの比較

上記の内容は、関数型に対する[型エイリアス](type-aliases.md)を使っても簡単に書き換えることができます。

```kotlin
typealias IntPredicate = (i: Int) -> Boolean

val isEven: IntPredicate = { it % 2 == 0 }

fun main() {
    println("Is 7 even? - ${isEven(7)}")
}
```

しかし、関数型インターフェースと[型エイリアス](type-aliases.md)は異なる目的で使用されます。
型エイリアスは既存の型に対する名前にすぎず、新しい型を作成しません。一方で、関数型インターフェースは新しい型を作成します。特定の関数型インターフェースに特化した拡張関数を提供することで、通常の関数やその型エイリアスには適用されないようにすることができます。

型エイリアスは1つのメンバしか持てませんが、関数型インターフェースは複数の非抽象メンバ関数と1つの抽象メンバ関数を持つことができます。また、関数型インターフェースは他のインターフェースを実装したり継承したりすることも可能です。

関数型インターフェースは型エイリアスよりも柔軟で多くの機能を提供しますが、特定のインターフェースへの変換が必要になる場合があるため、構文的にも実行時にもコストが高くなる可能性があります。
コード内でどちらを使用するか選択する際は、ニーズを考慮してください。

* APIが、特定のパラメータと戻り値の型を持つ関数（任意の関数）を受け取る必要がある場合は、単純な関数型を使用するか、対応する関数型に短い名前を付けるために型エイリアスを定義してください。
* APIが関数よりも複雑なエンティティを受け取る場合（例えば、関数型のシグネチャでは表現できない非自明な契約や操作がある場合）は、そのための個別の関数型インターフェースを宣言してください。