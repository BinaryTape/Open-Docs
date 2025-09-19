[//]: # (title: 条件とループ)

Kotlinは、プログラムのフローを制御するための柔軟なツールを提供します。`if`、`when`、およびループを使用して、条件に対する明確で表現力豊かなロジックを定義します。

## If式

Kotlinで`if`を使用するには、チェックする条件を丸括弧`()`内に、結果がtrueの場合に実行するアクションを波括弧`{}`内に記述します。追加のブランチやチェックには`else`や`else if`を使用できます。

また、`if`を式として記述することもでき、その返される値を直接変数に代入できます。この形式では、`else`ブランチが必須です。`if`式は、他の言語にある三項演算子（`condition ? then : else`）と同じ目的を果たします。

例：

```kotlin
fun main() {
    val heightAlice = 160
    val heightBob = 175

    //sampleStart
    var taller = heightAlice
    if (heightAlice < heightBob) taller = heightBob

    // Uses an else branch
    if (heightAlice > heightBob) {
        taller = heightAlice
    } else {
        taller = heightBob
    }

    // Uses if as an expression
    taller = if (heightAlice > heightBob) heightAlice else heightBob

    // Uses else if as an expression:
    val heightLimit = 150
    val heightOrLimit = if (heightLimit > heightAlice) heightLimit else if (heightAlice > heightBob) heightAlice else heightBob

    println("Taller height is $taller")
    // Taller height is 175
    println("Height or limit is $heightOrLimit")
    // Height or limit is 175
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="if-else-if-kotlin"}

`if`式の各ブランチはブロックにすることができ、その場合、最後の式の値が結果となります。

```kotlin
fun main() {
    //sampleStart
    val heightAlice = 160
    val heightBob = 175

    val taller = if (heightAlice > heightBob) {
        print("Choose Alice
")
        heightAlice
    } else {
        print("Choose Bob
")
        heightBob
    }

    println("Taller height is $taller")
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="if-else-blocks-kotlin"}

## When式とwhen文

`when`は、複数の可能な値または条件に基づいてコードを実行する条件式です。これは、Java、Cなどの言語における`switch`文に似ています。`when`はその引数を評価し、条件が満たされるまで各ブランチと順に結果を比較します。例：

```kotlin
fun main() {
    //sampleStart
    val userRole = "Editor"
    when (userRole) {
        "Viewer" -> print("User has read-only access")
        "Editor" -> print("User can edit content")
        else -> print("User role is not recognized")
    }
    // User can edit content
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-conditions-when-statement"}

`when`は**式（expression）**としても**文（statement）**としても使用できます。式として使用する場合、`when`は後でコードで使用できる値を返します。文として使用する場合、`when`は結果を返さずにアクションを完了します。

<table>
   <tr>
       <td>式（Expression）</td>
       <td>文（Statement）</td>
   </tr>
   <tr>
<td>

```kotlin
// text変数に代入される文字列を返す
val text = when (x) {
    1 -> "x == 1"
    2 -> "x == 2"
    else -> "x is neither 1 nor 2"
}
```

</td>
<td>

```kotlin
// 結果は返さないが、print文をトリガーする
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> print("x is neither 1 nor 2")
}
```

</td>
</tr>
</table>

次に、`when`は対象（subject）ありでもなしでも使用できます。どちらの方法でも動作は同じです。対象を使用すると、何をチェックしているかが明確になり、コードがより読みやすく保守しやすくなるため、通常は対象ありで使用することをお勧めします。

<table>
   <tr>
       <td>対象<code>x</code>あり</td>
       <td>対象なし</td>
   </tr>
   <tr>
<td>

```kotlin
when(x) { ... }
```

</td>
<td>

```kotlin
when { ... }
```

</td>
</tr>
</table>

`when`の使用方法によって、ブランチですべての可能なケースをカバーする必要があるかどうかの要件が異なります。すべての可能なケースをカバーすることを_網羅的（exhaustive）_と呼びます。

### 文（Statements）

`when`を文として使用する場合、すべての可能なケースをカバーする必要はありません。この例では、いくつかのケースがカバーされていないため、どのブランチもトリガーされません。しかし、エラーは発生しません。

```kotlin
fun main() {
    //sampleStart
    val deliveryStatus = "OutForDelivery"
    when (deliveryStatus) {
        // Not all cases are covered
        "Pending" -> print("Your order is being prepared")
        "Shipped" -> print("Your order is on the way")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-statement"}

`if`と同様に、各ブランチはブロックにすることができ、その値はブロック内の最後の式の値となります。

### 式（Expressions）

`when`を式として使用する場合、すべての可能なケースを**必ず**カバーする必要があります。最初に一致したブランチの値が、全体の式の値になります。すべてのケースをカバーしない場合、コンパイラはエラーをスローします。

`when`式に対象がある場合、`else`ブランチを使用してすべての可能なケースがカバーされていることを確認できますが、必須ではありません。例えば、対象が`Boolean`、[enumクラス](enum-classes.md)、[sealedクラス](sealed-classes.md)、またはそれらのnull許容型の場合、`else`ブランチなしで全ケースをカバーできます。

```kotlin
import kotlin.random.Random
//sampleStart
enum class Bit {
    ZERO, ONE
}

fun getRandomBit(): Bit {
    return if (Random.nextBoolean()) Bit.ONE else Bit.ZERO
}

fun main() {
    val numericValue = when (getRandomBit()) {
        // No else branch is needed because all cases are covered
        Bit.ZERO -> 0
        Bit.ONE -> 1
    }

    println("Random bit as number: $numericValue")
    // Random bit as number: 0
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-expression-subject"}

> `when`式を簡素化し、繰り返しを減らすには、コンテキスト依存の解決（context-sensitive resolution、現在プレビュー中）を試してください。
> この機能を使用すると、予想される型が分かっている場合に`when`式でenumエントリやsealedクラスのメンバーを使用する際に型名を省略できます。
>
> 詳細については、[コンテキスト依存の解決のプレビュー](whatsnew22.md#preview-of-context-sensitive-resolution)または関連する[KEEP提案](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)を参照してください。
>
{style="tip"}

`when`式に**対象がない場合**、`else`ブランチが**必須**であり、そうでないとコンパイラはエラーをスローします。`else`ブランチは、他のどのブランチ条件も満たされない場合に評価されます。

```kotlin
fun main() {
    //sampleStart
    val localFileSize = 1200
    val remoteFileSize = 1200

    val message = when {
        localFileSize > remoteFileSize -> "Local file is larger than remote file"
        localFileSize < remoteFileSize -> "Local file is smaller than remote file"
        else -> "Local and remote files are the same size"
    }

    println(message)
    // Local and remote files are the same size
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-no-subject"}

### whenのその他の使い方

`when`式と文は、コードを簡素化し、複数の条件を処理し、型チェックを実行するためのさまざまな方法を提供します。

コンマを使用して、複数の条件を1つのブランチにグループ化します。

```kotlin
fun main() {
    val ticketPriority = "High"
    //sampleStart
    when (ticketPriority) {
        "Low", "Medium" -> print("Standard response time")
        else -> print("High-priority handling")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-multiple-cases"}

ブール値に評価される式をブランチ条件として使用します。

```kotlin
fun main() {
    val storedPin = "1234"
    val enteredPin = 1234
  
    //sampleStart
    when (enteredPin) {
        // Expression
        storedPin.toInt() -> print("PIN is correct")
        else -> print("Incorrect PIN")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-branch-expression"}

`in`または`!in`キーワードを使用して、値が[範囲](ranges.md)またはコレクションに含まれているかどうか、あるいは含まれていないかをチェックできます。

```kotlin
fun main() {
    val x = 7
    val validNumbers = setOf(15, 16, 17)

    //sampleStart
    when (x) {
        in 1..10 -> print("x is in the range")
        in validNumbers -> print("x is valid")
        !in 10..20 -> print("x is outside the range")
        else -> print("none of the above")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-ranges"}

`is`または`!is`キーワードを使用して、値の型をチェックします。[スマートキャスト](typecasts.md#smart-casts)により、追加のチェックなしで型のメンバー関数やプロパティに直接アクセスできます。

```kotlin
fun hasPrefix(input: Any): Boolean = when (input) {
    is String -> input.startsWith("ID-")
    else -> false
}

fun main() {
    val testInput = "ID-98345"
    println(hasPrefix(testInput))
    // true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-type-checks"}

従来の`if`-`else if`チェーンの代替として`when`を使用します。
対象がない場合、ブランチ条件は単純なブール式になります。`true`となる最初のブランチが実行されます。

```kotlin
fun Int.isOdd() = this % 2 != 0
fun Int.isEven() = this % 2 == 0

fun main() {
    //sampleStart
    val x = 5
    val y = 8

    when {
        x.isOdd() -> print("x is odd")
        y.isEven() -> print("y is even")
        else -> print("x+y is odd")
    }
    // x is odd
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-replace-if"}

最後に、次の構文を使用して、対象を変数にキャプチャできます。

```kotlin
fun main() {
    val message = when (val input = "yes") {
        "yes" -> "You said yes"
        "no" -> "You said no"
        else -> "Unrecognized input: $input"
    }

    println(message)
    // You said yes
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-capture-subject"}

対象として導入された変数のスコープは、`when`式または文の本体に限定されます。

### ガード条件 {id="guard-conditions-in-when-expressions"}

ガード条件を使用すると、`when`式または文のブランチに複数の条件を含めることができ、複雑な制御フローをより明示的かつ簡潔にします。ガード条件は、対象を持つ`when`式または文で使用できます。

プライマリ条件の後に`if`で区切って、ガード条件を同じブランチに配置します。

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal
    data class Dog(val breed: String) : Animal
}

fun feedDog() = println("Feeding a dog")
fun feedCat() = println("Feeding a cat")

//sampleStart
fun feedAnimal(animal: Animal) {
    when (animal) {
        // プライマリ条件のみのブランチ
        // animalがDogの場合にfeedDog()を呼び出す
        is Animal.Dog -> feedDog()
        // プライマリ条件とガード条件の両方を持つブランチ
        // animalがCatであり、かつmouseHunterではない場合にfeedCat()を呼び出す
        is Animal.Cat if !animal.mouseHunter -> feedCat()
        // 上記のどの条件も一致しない場合に"Unknown animal"と表示する
        else -> println("Unknown animal")
    }
}

fun main() {
    val animals = listOf(
        Animal.Dog("Beagle"),
        Animal.Cat(mouseHunter = false),
        Animal.Cat(mouseHunter = true)
    )

    animals.forEach { feedAnimal(it) }
    // Feeding a dog
    // Feeding a cat
    // Unknown animal
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.2" id="kotlin-when-guard-conditions"}

コンマで区切られた複数の条件がある場合（例: `0, 1 -> print("x == 0 or x == 1")`）は、ガード条件を使用できません。

単一の`when`式または文内で、ガード条件を持つブランチと持たないブランチを組み合わせることができます。ガード条件を持つブランチ内のコードは、プライマリ条件とガード条件の両方が`true`と評価された場合にのみ実行されます。プライマリ条件が一致しない場合、ガード条件は評価されません。

`when`文はすべてのケースをカバーする必要がないため、`else`ブランチなしで`when`文にガード条件を使用する場合、どの条件も一致しなければコードは実行されません。

文とは異なり、`when`式はすべてのケースをカバーする必要があります。`else`ブランチなしで`when`式にガード条件を使用する場合、ランタイムエラーを避けるために、コンパイラは考えられるすべてのケースを処理するように要求します。

複数のガード条件は、ブール演算子`&&` (AND) または`||` (OR) を使用して、単一のブランチ内で組み合わせることができます。
[混乱を避ける](coding-conventions.md#guard-conditions-in-when-expression)ために、ブール式を括弧で囲んでください。

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) -> feedCat()
}
```

ガード条件は`else if`もサポートしています。

```kotlin
when (animal) {
    // `animal`が`Dog`であるかをチェックする
    is Animal.Dog -> feedDog()
    // `animal`が`Cat`であり、かつ`mouseHunter`ではないかをチェックするガード条件
    is Animal.Cat if !animal.mouseHunter -> feedCat()
    // 上記のどの条件も一致せず、animal.eatsPlantsがtrueの場合にgiveLettuce()を呼び出す
    else if animal.eatsPlants -> giveLettuce()
    // 上記のどの条件も一致しない場合に"Unknown animal"と表示する
    else -> println("Unknown animal")
}
```

## Forループ

`for`ループを使用して、[コレクション](collections-overview.md)、[配列](arrays.md)、または[範囲](ranges.md)を反復処理します。

```kotlin
for (item in collection) print(item)
```

`for`ループの本体は波括弧`{}`で囲まれたブロックにすることができます。

```kotlin
fun main() {
    val shoppingList = listOf("Milk", "Bananas", "Bread")
    //sampleStart
    println("Things to buy:")
    for (item in shoppingList) {
        println("- $item")
    }
    // Things to buy:
    // - Milk
    // - Bananas
    // - Bread
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop"}

### 範囲（Ranges）

数値の範囲を反復処理するには、`..`および`..<`演算子を含む[範囲式](ranges.md)を使用します。

```kotlin
fun main() {
//sampleStart
    println("Closed-ended range:")
    for (i in 1..6) {
        print(i)
    }
    // Closed-ended range:
    // 123456
  
    println("
Open-ended range:")
    for (i in 1..<6) {
        print(i)
    }
    // Open-ended range:
    // 12345
  
    println("
Reverse order in steps of 2:")
    for (i in 6 downTo 0 step 2) {
        print(i)
    }
    // Reverse order in steps of 2:
    // 6420
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-range"}

### 配列（Arrays）

インデックスを使用して配列やリストを反復処理したい場合は、`indices`プロパティを使用できます。

```kotlin
fun main() {
    val routineSteps = arrayOf("Wake up", "Brush teeth", "Make coffee")
    //sampleStart
    for (i in routineSteps.indices) {
        println(routineSteps[i])
    }
    // Wake up
    // Brush teeth
    // Make coffee
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-array"}

あるいは、標準ライブラリの[`withIndex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/with-index.html)関数を使用することもできます。

```kotlin
fun main() {
    val routineSteps = arrayOf("Wake up", "Brush teeth", "Make coffee")
    //sampleStart
    for ((index, value) in routineSteps.withIndex()) {
        println("The step at $index is \"$value\"")
    }
    // The step at 0 is "Wake up"
    // The step at 1 is "Brush teeth"
    // The step at 2 is "Make coffee"
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-array-index"}

### イテレーター（Iterators）

`for`ループは、[イテレーター](iterators.md)を提供するあらゆるものを反復処理します。コレクションはデフォルトでイテレーターを提供しますが、範囲と配列はインデックスベースのループにコンパイルされます。

`Iterator<>`を返す`iterator()`というメンバー関数または拡張関数を提供することで、独自のイテレーターを作成できます。`iterator()`関数は、`next()`関数と`Boolean`を返す`hasNext()`関数を持っている必要があります。

クラスの独自のイテレーターを作成する最も簡単な方法は、[`Iterable<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-iterable/)インターフェースを継承し、そこに既に存在する`iterator()`、`next()`、および`hasNext()`関数をオーバーライドすることです。例：

```kotlin
class Booklet(val totalPages: Int) : Iterable<Int> {
    override fun iterator(): Iterator<Int> {
        return object : Iterator<Int> {
            var current = 1
            override fun hasNext() = current <= totalPages
            override fun next() = current++
        }
    }
}

fun main() {
    val booklet = Booklet(3)
    for (page in booklet) {
        println("Reading page $page")
    }
    // Reading page 1
    // Reading page 2
    // Reading page 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-inherit-iterator"}

> [インターフェース](interfaces.md)と[継承](inheritance.md)について詳しく学びましょう。
>
{style="tip"}

あるいは、関数をゼロから作成することもできます。この場合、関数に`operator`キーワードを追加します。

```kotlin
//sampleStart
class Booklet(val totalPages: Int) {
    operator fun iterator(): Iterator<Int> {
        return object {
            var current = 1

            operator fun hasNext() = current <= totalPages
            operator fun next() = current++
        }.let {
            object : Iterator<Int> {
                override fun hasNext() = it.hasNext()
                override fun next() = it.next()
            }
        }
    }
}
//sampleEnd

fun main() {
    val booklet = Booklet(3)
    for (page in booklet) {
        println("Reading page $page")
    }
    // Reading page 1
    // Reading page 2
    // Reading page 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-iterator-from-scratch"}

## Whileループ

`while`と`do-while`ループは、条件が満たされている間、継続的にその本体のコードを処理します。
両者の違いは、条件をチェックするタイミングです。

*   `while`は条件をチェックし、満たされていれば本体のコードを実行し、再び条件チェックに戻ります。
*   `do-while`は本体のコードを実行してから条件をチェックします。条件が満たされていれば、ループを繰り返します。そのため、`do-while`の本体は条件にかかわらず少なくとも一度は実行されます。

`while`ループの場合、チェックする条件を丸括弧`()`内に、本体を波括弧`{}`内に記述します。

```kotlin
fun main() {
    var carsInGarage = 0
    val maxCapacity = 3
//sampleStart
    while (carsInGarage < maxCapacity) {
        println("Car entered. Cars now in garage: ${++carsInGarage}")
    }
    // Car entered. Cars now in garage: 1
    // Car entered. Cars now in garage: 2
    // Car entered. Cars now in garage: 3

    println("Garage is full!")
    // Garage is full!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-while-loop"}

`do-while`ループの場合、最初に本体を波括弧`{}`内に記述し、その後にチェックする条件を丸括弧`()`内に記述します。

```kotlin
import kotlin.random.Random

fun main() {
    var roll: Int
//sampleStart
    do {
        roll = Random.nextInt(1, 7)
        println("Rolled a $roll")
    } while (roll != 6)
    // Rolled a 2
    // Rolled a 6
    
    println("Got a 6! Game over.")
    // Got a 6! Game over.
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-do-while-loop"}

## ループにおけるbreakとcontinue

Kotlinは、ループにおける従来の`break`および`continue`演算子をサポートしています。[戻り値とジャンプ](returns.md)を参照してください。