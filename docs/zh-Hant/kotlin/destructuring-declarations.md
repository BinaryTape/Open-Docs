[//]: # (title: 解構宣告)

有時將一個物件*解構*（destructure）成多個變數會很方便，例如：

```kotlin
val (name, age) = person 
```

這種語法稱為*解構宣告*。解構宣告能一次建立多個變數。你宣告了兩個新變數：`name` 與 `age`，並且可以獨立使用它們：

 ```kotlin
println(name)
println(age)
```

解構宣告會被編譯為以下程式碼：

```kotlin
val name = person.component1()
val age = person.component2()
```

`component1()` 與 `component2()` 函式是 Kotlin 中廣泛使用的*慣例原則*（principle of conventions）的另一個範例（請參考 `+` 與 `*` 等運算子，以及 `for` 迴圈作為範例）。只要能在其上呼叫所需數量的 `component` 函式，任何東西都可以放在解構宣告的右側。當然，也可以有 `component3()` 與 `component4()` 等等。

> `componentN()` 函式需要標記 `operator` 關鍵字，才能在解構宣告中使用。
>
{style="note"}

解構宣告也適用於 `for` 迴圈：

```kotlin
for ((a, b) in collection) { ... }
```

變數 `a` 與 `b` 會取得在集合元素上呼叫 `component1()` 與 `component2()` 所傳回的值。

## 範例：從函式傳回兩個值
 
假設你需要從函式傳回兩個東西 —— 例如，一個結果物件與某種狀態。在 Kotlin 中一種精簡的做法是宣告一個 [data class](data-classes.md) 並傳回其執行個體：

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // computations
    
    return Result(result, status)
}

// 現在，要使用此函式：
val (result, status) = function(...)
```

由於資料類別會自動宣告 `componentN()` 函式，因此解構宣告在這裡可以運作。

> 你也可以使用標準類別 `Pair` 並讓 `function()` 傳回 `Pair<Int, Status>`，但將資料正確命名通常會更好。
>
{style="note"}

## 範例：解構宣告與 map

遍歷 map 最優雅的方式可能是：

```kotlin
for ((key, value) in map) {
   // 對 key 與 value 執行某些操作
}
```

為了使其運作，你應該：

* 透過提供 `iterator()` 函式，將 map 呈現為一系列的值。
* 透過提供 `component1()` 與 `component2()` 函式，將每個元素呈現為一個配對（pair）。
  
的確，標準程式庫提供了這類擴充：

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

因此，你可以自由地在 map 的 `for` 迴圈中使用解構宣告（以及資料類別執行個體或類似項目的集合）。

## 底線用於未使用的變數

如果你在解構宣告中不需要某個變數，可以用底線代替其名稱：

```kotlin
val (_, status) = getResult()
```

對於以此方式跳過的組件，不會呼叫其對應的 `componentN()` 運算子函式。

## Lambda 中的解構

你可以對 Lambda 參數使用解構宣告語法。如果 Lambda 具有 `Pair` 型別（或 `Map.Entry`，或任何具有對應 `componentN` 函式的型別）的參數，你可以透過將它們放入圓括號中來引入多個新參數以取代原本的一個參數：

```kotlin
map.mapValues { entry -> "${entry.value}!" }
map.mapValues { (key, value) -> "$value!" }
```

請注意宣告兩個參數與宣告解構配對以取代參數之間的差異：

```kotlin
{ a -> ... } // 一個參數
{ a, b -> ... } // 兩個參數
{ (a, b) -> ... } // 一個解構配對
{ (a, b), c -> ... } // 一個解構配對與另一個參數
```

如果解構參數中的某個組件未被使用，你可以用底線替換它以避免構思名稱：

```kotlin
map.mapValues { (_, value) -> "$value!" }
```

你可以為整個解構參數或特定組件分別指定型別：

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }

map.mapValues { (_, value: String) -> "$value!" }
```

## 以名稱為基礎的解構
<primary-label ref="experimental-opt-in"/>

Kotlin 支援*以名稱為基礎的解構宣告*（name-based destructuring declarations），其中變數會按名稱與屬性配對，而不是像*以位置為基礎*（position-based）的解構那樣由 `componentN()` 函式定義的位置來決定。

> 若要進一步了解以名稱為基礎的解構，請參閱該功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0438-name-based-destructuring.md)。
>
{style="tip"}

在以位置為基礎的解構中，變數對應於 `componentN()` 函式的順序，例如：

```kotlin
data class User(val username: String, val email: String)

fun main() {
    val user = User("alice", "alice@example.com")

    val (email, username) = user

    println(email)
    // alice

    println(username)
    // alice@example.com
}
```
{kotlin-runnable="true"}

在此範例中，由於解構依賴於 `componentN()` 函式的順序，因此 `email` 接收的是 `username` 的值，而 `username` 接收的是 `email` 的值。

使用以名稱為基礎的解構，是由屬性名稱決定提取哪些值，而不是 `componentN()` 函式的位置：

```kotlin
fun main() {
    val user = User("alice", "alice@example.com")

    // 使用帶有顯式形式的以名稱為基礎的解構
    (val mail = email, val name = username) = user

    println(name)
    // alice

    println(mail)
    // alice@example.com
}
```

以名稱為基礎的解構目前處於 [實驗功能](components-stability.md#stability-levels-explained) 階段。當你啟用此功能時，它還會為使用方括號的以位置為基礎的解構引入新語法。對於元素順序至關重要的型別，例如列表（list）和其他有序集合，以及像 `Pair` 或 `Triple` 這樣的未命名元組（unnamed tuple），請使用此語法：

```kotlin
val point = Pair(10, 20)

// 使用以位置為基礎的解構
val [x, y] = point
```

你可以使用 `-Xname-based-destructuring` 編譯器選項來控制編譯器如何解釋解構宣告。

它具有以下模式：

* `only-syntax` 啟用顯式形式的以名稱為基礎的解構，而不改變現有解構宣告的行為。
* `name-mismatch` 當資料類別中的以位置為基礎的解構使用的變數名稱與屬性名稱不符時，報告警告。
* `complete` 啟用帶有圓括號的短形式以名稱為基礎的解構，並繼續支援使用方括號語法的以位置為基礎的解構。

> 在啟用 `complete` 模式之前，請先檢閱並解決在 `name-mismatch` 模式中報告的警告。這些警告顯示了編譯器在 `complete` 模式下會以不同方式解釋哪些解構宣告，並包含了相應重寫這些宣告的建議。
> 
{style="tip"}

如果你使用 `complete` 模式，帶有圓括號的短形式解構語法會將變數與屬性名稱配對，而不是依賴位置：

```kotlin
val (email, username) = user
```

若要在專案中啟用以名稱為基礎的解構，請將編譯器選項新增到你的組建組態檔案中：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xname-based-destructuring=only-syntax")
    }
}
```

</tab> 
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xname-based-destructuring=only-syntax</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab> 
</tabs>