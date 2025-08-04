[//]: # (title: コレクション)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">Basic types</a><br />
        <img src="icon-3.svg" width="20" alt="Third step" /> <strong>コレクション</strong><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">制御フロー</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">関数</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">クラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">Null安全性</a></p>
</tldr>

プログラミングにおいて、後で処理するためにデータを構造にグループ化できると便利です。Kotlinはまさにこの目的のためにコレクションを提供します。

Kotlinには、アイテムをグループ化するための以下のコレクションがあります。

| **コレクションの型** | **説明**                                                         |
|---------------------|-------------------------------------------------------------------------|
| リスト               | 順序付けられたアイテムのコレクション                                            |
| セット                | ユニークで順序付けられていないアイテムのコレクション                                   |
| マップ                | キーがユニークで、それぞれが1つの値にマップされるキーと値のペアのセット |

各コレクションの型は、可変（ミュータブル）または読み取り専用（リードオンリー）にすることができます。

## リスト

リストは、アイテムを追加した順序で格納し、重複したアイテムを許可します。

読み取り専用リスト（[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/)）を作成するには、[`listOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html)関数を使用します。

可変リスト（[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list.html)）を作成するには、[`mutableListOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html)関数を使用します。

リストを作成する際、Kotlinは格納されるアイテムの型を推論できます。型を明示的に宣言するには、リスト宣言の後に山括弧`<>`内に型を追加します。

```kotlin
fun main() {
//sampleStart
    // Read only list
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println(readOnlyShapes)
    // [triangle, square, circle]

    // Mutable list with explicit type declaration
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    println(shapes)
    // [triangle, square, circle]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lists-declaration"}

> 意図しない変更を防ぐため、可変リストを`List`に割り当てることで、読み取り専用のビューを作成できます。
>
> ```kotlin
>     val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
>     val shapesLocked: List<String> = shapes
> ```
> これは**キャスティング**とも呼ばれます。
>
{style="tip"}

リストは順序付けされているため、リスト内のアイテムにアクセスするには、[インデックスアクセス演算子](operator-overloading.md#indexed-access-operator)`[]`を使用します。

```kotlin
fun main() {
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("The first item in the list is: ${readOnlyShapes[0]}")
    // The first item in the list is: triangle
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-access"}

リストの最初または最後のアイテムを取得するには、それぞれ[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)関数と[`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)関数を使用します。

```kotlin
fun main() {
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("The first item in the list is: ${readOnlyShapes.first()}")
    // The first item in the list is: triangle
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-first"}

> [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)関数と[`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)関数は**拡張関数**の例です。オブジェクトに対して拡張関数を呼び出すには、オブジェクトの後にピリオド`.`を付けて関数名を記述します。
>
> 拡張関数は[中級ツアー](kotlin-tour-intermediate-extension-functions.md#extension-functions)で詳しく説明されています。現時点では、その呼び出し方を知っているだけで十分です。
>
{style="note"}

リスト内のアイテム数を取得するには、[`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)関数を使用します。

```kotlin
fun main() {
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("This list has ${readOnlyShapes.count()} items")
    // This list has 3 items
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-count"}

アイテムがリスト内にあるかを確認するには、[`in`演算子](operator-overloading.md#in-operator)を使用します。

```kotlin
fun main() {
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("circle" in readOnlyShapes)
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-in"}

可変リストにアイテムを追加または削除するには、それぞれ[`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html)関数と[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html)関数を使用します。

```kotlin
fun main() {
//sampleStart
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    // Add "pentagon" to the list
    shapes.add("pentagon")
    println(shapes)
    // [triangle, square, circle, pentagon]

    // Remove the first "pentagon" from the list
    shapes.remove("pentagon")
    println(shapes)
    // [triangle, square, circle]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-add-remove"}

## セット

リストが順序付けされ重複アイテムを許可するのに対し、セットは**順序付けされておらず**、**ユニークな**アイテムのみを格納します。

読み取り専用セット（[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/)）を作成するには、[`setOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html)関数を使用します。

可変セット（[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/)）を作成するには、[`mutableSetOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html)関数を使用します。

セットを作成する際、Kotlinは格納されるアイテムの型を推論できます。型を明示的に宣言するには、セット宣言の後に山括弧`<>`内に型を追加します。

```kotlin
fun main() {
//sampleStart
    // Read-only set
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    // Mutable set with explicit type declaration
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")

    println(readOnlyFruit)
    // [apple, banana, cherry]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-sets-declaration"}

前の例でわかるように、セットはユニークな要素のみを含むため、重複した`"cherry"`アイテムは破棄されます。

> 意図しない変更を防ぐため、可変セットを`Set`に割り当てることで、読み取り専用のビューを作成できます。
>
> ```kotlin
>     val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
>     val fruitLocked: Set<String> = fruit
> ```
>
{style="tip"}

> セットは**順序付けされていない**ため、特定のインデックスにあるアイテムにアクセスすることはできません。
>
{style="note"}

セット内のアイテム数を取得するには、[`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)関数を使用します。

```kotlin
fun main() {
//sampleStart
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("This set has ${readOnlyFruit.count()} items")
    // This set has 3 items
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-set-count"}

アイテムがセット内にあるかを確認するには、[`in`演算子](operator-overloading.md#in-operator)を使用します。

```kotlin
fun main() {
//sampleStart
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("banana" in readOnlyFruit)
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-set-in"}

可変セットにアイテムを追加または削除するには、それぞれ[`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/add.html)関数と[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html)関数を使用します。

```kotlin
fun main() {
//sampleStart
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    fruit.add("dragonfruit")    // Add "dragonfruit" to the set
    println(fruit)              // [apple, banana, cherry, dragonfruit]

    fruit.remove("dragonfruit") // Remove "dragonfruit" from the set
    println(fruit)              // [apple, banana, cherry]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-set-add-remove"}

## マップ

マップはアイテムをキーと値のペアとして格納します。キーを参照することで値にアクセスします。マップはフードメニューのようなものだと想像できます。食べたい料理（キー）を見つけることで、その価格（値）を見つけることができます。マップは、リストのように番号付きインデックスを使用せずに値を検索したい場合に便利です。

> * マップ内のすべてのキーは、Kotlinがどの値を取得したいかを理解できるようにユニークでなければなりません。
> * マップには重複した値を含めることができます。
>
{style="note"}

読み取り専用マップ（[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/)）を作成するには、[`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html)関数を使用します。

可変マップ（[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/)）を作成するには、[`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html)関数を使用します。

マップを作成する際、Kotlinは格納されるアイテムの型を推論できます。型を明示的に宣言するには、マップ宣言の後に山括弧`<`>`内にキーと値の型を追加します。例：`MutableMap<String, Int>`。キーは`String`型で、値は`Int`型です。

マップを作成する最も簡単な方法は、各キーとその関連する値の間に[`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html)を使用することです。

```kotlin
fun main() {
//sampleStart
    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu)
    // {apple=100, kiwi=190, orange=100}

    // Mutable map with explicit type declaration
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-maps-declaration"}

> 意図しない変更を防ぐため、可変マップを`Map`に割り当てることで、読み取り専用のビューを作成できます。
>
> ```kotlin
>     val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
>     val juiceMenuLocked: Map<String, Int> = juiceMenu
> ```
>
{style="tip"}

マップ内の値にアクセスするには、[インデックスアクセス演算子](operator-overloading.md#indexed-access-operator)`[]`とそのキーを使用します。

```kotlin
fun main() {
//sampleStart
    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("The value of apple juice is: ${readOnlyJuiceMenu["apple"]}")
    // The value of apple juice is: 100
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-access"}

> マップに存在しないキーでキーと値のペアにアクセスしようとすると、`null`値が表示されます。
>
> ```kotlin
> fun main() {
> //sampleStart
>     // Read-only map
>     val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
>     println("The value of pineapple juice is: ${readOnlyJuiceMenu["pineapple"]}")
>     // The value of pineapple juice is: null
> //sampleEnd
> }
> ```
> {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-no-key" validate="false"}
>
> このツアーでは、後で[Null安全性](kotlin-tour-null-safety.md)の章でnull値について説明します。
>
{style="note"}

[インデックスアクセス演算子](operator-overloading.md#indexed-access-operator)`[]`を使用して、可変マップにアイテムを追加することもできます。

```kotlin
fun main() {
//sampleStart
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu["coconut"] = 150 // Add key "coconut" with value 150 to the map
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100, coconut=150}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-add-item"}

可変マップからアイテムを削除するには、[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html)関数を使用します。

```kotlin
fun main() {
//sampleStart
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu.remove("orange")    // Remove key "orange" from the map
    println(juiceMenu)
    // {apple=100, kiwi=190}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-put-remove"}

マップ内のアイテム数を取得するには、[`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)関数を使用します。

```kotlin
fun main() {
//sampleStart
    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("This map has ${readOnlyJuiceMenu.count()} key-value pairs")
    // This map has 3 key-value pairs
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-count"}

特定のキーがすでにマップに含まれているかを確認するには、[`containsKey()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-key.html)関数を使用します。

```kotlin
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.containsKey("kiwi"))
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-contains-keys"}

マップのキーまたは値のコレクションを取得するには、それぞれ[`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html)プロパティと[`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html)プロパティを使用します。

```kotlin
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.keys)
    // [apple, kiwi, orange]
    println(readOnlyJuiceMenu.values)
    // [100, 190, 100]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-keys-values"}

> [`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html)と[`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html)はオブジェクトの**プロパティ**の例です。オブジェクトのプロパティにアクセスするには、オブジェクトの後にピリオド`.`を付けてプロパティ名を記述します。
>
> プロパティについては、[クラス](kotlin-tour-classes.md)の章で詳しく説明しています。このツアーのこの時点では、そのアクセス方法を知っているだけで十分です。
>
{style="note"}

キーまたは値がマップ内にあるかを確認するには、[`in`演算子](operator-overloading.md#in-operator)を使用します。

```kotlin
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("orange" in readOnlyJuiceMenu.keys)
    // true

    // Alternatively, you don't need to use the keys property
    println("orange" in readOnlyJuiceMenu)
    // true

    println(200 in readOnlyJuiceMenu.values)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-in"}

コレクションでできることの詳細については、[コレクション](collections-overview.md)を参照してください。

基本型とコレクションの管理方法を理解したところで、プログラムで使用できる[制御フロー](kotlin-tour-control-flow.md)について探る時です。

## 練習問題

### 演習 1 {initial-collapse-state="collapsed" collapsible="true"}

「緑」の数字のリストと「赤」の数字のリストがあります。すべての数字が合計でいくつあるかを出力するコードを完成させてください。

|---|---|
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-collections-exercise-1"}

|---|---|
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    val totalCount = greenNumbers.count() + redNumbers.count()
    println(totalCount)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-collections-solution-1"}

### 演習 2 {initial-collapse-state="collapsed" collapsible="true"}

サーバーがサポートするプロトコルのセットがあります。ユーザーが特定のプロトコルを使用するよう要求しました。要求されたプロトコルがサポートされているかどうかをチェックするプログラムを完成させてください（`isSupported`はBoolean値である必要があります）。

|---|---|
```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = // Write your code here
    println("Support for $requested: $isSupported")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-collections-exercise-2"}

<deflist collapsible="true" id="kotlin-tour-collections-exercise-2-hint">
    <def title="ヒント">
        要求されたプロトコルが大文字でチェックされていることを確認してください。これには[`uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html)関数を使用できます。
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = requested.uppercase() in SUPPORTED
    println("Support for $requested: $isSupported")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-collections-solution-2"}

### 演習 3 {initial-collapse-state="collapsed" collapsible="true"}

1から3までの整数を対応するスペルに関連付けるマップを定義してください。このマップを使用して、指定された数字のスペルを出力してください。

|---|---|
```kotlin
fun main() {
    val number2word = // Write your code here
    val n = 2
    println("$n is spelt as '${<Write your code here >}'")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-collections-exercise-3"}

|---|---|
```kotlin
fun main() {
    val number2word = mapOf(1 to "one", 2 to "two", 3 to "three")
    val n = 2
    println("$n is spelt as '${number2word[n]}'")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-collections-solution-3"}

## 次のステップ

[制御フロー](kotlin-tour-control-flow.md)