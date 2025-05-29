[//]: # (title: スコープ関数)

Kotlin標準ライブラリには、オブジェクトのコンテキスト内でコードブロックを実行することのみを目的とするいくつかの関数が含まれています。オブジェクトに対して[ラムダ式](lambdas.md)を渡してこれらの関数を呼び出すと、一時的なスコープが形成されます。このスコープ内では、オブジェクトの名前なしでアクセスできます。このような関数は*スコープ関数*と呼ばれます。これらには、[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)、[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)、[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)、[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html)、[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)の5種類があります。

基本的に、これらの関数はすべて同じアクションを実行します。つまり、オブジェクトに対してコードブロックを実行します。異なるのは、このオブジェクトがブロック内でどのように利用可能になるか、および式全体の戻り値が何かという点です。

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

`let`なしで同じコードを記述する場合、新しい変数を導入し、それを使用するたびに名前を繰り返す必要があります。

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

スコープ関数は、新しい技術的な機能を追加するものではありませんが、コードをより簡潔で読みやすくすることができます。

スコープ関数には多くの類似点があるため、ユースケースに合った適切なものを選択するのは難しい場合があります。選択は主に、意図とプロジェクトでの一貫した使用方法に依存します。以下に、スコープ関数の違いとその慣例について詳細な説明を記述します。

## 関数選択

目的のために適切なスコープ関数を選択するのに役立つよう、それらの主な違いをまとめた以下の表を示します。

| 関数 |オブジェクト参照|戻り値|拡張関数であるか|
|---|---|---|---|
| [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) |`it`|ラムダの結果|はい|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |`this`|ラムダの結果|はい|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |-|ラムダの結果|いいえ: コンテキストオブジェクトなしで呼び出される|
| [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) |`this`|ラムダの結果|いいえ: コンテキストオブジェクトを引数として取る|
| [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) |`this`|コンテキストオブジェクト|はい|
| [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) |`it`|コンテキストオブジェクト|はい|

これらの関数に関する詳細は、以下の専用セクションで提供されています。

以下に、目的に応じたスコープ関数の選び方に関する簡単なガイドを示します。

*   null許容型ではないオブジェクトでラムダを実行する: `let`
*   ローカルスコープで式を変数として導入する: `let`
*   オブジェクトの構成: `apply`
*   オブジェクトの構成と結果の計算: `run`
*   式が必要な場所でステートメントを実行する: 非拡張関数版の`run`
*   追加の効果: `also`
*   オブジェクトに対する関数呼び出しのグループ化: `with`

異なるスコープ関数のユースケースは重複しているため、プロジェクトやチームで使用されている特定の慣例に基づいて、どの関数を使用するかを選択できます。

スコープ関数はコードをより簡潔にすることができますが、使いすぎは避けてください。コードが読みにくくなり、エラーにつながる可能性があります。また、スコープ関数のネストを避け、チェーンする際には注意することをお勧めします。現在のコンテキストオブジェクトと`this`または`it`の値について混乱しやすいからです。

## 区別

スコープ関数は本質的に似ているため、それらの違いを理解することが重要です。
各スコープ関数には主に2つの違いがあります。
*   コンテキストオブジェクトを参照する方法。
*   それらの戻り値。

### コンテキストオブジェクト: `this`または`it`

スコープ関数に渡されるラムダ内では、コンテキストオブジェクトは実際の名前の代わりに短い参照で利用できます。各スコープ関数は、コンテキストオブジェクトを参照するために2つの方法のいずれかを使用します。ラムダの[レシーバー](lambdas.md#function-literals-with-receiver) (`this`) として、またはラムダの引数 (`it`) としてです。どちらも同じ機能を提供するため、異なるユースケースにおけるそれぞれの長所と短所を説明し、その使用に関する推奨事項を提供します。

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

`run`、`with`、および`apply`は、コンテキストオブジェクトをラムダの[レシーバー](lambdas.md#function-literals-with-receiver)として、キーワード`this`で参照します。したがって、それらのラムダ内では、オブジェクトは通常のクラス関数と同じように利用できます。

ほとんどの場合、レシーバーオブジェクトのメンバーにアクセスするときに`this`を省略できるため、コードが短くなります。一方、`this`が省略されている場合、レシーバーのメンバーと外部のオブジェクトや関数を区別するのが難しくなることがあります。したがって、コンテキストオブジェクトをレシーバー (`this`) として持つことは、主にオブジェクトの関数を呼び出したり、プロパティに値を割り当てたりすることで、オブジェクトのメンバーを操作するラムダに推奨されます。

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

次に、`let`と`also`は、コンテキストオブジェクトをラムダの[引数](lambdas.md#lambda-expression-syntax)として参照します。引数名が指定されていない場合、オブジェクトは暗黙のデフォルト名`it`でアクセスされます。`it`は`this`よりも短く、`it`を使用する式は通常読みやすいです。

ただし、オブジェクトの関数やプロパティを呼び出す場合、`this`のようにオブジェクトを暗黙的に利用することはできません。したがって、オブジェクトが関数呼び出しの引数として主に使用される場合、`it`を介してコンテキストオブジェクトにアクセスする方が優れています。また、コードブロック内で複数の変数を使用する場合にも`it`は優れています。

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

以下の例は、引数名`value`を使用してコンテキストオブジェクトをラムダ引数として参照する方法を示しています。

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
*   `let`、`run`、および`with`はラムダの結果を返します。

コードで次に何をしたいかに基づいて、どのような戻り値が必要かを慎重に検討する必要があります。これにより、使用する最適なスコープ関数を選択できます。

#### コンテキストオブジェクト

`apply`と`also`の戻り値は、コンテキストオブジェクト自体です。したがって、これらは_サイドステップ_として呼び出しチェーンに含めることができます。つまり、同じオブジェクトに対して関数呼び出しを次々にチェーンし続けることができます。

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

また、コンテキストオブジェクトを返す関数のreturn文で使用することもできます。

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

`let`、`run`、および`with`はラムダの結果を返します。そのため、結果を変数に割り当てたり、結果に対する操作をチェーンしたりする場合などに使用できます。

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

ユースケースに合った適切なスコープ関数を選択できるように、各関数を詳細に説明し、使用に関する推奨事項を提供します。技術的には、スコープ関数は多くの場合で相互に交換可能であるため、例ではそれらの使用に関する慣例を示します。

### `let`

-   **コンテキストオブジェクト**は引数 (`it`) として利用できます。
-   **戻り値**はラムダの結果です。

[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)は、呼び出しチェーンの結果に対して1つまたは複数の関数を呼び出すために使用できます。たとえば、以下のコードはコレクションに対する2つの操作の結果を出力します。

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

`let`を使用すると、リスト操作の結果を変数に割り当てないように、上記の例を書き換えることができます。

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

`let`に渡されるコードブロックに`it`を引数とする単一の関数が含まれている場合、ラムダ引数の代わりにメソッド参照 (`::`) を使用できます。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let`は、nullではない値を含むコードブロックを実行するためによく使用されます。nullではないオブジェクトに対してアクションを実行するには、そのオブジェクトに対して[安全呼び出し演算子`?.`](null-safety.md#safe-call-operator)を使用し、そのラムダ内のアクションで`let`を呼び出します。

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

`let`を使用すると、限られたスコープを持つローカル変数を導入して、コードを読みやすくすることもできます。コンテキストオブジェクトの新しい変数を定義するには、その名前をラムダ引数として指定し、デフォルトの`it`の代わりに使用できるようにします。

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

-   **コンテキストオブジェクト**はレシーバー (`this`) として利用できます。
-   **戻り値**はラムダの結果です。

[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)は拡張関数ではないため、コンテキストオブジェクトは引数として渡されますが、ラムダ内ではレシーバー (`this`) として利用できます。

戻り値を使用する必要がない場合に、コンテキストオブジェクト上で関数を呼び出す際には`with`を使用することをお勧めします。コードでは、`with`は「_このオブジェクトに対して、以下を実行する_」と読むことができます。

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

`with`を使用すると、プロパティや関数が値の計算に使用されるヘルパーオブジェクトを導入することもできます。

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

-   **コンテキストオブジェクト**はレシーバー (`this`) として利用できます。
-   **戻り値**はラムダの結果です。

[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)は`with`と同じことをしますが、拡張関数として実装されています。したがって、`let`と同様に、ドット表記を使用してコンテキストオブジェクト上で呼び出すことができます。

`run`は、ラムダがオブジェクトを初期化し、戻り値を計算する両方を行う場合に役立ちます。

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

`run`を非拡張関数として呼び出すこともできます。非拡張関数版の`run`にはコンテキストオブジェクトがありませんが、それでもラムダの結果を返します。非拡張関数版の`run`を使用すると、式が必要な場所で複数のステートメントのブロックを実行できます。コードでは、非拡張関数版の`run`は「_コードブロックを実行し、結果を計算する_」と読むことができます。

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

-   **コンテキストオブジェクト**はレシーバー (`this`) として利用できます。
-   **戻り値**はオブジェクト自体です。

[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html)はコンテキストオブジェクト自体を返すため、値を返さず、主にレシーバーオブジェクトのメンバーを操作するコードブロックに使用することをお勧めします。`apply`の最も一般的なユースケースは、オブジェクトの構成です。このような呼び出しは、「_オブジェクトに以下の代入を適用する_」と読むことができます。

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

`apply`のもう一つのユースケースは、より複雑な処理のために複数の呼び出しチェーンに`apply`を含めることです。

### `also`

-   **コンテキストオブジェクト**は引数 (`it`) として利用できます。
-   **戻り値**はオブジェクト自体です。

[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)は、コンテキストオブジェクトを引数として取る何らかのアクションを実行するのに役立ちます。オブジェクトのプロパティや関数ではなく、オブジェクトへの参照が必要なアクション、または外側のスコープからの`this`参照をシャドウしたくない場合に`also`を使用します。

コードで`also`を見た場合、それは「_さらに、そのオブジェクトに対して以下を実行する_」と読むことができます。

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

スコープ関数に加えて、標準ライブラリには[`takeIf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-if.html)と[`takeUnless`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-unless.html)関数が含まれています。これらの関数を使用すると、オブジェクトの状態のチェックを呼び出しチェーンに組み込むことができます。

オブジェクトに対して述語とともに呼び出された場合、`takeIf`はそのオブジェクトが与えられた述語を満たせば、そのオブジェクトを返します。そうでなければ、`null`を返します。したがって、`takeIf`は単一のオブジェクトに対するフィルタリング関数です。

`takeUnless`は`takeIf`とは逆のロジックを持っています。オブジェクトに対して述語とともに呼び出された場合、`takeUnless`はそのオブジェクトが与えられた述語を満たせば、`null`を返します。そうでなければ、オブジェクトを返します。

`takeIf`または`takeUnless`を使用する場合、オブジェクトはラムダ引数 (`it`) として利用できます。

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

> `takeIf`と`takeUnless`の後に他の関数をチェーンする場合、戻り値がnull許容型であるため、nullチェックを実行するか安全呼び出し (`?.`) を使用することを忘れないでください。
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

`takeIf`と`takeUnless`は、スコープ関数と組み合わせると特に便利です。たとえば、`takeIf`と`takeUnless`を`let`とチェーンすることで、与えられた述語に一致するオブジェクトに対してコードブロックを実行できます。これを行うには、オブジェクトに対して`takeIf`を呼び出し、次に安全呼び出し (`?`) を使用して`let`を呼び出します。述語に一致しないオブジェクトの場合、`takeIf`は`null`を返し、`let`は呼び出されません。

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

比較のために、`takeIf`やスコープ関数を使用せずに同じ関数を記述する方法の例を以下に示します。

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