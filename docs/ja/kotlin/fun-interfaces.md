---
title: "Functional (SAM) インターフェース"
---
単一の抽象メンバー関数のみを持つインターフェースは、_関数型インターフェース_、または_Single Abstract Method (SAM) interface_と呼ばれます。関数型インターフェースは、複数の非抽象メンバー関数を持つことができますが、抽象メンバー関数は1つだけです。

Kotlinで関数型インターフェースを宣言するには、`fun`修飾子を使用します。

```kotlin
fun interface KRunnable {
   fun invoke()
}
```

## SAM変換

関数型インターフェースでは、[ラムダ式](lambdas#lambda-expressions-and-anonymous-functions)を使用することで、コードをより簡潔で読みやすくするのに役立つSAM変換を使用できます。

関数型インターフェースを実装するクラスを手動で作成する代わりに、ラムダ式を使用できます。
SAM変換を使用すると、Kotlinは、インターフェースの単一メソッドのシグネチャに一致するシグネチャを持つ任意のラムダ式を、インターフェースの実装を動的にインスタンス化するコードに変換できます。

たとえば、次のKotlinの関数型インターフェースについて考えてみましょう。

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}
```

SAM変換を使用しない場合は、次のようなコードを記述する必要があります。

```kotlin
// Creating an instance of a class
val isEven = object : IntPredicate {
   override fun accept(i: Int): Boolean {
       return i % 2 == 0
   }
}
```

KotlinのSAM変換を利用することで、代わりに次の同等のコードを記述できます。

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

[JavaインターフェースのSAM変換](java-interop#sam-conversions)も使用できます。

## コンストラクター関数を持つインターフェースから関数型インターフェースへの移行

1.6.20以降、Kotlinは関数型インターフェースのコンストラクターへの[呼び出し可能参照](reflection#callable-references)をサポートしています。これにより、コンストラクター関数を持つインターフェースから関数型インターフェースに移行するためのソース互換性のある方法が追加されます。
次のコードについて考えてみましょう。

```kotlin
interface Printer { 
    fun print() 
}

fun Printer(block: () `->` Unit): Printer = object : Printer { override fun print() = block() }
```

関数型インターフェースコンストラクターへの呼び出し可能参照を有効にすると、このコードは関数型インターフェースの宣言のみで置き換えることができます。

```kotlin
fun interface Printer { 
    fun print()
}
```

そのコンストラクターは暗黙的に作成され、`::Printer`関数参照を使用するすべてのコードはコンパイルされます。例：

```kotlin
documentsStorage.addPrinter(::Printer)
```

レガシー関数`Printer`に[`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)アノテーションと`DeprecationLevel.HIDDEN`を指定して、バイナリ互換性を維持します。

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

## 関数型インターフェースと型エイリアス

関数型に対して[型エイリアス](type-aliases)を使用するだけで、上記を簡単に書き換えることもできます。

```kotlin
typealias IntPredicate = (i: Int) `->` Boolean

val isEven: IntPredicate = { it % 2 == 0 }

fun main() {
   println("Is 7 even? - ${isEven(7)}")
}
```

ただし、関数型インターフェースと[型エイリアス](type-aliases)は異なる目的を果たします。
型エイリアスは既存の型の単なる名前であり、新しい型を作成しませんが、関数型インターフェースは新しい型を作成します。
特定の関数型インターフェースに固有の拡張機能を提供して、プレーンな関数またはその型エイリアスには適用できないようにすることができます。

型エイリアスはメンバーを1つしか持つことができませんが、関数型インターフェースは複数の非抽象メンバー関数と1つの抽象メンバー関数を持つことができます。
関数型インターフェースは、他のインターフェースを実装および拡張することもできます。

関数型インターフェースは型エイリアスよりも柔軟性があり、より多くの機能を提供しますが、特定のインターフェースへの変換が必要になる場合があるため、構文的にも実行時にもコストがかかる可能性があります。
コードでどちらを使用するかを選択するときは、ニーズを考慮してください。
* APIが特定のパラメーターと戻り値の型を持つ関数（任意の関数）を受け入れる必要がある場合は、単純な関数型を使用するか、型エイリアスを定義して対応する関数型に短い名前を付けます。
* APIが関数よりも複雑なエンティティを受け入れる場合（たとえば、関数型のシグネチャでは表現できない、重要でないコントラクトや操作がある場合）は、個別の関数型インターフェースを宣言します。