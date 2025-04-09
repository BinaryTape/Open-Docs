---
title: 条件分岐とループ
---
## If式

Kotlinでは、`if`は式であり、値を返します。
したがって、三項演算子（`condition ? then : else`）は存在しません。通常の`if`がこの役割を十分に果たせるからです。

```kotlin
fun main() {
    val a = 2
    val b = 3

    var max = a
    if (a < b) max = b

    // elseを使用する場合
    if (a > b) {
      max = a
    } else {
      max = b
    }

    // 式として
    max = if (a > b) a else b

    // `else if`を式で使用することもできます。
    val maxLimit = 1
    val maxOrLimit = if (maxLimit > a) maxLimit else if (a > b) a else b
  
    println("max is $max")
    // max is 3
    println("maxOrLimit is $maxOrLimit")
    // maxOrLimit is 3

}
```

`if`式の分岐はブロックにすることができます。この場合、最後の式がブロックの値になります。

```kotlin
val max = if (a > b) {
    print("Choose a")
    a
} else {
    print("Choose b")
    b
}
```

`if`を式として使用する場合（たとえば、その値を返したり、変数に代入したりする場合）、`else`分岐は必須です。

## When式と文

`when`は、複数の取りうる値または条件に基づいてコードを実行する条件式です。これは、Java、C、および同様の言語の`switch`文に似ています。例：

```kotlin
fun main() {

    val x = 2
    when (x) {
        1 `->` print("x == 1")
        2 `->` print("x == 2")
        else `->` print("x is neither 1 nor 2")
    }
    // x == 2

}
```

`when`は、いくつかの分岐条件が満たされるまで、引数をすべての分岐と順番に照合します。

`when`にはいくつかの異なる使い方があります。まず、`when`は**式**または**文**として使用できます。式として、`when`はコードで後で使用するために値を返します。文として、`when`はそれ以上の使用のために何も返さずにアクションを完了します。
<table>
<tr>
<td>
式
</td>
<td>
文
</td>
</tr>
<tr>
<td>

```kotlin
// 文字列を返し、
// text変数に代入します
val text = when (x) {
    1 `->` "x == 1"
    2 `->` "x == 2"
    else `->` "x is neither 1 nor 2"
}
```
</td>
<td>

```kotlin
// 何も返しませんが、
// print文をトリガーします
when (x) {
    1 `->` print("x == 1")
    2 `->` print("x == 2")
    else `->` print("x is neither 1 nor 2")
}
```
</td>
</tr>
</table>

次に、`when`はサブジェクトの有無にかかわらず使用できます。`when`でサブジェクトを使用するかどうかにかかわらず、式または文の動作は同じです。チェックしている内容を明確に示すことで、コードを読みやすく、保守しやすくするために、可能な場合はサブジェクトとともに`when`を使用することをお勧めします。
<table>
<tr>
<td>
サブジェクト`x`あり
</td>
<td>
サブジェクトなし
</td>
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

`when`の使用方法によっては、分岐ですべての場合を網羅する必要があるかどうかに異なる要件があります。

`when`を文として使用する場合、すべての可能なケースを網羅する必要はありません。この例では、一部のケースがカバーされていないため、何も起こりません。ただし、エラーは発生しません。

```kotlin
fun main() {

    val x = 3
    when (x) {
        // すべてのケースがカバーされているわけではありません
        1 `->` print("x == 1")
        2 `->` print("x == 2")
    }

}
```

`when`文では、個々の分岐の値は無視されます。`if`と同様に、各分岐はブロックにすることができ、その値はブロック内の最後の式の値です。

`when`を式として使用する場合は、すべての可能なケースを網羅する必要があります。言い換えれば、_網羅的_でなければなりません。最初に一致する分岐の値が、式全体の値になります。すべてのケースをカバーしない場合、コンパイラーはエラーをスローします。

`when`式にサブジェクトがある場合、`else`分岐を使用して、すべての可能なケースがカバーされていることを確認できますが、必須ではありません。たとえば、サブジェクトが`Boolean`、[`enum` class](enum-classes)、[`sealed` class](sealed-classes)、またはそれらのnullableな counterpartsのいずれかである場合、`else`分岐なしですべてのケースをカバーできます。

```kotlin
enum class Bit {
    ZERO, ONE
}

val numericValue = when (getRandomBit()) {
  // すべてのケースがカバーされているため、else分岐は不要です
    Bit.ZERO `->` 0
    Bit.ONE `->` 1
}
```

`when`式にサブジェクトが**ない**場合、**必ず** `else`分岐が必要です。そうでない場合、コンパイラーはエラーをスローします。`else`分岐は、他のどの分岐条件も満たされない場合に評価されます。

```kotlin
when {
    a > b `->` "a is greater than b"
    a < b `->` "a is less than b"
    else `->` "a is equal to b"
}
```

`when`式と文は、コードを簡素化し、複数の条件を処理し、型のチェックを実行するためのさまざまな方法を提供します。

コンマで区切って複数のケースの条件を1行に結合することで、複数のケースに共通の動作を定義できます。

```kotlin
when (x) {
    0, 1 `->` print("x == 0 or x == 1")
    else `->` print("otherwise")
}
```

任意の式（定数だけでなく）を分岐条件として使用できます。

```kotlin
when (x) {
    s.toInt() `->` print("s encodes x")
    else `->` print("s does not encode x")
}
```

また、`in`または`!in`キーワードを使用して、値が[範囲](ranges)またはコレクションに含まれているかどうかを確認することもできます。

```kotlin
when (x) {
    in 1..10 `->` print("x is in the range")
    in validNumbers `->` print("x is valid")
    !in 10..20 `->` print("x is outside the range")
    else `->` print("none of the above")
}
```

さらに、`is`または`!is`キーワードを使用して、値が特定の型であるかどうかを確認できます。
[スマートキャスト](typecasts#smart-casts)により、追加のチェックなしで、型のメンバー関数とプロパティにアクセスできます。

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String `->` x.startsWith("prefix")
    else `->` false
}
```

`when`を`if`-`else` `if`チェーンの代わりに使用できます。
サブジェクトがない場合、分岐条件は単にブール式です。`true`条件を持つ最初の分岐が実行されます。

```kotlin
when {
    x.isOdd() `->` print("x is odd")
    y.isEven() `->` print("y is even")
    else `->` print("x+y is odd")
}
```

次の構文を使用して、サブジェクトを変数にキャプチャできます。

```kotlin
fun Request.getBody() =
    when (val response = executeRequest()) {
        is Success `->` response.body
        is HttpError `->` throw HttpException(response.status)
    }
```

サブジェクトとして導入された変数のスコープは、`when`式または文の本体に限定されます。

### when式におけるガード条件

:::note
ガード条件は、いつでも変更される可能性がある[実験的な機能](components-stability#stability-levels-explained)です。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-71140/Guard-conditions-in-when-expressions-feedback)でフィードバックをお寄せいただければ幸いです。

ガード条件を使用すると、`when`式の分岐に複数の条件を含めることができ、複雑な制御フローをより明示的かつ簡潔にすることができます。
サブジェクトを持つ`when`式または文でガード条件を使用できます。

分岐にガード条件を含めるには、プライマリ条件の後に`if`で区切って配置します。

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal
    data class Dog(val breed: String) : Animal
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // プライマリ条件のみを持つ分岐。`Animal`が`Dog`の場合、`feedDog()`を呼び出します。
        is Animal.Dog `->` feedDog()
        // プライマリ条件とガード条件の両方を持つ分岐。`Animal`が`Cat`で、`mouseHunter`でない場合、`feedCat()`を呼び出します。
        is Animal.Cat if !animal.mouseHunter `->` feedCat()
        // 上記の条件のいずれにも一致しない場合、「Unknown animal」を出力します
        else `->` println("Unknown animal")
    }
}
```

単一の`when`式では、ガード条件の有無にかかわらず分岐を組み合わせることができます。
ガード条件付きの分岐内のコードは、プライマリ条件とガード条件の両方がtrueと評価された場合にのみ実行されます。
プライマリ条件が一致しない場合、ガード条件は評価されません。

`else`分岐のない`when`文でガード条件を使用し、いずれの条件も一致しない場合、どの分岐も実行されません。

それ以外の場合、`else`分岐のない`when`式でガード条件を使用すると、ランタイムエラーを回避するために、コンパイラーはすべての可能なケースを宣言するように要求します。

さらに、ガード条件は`else if`をサポートします。

```kotlin
when (animal) {
    // `animal`が`Dog`かどうかを確認します
    is Animal.Dog `->` feedDog()
    // `animal`が`Cat`で、`mouseHunter`でないかどうかを確認するガード条件
    is Animal.Cat if !animal.mouseHunter `->` feedCat()
    // 上記の条件のいずれにも一致せず、animal.eatsPlantsがtrueの場合、giveLettuce()を呼び出します
    else if animal.eatsPlants `->` giveLettuce()
    // 上記の条件のいずれにも一致しない場合、「Unknown animal」を出力します
    else `->` println("Unknown animal")
}
```

ブール演算子`&&`（AND）または`||`（OR）を使用して、単一の分岐内で複数のガード条件を結合します。
[混乱を避ける](coding-conventions#guard-conditions-in-when-expression)ために、ブール式の周りに括弧を使用します。

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) `->` feedCat()
}
```

コンマで区切られた複数の条件がある場合を除き、サブジェクトを持つ任意の`when`式または文でガード条件を使用できます。
たとえば、`0, 1 `->` print("x == 0 or x == 1")`。

CLIでガード条件を有効にするには、次のコマンドを実行します。

`kotlinc -Xwhen-guards main.kt`

Gradleでガード条件を有効にするには、次の行を`build.gradle.kts`ファイルに追加します。

`kotlin.compilerOptions.freeCompilerArgs.add("-Xwhen-guards")`

:::

## Forループ

`for`ループは、イテレーターを提供するすべてのものを反復処理します。これは、C#などの言語の`foreach`ループと同等です。
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

前に述べたように、`for`はイテレーターを提供するすべてのものを反復処理します。これは、次のことを意味します。

* メンバー関数または拡張関数`iterator()`を持ち、`Iterator<>`を返します。
  * メンバー関数または拡張関数`next()`を持ちます
  * `Boolean`を返すメンバー関数または拡張関数`hasNext()`を持ちます。

これら3つの関数はすべて、`operator`としてマークする必要があります。

数値の範囲を反復処理するには、[範囲式](ranges)を使用します。

```kotlin
fun main() {

    for (i in 1..3) {
        print(i)
    }
    for (i in 6 downTo 0 step 2) {
        print(i)
    }
    // 1236420

}
```

範囲または配列に対する`for`ループは、イテレーターオブジェクトを作成しないインデックスベースのループにコンパイルされます。

インデックスを使用して配列またはリストを反復処理する場合は、次の方法で実行できます。

```kotlin
fun main() {
val array = arrayOf("a", "b", "c")

    for (i in array.indices) {
        print(array[i])
    }
    // abc

}
```

または、`withIndex`ライブラリ関数を使用することもできます。

```kotlin
fun main() {
    val array = arrayOf("a", "b", "c")

    for ((index, value) in array.withIndex()) {
        println("the element at $index is $value")
    }
    // the element at 0 is a
    // the element at 1 is b
    // the element at 2 is c

}
```

## Whileループ

`while`および`do-while`ループは、条件が満たされている間、本体を継続的に処理します。
それらの違いは、条件チェックのタイミングです。
* `while`は条件をチェックし、満たされている場合は本体を処理し、条件チェックに戻ります。
* `do-while`は本体を処理してから、条件をチェックします。満たされている場合、ループが繰り返されます。したがって、`do-while`の本体は、条件に関係なく少なくとも1回は実行されます。

```kotlin
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // y is visible here!
```

## ループ内のBreakとContinue

Kotlinは、ループで従来の`break`および`continue`演算子をサポートしています。[Returns and jumps](returns)を参照してください。