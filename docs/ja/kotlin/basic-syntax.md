[//]: # (title: 基本構文)

これは、基本的な構文要素とその例をまとめたものです。各セクションの最後には、関連トピックの詳細な説明へのリンクがあります。

JetBrains Academy の無料の [Kotlin Core track](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23) でも、Kotlin のすべての必須事項を学ぶことができます。

## パッケージ定義とインポート

パッケージの指定は、ソースファイルの先頭に記述する必要があります。

```kotlin
package my.demo

import kotlin.text.*

// ...
```

ディレクトリとパッケージが一致している必要はありません。ソースファイルはファイルシステム内の任意の場所に配置できます。

詳細については、[パッケージ](packages.md)を参照してください。

## プログラムのエントリポイント

Kotlin アプリケーションのエントリポイントは `main` 関数です。

```kotlin
fun main() {
    println("Hello world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-hello-world"}

`main` の別の形式では、可変個の `String` 引数を受け入れます。

```kotlin
fun main(args: Array<String>) {
    println(args.contentToString())
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 標準出力への出力

`print` はその引数を標準出力に出力します。

```kotlin
fun main() {
//sampleStart
    print("Hello ")
    print("world!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-print"}

`println` はその引数を出力し、改行を追加するため、次に出力するものは次の行に表示されます。

```kotlin
fun main() {
//sampleStart
    println("Hello world!")
    println(42)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-println"}

## 標準入力からの読み取り

`readln()` 関数は標準入力から読み取ります。この関数は、ユーザーが入力した行全体を文字列として読み取ります。

`println()`、`readln()`、`print()` 関数を組み合わせて使用すると、ユーザー入力を要求し、表示するメッセージを出力できます。

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

詳細については、[標準入力の読み取り](read-standard-input.md)を参照してください。

## 関数

2つの `Int` パラメータと `Int` 戻り値の型を持つ関数:

```kotlin
//sampleStart
fun sum(a: Int, b: Int): Int {
    return a + b
}
//sampleEnd

fun main() {
    print("sum of 3 and 5 is ")
    println(sum(3, 5))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-return-int"}

関数本体は式にできます。その戻り値の型は推論されます。

```kotlin
//sampleStart
fun sum(a: Int, b: Int) = a + b
//sampleEnd

fun main() {
    println("sum of 19 and 23 is ${sum(19, 23)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-expression"}

意味のある値を返さない関数:

```kotlin
//sampleStart
fun printSum(a: Int, b: Int): Unit {
    println("sum of $a and $b is ${a + b}")
}
//sampleEnd

fun main() {
    printSum(-1, 8)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-return-unit"}

`Unit` 戻り値の型は省略できます。

```kotlin
//sampleStart
fun printSum(a: Int, b: Int) {
    println("sum of $a and $b is ${a + b}")
}
//sampleEnd

fun main() {
    printSum(-1, 8)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-omit-unit"}

詳細については、[関数](functions.md)を参照してください。

## 変数

Kotlin では、`val` または `var` というキーワードの後に変数名を続けて変数を宣言します。

値を一度だけ割り当てる変数を宣言するには、`val` キーワードを使用します。これらはイミュータブル (不変) な読み取り専用のローカル変数で、初期化後に別の値を再割り当てすることはできません。

```kotlin
fun main() {
//sampleStart
    // Declares the variable x and initializes it with the value of 5
    val x: Int = 5
    // 5
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-val"}

再割り当てが可能な変数を宣言するには、`var` キーワードを使用します。これらはミュータブル (可変) な変数で、初期化後に値を変更できます。

```kotlin
fun main() {
//sampleStart
    // Declares the variable x and initializes it with the value of 5
    var x: Int = 5
    // Reassigns a new value of 6 to the variable x
    x += 1
    // 6
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-var"}

Kotlin は型推論をサポートしており、宣言された変数のデータ型を自動的に識別します。変数を宣言するとき、変数名の後の型を省略できます。

```kotlin
fun main() {
//sampleStart
    // Declares the variable x with the value of 5;`Int` type is inferred
    val x = 5
    // 5
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-inference"}

変数は初期化後にのみ使用できます。変数を宣言時に初期化するか、最初に変数を宣言し、後で初期化することができます。後者の場合、データ型を指定する必要があります。

```kotlin
fun main() {
//sampleStart
    // Initializes the variable x at the moment of declaration; type is not required
    val x = 5
    // Declares the variable c without initialization; type is required
    val c: Int
    // Initializes the variable c after declaration 
    c = 3
    // 5 
    // 3
//sampleEnd
    println(x)
    println(c)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-initialize"}

変数はトップレベルで宣言できます。

```kotlin
//sampleStart
val PI = 3.14
var x = 0

fun incrementX() {
    x += 1
}
// x = 0; PI = 3.14
// incrementX()
// x = 1; PI = 3.14
//sampleEnd

fun main() {
    println("x = $x; PI = $PI")
    incrementX()
    println("incrementX()")
    println("x = $x; PI = $PI")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-variable-top-level"}

プロパティの宣言については、[プロパティ](properties.md)を参照してください。

## クラスとインスタンスの作成

クラスを定義するには、`class` キーワードを使用します。
```kotlin
class Shape
```

クラスのプロパティは、その宣言または本体にリストできます。

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
```

クラス宣言にリストされたパラメータを持つデフォルトコンストラクタは自動的に利用可能です。

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
fun main() {
    val rectangle = Rectangle(5.0, 2.0)
    println("The perimeter is ${rectangle.perimeter}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-class-constructor"}

クラス間の継承はコロン (`:`) で宣言されます。クラスはデフォルトで `final` です。クラスを継承可能にするには、`open` とマークします。

```kotlin
open class Shape

class Rectangle(val height: Double, val length: Double): Shape() {
    val perimeter = (height + length) * 2 
}
```

コンストラクタと継承の詳細については、[クラス](classes.md)および[オブジェクトとインスタンス](object-declarations.md)を参照してください。

## コメント

ほとんどの最新言語と同様に、Kotlin は単一行 (または _行末_) コメントと複数行 (または _ブロック_) コメントをサポートしています。

```kotlin
// This is an end-of-line comment

/* This is a block comment
   on multiple lines. */
```

Kotlin のブロックコメントはネストできます。

```kotlin
/* The comment starts here
/* contains a nested comment */     
and ends here. */
```

ドキュメントコメントの構文については、[Kotlin コードのドキュメント化](kotlin-doc.md)を参照してください。

## 文字列テンプレート

```kotlin
fun main() {
//sampleStart
    var a = 1
    // simple name in template:
    val s1 = "a is $a" 
    
    a = 2
    // arbitrary expression in template:
    val s2 = "${s1.replace("is", "was")}, but now is $a"
//sampleEnd
    println(s2)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-string-templates"}

詳細については、[文字列テンプレート](strings.md#string-templates)を参照してください。

## 条件式

```kotlin
//sampleStart
fun maxOf(a: Int, b: Int): Int {
    if (a > b) {
        return a
    } else {
        return b
    }
}
//sampleEnd

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-conditional-expressions"}

Kotlin では、`if` は式としても使用できます。

```kotlin
//sampleStart
fun maxOf(a: Int, b: Int) = if (a > b) a else b
//sampleEnd

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-if-expression"}

詳細については、[`if`-式](control-flow.md#if-expression)を参照してください。

## for ループ

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    for (item in items) {
        println(item)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-for-loop"}

または:

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    for (index in items.indices) {
        println("item at $index is ${items[index]}")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-for-loop-indices"}

詳細については、[for ループ](control-flow.md#for-loops)を参照してください。

## while ループ

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    var index = 0
    while (index < items.size) {
        println("item at $index is ${items[index]}")
        index++
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-while-loop"}

詳細については、[while ループ](control-flow.md#while-loops)を参照してください。

## when 式

```kotlin
//sampleStart
fun describe(obj: Any): String =
    when (obj) {
        1          -> "One"
        "Hello"    -> "Greeting"
        is Long    -> "Long"
        !is String -> "Not a string"
        else       -> "Unknown"
    }
//sampleEnd

fun main() {
    println(describe(1))
    println(describe("Hello"))
    println(describe(1000L))
    println(describe(2))
    println(describe("other"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-when-expression"}

詳細については、[when 式とステートメント](control-flow.md#when-expressions-and-statements)を参照してください。

## 範囲 (Ranges)

`in` 演算子を使用して、数値が範囲内にあるかを確認します。

```kotlin
fun main() {
//sampleStart
    val x = 10
    val y = 9
    if (x in 1..y+1) {
        println("fits in range")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-range-in"}

数値が範囲外であるかを確認します。

```kotlin
fun main() {
//sampleStart
    val list = listOf("a", "b", "c")
    
    if (-1 !in 0..list.lastIndex) {
        println("-1 is out of range")
    }
    if (list.size !in list.indices) {
        println("list size is out of valid list indices range, too")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-out-of-range"}

範囲を反復処理します。

```kotlin
fun main() {
//sampleStart
    for (x in 1..5) {
        print(x)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-iterate-range"}

または、等差数列 (プログレッション) を反復処理します。

```kotlin
fun main() {
//sampleStart
    for (x in 1..10 step 2) {
        print(x)
    }
    println()
    for (x in 9 downTo 0 step 3) {
        print(x)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-iterate-progression"}

詳細については、[範囲と等差数列](ranges.md)を参照してください。

## コレクション

コレクションを反復処理します。

```kotlin
fun main() {
    val items = listOf("apple", "banana", "kiwifruit")
//sampleStart
    for (item in items) {
        println(item)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-iterate-collection"}

`in` 演算子を使用してコレクションにオブジェクトが含まれているかを確認します。

```kotlin
fun main() {
    val items = setOf("apple", "banana", "kiwifruit")
//sampleStart
    when {
        "orange" in items -> println("juicy")
        "apple" in items -> println("apple is fine too")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-collection-in"}

[ラムダ式](lambdas.md)を使用してコレクションをフィルタリングおよびマップします。

```kotlin
fun main() {
//sampleStart
    val fruits = listOf("banana", "avocado", "apple", "kiwifruit")
    fruits
      .filter { it.startsWith("a") }
      .sortedBy { it }
      .map { it.uppercase() }
      .forEach { println(it) }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-collection-filter-map"}

詳細については、[コレクションの概要](collections-overview.md)を参照してください。

## ヌル許容値とヌルチェック

`null` 値が可能な場合、参照は明示的にヌル許容としてマークする必要があります。ヌル許容型の名前は末尾に `?` を持ちます。

`str` が整数を保持しない場合、`null` を返します。

```kotlin
fun parseInt(str: String): Int? {
    // ...
}
```

ヌル許容値を返す関数を使用します。

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

//sampleStart
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
//sampleEnd

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("a", "b")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-nullable-value"}

または:

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)
    
//sampleStart
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
//sampleEnd
}

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("99", "b")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-null-check"}

詳細については、[Null-safety](null-safety.md)を参照してください。

## 型チェックと自動キャスト

`is` 演算子は、式が特定の型のインスタンスであるかを確認します。
不変のローカル変数またはプロパティが特定の型としてチェックされる場合、明示的にキャストする必要はありません。

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj is String) {
        // `obj` is automatically cast to `String` in this branch
        return obj.length
    }

    // `obj` is still of type `Any` outside of the type-checked branch
    return null
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-is-operator"}

または:

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj !is String) return null

    // `obj` is automatically cast to `String` in this branch
    return obj.length
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-is-operator-expression"}

さらには:

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    // `obj` is automatically cast to `String` on the right-hand side of `&&`
    if (obj is String && obj.length > 0) {
        return obj.length
    }

    return null
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength("")
    printLength(1000)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-is-operator-logic"}

詳細については、[クラス](classes.md)および[型キャスト](typecasts.md)を参照してください。