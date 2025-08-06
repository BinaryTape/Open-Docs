[//]: # (title: スコープ関数)

Kotlin標準ライブラリには、オブジェクトのコンテキスト内でコードブロックを実行することのみを目的とした関数がいくつか含まれています。これらの関数をオブジェクトに対して[ラムダ式](lambdas.md)を渡して呼び出すと、一時的なスコープが形成されます。このスコープでは、オブジェクト名を指定せずにオブジェクトにアクセスできます。このような関数を_スコープ関数_と呼びます。スコープ関数には、[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)、[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)、[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)、[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html)、[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)の5つがあります。

基本的に、これらの関数はすべて同じアクションを実行します。つまり、オブジェクトに対してコードブロックを実行します。異なるのは、このオブジェクトがブロック内でどのように利用可能になるか、そして式全体の結果が何であるかです。

スコープ関数の典型的な使用例を以下に示します。

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {
//sampleStart
    Person("Alice", 20, "Amsterdam").let {
        println(it)
        it.moveTo("London")
        it.incrementAge()
        println(it)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let`なしで同じコードを記述した場合、新しい変数を導入し、使用するたびにその名前を繰り返す必要があります。

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {
//sampleStart
    val alice = Person("Alice", 20, "Amsterdam")
    println(alice)
    alice.moveTo("London")
    alice.incrementAge()
    println(alice)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

スコープ関数は新しい技術的能力を導入するものではありませんが、コードをより簡潔で読みやすくすることができます。

スコープ関数には多くの類似点があるため、使用ケースに最適なものを選択するのは難しい場合があります。選択は主に、目的とプロジェクトでの使用の一貫性によって決まります。以下に、スコープ関数の違いとそれらの慣例について詳細な説明を提供します。

## 関数選択

目的のために適切なスコープ関数を選択するのに役立つように、それらの主な違いをまとめた表を以下に示します。

| 関数 |オブジェクト参照|戻り値|拡張関数であるか|
|---|---|---|---|
| [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) |`it`|ラムダの結果|はい|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |`this`|ラムダの結果|はい|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |-|ラムダの結果|いいえ: コンテキストオブジェクトなしで呼び出される|
| [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) |`this`|ラムダの結果|いいえ: コンテキストオブジェクトを引数として受け取る|
| [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) |`this`|コンテキストオブジェクト|はい|
| [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) |`it`|コンテキストオブジェクト|はい|

これらの関数に関する詳細情報は、以下の専用セクションで提供されています。

意図された目的に応じたスコープ関数選択のための簡単なガイドを以下に示します。

*   非nullオブジェクトに対してラムダを実行する: `let`
*   式をローカルスコープの変数として導入する: `let`
*   オブジェクトの構成: `apply`
*   オブジェクトの構成と結果の算出: `run`
*   式が必要な場所でステートメントを実行する: 非拡張版 `run`
*   追加の処理/副作用: `also`
*   オブジェクト上での関数呼び出しのグループ化: `with`

異なるスコープ関数の使用ケースは重複するため、プロジェクトやチームで使用されている特定の慣例に基づいて、どの関数を使用するかを選択できます。

スコープ関数はコードをより簡潔にすることができますが、過度に使いすぎないようにしてください。コードが読みにくくなり、エラーにつながる可能性があります。また、スコープ関数のネストを避け、チェーン化する際には注意することをお勧めします。現在のコンテキストオブジェクトや`this`または`it`の値について混乱しやすいからです。

## 相違点

スコープ関数は性質が似ているため、それらの違いを理解することが重要です。
各スコープ関数には、主に次の2つの違いがあります。
*   コンテキストオブジェクトを参照する方法。
*   戻り値。

### コンテキストオブジェクト: `this`または`it`

スコープ関数に渡されるラムダ内では、コンテキストオブジェクトは実際の名前ではなく、短い参照で利用できます。各スコープ関数は、コンテキストオブジェクトを参照するために2つの方法のいずれかを使用します。ラムダ[レシーバー](lambdas.md#function-literals-with-receiver)（`this`）として、またはラムダ引数（`it`）としてです。どちらも同じ機能を提供するため、異なる使用ケースにおけるそれぞれの利点と欠点を説明し、使用に関する推奨事項を提供します。

```kotlin
fun main() {
    val str = "Hello"
    // this
    str.run {
        println("The string's length: $length")
        //println("The string's length: ${this.length}") // does the same
    }

    // it
    str.let {
        println("The string's length is ${it.length}")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### `this`

`run`、`with`、`apply`は、コンテキストオブジェクトをラムダ[レシーバー](lambdas.md#function-literals-with-receiver)として、キーワード`this`で参照します。そのため、それらのラムダ内では、通常のクラス関数内と同じようにオブジェクトが利用可能です。

ほとんどの場合、レシーバーオブジェクトのメンバーにアクセスする際に`this`を省略できるため、コードが短くなります。その一方で、`this`を省略すると、レシーバーのメンバーと外部のオブジェクトや関数を区別しにくくなる場合があります。したがって、コンテキストオブジェクトをレシーバー（`this`）として持つことは、主にオブジェクトの関数を呼び出したり、プロパティに値を代入したりしてオブジェクトのメンバーに対して操作を行うラムダに推奨されます。

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply { 
        age = 20                       // same as this.age = 20
        city = "London"
    }
    println(adam)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### `it`

一方、`let`と`also`は、コンテキストオブジェクトをラムダ[引数](lambdas.md#lambda-expression-syntax)として参照します。引数名が指定されていない場合、オブジェクトは暗黙のデフォルト名`it`でアクセスされます。`it`は`this`よりも短く、`it`を含む式は通常、より読みやすいです。

ただし、オブジェクトの関数やプロパティを呼び出す際に、`this`のように暗黙的にオブジェクトが利用できるわけではありません。したがって、コンテキストオブジェクトが主に関数呼び出しの引数として使用される場合、`it`を介してアクセスする方が優れています。また、コードブロック内で複数の変数を使用する場合にも`it`の方が適しています。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

以下の例は、引数名`value`でラムダ引数としてコンテキストオブジェクトを参照する方法を示しています。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also { value ->
            writeToLog("getRandomInt() generated value $value")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 戻り値

スコープ関数は、返す結果によって異なります。
*   `apply`と`also`はコンテキストオブジェクトを返します。
*   `let`、`run`、`with`はラムダの結果を返します。

コードの次のステップで何を行いたいかに基づいて、どのような戻り値が必要かを慎重に検討する必要があります。これは、使用する最適なスコープ関数を選択するのに役立ちます。

#### コンテキストオブジェクト

`apply`と`also`の戻り値はコンテキストオブジェクト自体です。したがって、それらは_サイドステップ_として呼び出しチェーンに組み込むことができます。同じオブジェクトに対して、次々と関数呼び出しをチェーンし続けることができます。

```kotlin
fun main() {
//sampleStart
    val numberList = mutableListOf<Double>()
    numberList.also { println("Populating the list") }
        .apply {
            add(2.71)
            add(3.14)
            add(1.0)
        }
        .also { println("Sorting the list") }
        .sort()
//sampleEnd
    println(numberList)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

これらは、コンテキストオブジェクトを返す関数のreturn文で使用することもできます。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### ラムダの結果

`let`、`run`、`with`はラムダの結果を返します。そのため、結果を変数に代入したり、結果に対する操作をチェーンしたりする場合などにこれらを使用できます。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val countEndsWithE = numbers.run { 
        add("four")
        add("five")
        count { it.endsWith("e") }
    }
    println("There are $countEndsWithE elements that end with e.")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

さらに、戻り値を無視して、スコープ関数を使用してローカル変数の一時的なスコープを作成することもできます。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        val firstItem = first()
        val lastItem = last()        
        println("First item: $firstItem, last item: $lastItem")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 関数

使用ケースに最適なスコープ関数を選択するのに役立つように、それらを詳細に説明し、使用に関する推奨事項を提供します。技術的には、スコープ関数は多くの場合、互換性があるため、以下の例ではそれらの使用に関する慣例を示しています。

### `let`

-   **コンテキストオブジェクト**は引数（`it`）として利用可能です。
-   **戻り値**はラムダの結果です。

[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)は、呼び出しチェーンの結果に対して1つ以上の関数を呼び出すために使用できます。たとえば、次のコードはコレクションに対する2つの操作の結果を出力します。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    val resultList = numbers.map { it.length }.filter { it > 3 }
    println(resultList)    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let`を使用すると、上記の例を、リスト操作の結果を変数に代入しないように書き換えることができます。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let { 
        println(it)
        // and more function calls if needed
    } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let`に渡されるコードブロックが、`it`を引数とする単一の関数を含む場合、ラムダ引数の代わりにメソッド参照（`::`）を使用できます。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let`は、nullでない値を含むコードブロックを実行するためによく使用されます。nullでないオブジェクトに対してアクションを実行するには、そのオブジェクトで[セーフコール演算子`?.`](null-safety.md#safe-call-operator)を使用し、ラムダ内のアクションで`let`を呼び出します。

```kotlin
fun processNonNullString(str: String) {}

fun main() {
//sampleStart
    val str: String? = "Hello"   
    //processNonNullString(str)       // compilation error: str can be null
    val length = str?.let { 
        println("let() called on $it")        
        processNonNullString(it)      // OK: 'it' is not null inside '?.let { }'
        it.length
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let`を使用して、コードを読みやすくするために、スコープが制限されたローカル変数を導入することもできます。
コンテキストオブジェクトの新しい変数を定義するには、その名前をラムダ引数として提供し、デフォルトの`it`の代わりに使用できるようにします。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val modifiedFirstItem = numbers.first().let { firstItem ->
        println("The first item of the list is '$firstItem'")
        if (firstItem.length >= 5) firstItem else "!" + firstItem + "!"
    }.uppercase()
    println("First item after modifications: '$modifiedFirstItem'")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `with`

-   **コンテキストオブジェクト**はレシーバー（`this`）として利用可能です。
-   **戻り値**はラムダの結果です。

[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)は拡張関数ではないため、コンテキストオブジェクトは引数として渡されますが、ラムダ内ではレシーバー（`this`）として利用できます。

`with`は、返された結果を使用する必要がない場合に、コンテキストオブジェクト上で関数を呼び出すために使用することをお勧めします。
コードでは、`with`は「_このオブジェクトを使って、次を実行する_」と読むことができます。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        println("'with' is called with argument $this")
        println("It contains $size elements")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`with`を使用して、値を計算するためにプロパティや関数が使用されるヘルパーオブジェクトを導入することもできます。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val firstAndLast = with(numbers) {
        "The first element is ${first()}," +
        " the last element is ${last()}"
    }
    println(firstAndLast)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `run`

-   **コンテキストオブジェクト**はレシーバー（`this`）として利用可能です。
-   **戻り値**はラムダの結果です。

[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)は`with`と同じことを行いますが、拡張関数として実装されています。そのため、`let`と同様に、ドット表記を使用してコンテキストオブジェクトに対して呼び出すことができます。

`run`は、ラムダがオブジェクトを初期化し、戻り値を計算する両方の役割を果たす場合に便利です。

```kotlin
class MultiportService(var url: String, var port: Int) {
    fun prepareRequest(): String = "Default request"
    fun query(request: String): String = "Result for query '$request'"
}

fun main() {
//sampleStart
    val service = MultiportService("https://example.kotlinlang.org", 80)

    val result = service.run {
        port = 8080
        query(prepareRequest() + " to port $port")
    }
    
    // the same code written with let() function:
    val letResult = service.let {
        it.port = 8080
        it.query(it.prepareRequest() + " to port ${it.port}")
    }
//sampleEnd
    println(result)
    println(letResult)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`run`を拡張関数ではない形で呼び出すこともできます。非拡張版の`run`はコンテキストオブジェクトを持ちませんが、やはりラムダの結果を返します。非拡張版の`run`を使用すると、式が必要な場所で複数のステートメントのブロックを実行できます。コードでは、非拡張版の`run`は「_コードブロックを実行して結果を計算する_」と読むことができます。

```kotlin
fun main() {
//sampleStart
    val hexNumberRegex = run {
        val digits = "0-9"
        val hexDigits = "A-Fa-f"
        val sign = "+-"
        
        Regex("[$sign]?[$digits$hexDigits]+")
    }
    
    for (match in hexNumberRegex.findAll("+123 -FFFF !%*& 88 XYZ")) {
        println(match.value)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `apply`

-   **コンテキストオブジェクト**はレシーバー（`this`）として利用可能です。
-   **戻り値**はオブジェクト自体です。

[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html)はコンテキストオブジェクト自体を返すため、値を返さず、主にレシーバーオブジェクトのメンバーに対して操作を行うコードブロックに使用することをお勧めします。`apply`の最も一般的な使用ケースは、オブジェクトの構成です。このような呼び出しは「_オブジェクトに次の代入を適用する_」と読むことができます。

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply {
        age = 32
        city = "London"        
    }
    println(adam)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`apply`のもう一つの使用ケースは、より複雑な処理のために、`apply`を複数の呼び出しチェーンに含めることです。

### `also`

-   **コンテキストオブジェクト**は引数（`it`）として利用可能です。
-   **戻り値**はオブジェクト自体です。

[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)は、コンテキストオブジェクトを引数として取る何らかのアクションを実行するのに役立ちます。`also`は、オブジェクトのプロパティや関数ではなくオブジェクトへの参照が必要な場合、または外側のスコープからの`this`参照をシャドウしたくない場合に使用します。

コードで`also`を見たとき、「_さらにそのオブジェクトで次を実行する_」と読むことができます。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    numbers
        .also { println("The list elements before adding new one: $it") }
        .add("four")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## `takeIf`と`takeUnless`

スコープ関数に加えて、標準ライブラリには[`takeIf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-if.html)と[`takeUnless`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-unless.html)という関数が含まれています。これらの関数を使用すると、オブジェクトの状態のチェックを呼び出しチェーンに組み込むことができます。

述語とともにオブジェクトに対して呼び出された場合、`takeIf`は与えられた述語を満たす場合にそのオブジェクトを返します。そうでない場合は`null`を返します。したがって、`takeIf`は単一のオブジェクトに対するフィルタリング関数です。

`takeUnless`は`takeIf`とは逆のロジックを持ちます。述語とともにオブジェクトに対して呼び出された場合、`takeUnless`は与えられた述語を満たす場合に`null`を返します。そうでない場合はそのオブジェクトを返します。

`takeIf`または`takeUnless`を使用する場合、オブジェクトはラムダ引数（`it`）として利用可能です。

```kotlin
import kotlin.random.*

fun main() {
//sampleStart
    val number = Random.nextInt(100)

    val evenOrNull = number.takeIf { it % 2 == 0 }
    val oddOrNull = number.takeUnless { it % 2 == 0 }
    println("even: $evenOrNull, odd: $oddOrNull")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> `takeIf`および`takeUnless`の後に他の関数をチェーンする場合、これらの戻り値はnull許容であるため、nullチェックを行うかセーフコール（`?.`）を使用することを忘れないでください。
>
{style="tip"}

```kotlin
fun main() {
//sampleStart
    val str = "Hello"
    val caps = str.takeIf { it.isNotEmpty() }?.uppercase()
   //val caps = str.takeIf { it.isNotEmpty() }.uppercase() //compilation error
    println(caps)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeIf`と`takeUnless`は、スコープ関数との組み合わせで特に有用です。たとえば、`takeIf`と`takeUnless`を`let`とチェーンして、与えられた述語に一致するオブジェクトに対してコードブロックを実行できます。これを行うには、オブジェクトに対して`takeIf`を呼び出し、その後セーフコール（`?`）で`let`を呼び出します。述語に一致しない場合、`takeIf`は`null`を返し、`let`は呼び出されません。

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        input.indexOf(sub).takeIf { it >= 0 }?.let {
            println("The substring $sub is found in $input.")
            println("Its start position is $it.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

比較のために、以下に`takeIf`やスコープ関数を使用せずに同じ関数を記述する方法の例を示します。

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        val index = input.indexOf(sub)
        if (index >= 0) {
            println("The substring $sub is found in $input.")
            println("Its start position is $index.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}