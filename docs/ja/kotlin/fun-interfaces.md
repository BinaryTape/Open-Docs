[//]: # (title: 関数型 (SAM) インターフェース)

抽象メンバー関数を1つだけ持つインターフェースは、_関数型インターフェース_、または _単一抽象メソッド (SAM) インターフェース_ と呼ばれます。関数型インターフェースは、複数の非抽象メンバー関数を持つことができますが、抽象メンバー関数は1つだけです。

Kotlinで関数型インターフェースを宣言するには、`fun` 修飾子を使用します。

```kotlin
fun interface KRunnable {
   fun invoke()
}
```

## SAM変換

関数型インターフェースの場合、[ラムダ式](lambdas.md#lambda-expressions-and-anonymous-functions)を使用することで、コードをより簡潔で読みやすくするSAM変換を利用できます。

関数型インターフェースを手動で実装するクラスを作成する代わりに、ラムダ式を使用できます。SAM変換により、Kotlinはインターフェースの単一メソッドのシグネチャに一致するラムダ式を、インターフェースの実装を動的にインスタンス化するコードに変換できます。

例えば、次のKotlin関数型インターフェースを考えてみましょう。

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}
```

SAM変換を使用しない場合、次のようなコードを書く必要があります。

```kotlin
// クラスのインスタンスを作成する
val isEven = object : IntPredicate {
   override fun accept(i: Int): Boolean {
       return i % 2 == 0
   }
}
```

KotlinのSAM変換を活用することで、代わりに次の同等のコードを書くことができます。

```kotlin
// ラムダを使用してインスタンスを作成する
val isEven = IntPredicate { it % 2 == 0 }
```

短いラムダ式が、不要なコードをすべて置き換えます。

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

1.6.20以降、Kotlinは関数型インターフェースのコンストラクタへの[呼び出し可能参照](reflection.md#callable-references)をサポートしており、これによりコンストラクタ関数を持つインターフェースから関数型インターフェースへのソース互換性のある移行方法が追加されました。
次のコードを検討してください。

```kotlin
interface Printer { 
    fun print() 
}

fun Printer(block: () -> Unit): Printer = object : Printer { override fun print() = block() }
```

関数型インターフェースのコンストラクタへの呼び出し可能参照が有効になっている場合、このコードは単に関数型インターフェースの宣言に置き換えることができます。

```kotlin
fun interface Printer { 
    fun print()
}
```

そのコンストラクタは暗黙的に作成され、`::Printer` 関数参照を使用するすべてのコードはコンパイルされます。例：

```kotlin
documentsStorage.addPrinter(::Printer)
```

レガシー関数 `Printer` を`DeprecationLevel.HIDDEN`を持つ[`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)アノテーションでマークすることで、バイナリ互換性を維持できます。

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

## 関数型インターフェースと型エイリアス

上記のコードは、関数型の[型エイリアス](type-aliases.md)を使用して簡単に書き換えることもできます。

```kotlin
typealias IntPredicate = (i: Int) -> Boolean

val isEven: IntPredicate = { it % 2 == 0 }

fun main() {
   println("Is 7 even? - ${isEven(7)}")
}
```

しかし、関数型インターフェースと[型エイリアス](type-aliases.md)は異なる目的を果たします。
型エイリアスは既存の型の単なる名前であり、新しい型を作成しませんが、関数型インターフェースは新しい型を作成します。特定の関数型インターフェースに固有の拡張機能を提供し、通常の関数やその型エイリアスには適用されないようにすることができます。

型エイリアスはメンバーを1つしか持てませんが、関数型インターフェースは複数の非抽象メンバー関数と1つの抽象メンバー関数を持つことができます。関数型インターフェースは、他のインターフェースを実装したり拡張したりすることもできます。

関数型インターフェースは型エイリアスよりも柔軟で、より多くの機能を提供しますが、特定のインターフェースへの変換が必要になるため、構文的にも実行時にもコストがかかる可能性があります。
コードでどちらを使用するかを選択する際には、以下のニーズを考慮してください。
*   APIが特定のパラメータと戻り値の型を持つ関数（任意の関数）を受け入れる必要がある場合、単純な関数型を使用するか、対応する関数型に短い名前を付けるために型エイリアスを定義してください。
*   APIが関数よりも複雑なエンティティを受け入れる場合（例えば、自明ではない契約や関数型のシグネチャでは表現できない操作を持つ場合）、それ専用の関数型インターフェースを宣言してください。