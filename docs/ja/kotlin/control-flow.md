[//]: # (title: 条件とループ)

## If式

Kotlinでは、`if`は式（expression）であり、値を返します。
そのため、通常の`if`がその役割を十分に果たすため、三項演算子（`condition ? then : else`）は存在しません。

```kotlin
fun main() {
    val a = 2
    val b = 3

    //sampleStart
    var max = a
    if (a < b) max = b

    // With else
    if (a > b) {
      max = a
    } else {
      max = b
    }

    // As expression
    max = if (a > b) a else b

    // You can also use `else if` in expressions:
    val maxLimit = 1
    val maxOrLimit = if (maxLimit > a) maxLimit else if (a > b) a else b
  
    println("max is $max")
    // max is 3
    println("maxOrLimit is $maxOrLimit")
    // maxOrLimit is 3
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="if-else-if-kotlin"}

`if`式のブランチはブロックにすることができます。この場合、最後の式がブロックの値となります。

```kotlin
val max = if (a > b) {
    print("Choose a")
    a
} else {
    print("Choose b")
    b
}
```

`if`を式として使用する場合、例えばその値を返したり、変数に代入したりする際には、`else`ブランチは必須です。

## When式とwhen文

`when`は、複数の可能な値や条件に基づいてコードを実行する条件式です。これはJava、Cなどの言語における`switch`文に似ています。例を挙げます。

```kotlin
fun main() {
    //sampleStart
    val x = 2
    when (x) {
        1 -> print("x == 1")
        2 -> print("x == 2")
        else -> print("x is neither 1 nor 2")
    }
    // x == 2
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-conditions-when-statement"}

`when`は、何らかのブランチ条件が満たされるまで、その引数をすべてのブランチと順に照合します。

`when`にはいくつかの異なる使い方があります。まず、`when`は**式（expression）**としても**文（statement）**としても使用できます。
式として使用する場合、`when`は後でコードで使用するために値を返します。文として使用する場合、`when`はそれ以上何も返さずにアクションを完了します。

<table>
   <tr>
       <td>式（Expression）</td>
       <td>文（Statement）</td>
   </tr>
   <tr>
<td>

```kotlin
// Returns a string assigned to the 
// text variable
val text = when (x) {
    1 -> "x == 1"
    2 -> "x == 2"
    else -> "x is neither 1 nor 2"
}
```

</td>
<td>

```kotlin
// Returns nothing but triggers a 
// print statement
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> print("x is neither 1 nor 2")
}
```

</td>
</tr>
</table>

次に、`when`を対象（subject）ありで、または対象なしで使用できます。対象を`when`で使用するかどうかにかかわらず、式または文の動作は同じです。可能な場合は対象ありの`when`を使用することをお勧めします。そうすることで、何をチェックしているかが明確になり、コードが読みやすく、保守しやすくなります。

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

`when`をどのように使用するかによって、ブランチで考えられるすべてのケースをカバーする必要があるかどうかの要件が異なります。

`when`を文として使用する場合、考えられるすべてのケースをカバーする必要はありません。この例では、一部のケースがカバーされていないため、何も起こりません。しかし、エラーは発生しません。

```kotlin
fun main() {
    //sampleStart
    val x = 3
    when (x) {
        // Not all cases are covered
        1 -> print("x == 1")
        2 -> print("x == 2")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-statement"}

`when`文では、個々のブランチの値は無視されます。`if`と同様に、各ブランチはブロックにすることができ、その値はブロック内の最後の式の値となります。

`when`を式として使用する場合、考えられるすべてのケースをカバーする必要があります。つまり、**網羅的（exhaustive）**でなければなりません。最初に一致したブランチの値が、全体の式の値になります。すべてのケースをカバーしない場合、コンパイラはエラーをスローします。

`when`式に対象がある場合、考えられるすべてのケースがカバーされていることを確認するために`else`ブランチを使用できますが、必須ではありません。例えば、対象が`Boolean`、[enumクラス](enum-classes.md)、[sealedクラス](sealed-classes.md)、またはそれらのnull許容型の場合、`else`ブランチなしで全ケースをカバーできます。

```kotlin
enum class Bit {
    ZERO, ONE
}

val numericValue = when (getRandomBit()) {
    // No else branch is needed because all cases are covered
    Bit.ZERO -> 0
    Bit.ONE -> 1
}
```

> `when`式を簡素化し、繰り返しを減らすには、コンテキスト依存の解決（現在プレビュー中）を試してください。
> この機能を使用すると、予想される型が分かっている場合に`when`式でenumエントリやsealedクラスのメンバーを使用する際に型名を省略できます。
>
> 詳細については、[コンテキスト依存の解決のプレビュー](whatsnew22.md#preview-of-context-sensitive-resolution)または関連する[KEEP提案](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)を参照してください。
>
{style="tip"}

`when`式に**対象がない場合**、`else`ブランチが**必須**であり、そうでないとコンパイラはエラーをスローします。
`else`ブランチは、他のどのブランチ条件も満たされない場合に評価されます。

```kotlin
val message = when {
    a > b -> "a is greater than b"
    a < b -> "a is less than b"
    else -> "a is equal to b"
}
```

`when`式と文は、コードを簡素化し、複数の条件を処理し、型チェックを実行するためのさまざまな方法を提供します。

複数のケースの共通の動作は、コンマで区切って1行に結合することで定義できます。

```kotlin
when (x) {
    0, 1 -> print("x == 0 or x == 1")
    else -> print("otherwise")
}
```

ブランチ条件として、定数だけでなく任意の式を使用できます。

```kotlin
when (x) {
    s.toInt() -> print("s encodes x")
    else -> print("s does not encode x")
}
```

`in`または`!in`キーワードを使用して、値が[範囲](ranges.md)またはコレクションに含まれているかどうか、あるいは含まれていないかをチェックすることもできます。

```kotlin
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}
```

さらに、`is`または`!is`キーワードを使用して、値が特定の型であるかどうか、あるいはそうでないかをチェックできます。なお、[スマートキャスト](typecasts.md#smart-casts)により、追加のチェックなしで型のメンバー関数やプロパティにアクセスできます。

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}
```

`when`は、`if`-`else if`チェーンの代替として使用できます。
対象がない場合、ブランチ条件は単純なブール式になります。`true`となる最初のブランチが実行されます。

```kotlin
when {
    x.isOdd() -> print("x is odd")
    y.isEven() -> print("y is even")
    else -> print("x+y is odd")
}
```

次の構文を使用して、対象を変数にキャプチャできます。

```kotlin
fun Request.getBody() =
    when (val response = executeRequest()) {
        is Success -> response.body
        is HttpError -> throw HttpException(response.status)
    }
```

対象として導入された変数のスコープは、`when`式または文の本体に限定されます。

### when式におけるガード条件

ガード条件を使用すると、`when`式のブランチに複数の条件を含めることができ、複雑な制御フローをより明示的かつ簡潔にします。
ガード条件は、対象を持つ`when`式または文で使用できます。

ブランチにガード条件を含めるには、プライマリ条件の後に`if`で区切って配置します。

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal
    data class Dog(val breed: String) : Animal
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // プライマリ条件のみのブランチ。`animal`が`Dog`の場合に`feedDog()`を呼び出す
        is Animal.Dog -> feedDog()
        // プライマリ条件とガード条件の両方を持つブランチ。`animal`が`Cat`であり、かつ`mouseHunter`ではない場合に`feedCat()`を呼び出す
        is Animal.Cat if !animal.mouseHunter -> feedCat()
        // 上記のどの条件も一致しない場合に"Unknown animal"と表示する
        else -> println("Unknown animal")
    }
}
```

単一の`when`式内で、ガード条件を持つブランチと持たないブランチを組み合わせることができます。
ガード条件を持つブランチ内のコードは、プライマリ条件とガード条件の両方が`true`と評価された場合にのみ実行されます。
プライマリ条件が一致しない場合、ガード条件は評価されません。

`else`ブランチを持たない`when`文でガード条件を使用し、どの条件も一致しない場合、どのブランチも実行されません。

一方、`else`ブランチを持たない`when`式でガード条件を使用する場合、ランタイムエラーを避けるために、考えられるすべてのケースを宣言することがコンパイラによって要求されます。

さらに、ガード条件は`else if`をサポートしています。

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

複数のガード条件を単一のブランチ内で、ブール演算子`&&` (AND) または`||` (OR) を使用して組み合わせることができます。
[混乱を避ける](coding-conventions.md#guard-conditions-in-when-expression)ために、ブール式を括弧で囲んでください。

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) -> feedCat()
}
```

ガード条件は、対象を持つすべての`when`式または文で使用できます。ただし、コンマで区切られた複数の条件がある場合（例: `0, 1 -> print("x == 0 or x == 1")`）は除きます。

## Forループ

`for`ループは、イテレーターを提供するあらゆるものを反復処理します。これは、C#のような言語における`foreach`ループに相当します。
`for`の構文は次のとおりです。

```kotlin
for (item in collection) print(item)
```

`for`の本体はブロックにすることができます。

```kotlin
for (item: Int in ints) {
    // ...
}
```

前述のとおり、`for`はイテレーターを提供するあらゆるものを反復処理します。これは、以下の条件を満たすことを意味します。

*   `Iterator<>`を返すメンバー関数または拡張関数`iterator()`を持つこと。そして、その`Iterator<>`は：
    *   メンバー関数または拡張関数`next()`を持つこと。
    *   `Boolean`を返すメンバー関数または拡張関数`hasNext()`を持つこと。

これら3つの関数はすべて`operator`としてマークされている必要があります。

数値の範囲を反復処理するには、[範囲式](ranges.md)を使用します。

```kotlin
fun main() {
//sampleStart
    for (i in 1..3) {
        print(i)
    }
    for (i in 6 downTo 0 step 2) {
        print(i)
    }
    // 1236420
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

範囲または配列に対する`for`ループは、イテレーターオブジェクトを作成しないインデックスベースのループにコンパイルされます。

インデックスを使用して配列やリストを反復処理したい場合は、次のように行えます。

```kotlin
fun main() {
val array = arrayOf("a", "b", "c")
//sampleStart
    for (i in array.indices) {
        print(array[i])
    }
    // abc
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

あるいは、`withIndex`ライブラリ関数を使用することもできます。

```kotlin
fun main() {
    val array = arrayOf("a", "b", "c")
//sampleStart
    for ((index, value) in array.withIndex()) {
        println("the element at $index is $value")
    }
    // the element at 0 is a
    // the element at 1 is b
    // the element at 2 is c
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Whileループ

`while`と`do-while`ループは、条件が満たされている間、継続的にその本体を処理します。
両者の違いは、条件をチェックするタイミングです。
*   `while`は条件をチェックし、満たされていれば本体を処理し、再び条件チェックに戻ります。
*   `do-while`は本体を処理してから条件をチェックします。条件が満たされていれば、ループを繰り返します。そのため、`do-while`の本体は条件にかかわらず少なくとも一度は実行されます。

```kotlin
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // y is visible here!
```

## ループにおけるbreakとcontinue

Kotlinは、ループにおける従来の`break`および`continue`演算子をサポートしています。[戻り値とジャンプ](returns.md)を参照してください。