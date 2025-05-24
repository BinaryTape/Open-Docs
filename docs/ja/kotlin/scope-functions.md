---
title: スコープ関数
---
Kotlin標準ライブラリには、オブジェクトのコンテキスト内でコードブロックを実行することだけを目的とする関数がいくつか含まれています。このような関数を、[ラムダ式](lambdas)を指定してオブジェクトに対して呼び出すと、一時的なスコープが形成されます。このスコープでは、オブジェクトの名前なしでアクセスできます。このような関数は、_スコープ関数_と呼ばれます。スコープ関数には、[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)、[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)、[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)、[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html)、[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)の5つがあります。

基本的に、これらの関数はすべて同じアクションを実行します。オブジェクトに対してコードブロックを実行します。異なるのは、このオブジェクトがブロック内でどのように利用可能になるか、そして式全体の結果がどうなるかです。

スコープ関数の典型的な使用例を以下に示します。

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {

    Person("Alice", 20, "Amsterdam").let {
        println(it)
        it.moveTo("London")
        it.incrementAge()
        println(it)
    }

}
```

`let`なしで同じことを記述すると、新しい変数を導入し、それを使用するたびにその名前を繰り返す必要があります。

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {

    val alice = Person("Alice", 20, "Amsterdam")
    println(alice)
    alice.moveTo("London")
    alice.incrementAge()
    println(alice)

}
```

スコープ関数は、新しい技術的な機能を提供するわけではありませんが、コードをより簡潔で読みやすくすることができます。

スコープ関数には多くの類似点があるため、ユースケースに適したものを選択するのは難しい場合があります。選択は主に、プロジェクトにおける意図と一貫した使用法に依存します。以下では、スコープ関数間の違いとその規約について詳しく説明します。

## 関数の選択

目的のために適切なスコープ関数を選択できるように、それらの主な違いをまとめた表を以下に示します。

| Function |Object reference|Return value|Is extension function|
|---|---|---|---|
| [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) |`it`|Lambda result|Yes|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |`this`|Lambda result|Yes|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |-|Lambda result|No: called without the context object|
| [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) |`this`|Lambda result|No: takes the context object as an argument.|
| [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) |`this`|Context object|Yes|
| [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) |`it`|Context object|Yes|

これらの関数の詳細については、以下の専用セクションで説明します。

以下は、意図する目的に応じてスコープ関数を選択するための簡単なガイドです。

* Null許容でないオブジェクトに対するラムダの実行: `let`
* ローカルスコープに変数を導入する: `let`
* オブジェクトの構成: `apply`
* オブジェクトの構成と結果の計算: `run`
* 式が必要な場所でのステートメントの実行: 拡張関数ではない`run`
* 追加の効果: `also`
* オブジェクトに対する関数呼び出しのグループ化: `with`

異なるスコープ関数のユースケースは重複しているため、プロジェクトまたはチームで使用されている特定の規則に基づいて、使用する関数を選択できます。

スコープ関数はコードをより簡潔にすることができますが、過剰な使用は避けてください。コードが読みにくくなり、エラーが発生する可能性があります。また、スコープ関数のネストは避け、それらをチェーンするときは、現在のコンテキストオブジェクトと`this`または`it`の値について混乱しないように注意することをお勧めします。

## 区別

スコープ関数は性質が似ているため、それらの違いを理解することが重要です。各スコープ関数には、主に2つの違いがあります。
* コンテキストオブジェクトを参照する方法。
* 戻り値。

### コンテキストオブジェクト: thisまたはit

スコープ関数に渡されるラムダ内では、コンテキストオブジェクトは、その実際の名前の代わりに短い参照で利用できます。各スコープ関数は、コンテキストオブジェクトを参照する2つの方法のいずれかを使用します。ラムダ[レシーバー](lambdas#function-literals-with-receiver)（`this`）またはラムダ引数（`it`）として。どちらも同じ機能を提供するため、さまざまなユースケースにおけるそれぞれの長所と短所を説明し、それらの使用に関する推奨事項を提供します。

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

#### this

`run`、`with`、および`apply`は、コンテキストオブジェクトをラムダ[レシーバー](lambdas#function-literals-with-receiver)として参照します - キーワード`this`を使用します。したがって、それらのラムダでは、オブジェクトは通常のクラス関数の場合と同じように利用できます。

ほとんどの場合、レシーバーオブジェクトのメンバーにアクセスするときに`this`を省略して、コードを短くすることができます。一方、`this`が省略されている場合は、レシーバーメンバーと外部オブジェクトまたは関数を区別することが難しい場合があります。したがって、コンテキストオブジェクトをレシーバー（`this`）として持つことは、その関数を呼び出すか、プロパティに値を割り当てることによって、主にオブジェクトのメンバーを操作するラムダに推奨されます。

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {

    val adam = Person("Adam").apply { 
        age = 20                       // same as this.age = 20
        city = "London"
    }
    println(adam)

}
```

#### it

一方、`let`と`also`は、コンテキストオブジェクトをラムダ[引数](lambdas#lambda-expression-syntax)として参照します。引数名が指定されていない場合、オブジェクトは暗黙的なデフォルト名`it`でアクセスされます。`it`は`this`よりも短く、`it`を使用した式は通常読みやすくなります。

ただし、オブジェクトの関数またはプロパティを呼び出す場合、`this`のようにオブジェクトを暗黙的に利用することはできません。したがって、オブジェクトが主に関数呼び出しの引数として使用される場合は、`it`を介してコンテキストオブジェクトにアクセスする方が適しています。`it`は、コードブロックで複数の変数を使用する場合にも適しています。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {

    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()
    println(i)

}
```

以下の例は、引数名`value`を使用して、コンテキストオブジェクトをラムダ引数として参照する方法を示しています。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {

    fun getRandomInt(): Int {
        return Random.nextInt(100).also { value `->`
            writeToLog("getRandomInt() generated value $value")
        }
    }
    
    val i = getRandomInt()
    println(i)

}
```

### 戻り値

スコープ関数は、返す結果が異なります。
* `apply`と`also`は、コンテキストオブジェクトを返します。
* `let`、`run`、および`with`は、ラムダの結果を返します。

コードで次に何をするかに基づいて、必要な戻り値を慎重に検討する必要があります。これにより、使用する最適なスコープ関数を選択できます。

#### コンテキストオブジェクト

`apply`と`also`の戻り値は、コンテキストオブジェクト自体です。したがって、それらは_サイドステップ_として呼び出しチェーンに含めることができます。同じオブジェクトに対する関数呼び出しを次々とチェーンし続けることができます。

```kotlin
fun main() {

    val numberList = mutableListOf<Double>()
    numberList.also { println("Populating the list") }
        .apply {
            add(2.71)
            add(3.14)
            add(1.0)
        }
        .also { println("Sorting the list") }
        .sort()

    println(numberList)
}
```

また、コンテキストオブジェクトを返す関数のreturnステートメントで使用することもできます。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {

    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()

}
```

#### ラムダ結果

`let`、`run`、および`with`は、ラムダの結果を返します。したがって、結果を変数に割り当てたり、結果に対して操作をチェーンしたりする場合などに使用できます。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    val countEndsWithE = numbers.run { 
        add("four")
        add("five")
        count { it.endsWith("e") }
    }
    println("There are $countEndsWithE elements that end with e.")

}
```

さらに、戻り値を無視して、スコープ関数を使用してローカル変数の一時的なスコープを作成することもできます。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        val firstItem = first()
        val lastItem = last()        
        println("First item: $firstItem, last item: $lastItem")
    }

}
```

## 関数

ユースケースに適したスコープ関数を選択できるように、それらについて詳しく説明し、使用に関する推奨事項を提供します。技術的には、スコープ関数は多くの場合互換性があるため、例ではそれらを使用するための規則を示しています。

### let

- **コンテキストオブジェクト**は、引数（`it`）として使用できます。
- **戻り値**は、ラムダの結果です。

[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)を使用して、呼び出しチェーンの結果に対して1つ以上の関数を呼び出すことができます。たとえば、次のコードは、コレクションに対する2つの操作の結果を出力します。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four", "five")
    val resultList = numbers.map { it.length }.filter { it > 3 }
    println(resultList)    

}
```

`let`を使用すると、リスト操作の結果を変数に割り当てないように、上記の例を書き換えることができます。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let { 
        println(it)
        // and more function calls if needed
    } 

}
```

`let`に渡されるコードブロックに、引数として`it`を持つ単一の関数が含まれている場合は、ラムダ引数の代わりにメソッド参照（`::`）を使用できます。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)

}
```

`let`は、null許容でない値を含むコードブロックを実行するためによく使用されます。null許容でないオブジェクトに対してアクションを実行するには、[セーフコール演算子`?.`](null-safety#safe-call-operator)を使用して、ラムダでアクションを実行する`let`を呼び出します。

```kotlin
fun processNonNullString(str: String) {}

fun main() {

    val str: String? = "Hello"   
    //processNonNullString(str)       // compilation error: str can be null
    val length = str?.let { 
        println("let() called on $it")        
        processNonNullString(it)      // OK: 'it' is not null inside '?.let { }'
        it.length
    }

}
```

また、`let`を使用してスコープが制限されたローカル変数を導入し、コードを読みやすくすることもできます。コンテキストオブジェクトの新しい変数を定義するには、その名前をラムダ引数として指定して、デフォルトの`it`の代わりに使用できるようにします。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val modifiedFirstItem = numbers.first().let { firstItem `->`
        println("The first item of the list is '$firstItem'")
        if (firstItem.length >= 5) firstItem else "!" + firstItem + "!"
    }.uppercase()
    println("First item after modifications: '$modifiedFirstItem'")

}
```

### with

- **コンテキストオブジェクト**は、レシーバー（`this`）として使用できます。
- **戻り値**は、ラムダの結果です。

[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)は拡張関数ではないため、コンテキストオブジェクトは引数として渡されますが、ラムダ内ではレシーバー（`this`）として使用できます。

返された結果を使用する必要がない場合は、コンテキストオブジェクトで関数を呼び出すために`with`を使用することをお勧めします。
コードでは、`with`は「_このオブジェクトで、以下を実行します_」と読むことができます。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        println("'with' is called with argument $this")
        println("It contains $size elements")
    }

}
```

また、`with`を使用して、プロパティまたは関数が値の計算に使用されるヘルパーオブジェクトを導入することもできます。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    val firstAndLast = with(numbers) {
        "The first element is ${first()}," +
        " the last element is ${last()}"
    }
    println(firstAndLast)

}
```

### run

- **コンテキストオブジェクト**は、レシーバー（`this`）として使用できます。
- **戻り値**は、ラムダの結果です。

[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)は`with`と同じことを行いますが、拡張関数として実装されます。したがって、`let`と同様に、ドット表記を使用してコンテキストオブジェクトで呼び出すことができます。

`run`は、ラムダがオブジェクトを初期化し、戻り値を計算する場合に役立ちます。

```kotlin
class MultiportService(var url: String, var port: Int) {
    fun prepareRequest(): String = "Default request"
    fun query(request: String): String = "Result for query '$request'"
}

fun main() {

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

    println(result)
    println(letResult)
}
```

また、`run`を非拡張関数として呼び出すこともできます。非拡張バリアントの`run`にはコンテキストオブジェクトはありませんが、ラムダの結果は返されます。非拡張`run`を使用すると、式が必要な場所で複数のステートメントのブロックを実行できます。コードでは、非拡張`run`は「_コードブロックを実行し、結果を計算します_」と読むことができます。

```kotlin
fun main() {

    val hexNumberRegex = run {
        val digits = "0-9"
        val hexDigits = "A-Fa-f"
        val sign = "+-"
        
        Regex("[$sign]?[$digits$hexDigits]+")
    }
    
    for (match in hexNumberRegex.findAll("+123 -FFFF !%*& 88 XYZ")) {
        println(match.value)
    }

}
```

### apply

- **コンテキストオブジェクト**は、レシーバー（`this`）として使用できます。
- **戻り値**は、オブジェクト自体です。

[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html)はコンテキストオブジェクト自体を返すため、値を返さず、主にレシーバーオブジェクトのメンバーを操作するコードブロックに使用することをお勧めします。`apply`の最も一般的なユースケースは、オブジェクトの構成です。このような呼び出しは、「_以下の割り当てをオブジェクトに適用します_」と読むことができます。

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {

    val adam = Person("Adam").apply {
        age = 32
        city = "London"        
    }
    println(adam)

}
```

`apply`のもう1つのユースケースは、より複雑な処理のために複数の呼び出しチェーンに`apply`を含めることです。

### also

- **コンテキストオブジェクト**は、引数（`it`）として使用できます。
- **戻り値**は、オブジェクト自体です。

[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)は、コンテキストオブジェクトを引数として受け取るアクションを実行するのに役立ちます。プロパティと関数ではなく、オブジェクトへの参照が必要なアクション、または外部スコープからの`this`参照をシャドウしたくない場合は、`also`を使用します。

コードで`also`が表示されたら、「_オブジェクトを使用して以下も実行します_」と読むことができます。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    numbers
        .also { println("The list elements before adding new one: $it") }
        .add("four")

}
```

## takeIfとtakeUnless

スコープ関数に加えて、標準ライブラリには関数[`takeIf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-if.html)と[`takeUnless`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-unless.html)が含まれています。これらの関数を使用すると、オブジェクトの状態のチェックを呼び出しチェーンに埋め込むことができます。

述語とともにオブジェクトで呼び出されると、`takeIf`は、特定の述語を満たす場合にこのオブジェクトを返します。
それ以外の場合は、`null`を返します。したがって、`takeIf`は単一のオブジェクトのフィルタリング関数です。

`takeUnless`は、`takeIf`とは反対のロジックを持ちます。述語とともにオブジェクトで呼び出されると、`takeUnless`は、特定の述語を満たす場合に`null`を返します。それ以外の場合は、オブジェクトを返します。

`takeIf`または`takeUnless`を使用する場合、オブジェクトはラムダ引数（`it`）として使用できます。

```kotlin
import kotlin.random.*

fun main() {

    val number = Random.nextInt(100)

    val evenOrNull = number.takeIf { it % 2 == 0 }
    val oddOrNull = number.takeUnless { it % 2 == 0 }
    println("even: $evenOrNull, odd: $oddOrNull")

}
```

:::tip
`takeIf`と`takeUnless`の後に他の関数をチェーンする場合は、戻り値がnull許容であるため、nullチェックを実行するか、セーフコール（`?.`）を使用することを忘れないでください。

:::

```kotlin
fun main() {

    val str = "Hello"
    val caps = str.takeIf { it.isNotEmpty() }?.uppercase()
   //val caps = str.takeIf { it.isNotEmpty() }.uppercase() //compilation error
    println(caps)

}
```

`takeIf`と`takeUnless`は、特にスコープ関数と組み合わせて使用すると便利です。たとえば、`takeIf`と`takeUnless`を`let`とチェーンして、特定の述語に一致するオブジェクトに対してコードブロックを実行できます。これを行うには、オブジェクトで`takeIf`を呼び出し、次にセーフコール（`?`）を使用して`let`を呼び出します。述語に一致しないオブジェクトの場合、`takeIf`は`null`を返し、`let`は呼び出されません。

```kotlin
fun main() {

    fun displaySubstringPosition(input: String, sub: String) {
        input.indexOf(sub).takeIf { it >= 0 }?.let {
            println("The substring $sub is found in $input.")
            println("Its start position is $it.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")

}
```

比較のために、以下は`takeIf`またはスコープ関数を使用せずに同じ関数を記述する方法の例です。

```kotlin
fun main() {

    fun displaySubstringPosition(input: String, sub: String) {
        val index = input.indexOf(sub)
        if (index >= 0) {
            println("The substring $sub is found in $input.")
            println("Its start position is $index.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")

}
```