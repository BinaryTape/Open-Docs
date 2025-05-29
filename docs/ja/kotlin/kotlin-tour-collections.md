[//]: # (title: コレクション)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="2番目のステップ" /> <a href="kotlin-tour-basic-types.md">基本型</a><br />
        <img src="icon-3.svg" width="20" alt="3番目のステップ" /> <strong>コレクション</strong><br />
        <img src="icon-4-todo.svg" width="20" alt="4番目のステップ" /> <a href="kotlin-tour-control-flow.md">制御フロー</a><br />
        <img src="icon-5-todo.svg" width="20" alt="5番目のステップ" /> <a href="kotlin-tour-functions.md">関数</a><br />
        <img src="icon-6-todo.svg" width="20" alt="6番目のステップ" /> <a href="kotlin-tour-classes.md">クラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="最後のステップ" /> <a href="kotlin-tour-null-safety.md">Null安全性</a></p>
</tldr>

プログラミングでは、後で処理するためにデータを構造体にグループ化できると便利です。Kotlinはまさにこの目的のためにコレクションを提供します。

Kotlinには、項目をグループ化するための以下のコレクションがあります。

| **コレクションの型** | **説明**                                                         |
|---------------------|-------------------------------------------------------------------------|
| リスト              | 順序付けされた項目のコレクション                                          |
| セット              | 一意で順序付けされていない項目のコレクション                                 |
| マップ              | キーが一意で1つの値にのみマップされるキーと値のペアのセット           |

各コレクションの型はミュータブル（可変）または読み取り専用にすることができます。

## リスト

リストは、項目を追加された順序で格納し、重複する項目を許可します。

読み取り専用リスト（[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/)）を作成するには、[`listOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html)関数を使用します。

ミュータブルリスト（[`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list.html)）を作成するには、[`mutableListOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html)関数を使用します。

リストを作成する際、Kotlinは格納される項目の型を推論できます。型を明示的に宣言するには、リスト宣言の後に山括弧`< >`内に型を追加します。

```kotlin
fun main() { 
//sampleStart
    // 読み取り専用リスト
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println(readOnlyShapes)
    // [triangle, square, circle]
    
    // 明示的な型宣言を持つミュータブルリスト
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    println(shapes)
    // [triangle, square, circle]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lists-declaration"}

> 意図しない変更を防ぐために、ミュータブルリストを`List`に代入することで、読み取り専用ビューを作成できます。
> 
> ```kotlin
>     val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
>     val shapesLocked: List<String> = shapes
> ```
> これは**キャスト**とも呼ばれます。
> 
{style="tip"}

リストは順序付けされているため、リスト内の項目にアクセスするには、[インデックスアクセス演算子](operator-overloading.md#indexed-access-operator) `[]`を使用します。

```kotlin
fun main() { 
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("リストの最初の項目は: ${readOnlyShapes[0]}")
    // リストの最初の項目は: triangle
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-access"}

リストの最初または最後の項目を取得するには、それぞれ[`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)関数と[`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)関数を使用します。

```kotlin
fun main() { 
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("リストの最初の項目は: ${readOnlyShapes.first()}")
    // リストの最初の項目は: triangle
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-first"}

> [`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)関数と[`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)関数は、**拡張関数**の例です。オブジェクトで拡張関数を呼び出すには、オブジェクトの後にピリオド`.`を付けて関数名を記述します。
> 
> 拡張関数は、[中級ツアー](kotlin-tour-intermediate-extension-functions.md#extension-functions)で詳細に説明されています。
> 現時点では、それらを呼び出す方法を知っていれば十分です。
> 
{style="note"}

リスト内の項目の数を取得するには、[`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)関数を使用します。

```kotlin
fun main() { 
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("このリストには${readOnlyShapes.count()}項目があります")
    // このリストには3つの項目があります
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-count"}

項目がリストに含まれているか確認するには、[`in`演算子](operator-overloading.md#in-operator)を使用します。

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

ミュータブルリストから項目を追加または削除するには、それぞれ[`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html)関数と[`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html)関数を使用します。

```kotlin
fun main() { 
//sampleStart
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    // リストに"pentagon"を追加
    shapes.add("pentagon") 
    println(shapes)  
    // [triangle, square, circle, pentagon]

    // リストから最初の"pentagon"を削除
    shapes.remove("pentagon") 
    println(shapes)  
    // [triangle, square, circle]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-add-remove"}

## セット

リストは順序付けされており重複する項目を許可するのに対し、セットは**順序付けされておらず**、**一意の**項目のみを格納します。

読み取り専用セット（[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/)）を作成するには、[`setOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html)関数を使用します。

ミュータブルセット（[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/)）を作成するには、[`mutableSetOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html)関数を使用します。

セットを作成する際、Kotlinは格納される項目の型を推論できます。型を明示的に宣言するには、セット宣言の後に山括弧`< >`内に型を追加します。

```kotlin
fun main() {
//sampleStart
    // 読み取り専用セット
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    // 明示的な型宣言を持つミュータブルセット
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    
    println(readOnlyFruit)
    // [apple, banana, cherry]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-sets-declaration"}

前の例でわかるように、セットは一意の要素のみを含むため、重複する`"cherry"`項目は削除されます。

> 意図しない変更を防ぐために、ミュータブルセットを`Set`に代入することで、読み取り専用ビューを作成できます。
> 
> ```kotlin
>     val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
>     val fruitLocked: Set<String> = fruit
> ```
>
{style="tip"}

> セットは**順序付けされていない**ため、特定のインデックスで項目にアクセスすることはできません。
> 
{style="note"}

セット内の項目の数を取得するには、[`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)関数を使用します。

```kotlin
fun main() { 
//sampleStart
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("このセットには${readOnlyFruit.count()}項目があります")
    // このセットには3つの項目があります
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-set-count"}

項目がセットに含まれているか確認するには、[`in`演算子](operator-overloading.md#in-operator)を使用します。

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

ミュータブルセットから項目を追加または削除するには、それぞれ[`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/add.html)関数と[`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html)関数を使用します。

```kotlin
fun main() { 
//sampleStart
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    fruit.add("dragonfruit")    // セットに"dragonfruit"を追加
    println(fruit)              // [apple, banana, cherry, dragonfruit]
    
    fruit.remove("dragonfruit") // セットから"dragonfruit"を削除
    println(fruit)              // [apple, banana, cherry]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-set-add-remove"}

## マップ

マップは項目をキーと値のペアとして格納します。キーを参照して値にアクセスします。マップは食べ物のメニューのようなものだと想像できます。食べ物（キー）を見つけることで、食べたいものの価格（値）を見つけることができます。リストのように数値インデックスを使用せずに値を検索したい場合に、マップは便利です。

> * マップ内のすべてのキーは一意である必要があります。これにより、Kotlinはどの値を取得したいのかを理解できます。
> * マップ内には重複する値を持つことができます。
>
{style="note"}

読み取り専用マップ（[`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/)）を作成するには、[`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html)関数を使用します。

ミュータブルマップ（[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/)）を作成するには、[`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html)関数を使用します。

マップを作成する際、Kotlinは格納される項目の型を推論できます。型を明示的に宣言するには、マップ宣言の後に山括弧`< >`内にキーと値の型を追加します。例：`MutableMap<String, Int>`。キーは`String`型で、値は`Int`型です。

マップを作成する最も簡単な方法は、各キーとその関連する値の間に[`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html)を使用することです。

```kotlin
fun main() {
//sampleStart
    // 読み取り専用マップ
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu)
    // {apple=100, kiwi=190, orange=100}

    // 明示的な型宣言を持つミュータブルマップ
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-maps-declaration"}

> 意図しない変更を防ぐために、ミュータブルマップを`Map`に代入することで、読み取り専用ビューを作成できます。
> 
> ```kotlin
>     val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
>     val juiceMenuLocked: Map<String, Int> = juiceMenu
> ```
>
{style="tip"}

マップ内の値にアクセスするには、[インデックスアクセス演算子](operator-overloading.md#indexed-access-operator) `[]`をそのキーと一緒に使用します。

```kotlin
fun main() {
//sampleStart
    // 読み取り専用マップ
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("アップルジュースの値は: ${readOnlyJuiceMenu["apple"]}")
    // アップルジュースの値は: 100
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-access"}

> マップ内に存在しないキーでキーと値のペアにアクセスしようとすると、`null`値が表示されます。
>
> ```kotlin
> fun main() {
> //sampleStart
>     // 読み取り専用マップ
>     val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
>     println("パイナップルジュースの値は: ${readOnlyJuiceMenu["pineapple"]}")
>     // パイナップルジュースの値は: null
> //sampleEnd
> }
> ```
> {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-no-key" validate="false"}
> 
> このツアーでは、[Null安全性](kotlin-tour-null-safety.md)の章でnull値について後で説明します。
> 
{style="note"}

[インデックスアクセス演算子](operator-overloading.md#indexed-access-operator) `[]`を使用して、ミュータブルマップに項目を追加することもできます。

```kotlin
fun main() {
//sampleStart
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu["coconut"] = 150 // マップにキー"coconut"と値150を追加
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100, coconut=150}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-add-item"}

ミュータブルマップから項目を削除するには、[`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html)関数を使用します。

```kotlin
fun main() {
//sampleStart
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu.remove("orange")    // マップからキー"orange"を削除
    println(juiceMenu)
    // {apple=100, kiwi=190}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-put-remove"}

マップ内の項目の数を取得するには、[`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)関数を使用します。

```kotlin
fun main() {
//sampleStart
    // 読み取り専用マップ
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("このマップには${readOnlyJuiceMenu.count()}キーと値のペアがあります")
    // このマップには3つのキーと値のペアがあります
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-count"}

特定のキーがすでにマップに含まれているか確認するには、[`.containsKey()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-key.html)関数を使用します。

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

マップのキーまたは値のコレクションを取得するには、それぞれ[`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html)と[`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html)プロパティを使用します。

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

> [`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html)と[`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html)は、オブジェクトの**プロパティ**の例です。オブジェクトのプロパティにアクセスするには、オブジェクトの後にピリオド`.`を付けてプロパティ名を記述します。
>
> プロパティについては、[クラス](kotlin-tour-classes.md)の章で詳細に議論されています。
> このツアーのこの時点では、それらにアクセスする方法を知っていれば十分です。
>
{style="note"}

キーまたは値がマップに含まれているか確認するには、[`in`演算子](operator-overloading.md#in-operator)を使用します。

```kotlin
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("orange" in readOnlyJuiceMenu.keys)
    // true
    
    // または、keysプロパティを使用する必要はありません
    println("orange" in readOnlyJuiceMenu)
    // true
    
    println(200 in readOnlyJuiceMenu.values)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-in"}

コレクションでできることについてさらに詳しく知るには、[コレクション](collections-overview.md)を参照してください。

基本型とコレクションの管理方法について学んだので、プログラムで使用できる[制御フロー](kotlin-tour-control-flow.md)を探索する時が来ました。

## 演習

### 演習1 {initial-collapse-state="collapsed" collapsible="true"}

「緑」の数字のリストと「赤」の数字のリストがあります。数字が合計でいくつあるかを出力するようにコードを完成させてください。

|---|---|
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    // ここにコードを記述してください
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

### 演習2 {initial-collapse-state="collapsed" collapsible="true"}

サーバーでサポートされているプロトコルのセットがあります。ユーザーが特定のプロトコルを使用するよう要求します。要求されたプロトコルがサポートされているかどうかを確認するようにプログラムを完成させてください（`isSupported`はBoolean値である必要があります）。

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
        要求されたプロトコルを大文字で確認するようにしてください。これには<a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html"><code>.uppercase()</code></a>関数を使用できます。
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

### 演習3 {initial-collapse-state="collapsed" collapsible="true"}

1から3までの整数と、それに対応するスペルを関連付けるマップを定義してください。このマップを使用して、与えられた数字をスペルアウトしてください。

|---|---|
```kotlin
fun main() {
    val number2word = // ここにコードを記述してください
    val n = 2
    println("$nは'${<ここにコードを記述してください>}'とスペルアウトされます")
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