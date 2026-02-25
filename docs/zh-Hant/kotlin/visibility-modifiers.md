[//]: # (title: 可見性修飾詞)

類別、物件、介面、建構函式和函式，以及屬性及其 setter，都可以具有 *可見性修飾詞*。
Getter 始終與其屬性具有相同的可見性。

Kotlin 中有四種可見性修飾詞：`private`、`protected`、`internal` 和 `public`。
預設的可見性為 `public`。

在本頁面中，你將學習這些修飾詞如何應用於不同類型的宣告作用域。

## 套件

函式、屬性、類別、物件和介面可以直接在套件內的「頂層」進行宣告：

```kotlin
// 檔案名稱：example.kt
package foo

fun baz() { ... }
class Bar { ... }
```

* 如果不使用可見性修飾詞，則預設使用 `public`，這意味著你的宣告在任何地方都可見。
* 如果將宣告標記為 `private`，它將僅在包含該宣告的檔案內可見。
* 如果將其標記為 `internal`，它將在同一個 [模組](#modules) 中的任何地方可見。
* `protected` 修飾詞不適用於頂層宣告。

> 若要使用來自其他套件的可見頂層宣告，你應該 [匯入](packages.md#imports) 它。
>
{style="note"}

範例：

```kotlin
// 檔案名稱：example.kt
package foo

private fun foo() { ... } // 在 example.kt 內可見

public var bar: Int = 5 // 屬性在任何地方都可見
    private set         // setter 僅在 example.kt 內可見
    
internal val baz = 6    // 在同一個模組內可見
```

## 類別成員

對於在類別內部宣告的成員：

* `private` 表示該成員僅在此類別內（包括其所有成員）可見。
* `protected` 表示該成員與標記為 `private` 的成員具有相同的可見性，但它在子類別中也為可見。
* `internal` 表示此模組內任何看到宣告類別的用戶端都能看到其 `internal` 成員。
* `public` 表示任何看到宣告類別的用戶端都能看到其 `public` 成員。

> 在 Kotlin 中，外部類別看不到其內部類別的私有成員。
>
{style="note"}

如果你覆寫一個 `protected` 或 `internal` 成員且未明確指定可見性，則該覆寫成員也將與原始成員具有相同的可見性。

範例：

```kotlin
open class Outer {
    private val a = 1
    protected open val b = 2
    internal open val c = 3
    val d = 4  // 預設為 public
    
    protected class Nested {
        public val e: Int = 5
    }
}

class Subclass : Outer() {
    // a 不可見
    // b, c 和 d 可見
    // Nested 和 e 可見

    override val b = 5   // 'b' 是 protected
    override val c = 7   // 'c' 是 internal
}

class Unrelated(o: Outer) {
    // o.a, o.b 不可見
    // o.c 和 o.d 可見（同一個模組）
    // Outer.Nested 不可見，且 Nested::e 也不可見 
}
```

### 建構函式

使用以下語法來指定類別主建構函數的可見性：

> 你需要添加一個明確的 `constructor` 關鍵字。
>
{style="note"}

```kotlin
class C private constructor(a: Int) { ... }
```

這裡的建構函式是 `private`。預設情況下，所有建構函式都是 `public`，這實際上相當於它們在類別可見的任何地方都可見（這意味著 `internal` 類別的建構函式僅在同一個模組內可見）。

對於密封類別，建構函式預設為 `protected`。若要了解更多，請參閱 [密封類別](sealed-classes.md#constructors)。

### 區域宣告

區域變數、函式和類別不能具有可見性修飾詞。

## 模組

`internal` 可見性修飾詞表示該成員在同一個模組內可見。更具體地說，模組是一組共同編譯的 Kotlin 檔案，例如：

* 一個 IntelliJ IDEA 模組。
* 一個 Maven 專案。
* 一個 Gradle 原始碼集（例外情況是 `test` 原始碼集可以存取 `main` 的內部宣告）。