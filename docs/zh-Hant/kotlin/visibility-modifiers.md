[//]: # (title: 視域修飾符)

類別、物件、介面、建構器、函數，以及屬性與其設定器，都可以擁有*視域修飾符 (visibility modifiers)*。取得器 (Getters) 始終與其屬性擁有相同的視域。

Kotlin 中有四種視域修飾符：`private`、`protected`、`internal` 和 `public`。預設視域是 `public`。

在此頁面上，您將了解這些修飾符如何應用於不同類型的宣告範圍。

## 套件

函數、屬性、類別、物件和介面可以直接在套件內「頂層 (top-level)」宣告：

```kotlin
// file name: example.kt
package foo

fun baz() { ... }
class Bar { ... }
```

*   如果您不使用視域修飾符，則預設使用 `public`，這表示您的宣告將在任何地方都可見。
*   如果您將宣告標記為 `private`，它將僅在包含該宣告的檔案內部可見。
*   如果您將其標記為 `internal`，它將在同一[模組](#modules)中的任何地方都可見。
*   `protected` 修飾符不適用於頂層宣告。

>若要從其他套件使用可見的頂層宣告，您應該[匯入](packages.md#imports)它。
>
{style="note"}

範例：

```kotlin
// file name: example.kt
package foo

private fun foo() { ... } // 在 example.kt 檔案內可見

public var bar: Int = 5 // 屬性在任何地方都可見
    private set         // 設定器僅在 example.kt 檔案內可見
    
internal val baz = 6    // 在同一模組內可見
```

## 類別成員

對於在類別內部宣告的成員：

*   `private` 意味著該成員僅在此類別內部可見（包括其所有成員）。
*   `protected` 意味著該成員與標記為 `private` 的成員具有相同的視域，但它在子類別中也一樣可見。
*   `internal` 意味著任何*在同一模組內*看到宣告類別的用戶端都能看到其 `internal` 成員。
*   `public` 意味著任何看到宣告類別的用戶端都能看到其 `public` 成員。

> 在 Kotlin 中，外部類別無法看到其內部類別的 private 成員。
>
{style="note"}

如果您覆寫 (override) `protected` 或 `internal` 成員，且沒有明確指定視域，則覆寫成員也將擁有與原始成員相同的視域。

範例：

```kotlin
open class Outer {
    private val a = 1
    protected open val b = 2
    internal open val c = 3
    val d = 4  // public by default
    
    protected class Nested {
        public val e: Int = 5
    }
}

class Subclass : Outer() {
    // a 不可見
    // b、c 和 d 可見
    // Nested 和 e 可見

    override val b = 5   // 'b' 是 protected
    override val c = 7   // 'c' 是 internal
}

class Unrelated(o: Outer) {
    // o.a, o.b 不可見
    // o.c 和 o.d 可見（同一模組）
    // Outer.Nested 不可見，且 Nested::e 也不可見
}
```

### 建構器

使用以下語法來指定類別主要建構器的視域：

> 您需要添加一個明確的 `constructor` 關鍵字。
>
{style="note"}

```kotlin
class C private constructor(a: Int) { ... }
```

這裡的建構器是 `private`。預設情況下，所有建構器都是 `public`，這實質上等同於它們在類別可見的任何地方都可見（這意味著 `internal` 類別的建構器僅在同一模組內可見）。

對於密封類別 (sealed classes)，建構器預設為 `protected`。欲了解更多資訊，請參閱[密封類別](sealed-classes.md#constructors)。

### 局部宣告

局部變數、函數和類別不能擁有視域修飾符。

## 模組

`internal` 視域修飾符表示該成員在同一模組內可見。更具體地說，模組是一組一起編譯的 Kotlin 檔案，例如：

*   一個 IntelliJ IDEA 模組。
*   一個 Maven 專案。
*   一個 Gradle 原始碼集 (source set)（例外情況是 `test` 原始碼集可以存取 `main` 的內部宣告）。
*   一組透過一次 `<kotlinc>` Ant 任務呼叫而編譯的檔案。