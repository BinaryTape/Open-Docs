[//]: # (title: 可見性修飾符)

類別、物件、介面、建構函式和函式，以及屬性及其設定器，都可以擁有*可見性修飾符*。
取得器的可見性始終與其屬性相同。

Kotlin 中有四種可見性修飾符：`private`、`protected`、`internal` 和 `public`。
預設可見性為 `public`。

在本頁中，您將了解這些修飾符如何應用於不同類型的宣告範圍。

## 套件

函式、屬性、類別、物件和介面可以直接在套件內部「頂層」宣告：

```kotlin
// file name: example.kt
package foo

fun baz() { ... }
class Bar { ... }
```

* 如果您不使用可見性修飾符，則預設使用 `public`，這表示您的宣告將隨處可見。
* 如果您將宣告標記為 `private`，則它僅在包含該宣告的檔案內部可見。
* 如果您將其標記為 `internal`，則它將在同一個 [模組](#modules) 內隨處可見。
* `protected` 修飾符不適用於頂層宣告。

>若要從其他套件使用可見的頂層宣告，您應該 [匯入](packages.md#imports) 它。
>
{style="note"}

範例：

```kotlin
// file name: example.kt
package foo

private fun foo() { ... } // 僅在 example.kt 內部可見

public var bar: Int = 5 // 屬性隨處可見
    private set         // 設定器僅在 example.kt 內部可見
    
internal val baz = 6    // 在同一個模組內部可見
```

## 類別成員

對於在類別內部宣告的成員：

* `private` 表示該成員僅在此類別內部可見（包括其所有成員）。
* `protected` 表示該成員與標記為 `private` 的成員具有相同的可見性，但它在子類別中也具可見性。
* `internal` 表示*該模組內部*的任何看到宣告類別的用戶端都能看到其 `internal` 成員。
* `public` 表示任何看到宣告類別的用戶端都能看到其 `public` 成員。

>在 Kotlin 中，外部類別無法看到其內部類別的私有成員。
>
{style="note"}

如果您覆寫 `protected` 或 `internal` 成員且未明確指定可見性，則覆寫成員也將具有與原始成員相同的可見性。

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
    // b、c 和 d 可見
    // Nested 和 e 可見

    override val b = 5   // 'b' 是 protected
    override val c = 7   // 'c' 是 internal
}

class Unrelated(o: Outer) {
    // o.a、o.b 不可見
    // o.c 和 o.d 可見 (同一個模組)
    // Outer.Nested 不可見，Nested::e 也不可見
}
```

### 建構函式

使用以下語法指定類別主要建構函式的可見性：

>您需要新增一個明確的 `constructor` 關鍵字。
>
{style="note"}

```kotlin
class C private constructor(a: Int) { ... }
```

此處建構函式為 `private`。預設情況下，所有建構函式都是 `public`，這實際上意味著它們在類別可見的任何地方都可見（這表示 `internal` 類別的建構函式僅在同一個模組內部可見）。

對於密封類別，建構函式預設為 `protected`。更多資訊請參閱 [密封類別](sealed-classes.md#constructors)。

### 局部宣告

局部變數、函式和類別不能擁有可見性修飾符。

## 模組

`internal` 可見性修飾符表示成員在同一個模組內部可見。更具體地說，模組是一組一起編譯的 Kotlin 檔案，例如：

* 一個 IntelliJ IDEA 模組。
* 一個 Maven 專案。
* 一個 Gradle 來源集（例外是 `test` 來源集可以存取 `main` 的內部宣告）。
* 一組使用一次 `<kotlinc>` Ant 任務呼叫編譯的檔案。