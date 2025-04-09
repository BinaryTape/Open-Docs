---
title: "可見性修飾詞 (Visibility modifiers)"
---
類別 (Classes)、物件 (objects)、介面 (interfaces)、建構函式 (constructors) 和函式 (functions)，以及屬性 (properties) 及其設定器 (setters)，都可以有*可見性修飾符 (visibility modifiers)*。
Getter 的可見性始終與其屬性相同。

Kotlin 中有四種可見性修飾符：`private`、`protected`、`internal` 和 `public`。
預設可見性為 `public`。

在本頁中，您將了解修飾符如何應用於不同類型的宣告範圍。

## 套件 (Packages)

函式、屬性、類別、物件和介面可以直接在套件 (package) 內「頂層 (top-level)」宣告：

```kotlin
// file name: example.kt
package foo

fun baz() { ... }
class Bar { ... }
```

* 如果您不使用可見性修飾符，則預設使用 `public`，這表示您的宣告將在任何地方都可見。
* 如果您將宣告標記為 `private`，則它僅在包含該宣告的檔案中可見。
* 如果您將其標記為 `internal`，它將在同一個[模組](#modules)中的任何地方都可見。
* `protected` 修飾符不適用於頂層 (top-level) 宣告。

:::note
要使用來自另一個套件 (package) 的可見頂層 (top-level) 宣告，您應該[匯入](packages#imports)它。

:::

範例：

```kotlin
// file name: example.kt
package foo

private fun foo() { ... } // visible inside example.kt

public var bar: Int = 5 // property is visible everywhere
    private set         // setter is visible only in example.kt
    
internal val baz = 6    // visible inside the same module
```

## 類別成員 (Class members)

對於在類別中宣告的成員：

* `private` 表示該成員僅在此類別中可見（包括其所有成員）。
* `protected` 表示該成員具有與標記為 `private` 的成員相同的可見性，但它在子類別中也可見。
* `internal` 表示*在此模組內*的任何看到宣告類別的客戶端都可以看到其 `internal` 成員。
* `public` 表示任何看到宣告類別的客戶端都可以看到其 `public` 成員。

:::note
在 Kotlin 中，外部類別看不到其內部類別的 private 成員。

:::

如果您覆寫 `protected` 或 `internal` 成員，並且未明確指定可見性，則覆寫成員也將具有與原始成員相同的可見性。

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
    // a is not visible
    // b, c and d are visible
    // Nested and e are visible

    override val b = 5   // 'b' is protected
    override val c = 7   // 'c' is internal
}

class Unrelated(o: Outer) {
    // o.a, o.b are not visible
    // o.c and o.d are visible (same module)
    // Outer.Nested is not visible, and Nested::e is not visible either 
}
```

### 建構函式 (Constructors)

使用以下語法來指定類別的主要建構函式 (primary constructor) 的可見性：

:::note
您需要新增一個明確的 `constructor` 關鍵字。

:::

```kotlin
class C private constructor(a: Int) { ... }
```

這裡的建構函式是 `private`。 預設情況下，所有建構函式都是 `public`，這實際上等同於它們在類別可見的任何地方都可見（這意味著 `internal` 類別的建構函式僅在同一個模組內可見）。

對於密封類別 (sealed classes)，建構函式預設為 `protected`。 有關更多資訊，請參閱 [密封類別](sealed-classes#constructors)。

### 區域宣告 (Local declarations)

區域變數、函式和類別不能有可見性修飾符。

## 模組 (Modules)

`internal` 可見性修飾符表示該成員在同一個模組內可見。 更具體地說，模組是一組一起編譯的 Kotlin 檔案，例如：

* IntelliJ IDEA 模組。
* Maven 專案。
* Gradle 原始碼集（但 `test` 原始碼集可以存取 `main` 的 internal 宣告）。
* 一組使用 `<kotlinc>` Ant 任務的一次調用編譯的檔案。