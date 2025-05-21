---
title: コレクション
---
<no-index/>
:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">Basic types（基本型）</a><br />
        <img src="/img/icon-3.svg" width="20" alt="Third step" /> <strong>コレクション</strong><br />
        <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">Control flow（制御フロー）</a><br />
        <img src="/img/icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">Functions（関数）</a><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">Classes（クラス）</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null safety（Null安全性）</a>
</p>

:::

プログラミングにおいて、データを構造化して後で処理できるようにグループ化できると便利です。Kotlinはまさにこの目的のためにコレクションを提供します。

Kotlinには、アイテムをグループ化するための次のコレクションがあります。

| **コレクション型** | **説明**                                                                |
|---------------------|-------------------------------------------------------------------------|
| リスト              | アイテムの順序付きコレクション                                           |
| セット              | アイテムの一意な順序なしコレクション                                     |
| マップ              | キーと値のペアのセット。キーは一意で、1つの値にのみマップされます       |

各コレクション型は、変更可能または読み取り専用にできます。

## リスト

リストは、アイテムが追加された順に格納し、重複するアイテムを許可します。

読み取り専用リスト（[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/)）を作成するには、
[`listOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html)関数を使用します。

変更可能なリスト（[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list.html)）を作成するには、
[`mutableListOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html)関数を使用します。

リストを作成する場合、Kotlinは格納されているアイテムの型を推測できます。型を明示的に宣言するには、リストの宣言の後に山かっこ`<>`内に型を追加します。

```kotlin
fun main() { 

    // Read only list
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println(readOnlyShapes)
    // [triangle, square, circle]
    
    // Mutable list with explicit type declaration
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    println(shapes)
    // [triangle, square, circle]

}
```

:::note
不要な変更を防ぐために、変更可能なリストの読み取り専用ビューを作成するには、それを`List`に割り当てます。

```kotlin
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    val shapesLocked: List<String> = shapes
```
これは**キャスティング**とも呼ばれます。

リストは順序付けられているため、リスト内のアイテムにアクセスするには、[インデックス付きアクセス演算子](operator-overloading#indexed-access-operator)`[]`を使用します。

```kotlin
fun main() { 

    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("The first item in the list is: ${readOnlyShapes[0]}")
    // The first item in the list is: triangle

}
```

リスト内の最初または最後のアイテムを取得するには、[`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)
関数と[`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)関数をそれぞれ使用します。

```kotlin
fun main() { 

    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("The first item in the list is: ${readOnlyShapes.first()}")
    // The first item in the list is: triangle

}
```

[`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)と[`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)
関数は、**拡張**関数の例です。オブジェクトで拡張関数を呼び出すには、オブジェクトの後にピリオド`.`を付けて関数名を記述します。

拡張関数の詳細については、[拡張関数](extensions#extension-functions)を参照してください。
このツアーの目的では、それらを呼び出す方法を知っておくだけで十分です。

:::

リスト内のアイテムの数を取得するには、[`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)
関数を使用します。

```kotlin
fun main() { 

    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("This list has ${readOnlyShapes.count()} items")
    // This list has 3 items

}
```

アイテムがリストにあることを確認するには、[`in`演算子](operator-overloading#in-operator)を使用します。

```kotlin
fun main() {

    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("circle" in readOnlyShapes)
    // true

}
```

変更可能なリストからアイテムを追加または削除するには、[`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html)
関数と[`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html)関数をそれぞれ使用します。

```kotlin
fun main() { 

    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    // Add "pentagon" to the list
    shapes.add("pentagon") 
    println(shapes)  
    // [triangle, square, circle, pentagon]

    // Remove the first "pentagon" from the list
    shapes.remove("pentagon") 
    println(shapes)  
    // [triangle, square, circle]

}
```

## セット

リストは順序付けられており、重複するアイテムを許可しますが、セットは**順序付けられておらず**、**一意の**アイテムのみを格納します。

読み取り専用セット（[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/)）を作成するには、
[`setOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html)関数を使用します。

変更可能なセット（[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/)）を作成するには、
[`mutableSetOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html)関数を使用します。

セットを作成する場合、Kotlinは格納されているアイテムの型を推測できます。型を明示的に宣言するには、セットの宣言の後に山かっこ`<>`内に型を追加します。

```kotlin
fun main() {

    // Read-only set
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    // Mutable set with explicit type declaration
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    
    println(readOnlyFruit)
    // [apple, banana, cherry]

}
```

前の例からわかるように、セットには一意の要素のみが含まれているため、重複する`"cherry"`アイテムは削除されます。

:::note
不要な変更を防ぐために、変更可能なセットの読み取り専用ビューを作成するには、それを`Set`に割り当てます。

```kotlin
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    val fruitLocked: Set<String> = fruit
```

セットは**順序付けられていない**ため、特定のインデックスでアイテムにアクセスすることはできません。

:::

セット内のアイテムの数を取得するには、[`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)
関数を使用します。

```kotlin
fun main() { 

    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("This set has ${readOnlyFruit.count()} items")
    // This set has 3 items

}
```

アイテムがセットにあることを確認するには、[`in`演算子](operator-overloading#in-operator)を使用します。

```kotlin
fun main() {

    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("banana" in readOnlyFruit)
    // true

}
```

変更可能なセットからアイテムを追加または削除するには、[`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/add.html)
関数と[`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html)関数をそれぞれ使用します。

```kotlin
fun main() { 

    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    fruit.add("dragonfruit")    // Add "dragonfruit" to the set
    println(fruit)              // [apple, banana, cherry, dragonfruit]
    
    fruit.remove("dragonfruit") // Remove "dragonfruit" from the set
    println(fruit)              // [apple, banana, cherry]

}
```

## マップ

マップは、アイテムをキーと値のペアとして格納します。キーを参照して値にアクセスします。マップは、フードメニューのように想像できます。
食べたい料理（キー）を見つけることで、価格（値）を見つけることができます。マップは、リストのように番号付きのインデックスを使用せずに値を検索する場合に役立ちます。

:::note
* マップ内のすべてのキーは一意である必要があります。これにより、Kotlinは取得したい値を理解できます。
* マップに重複する値を含めることができます。

:::

読み取り専用マップ（[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/)）を作成するには、
[`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html)関数を使用します。

変更可能なマップ（[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/)）を作成するには、
[`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html)関数を使用します。

マップを作成する場合、Kotlinは格納されているアイテムの型を推測できます。型を明示的に宣言するには、マップの宣言の後に山かっこ`<>`内にキーと値の型を追加します。たとえば、`MutableMap<String, Int>`です。
キーの型は`String`で、値の型は`Int`です。

マップを作成する最も簡単な方法は、各キーとその関連する値の間に[`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html)を使用することです。

```kotlin
fun main() {

    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu)
    // {apple=100, kiwi=190, orange=100}

    // Mutable map with explicit type declaration
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100}

}
```

:::note
不要な変更を防ぐために、変更可能なマップの読み取り専用ビューを作成するには、それを`Map`に割り当てます。

```kotlin
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    val juiceMenuLocked: Map<String, Int> = juiceMenu
```

マップ内の値にアクセスするには、キーとともに[インデックス付きアクセス演算子](operator-overloading#indexed-access-operator)`[]`を使用します。

```kotlin
fun main() {

    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("The value of apple juice is: ${readOnlyJuiceMenu["apple"]}")
    // The value of apple juice is: 100

}
```

マップに存在しないキーでキーと値のペアにアクセスしようとすると、`null`値が表示されます。

```kotlin
fun main() {

    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("The value of pineapple juice is: ${readOnlyJuiceMenu["pineapple"]}")
    // The value of pineapple juice is: null

}
```

このツアーでは、[Null安全性](kotlin-tour-null-safety)の章でnull値を後で説明します。

:::

[インデックス付きアクセス演算子](operator-overloading#indexed-access-operator)`[]`を使用して、変更可能なマップにアイテムを追加することもできます。

```kotlin
fun main() {

    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu["coconut"] = 150 // Add key "coconut" with value 150 to the map
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100, coconut=150}

}
```

変更可能なマップからアイテムを削除するには、[`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html)
関数を使用します。

```kotlin
fun main() {

    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu.remove("orange")    // Remove key "orange" from the map
    println(juiceMenu)
    // {apple=100, kiwi=190}

}
```

マップ内のアイテムの数を取得するには、[`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)
関数を使用します。

```kotlin
fun main() {

    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("This map has ${readOnlyJuiceMenu.count()} key-value pairs")
    // This map has 3 key-value pairs

}
```

特定のキーがマップにすでに含まれているかどうかを確認するには、[`.containsKey()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-key.html)
関数を使用します。

```kotlin
fun main() {

    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.containsKey("kiwi"))
    // true

}
```

マップのキーまたは値のコレクションを取得するには、[`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html)
プロパティと[`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html)プロパティをそれぞれ使用します。

```kotlin
fun main() {

    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.keys)
    // [apple, kiwi, orange]
    println(readOnlyJuiceMenu.values)
    // [100, 190, 100]

}
```

:::note
[`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html)と[`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html)
は、オブジェクトの**プロパティ**の例です。オブジェクトのプロパティにアクセスするには、オブジェクトの後にピリオド`.`を付けてプロパティ名を記述します。

プロパティの詳細については、[クラス](kotlin-tour-classes)の章で説明します。
このツアーのこの時点では、それらにアクセスする方法を知っておくだけで十分です。

:::

キーまたは値がマップにあることを確認するには、[`in`演算子](operator-overloading#in-operator)を使用します。

```kotlin
fun main() {

    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("orange" in readOnlyJuiceMenu.keys)
    // true
    
    // Alternatively, you don't need to use the keys property
    println("orange" in readOnlyJuiceMenu)
    // true
    
    println(200 in readOnlyJuiceMenu.values)
    // false

}
```

コレクションでできることの詳細については、[コレクション](collections-overview)を参照してください。

基本型とコレクションの管理方法を理解したので、プログラムで使用できる[制御フロー](kotlin-tour-control-flow)を調べてみましょう。

## 練習

### 演習1

「緑」の数字のリストと「赤」の数字のリストがあります。コードを完成させて、合計でいくつの数字があるかを出力します。

|---|---|
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    // Write your code here
}
```

|---|---|
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    val totalCount = greenNumbers.count() + redNumbers.count()
    println(totalCount)
}
```

### 演習2

サーバーでサポートされているプロトコルのセットがあります。ユーザーが特定のプロトコルの使用をリクエストします。プログラムを完成させて、リクエストされたプロトコルがサポートされているかどうかを確認します（`isSupported`はBoolean値である必要があります）。

|---|---|
```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = // Write your code here 
    println("Support for $requested: $isSupported")
}
```

<h3>ヒント</h3>
        リクエストされたプロトコルが大文字でチェックされていることを確認してください。<a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html">`.uppercase()`</a>
関数を使用して、これを行うことができます。
    

|---|---|
```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = requested.uppercase() in SUPPORTED
    println("Support for $requested: $isSupported")
}
```

### 演習3

1から3までの整数を対応するスペルに関連付けるマップを定義します。このマップを使用して、指定された数字をスペルします。

|---|---|
```kotlin
fun main() {
    val number2word = // Write your code here
    val n = 2
    println("$n is spelt as '${<Write your code here >}'")
}
```

|---|---|
```kotlin
fun main() {
    val number2word = mapOf(1 to "one", 2 to "two", 3 to "three")
    val n = 2
    println("$n is spelt as '${number2word[n]}'")
}
```

## 次のステップ

[制御フロー](kotlin-tour-control-flow)