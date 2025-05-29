[//]: # (title: 条件とループ)

## `if` 式

Kotlinでは、`if`は式です。値を返します。
したがって、通常の`if`がこの役割を十分に果たすため、三項演算子 (`condition ? then : else`) はありません。

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

`if`式のブランチはブロックにすることができます。この場合、最後の式がブロックの値になります。

```kotlin
val max = if (a > b) {
    print("Choose a")
    a
} else {
    print("Choose b")
    b
}
```

`if`を式として、たとえばその値を返したり、変数に代入したりする場合、`else`ブランチは必須です。

## `when`式とステートメント

`when`は、複数の可能な値や条件に基づいてコードを実行する条件式です。これはJava、C、および同様の言語の`switch`ステートメントに似ています。例：

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

`when`は、いずれかのブランチ条件が満たされるまで、その引数をすべてのブランチと順次照合します。

`when`はいくつかの異なる方法で使用できます。まず、`when`は**式**としても**ステートメント**としても使用できます。
式として、`when`はコードで後で使用するための値を返します。ステートメントとして、`when`はそれ以上の使用目的の値を返さずにアクションを完了します。

<table>
   <tr>
       <td>式</td>
       <td>ステートメント</td>
   </tr>
   <tr>
<td>

```kotlin
// 文字列を
// text変数に割り当てます
val text = when (x) {
    1 -> "x == 1"
    2 -> "x == 2"
    else -> "x is neither 1 nor 2"
}
```

</td>
<td>

```kotlin
// 何も返しませんが、
// printステートメントをトリガーします
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> print("x is neither 1 nor 2")
}
```

</td>
</tr>
</table>

次に、`when`をサブジェクト（対象）あり、またはサブジェクトなしで使用できます。`when`にサブジェクトを使用するかどうかにかかわらず、式またはステートメントの動作は同じです。可能な場合はサブジェクト付きの`when`を使用することをお勧めします。そうすることで、何をチェックしているのかが明確になり、コードの読みやすさと保守性が向上します。

<table>
   <tr>
       <td>サブジェクト <code>x</code> を使用</td>
       <td>サブジェクトなし</td>
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

`when`の使用方法に応じて、ブランチですべての可能なケースをカバーする必要があるかどうかの要件が異なります。

`when`をステートメントとして使用する場合、すべての可能なケースをカバーする必要はありません。この例では、一部のケースがカバーされていないため、何も起こりません。ただし、エラーは発生しません。

```kotlin
fun main() {
    //sampleStart
    val x = 3
    when (x) {
        // すべてのケースがカバーされていません
        1 -> print("x == 1")
        2 -> print("x == 2")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-statement"}

`when`ステートメントでは、個々のブランチの値は無視されます。`if`と同様に、各ブランチはブロックにすることができ、その値はブロック内の最後の式の値になります。

`when`を式として使用する場合、すべての可能なケースをカバーする必要があります。言い換えれば、それは_網羅的_でなければなりません。最初に一致したブランチの値が、全体の式の値になります。すべてのケースをカバーしない場合、コンパイラはエラーをスローします。

`when`式にサブジェクトがある場合、`else`ブランチを使用してすべての可能なケースがカバーされていることを確認できますが、必須ではありません。たとえば、サブジェクトが`Boolean`、[`enum`クラス](enum-classes.md)、[`sealed`クラス](sealed-classes.md)、またはそれらのnull許容型の場合、`else`ブランチなしですべてのケースをカバーできます。

```kotlin
enum class Bit {
    ZERO, ONE
}

val numericValue = when (getRandomBit()) {
    // すべてのケースがカバーされているため、elseブランチは必要ありません
    Bit.ZERO -> 0
    Bit.ONE -> 1
}
```

`when`式にサブジェクトが**ない**場合、**必ず**`else`ブランチが必要です。そうでない場合、コンパイラはエラーをスローします。`else`ブランチは、他のどのブランチ条件も満たされない場合に評価されます。

```kotlin
val message = when {
    a > b -> "a is greater than b"
    a < b -> "a is less than b"
    else -> "a is equal to b"
}
```

`when`式とステートメントは、コードを簡素化し、複数の条件を処理し、型チェックを実行するためのさまざまな方法を提供します。

複数のケースに対して共通の動作を定義するには、カンマで条件を1行に結合します。

```kotlin
when (x) {
    0, 1 -> print("x == 0 or x == 1")
    else -> print("otherwise")
}
```

ブランチ条件として、任意の式（定数だけでなく）を使用できます。

```kotlin
when (x) {
    s.toInt() -> print("s encodes x")
    else -> print("s does not encode x")
}
```

また、`in`または`!in`キーワードを使用して、値が[範囲](ranges.md)またはコレクションに含まれているかいないかをチェックできます。

```kotlin
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}
```

さらに、`is`または`!is`キーワードを使用して、値が特定の型であるか、またはそうでないかをチェックできます。なお、[スマートキャスト](typecasts.md#smart-casts)により、追加のチェックなしにその型のメンバー関数やプロパティにアクセスできます。

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}
```

`when`は、`if`-`else` `if`チェーンの代替として使用できます。
サブジェクトがない場合、ブランチ条件は単純なブール式になります。`true`となる最初のブランチが実行されます。

```kotlin
when {
    x.isOdd() -> print("x is odd")
    y.isEven() -> print("y is even")
    else -> print("x+y is odd")
}
```

以下の構文を使用して、サブジェクトを変数にキャプチャできます。

```kotlin
fun Request.getBody() =
    when (val response = executeRequest()) {
        is Success -> response.body
        is HttpError -> throw HttpException(response.status)
    }
```

サブジェクトとして導入された変数のスコープは、`when`式またはステートメントの本体に限定されます。

### `when`式におけるガード条件

> ガード条件は、[実験的な機能](components-stability.md#stability-levels-explained)であり、いつでも変更される可能性があります。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-71140/Guard-conditions-in-when-expressions-feedback)でフィードバックをいただけると幸いです。
>
{style="warning"}

ガード条件を使用すると、`when`式のブランチに複数の条件を含めることができ、複雑な制御フローをより明示的かつ簡潔に記述できます。
ガード条件は、サブジェクト付きの`when`式またはステートメントで使用できます。

ブランチにガード条件を含めるには、主要な条件の後に`if`で区切って配置します。

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal
    data class Dog(val breed: String) : Animal
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // 主要な条件のみのブランチ。`animal`が`Dog`の場合に`feedDog()`を呼び出します
        is Animal.Dog -> feedDog()
        // 主要な条件とガード条件の両方を持つブランチ。`animal`が`Cat`で`mouseHunter`ではない場合に`feedCat()`を呼び出します
        is Animal.Cat if !animal.mouseHunter -> feedCat()
        // 上記のどの条件にも一致しない場合に「Unknown animal」と出力します
        else -> println("Unknown animal")
    }
}
```

単一の`when`式内で、ガード条件を持つブランチと持たないブランチを組み合わせることができます。
ガード条件を持つブランチ内のコードは、主要な条件とガード条件の両方が`true`と評価された場合にのみ実行されます。
主要な条件が一致しない場合、ガード条件は評価されません。

`else`ブランチなしで`when`ステートメントでガード条件を使用し、どの条件も一致しない場合、どのブランチも実行されません。

そうでない場合、`else`ブランチなしで`when`式でガード条件を使用する場合、コンパイラはランタイムエラーを避けるためにすべての可能なケースを宣言することを要求します。

さらに、ガード条件は`else if`をサポートします。

```kotlin
when (animal) {
    // `animal`が`Dog`であるかをチェックします
    is Animal.Dog -> feedDog()
    // `animal`が`Cat`で`mouseHunter`ではないかをチェックするガード条件
    is Animal.Cat if !animal.mouseHunter -> feedCat()
    // 上記のどの条件にも一致せず、かつ`animal.eatsPlants`がtrueの場合に`giveLettuce()`を呼び出します
    else if animal.eatsPlants -> giveLettuce()
    // 上記のどの条件にも一致しない場合に「Unknown animal」と出力します
    else -> println("Unknown animal")
}
```

単一のブランチ内で複数のガード条件を組み合わせるには、論理演算子`&&` (AND) または`||` (OR) を使用します。
論理式の周りに丸括弧を使用して、[混乱を避けてください](coding-conventions.md#guard-conditions-in-when-expression)。

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) -> feedCat()
}
```

カンマで区切られた複数の条件を持つ場合を除き、ガード条件はサブジェクトを持つ任意の`when`式またはステートメントで使用できます。
例:`0, 1 -> print("x == 0 or x == 1")`。

> CLIでガード条件を有効にするには、次のコマンドを実行します。
>
> `kotlinc -Xwhen-guards main.kt`
>
> Gradleでガード条件を有効にするには、`build.gradle.kts`ファイルに次の行を追加します。
>
> `kotlin.compilerOptions.freeCompilerArgs.add("-Xwhen-guards")`
>
{style="note"}

## `for` ループ

`for`ループは、イテレータを提供するあらゆるものを反復処理します。これは、C#などの言語における`foreach`ループに相当します。
`for`の構文は次のとおりです。

```kotlin
for (item in collection) print(item)
```

`for`の本体はブロックにできます。

```kotlin
for (item: Int in ints) {
    // ...
}
```

前述のとおり、`for`はイテレータを提供するあらゆるものを反復処理します。これは、次のことを意味します。

*   `Iterator<>`を返すメンバー関数または拡張関数`iterator()`を持つこと。
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

範囲または配列に対する`for`ループは、イテレータオブジェクトを作成しないインデックスベースのループにコンパイルされます。

インデックス付きで配列やリストを反復処理したい場合は、次の方法で行うことができます。

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

## `while` ループ

`while`ループと`do-while`ループは、条件が満たされている間、本体を継続的に処理します。
両者の違いは、条件チェックのタイミングです。
*   `while`は条件をチェックし、満たされていれば本体を処理し、その後条件チェックに戻ります。
*   `do-while`は本体を処理してから条件をチェックします。満たされていればループが繰り返されます。したがって、`do-while`の本体は条件にかかわらず少なくとも1回は実行されます。

```kotlin
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // y is visible here!
```

## ループにおける`break`と`continue`

Kotlinは、ループにおける従来の`break`および`continue`演算子をサポートしています。[Returns and jumps](returns.md)を参照してください。