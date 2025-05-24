---
title: マップ固有の操作
---
[maps](collections-overview#map)では、キーと値の型はどちらもユーザー定義です。
マップのエントリへのキーベースのアクセスにより、キーによる値の取得からキーと値の個別の
フィルタリングまで、さまざまなマップ固有の処理機能が実現します。
このページでは、標準ライブラリのマップ処理関数について説明します。

## キーと値の取得

マップから値を取得するには、[`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/get.html)関数の引数としてキーを指定する必要があります。
短縮形の`[key]`構文もサポートされています。指定されたキーが見つからない場合は、`null`を返します。
わずかに異なる動作をする関数[`getValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-value.html)もあります。
これは、マップにキーが見つからない場合に例外をスローします。
さらに、キーが存在しない場合の処理には、次の2つのオプションがあります。

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html)は、リストの場合と同じように動作します。存在しないキーの値は、指定されたラムダ関数から返されます。
* [`getOrDefault()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-default.html)は、キーが見つからない場合に指定されたデフォルト値を返します。

```kotlin

fun main() {

    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.get("one"))
    println(numbersMap["one"])
    println(numbersMap.getOrDefault("four", 10))
    println(numbersMap["five"])               // null
    //numbersMap.getValue("six")      // exception!

}
```

マップのすべてのキーまたはすべての値に対して操作を実行するには、プロパティ`keys`および`values`からそれぞれ取得できます。
`keys`はすべてのマップキーのセットであり、`values`はすべてのマップ値のコレクションです。

```kotlin

fun main() {

    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.keys)
    println(numbersMap.values)

}
```

## フィルタ

他のコレクションと同様に、[`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)関数を使用してマップを[フィルタ](collection-filtering)できます。
マップで`filter()`を呼び出す場合は、引数として`Pair`を持つ述語を渡します。
これにより、フィルタリング述語でキーと値の両方を使用できます。

```kotlin

fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numbersMap.filter { (key, value) `->` key.endsWith("1") && value > 10}
    println(filteredMap)

}
```

マップをフィルタリングするための2つの特定の方法もあります。キーによる方法と値による方法です。
それぞれの方法には、関数[`filterKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-keys.html)と[`filterValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-values.html)があります。
どちらも、指定された述語に一致するエントリの新しいマップを返します。
`filterKeys()`の述語は要素キーのみをチェックし、`filterValues()`の述語は値のみをチェックします。

```kotlin

fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredKeysMap = numbersMap.filterKeys { it.endsWith("1") }
    val filteredValuesMap = numbersMap.filterValues { it < 10 }

    println(filteredKeysMap)
    println(filteredValuesMap)

}
```

## プラスおよびマイナス演算子

要素へのキーアクセスにより、[`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`)および[`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html)
(`-`)演算子は、他のコレクションとは異なる方法でマップに対して機能します。
`plus`は、両方のオペランドの要素を含む`Map`を返します。左側の`Map`と右側の`Pair`または別の`Map`です。
右側のオペランドに左側の`Map`に存在するキーを持つエントリが含まれている場合、結果のマップには右側のエントリが含まれます。

```kotlin

fun main() {

    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap + Pair("four", 4))
    println(numbersMap + Pair("one", 10))
    println(numbersMap + mapOf("five" to 5, "one" to 11))

}
```

`minus`は、右側のオペランドからのキーを持つものを除く、左側の`Map`のエントリから`Map`を作成します。
したがって、右側のオペランドは、単一のキーまたはキーのコレクション（リスト、セットなど）のいずれかになります。

```kotlin

fun main() {

    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap - "one")
    println(numbersMap - listOf("two", "four"))

}
```

[`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`)および[`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html)
(`-=`)演算子の可変マップでの使用の詳細については、以下の[マップ書き込み操作](#map-write-operations)を参照してください。

## マップ書き込み操作

[Mutable](collections-overview#collection-types)マップは、マップ固有の書き込み操作を提供します。
これらの操作を使用すると、値へのキーベースのアクセスを使用してマップの内容を変更できます。

マップに対する書き込み操作を定義する特定のルールがあります。

* 値は更新できます。順番に、キーは決して変更されません。エントリを追加すると、そのキーは定数になります。
* 各キーには、常に単一の値が関連付けられています。エントリ全体を追加および削除できます。

以下は、可変マップで使用可能な書き込み操作用の標準ライブラリ関数の説明です。

### エントリの追加と更新

新しいキーと値のペアを可変マップに追加するには、[`put()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/put.html)を使用します。
新しいエントリが`LinkedHashMap`（デフォルトのマップ実装）に入力されると、マップを反復処理するときに最後になるように追加されます。ソートされたマップでは、新しい要素の位置はキーの順序によって定義されます。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    println(numbersMap)

}
```

一度に複数のエントリを追加するには、[`putAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/put-all.html)を使用します。
その引数は、`Map`または`Pair`のグループ（`Iterable`、`Sequence`、または`Array`）にすることができます。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.putAll(setOf("four" to 4, "five" to 5))
    println(numbersMap)

}
```

`put()`と`putAll()`は両方とも、指定されたキーがマップに既に存在する場合に値を上書きします。したがって、マップエントリの値を更新するために使用できます。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    val previousValue = numbersMap.put("one", 11)
    println("value associated with 'one', before: $previousValue, after: ${numbersMap["one"]}")
    println(numbersMap)

}
```

短縮演算子形式を使用して、マップに新しいエントリを追加することもできます。次の2つの方法があります。

* [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`)演算子。
* `set()`の`[]`演算子エイリアス。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap["three"] = 3     // calls numbersMap.put("three", 3)
    numbersMap += mapOf("four" to 4, "five" to 5)
    println(numbersMap)

}
```

マップに存在するキーで呼び出されると、演算子は対応するエントリの値を上書きします。

### エントリの削除

可変マップからエントリを削除するには、[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/remove.html)関数を使用します。
`remove()`を呼び出すときは、キーまたはキーと値のペア全体を渡すことができます。
キーと値の両方を指定した場合、値が2番目の引数と一致する場合にのみ、このキーを持つ要素が削除されます。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.remove("one")
    println(numbersMap)
    numbersMap.remove("three", 4)            //doesn't remove anything
    println(numbersMap)

}
```

キーまたは値で可変マップからエントリを削除することもできます。
これを行うには、エントリのキーまたは値を指定して、マップのキーまたは値で`remove()`を呼び出します。
値で呼び出されると、`remove()`は指定された値を持つ最初のエントリのみを削除します。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3, "threeAgain" to 3)
    numbersMap.keys.remove("one")
    println(numbersMap)
    numbersMap.values.remove(3)
    println(numbersMap)

}
```

[`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`)演算子も
可変マップで使用できます。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap -= "two"
    println(numbersMap)
    numbersMap -= "five"             //doesn't remove anything
    println(numbersMap)

}
```