[//]: # (title: 基本構文)

これは、基本的な構文要素の例を集めたものです。各セクションの終わりには、関連トピックの詳細な説明へのリンクがあります。

また、JetBrains Academyが提供する無料の[Kotlin Coreトラック](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)でKotlinの基礎をすべて学ぶこともできます。

## パッケージの定義とインポート

パッケージの指定はソースファイルの先頭に記述します。

```kotlin
package my.demo

import kotlin.text.*

// ...
```

ディレクトリとパッケージを一致させる必要はありません。ソースファイルはファイルシステム内の任意の場所に配置できます。

[パッケージ](packages.md)を参照してください。

## プログラムのエントリーポイント

Kotlinアプリケーションのエントリーポイントは`main`関数です。

```kotlin
fun main() {
    println("Hello world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-hello-world"}

`main`の別の形式では、可変数の`String`引数を受け入れます。

```kotlin
fun main(args: Array<String>) {
    println(args.contentToString())
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 標準出力への出力

`print`は引数を標準出力に出力します。

```kotlin
fun main() {
//sampleStart
    print("Hello ")
    print("world!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-print"}

`println`は引数を出力し、改行を追加するため、次に出力するものは次の行に表示されます。

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

`readln()`関数は標準入力から読み取ります。この関数は、ユーザーが入力した行全体を文字列として読み取ります。

`println()`、`readln()`、`print()`関数を組み合わせて、ユーザー入力の要求と表示を行うメッセージを出力できます。

```kotlin
// 入力を要求するメッセージを出力します
println("Enter any word: ")

// ユーザー入力を読み取り、保存します。例: Happiness
val yourWord = readln()

// 入力されたメッセージを出力します
print("You entered the word: ")
print(yourWord)
// You entered the word: Happiness
```

詳細については、[標準入力の読み取り](read-standard-input.md)を参照してください。

## 関数

2つの`Int`型パラメータと`Int`型戻り値を持つ関数：

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

関数本体は式にすることができます。その戻り値の型は推論されます。

```kotlin
//sampleStart
fun sum(a: Int, b: Int) = a + b
//sampleEnd

fun main() {
    println("sum of 19 and 23 is ${sum(19, 23)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-expression"}

意味のある値を返さない関数：

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

`Unit`戻り値の型は省略できます。

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

[関数](functions.md)を参照してください。

## 変数

Kotlinでは、`val`または`var`キーワードを変数名の前に付けて変数を宣言します。

`val`キーワードを使用して、一度だけ値が代入される変数を宣言します。これらは不変の読み取り専用ローカル変数であり、初期化後に異なる値を再代入することはできません。

```kotlin
fun main() {
//sampleStart
    // 変数xを宣言し、値5で初期化します
    val x: Int = 5
    // 5
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-val"}

`var`キーワードを使用して、再代入可能な変数を宣言します。これらは可変変数であり、初期化後にその値を変更できます。

```kotlin
fun main() {
//sampleStart
    // 変数xを宣言し、値5で初期化します
    var x: Int = 5
    // 変数xに新しい値6を再代入します
    x += 1
    // 6
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-var"}

Kotlinは型推論をサポートしており、宣言された変数のデータ型を自動的に識別します。変数を宣言する際、変数名の後の型を省略できます。

```kotlin
fun main() {
//sampleStart
    // 値5で変数xを宣言します。`Int`型が推論されます
    val x = 5
    // 5
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-inference"}

変数は初期化後にのみ使用できます。変数を宣言時に初期化するか、先に宣言してから後で初期化することができます。後者の場合、データ型を指定する必要があります。

```kotlin
fun main() {
//sampleStart
    // 宣言時に変数xを初期化します。型は不要です
    val x = 5
    // 初期化せずに変数cを宣言します。型が必要です
    val c: Int
    // 宣言後に変数cを初期化します
    c = 3
    // 5 
    // 3
//sampleEnd
    println(x)
    println(c)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-initialize"}

トップレベルで変数を宣言できます。

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

クラスを定義するには、`class`キーワードを使用します。
```kotlin
class Shape
```

クラスのプロパティは、宣言または本体にリストできます。

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
```

クラス宣言にリストされたパラメータを持つデフォルトコンストラクタは、自動的に利用できます。

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

クラス間の継承はコロン (`:`) で宣言されます。クラスはデフォルトで`final`です。クラスを継承可能にするには、`open`とマークします。

```kotlin
open class Shape

class Rectangle(val height: Double, val length: Double): Shape() {
    val perimeter = (height + length) * 2 
}
```

コンストラクタと継承の詳細については、[クラス](classes.md)と[オブジェクトとインスタンス](object-declarations.md)を参照してください。

## コメント

ほとんどのモダンな言語と同様に、Kotlinは単一行（または_行末_）コメントと複数行（_ブロック_）コメントをサポートしています。

```kotlin
// これは行末コメントです

/* これは複数行にわたる
   ブロックコメントです。 */
```

Kotlinのブロックコメントはネストできます。

```kotlin
/* コメントはここから始まり
/* ネストされたコメントが含まれ */     
ここで終わります。 */
```

ドキュメントコメントの構文については、[Kotlinコードのドキュメント化](kotlin-doc.md)を参照してください。

## 文字列テンプレート

```kotlin
fun main() {
//sampleStart
    var a = 1
    // テンプレート内の単純な名前:
    val s1 = "a is $a" 
    
    a = 2
    // テンプレート内の任意の式:
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

Kotlinでは、`if`は式としても使用できます。

```kotlin
//sampleStart
fun maxOf(a: Int, b: Int) = if (a > b) a else b
//sampleEnd

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-if-expression"}

[`if`式](control-flow.md#if-expression)を参照してください。

## forループ

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

または：

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

[forループ](control-flow.md#for-loops)を参照してください。

## whileループ

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

[whileループ](control-flow.md#while-loops)を参照してください。

## when式

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

[when式とwhen文](control-flow.md#when-expressions-and-statements)を参照してください。

## 範囲

`in`演算子を使用して、数値が範囲内にあるかを確認します。

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

数値が範囲外にあるかを確認します。

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

あるいは、プログレッションを反復処理します。

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

[範囲とプログレッション](ranges.md)を参照してください。

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

`in`演算子を使用して、コレクションがオブジェクトを含むかを確認します。

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

[ラムダ式](lambdas.md)を使用してコレクションをフィルタリングおよびマッピングします。

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

[コレクションの概要](collections-overview.md)を参照してください。

## Nullableな値とNullチェック

`null`値が許容される場合、参照は明示的にnullableとしてマークする必要があります。nullableな型名には末尾に`?`が付きます。

`str`が整数を保持しない場合、`null`を返します。

```kotlin
fun parseInt(str: String): Int? {
    // ...
}
```

nullableな値を返す関数を使用します。

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

//sampleStart
fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

    // `x * y`を使用すると、nullを含む可能性があるためエラーになります。
    if (x != null && y != null) {
        // nullチェック後、xとyは自動的に非nullableにキャストされます
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

または：

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

    // nullチェック後、xとyは自動的に非nullableにキャストされます
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

[Null安全](null-safety.md)を参照してください。

## 型チェックと自動キャスト

`is`演算子は、式がある型のインスタンスであるかを確認します。
不変のローカル変数またはプロパティが特定の型としてチェックされる場合、明示的にキャストする必要はありません。

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj is String) {
        // このブランチでは、`obj`は自動的に`String`にキャストされます
        return obj.length
    }

    // 型チェックされたブランチの外では、`obj`は依然として`Any`型です
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

または：

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj !is String) return null

    // このブランチでは、`obj`は自動的に`String`にキャストされます
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

あるいはさらに：

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    // `&&`の右側では、`obj`は自動的に`String`にキャストされます
    if (obj is String && obj.length >= 0) {
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

[クラス](classes.md)と[型キャスト](typecasts.md)を参照してください。