---
title: 基本構文
---
基本的な構文要素と例を集めました。各セクションの最後には、関連トピックの詳細な説明へのリンクがあります。

JetBrains Academyの無料[Kotlin Core track](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)でKotlinの基礎を全て学ぶこともできます。

## パッケージの定義とインポート

パッケージの指定はソースファイルの先頭で行う必要があります。

```kotlin
package my.demo

import kotlin.text.*

// ...
```

ディレクトリとパッケージを一致させる必要はありません。ソースファイルはファイルシステム内の任意の場所に配置できます。

[パッケージ (Packages)](packages)を参照してください。

## プログラムのエントリーポイント

Kotlinアプリケーションのエントリーポイントは、`main`関数です。

```kotlin
fun main() {
    println("Hello world!")
}
```

別の形式の`main`は、可変個数の`String`引数を受け入れます。

```kotlin
fun main(args: Array<String>) {
    println(args.contentToString())
}
```

## 標準出力への出力

`print`は、引数を標準出力に出力します。

```kotlin
fun main() {

    print("Hello ")
    print("world!")

}
```

`println`は、引数を出力し、改行を追加します。これにより、次に出力するものが次の行に表示されます。

```kotlin
fun main() {

    println("Hello world!")
    println(42)

}
```

## 標準入力からの読み込み

`readln()`関数は、標準入力から読み込みます。この関数は、ユーザーが入力した行全体を文字列として読み取ります。

`println()`、`readln()`、および`print()`関数を組み合わせて、ユーザー入力を要求および表示するメッセージを出力できます。

```kotlin
// Prints a message to request input
println("Enter any word: ")

// Reads and stores the user input. For example: Happiness
val yourWord = readln()

// Prints a message with the input
print("You entered the word: ")
print(yourWord)
// You entered the word: Happiness
```

詳細については、[標準入力の読み込み (Read standard input)](read-standard-input)を参照してください。

## 関数

2つの`Int`パラメータと`Int`戻り値の型を持つ関数:

```kotlin

fun sum(a: Int, b: Int): Int {
    return a + b
}

fun main() {
    print("sum of 3 and 5 is ")
    println(sum(3, 5))
}
```

関数本体は式にすることができます。その戻り値の型は推論されます。

```kotlin

fun sum(a: Int, b: Int) = a + b

fun main() {
    println("sum of 19 and 23 is ${sum(19, 23)}")
}
```

意味のある値を返さない関数:

```kotlin

fun printSum(a: Int, b: Int): Unit {
    println("sum of $a and $b is ${a + b}")
}

fun main() {
    printSum(-1, 8)
}
```

`Unit`戻り値の型は省略できます。

```kotlin

fun printSum(a: Int, b: Int) {
    println("sum of $a and $b is ${a + b}")
}

fun main() {
    printSum(-1, 8)
}
```

[関数 (Functions)](functions)を参照してください。

## 変数

Kotlinでは、変数を宣言するには、キーワード`val`または`var`で始め、その後に変数の名前を続けます。

`val`キーワードを使用して、一度だけ値を割り当てられる変数を宣言します。これらはイミュータブルな読み取り専用のローカル変数であり、初期化後に別の値を再割り当てすることはできません。

```kotlin
fun main() {

    // Declares the variable x and initializes it with the value of 5
    val x: Int = 5
    // 5

    println(x)
}
```

`var`キーワードを使用して、再割り当てできる変数を宣言します。これらはミュータブルな変数であり、初期化後に値を変更できます。

```kotlin
fun main() {

    // Declares the variable x and initializes it with the value of 5
    var x: Int = 5
    // Reassigns a new value of 6 to the variable x
    x += 1
    // 6

    println(x)
}
```

Kotlinは型推論をサポートしており、宣言された変数のデータ型を自動的に識別します。変数を宣言するときに、変数名の後の型を省略できます。

```kotlin
fun main() {

    // Declares the variable x with the value of 5;`Int` type is inferred
    val x = 5
    // 5

    println(x)
}
```

変数は、初期化後にのみ使用できます。変数は宣言時に初期化するか、最初に変数を宣言して後で初期化することができます。
後者の場合、データ型を指定する必要があります。

```kotlin
fun main() {

    // Initializes the variable x at the moment of declaration; type is not required
    val x = 5
    // Declares the variable c without initialization; type is required
    val c: Int
    // Initializes the variable c after declaration 
    c = 3
    // 5 
    // 3

    println(x)
    println(c)
}
```

トップレベルで変数を宣言できます。

```kotlin

val PI = 3.14
var x = 0

fun incrementX() {
    x += 1
}
// x = 0; PI = 3.14
// incrementX()
// x = 1; PI = 3.14

fun main() {
    println("x = $x; PI = $PI")
    incrementX()
    println("incrementX()")
    println("x = $x; PI = $PI")
}
```

プロパティの宣言については、[プロパティ (Properties)](properties)を参照してください。

## クラスとインスタンスの作成

クラスを定義するには、`class`キーワードを使用します。
```kotlin
class Shape
```

クラスのプロパティは、その宣言または本体にリストできます。

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
```

クラス宣言にリストされたパラメータを持つデフォルトのコンストラクタは、自動的に利用可能です。

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
fun main() {
    val rectangle = Rectangle(5.0, 2.0)
    println("The perimeter is ${rectangle.perimeter}")
}
```

クラス間の継承はコロン（`:`）で宣言されます。クラスはデフォルトで`final`です。クラスを継承可能にするには、
`open`としてマークします。

```kotlin
open class Shape

class Rectangle(val height: Double, val length: Double): Shape() {
    val perimeter = (height + length) * 2 
}
```

コンストラクタと継承の詳細については、[クラス (Classes)](classes)と[オブジェクトとインスタンス (Objects and instances)](object-declarations)を参照してください。

## コメント

ほとんどの最新言語と同様に、Kotlinは単一行（または_行末_）コメントと複数行（_ブロック_）コメントをサポートしています。

```kotlin
// This is an end-of-line comment

/* This is a block comment
   on multiple lines. */
```

Kotlinのブロックコメントはネストできます。

```kotlin
/* The comment starts here
/* contains a nested comment */     
and ends here. */
```

ドキュメンテーションコメントの構文については、[Kotlinコードのドキュメント化 (Documenting Kotlin Code)](kotlin-doc)を参照してください。

## 文字列テンプレート

```kotlin
fun main() {

    var a = 1
    // simple name in template:
    val s1 = "a is $a" 
    
    a = 2
    // arbitrary expression in template:
    val s2 = "${s1.replace("is", "was")}, but now is $a"

    println(s2)
}
```

詳細については、[文字列テンプレート (String templates)](strings#string-templates)を参照してください。

## 条件式

```kotlin

fun maxOf(a: Int, b: Int): Int {
    if (a > b) {
        return a
    } else {
        return b
    }
}

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```

Kotlinでは、`if`は式としても使用できます。

```kotlin

fun maxOf(a: Int, b: Int) = if (a > b) a else b

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```

[`if`-式 (`if`-expressions)](control-flow#if-expression)を参照してください。

## forループ

```kotlin
fun main() {

    val items = listOf("apple", "banana", "kiwifruit")
    for (item in items) {
        println(item)
    }

}
```

または:

```kotlin
fun main() {

    val items = listOf("apple", "banana", "kiwifruit")
    for (index in items.indices) {
        println("item at $index is ${items[index]}")
    }

}
```

[forループ (for loop)](control-flow#for-loops)を参照してください。

## whileループ

```kotlin
fun main() {

    val items = listOf("apple", "banana", "kiwifruit")
    var index = 0
    while (index < items.size) {
        println("item at $index is ${items[index]}")
        index++
    }

}
```

[whileループ (while loop)](control-flow#while-loops)を参照してください。

## when式

```kotlin

fun describe(obj: Any): String =
    when (obj) {
        1          `->` "One"
        "Hello"    `->` "Greeting"
        is Long    `->` "Long"
        !is String `->` "Not a string"
        else       `->` "Unknown"
    }

fun main() {
    println(describe(1))
    println(describe("Hello"))
    println(describe(1000L))
    println(describe(2))
    println(describe("other"))
}
```

[when式と文 (when expressions and statements)](control-flow#when-expressions-and-statements)を参照してください。

## 範囲

`in`演算子を使用して、数値が範囲内にあるかどうかを確認します。

```kotlin
fun main() {

    val x = 10
    val y = 9
    if (x in 1..y+1) {
        println("fits in range")
    }

}
```

数値が範囲外にあるかどうかを確認します。

```kotlin
fun main() {

    val list = listOf("a", "b", "c")
    
    if (-1 !in 0..list.lastIndex) {
        println("-1 is out of range")
    }
    if (list.size !in list.indices) {
        println("list size is out of valid list indices range, too")
    }

}
```

範囲を反復処理します。

```kotlin
fun main() {

    for (x in 1..5) {
        print(x)
    }

}
```

またはプログレッションを反復処理します。

```kotlin
fun main() {

    for (x in 1..10 step 2) {
        print(x)
    }
    println()
    for (x in 9 downTo 0 step 3) {
        print(x)
    }

}
```

[範囲とプログレッション (Ranges and progressions)](ranges)を参照してください。

## コレクション

コレクションを反復処理します。

```kotlin
fun main() {
    val items = listOf("apple", "banana", "kiwifruit")

    for (item in items) {
        println(item)
    }

}
```

`in`演算子を使用して、コレクションにオブジェクトが含まれているかどうかを確認します。

```kotlin
fun main() {
    val items = setOf("apple", "banana", "kiwifruit")

    when {
        "orange" in items `->` println("juicy")
        "apple" in items `->` println("apple is fine too")
    }

}
```

[ラムダ式 (lambda expressions)](lambdas)を使用して、コレクションをフィルタリングおよびマップします。

```kotlin
fun main() {

    val fruits = listOf("banana", "avocado", "apple", "kiwifruit")
    fruits
      .filter { it.startsWith("a") }
      .sortedBy { it }
      .map { it.uppercase() }
      .forEach { println(it) }

}
```

[コレクションの概要 (Collections overview)](collections-overview)を参照してください。

## Null許容値とnullチェック

`null`値が可能な場合は、参照を明示的にnull許容としてマークする必要があります。Null許容型の名前の末尾には`?`が付きます。

`str`が整数を保持していない場合は、`null`を返します。

```kotlin
fun parseInt(str: String): Int? {
    // ...
}
```

Null許容値を返す関数を使用します。

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

    // Using `x * y` yields error because they may hold nulls.
    if (x != null && y != null) {
        // x and y are automatically cast to non-nullable after null check
        println(x * y)
    }
    else {
        println("'$arg1' or '$arg2' is not a number")
    }    
}

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("a", "b")
}
```

または:

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

    // ...
    if (x == null) {
        println("Wrong number format in arg1: '$arg1'")
        return
    }
    if (y == null) {
        println("Wrong number format in arg2: '$arg2'")
        return
    }

    // x and y are automatically cast to non-nullable after null check
    println(x * y)

}

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("99", "b")
}
```

[Null安全性 (Null-safety)](null-safety)を参照してください。

## 型チェックと自動キャスト

`is`演算子は、式がある型のインスタンスであるかどうかを確認します。
イミュータブルなローカル変数またはプロパティが特定の型に対してチェックされる場合、明示的にキャストする必要はありません。

```kotlin

fun getStringLength(obj: Any): Int? {
    if (obj is String) {
        // `obj` is automatically cast to `String` in this branch
        return obj.length
    }

    // `obj` is still of type `Any` outside of the type-checked branch
    return null
}

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```

または:

```kotlin

fun getStringLength(obj: Any): Int? {
    if (obj !is String) return null

    // `obj` is automatically cast to `String` in this branch
    return obj.length
}

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```

あるいは:

```kotlin

fun getStringLength(obj: Any): Int? {
    // `obj` is automatically cast to `String` on the right-hand side of `&&`
    if (obj is String && obj.length > 0) {
        return obj.length
    }

    return null
}

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength("")
    printLength(1000)
}
```

[クラス (Classes)](classes)と[型キャスト (Type casts)](typecasts)を参照してください。