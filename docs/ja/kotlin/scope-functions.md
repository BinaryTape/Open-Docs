[//]: # (title: スコープ関数)

Kotlin標準ライブラリには、オブジェクトのコンテキスト内でコードブロックを実行することのみを目的とした関数がいくつか含まれています。[ラムダ式](lambdas.md)を提供してオブジェクト上でこのような関数を呼び出すと、一時的なスコープが形成されます。このスコープ内では、名前を使わずにそのオブジェクトにアクセスできます。このような関数は *スコープ関数* と呼ばれます。これには、[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)、[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)、[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)、[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html)、[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) の5つがあります。

基本的に、これらの関数はすべて同じ動作をします。それは、オブジェクトに対してコードブロックを実行することです。異なるのは、ブロック内でそのオブジェクトがどのように利用可能になるか、そして式全体の結果が何になるかという点です。

スコープ関数の典型的な使用例を以下に示します：

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

`let` を使わずに同じことを書く場合、新しい変数を導入し、それを使用するたびにその名前を繰り返す必要があります。

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

スコープ関数は新しい技術的な機能を導入するものではありませんが、コードをより簡潔で読みやすくすることができます。

スコープ関数には多くの類似点があるため、ユースケースに適したものを選択するのは難しい場合があります。選択は主に、目的とプロジェクト内での使用の整合性に依存します。以下では、スコープ関数間の違いとその慣習について詳しく説明します。

## 関数の選択

目的に適したスコープ関数を選択しやすくするために、主な違いをまとめた表を以下に示します。

| 関数 | オブジェクト参照 | 戻り値 | 拡張関数か |
|---|---|---|---|
| [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) | `it` | ラムダの結果 | はい |
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) | `this` | ラムダの結果 | はい |
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) | - | ラムダの結果 | いいえ：コンテキストオブジェクトなしで呼び出される |
| [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) | `this` | ラムダの結果 | いいえ：コンテキストオブジェクトを引数として受け取る |
| [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) | `this` | コンテキストオブジェクト | はい |
| [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) | `it` | コンテキストオブジェクト | はい |

これらの関数に関する詳細は、以下の専用セクションで説明します。

意図した目的に応じてスコープ関数を選択するための簡単なガイドを以下に示します：

* 非nullオブジェクトに対してラムダを実行する： `let`
* 式をローカルスコープの変数として導入する： `let`
* オブジェクトの設定： `apply`
* オブジェクトの設定と結果の計算： `run`
* 式が必要な場所で文（ステートメント）を実行する： 非拡張の `run`
* 付加的な効果（追加の処理）： `also`
* オブジェクトに対する関数呼び出しをグループ化する： `with`

異なるスコープ関数のユースケースは重なっているため、プロジェクトやチームで使用されている特定の慣習に基づいて、どの関数を使用するかを選択できます。

スコープ関数はコードをより簡潔にできますが、多用は避けてください。コードが読みづらくなり、エラーにつながる可能性があります。また、スコープ関数のネストは避け、チェイン（連結）させる場合は注意することを推奨します。現在のコンテキストオブジェクトや `this` または `it` の値について混乱しやすいためです。

## 相違点

スコープ関数はその性質が似ているため、それらの違いを理解することが重要です。
各スコープ関数には、主に2つの違いがあります：
* コンテキストオブジェクトを参照する方法。
* 戻り値。

### コンテキストオブジェクト：this または it

スコープ関数に渡されるラムダ内では、コンテキストオブジェクトは実際の実名の代わりに短い参照で利用可能です。各スコープ関数は、コンテキストオブジェクトを参照するために、ラムダの [レシーバー](lambdas.md#function-literals-with-receiver) (`this`) またはラムダの引数 (`it`) のいずれかの方法を使用します。どちらも同じ機能を提供するため、異なるユースケースにおけるそれぞれのメリットとデメリットを説明し、使用上の推奨事項を提示します。

```kotlin
fun main() {
    val str = "Hello"
    // this
    str.run {
        println("The string's length: $length")
        //println("The string's length: ${this.length}") // 同じ動作
    }

    // it
    str.let {
        println("The string's length is ${it.length}")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### this

`run`、`with`、`apply` は、コンテキストオブジェクトをラムダの [レシーバー](lambdas.md#function-literals-with-receiver) として、キーワード `this` で参照します。したがって、それらのラムダ内では、通常のクラス関数内と同じようにオブジェクトを利用できます。

ほとんどの場合、レシーバーオブジェクトのメンバにアクセスする際に `this` を省略でき、コードを短くできます。一方で、`this` を省略すると、レシーバーのメンバと外部のオブジェクトや関数を区別するのが難しくなる場合があります。そのため、オブジェクトの関数を呼び出したり、プロパティに値を代入したりするなど、主にオブジェクトのメンバを操作するラムダには、コンテキストオブジェクトをレシーバー (`this`) として持つことが推奨されます。

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply { 
        age = 20                       // this.age = 20 と同じ
        city = "London"
    }
    println(adam)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### it

一方、`let` と `also` は、コンテキストオブジェクトをラムダの [引数](lambdas.md#lambda-expression-syntax) として参照します。引数名が指定されていない場合、オブジェクトには暗黙のデフォルト名 `it` でアクセスします。`it` は `this` よりも短く、`it` を使った式は通常読みやすくなります。

ただし、オブジェクトの関数やプロパティを呼び出す際、`this` のようにオブジェクトを暗黙的に利用することはできません。したがって、オブジェクトが主に関数呼び出しの引数として使用される場合は、`it` を介してコンテキストオブジェクトにアクセスする方が適しています。また、コードブロック内で複数の変数を使用する場合も、`it` を使う方が良いでしょう。

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

以下の例は、コンテキストオブジェクトをラムダ引数として、引数名 `value` で参照する方法を示しています。

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

スコープ関数は、返される結果によって異なります：
* `apply` と `also` はコンテキストオブジェクトを返します。
* `let`、`run`、`with` はラムダの結果を返します。

コードの次のステップで何をしたいかに基づいて、どの戻り値が必要かを慎重に検討する必要があります。これにより、使用するのに最適なスコープ関数を選択しやすくなります。

#### コンテキストオブジェクト

`apply` と `also` の戻り値は、コンテキストオブジェクト自体です。そのため、これらは *サイドステップ* としてコールチェーンに含めることができます。同じオブジェクトに対して、次々と関数呼び出しを連鎖させることができます。

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

これらは、コンテキストオブジェクトを返す関数の return 文でも使用できます。

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

`let`、`run`、`with` はラムダの結果を返します。そのため、結果を変数に代入したり、結果に対して操作を連鎖させたりする場合などに使用できます。

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

さらに、戻り値を無視して、スコープ関数を使用してローカル変数用の一時的なスコープを作成することもできます。

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

## 関数詳細

ユースケースに適したスコープ関数を選択しやすくするために、各関数を詳しく説明し、使用上の推奨事項を提示します。技術的には、スコープ関数は多くの場合において相互に置き換え可能であるため、以下の例ではそれらを使用する際の慣習を示しています。

### let

- **コンテキストオブジェクト**は引数 (`it`) として利用可能です。
- **戻り値**はラムダの結果です。

[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) は、コールチェーンの結果に対して1つ以上の関数を呼び出すために使用できます。例えば、次のコードはコレクションに対する2つの操作の結果を出力します：

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

`let` を使用すると、リスト操作の結果を変数に代入せずに、上記の例を書き換えることができます：

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let { 
        println(it)
        // 必要に応じてさらに関数を呼び出す
    } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let` に渡されるコードブロックに、`it` を引数とする単一の関数が含まれている場合は、ラムダ引数の代わりにメソッド参照 (`::`) を使用できます：

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let` は、非null値を含むコードブロックを実行するために頻繁に使用されます。null許容（nullable）オブジェクトに対してアクションを実行するには、そのオブジェクトで [セーフコール演算子 `?.`](null-safety.md#safe-call-operator) を使用し、ラムダ内にアクションを記述して `let` を呼び出します。

```kotlin
fun processNonNullString(str: String) {}

fun main() {
//sampleStart
    val str: String? = "Hello"   
    //processNonNullString(str)       // コンパイルエラー：str は null の可能性があります
    val length = str?.let { 
        println("let() called on $it")        
        processNonNullString(it)      // OK：'?.let { }' 内では 'it' は null ではありません
        it.length
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

また、`let` を使用して、コードを読みやすくするためにスコープを限定したローカル変数を導入することもできます。
コンテキストオブジェクトに新しい変数を定義するには、デフォルトの `it` の代わりに使用できるように、ラムダ引数としてその名前を指定します。

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

### with

- **コンテキストオブジェクト**はレシーバー (`this`) として利用可能です。
- **戻り値**はラムダの結果です。

[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) は拡張関数ではありません。コンテキストオブジェクトは引数として渡されますが、ラムダ内ではレシーバー (`this`) として利用可能です。

返される結果を使用する必要がない場合に、コンテキストオブジェクトに対して関数を呼び出すために `with` を使用することを推奨します。コード上では、`with` は「*このオブジェクトを使用して、以下を行う*」と読むことができます。

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

また、プロパティや関数が値の計算に使用されるヘルパーオブジェクトを導入するために `with` を使用することもできます。

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

### run

- **コンテキストオブジェクト**はレシーバー (`this`) として利用可能です。
- **戻り値**はラムダの結果です。

[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) は `with` と同じ動作をしますが、拡張関数として実装されています。そのため、`let` と同様に、ドット記法を使用してコンテキストオブジェクト上で呼び出すことができます。

`run` は、ラムダ内でオブジェクトの初期化と戻り値の計算の両方を行う場合に便利です。

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
    
    // let() 関数を使用して書かれた同じコード：
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

また、`run` を非拡張関数として呼び出すこともできます。非拡張バリアントの `run` にはコンテキストオブジェクトはありませんが、ラムダの結果を返します。非拡張の `run` を使用すると、式が必要な場所で複数の文からなるブロックを実行できます。コード上では、非拡張の `run` は「*コードブロックを実行し、結果を計算する*」と読むことができます。

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

### apply

- **コンテキストオブジェクト**はレシーバー (`this`) として利用可能です。
- **戻り値**はオブジェクト自体です。

[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) はコンテキストオブジェクト自体を返すため、値を返さず、主にレシーバーオブジェクトのメンバを操作するコードブロックに使用することを推奨します。`apply` の最も一般的なユースケースはオブジェクトの設定です。このような呼び出しは、「*オブジェクトに以下の割り当てを適用する*」と読むことができます。

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

`apply` のもう1つのユースケースは、より複雑な処理のために複数のコールチェーンに `apply` を含めることです。

### also

- **コンテキストオブジェクト**は引数 (`it`) として利用可能です。
- **戻り値**はオブジェクト自体です。

[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) は、コンテキストオブジェクトを引数として受け取るアクションを実行するのに便利です。オブジェクトのプロパティや関数ではなく、オブジェクトへの参照を必要とするアクションや、外部スコープからの `this` 参照をシャドウイングしたくない場合に使用します。

コード内で `also` を見かけたときは、「*そしてまた、オブジェクトに対して以下を行う*」と読むことができます。

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

## takeIf と takeUnless

スコープ関数に加えて、標準ライブラリには [`takeIf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-if.html) と [`takeUnless`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-unless.html) という関数が含まれています。これらの関数を使用すると、オブジェクトの状態のチェックをコールチェーンに組み込むことができます。

オブジェクト上で述語（プレディケート）と共に呼び出された場合、`takeIf` はオブジェクトがその述語を満たせばそのオブジェクトを返し、そうでなければ `null` を返します。つまり、`takeIf` は単一のオブジェクトに対するフィルタリング関数です。

`takeUnless` は `takeIf` と逆のロジックを持ちます。オブジェクト上で述語と共に呼び出された場合、`takeUnless` はオブジェクトが述語を満たせば `null` を返し、そうでなければそのオブジェクトを返します。

`takeIf` や `takeUnless` を使用する場合、オブジェクトはラムダ引数 (`it`) として利用可能です。

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

> `takeIf` や `takeUnless` の後に他の関数を連鎖させる場合は、戻り値が null 許容（nullable）であるため、null チェックを行うかセーフコール (`?.`) を使用することを忘れないでください。
>
{style="tip"}

```kotlin
fun main() {
//sampleStart
    val str = "Hello"
    val caps = str.takeIf { it.isNotEmpty() }?.uppercase()
   //val caps = str.takeIf { it.isNotEmpty() }.uppercase() // コンパイルエラー
    println(caps)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeIf` と `takeUnless` は、スコープ関数と組み合わせると特に便利です。例えば、`takeIf` や `takeUnless` を `let` と連鎖させて、指定された述語に一致するオブジェクトに対してのみコードブロックを実行できます。これを行うには、オブジェクトで `takeIf` を呼び出し、次にセーフコール (`?.`) を使用して `let` を呼び出します。述語に一致しないオブジェクトの場合、`takeIf` は `null` を返し、`let` は呼び出されません。

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

比較のために、以下は `takeIf` やスコープ関数を使用せずに同じ関数を記述した例です：

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