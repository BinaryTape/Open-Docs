[//]: # (title: 內聯函式)

使用 [高階函式](lambdas.md) 會帶來某些執行時期的效能開銷：每個函式都是一個物件，並且它會捕獲一個閉包。閉包是可以在函式主體中存取的變數範圍。記憶體分配（包括函式物件和類別）以及虛擬呼叫都會引入執行時期的開銷。

但是，在許多情況下，這種開銷似乎可以透過內聯 lambda 運算式來消除。下面顯示的函式就是這種情況的良好範例。`lock()` 函式可以很容易地在呼叫點被內聯。考慮以下情況：

```kotlin
lock(l) { foo() }
```

編譯器可以發出以下程式碼，而不是為參數建立函式物件並產生呼叫：

```kotlin
l.lock()
try {
    foo()
} finally {
    l.unlock()
}
```

為了讓編譯器執行此操作，請使用 `inline` 修飾符標記 `lock()` 函式：

```kotlin
inline fun <T> lock(lock: Lock, body: () -> T): T { ... }
```

`inline` 修飾符會同時影響函式本身和傳遞給它的 lambda：所有這些都將被內聯到呼叫點。

內聯可能會導致生成的程式碼膨脹。然而，如果您以合理的方式執行它（避免內聯大型函式），它將在效能方面有所回報，尤其是在迴圈內部「多態」的呼叫點。

## noinline

如果您不希望所有傳遞給內聯函式的 lambda 都被內聯，請使用 `noinline` 修飾符標記您的部分函式參數：

```kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) { ... }
```

可內聯的 lambda 只能在內聯函式內部呼叫，或作為可內聯引數傳遞。然而，`noinline` 的 lambda 可以以您喜歡的任何方式操作，包括儲存在欄位中或傳遞。

> 如果一個內聯函式沒有可內聯的函式參數，也沒有 [具體化型別參數](#reified-type-parameters)，編譯器將會發出警告，因為內聯這類函式不太可能帶來好處（如果您確定需要內聯，可以使用 `@Suppress("NOTHING_TO_INLINE")` 註解來抑制該警告）。
>
{style="note"}

## 非局部跳轉運算式

### 返回

在 Kotlin 中，您只能使用正常的、不限定的 `return` 來退出具名函式或匿名函式。要退出 lambda，請使用 [標籤](returns.md#return-to-labels)。在 lambda 內部禁止使用純粹的 `return`，因為 lambda 不能讓封閉函式 `return`：

```kotlin
fun ordinaryFunction(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    ordinaryFunction {
        return // 錯誤：無法在此處讓 `foo` 返回
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true" validate="false"}

但如果傳遞 lambda 的函式被內聯，則 return 也可以被內聯。因此它是允許的：

```kotlin
inline fun inlined(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    inlined {
        return // 正常：lambda 已被內聯
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true"}

這種返回（位於 lambda 中，但退出封閉函式）稱為 *非局部* 返回。這種結構通常發生在迴圈中，內聯函式通常會包圍這些迴圈：

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // 從 hasZeros 返回
    }
    return false
}
```

請注意，某些內聯函式可能不會直接從函式主體中呼叫作為參數傳遞給它們的 lambda，而是從另一個執行上下文呼叫，例如局部物件或巢狀函式。在這種情況下，非局部控制流在 lambda 中也是不允許的。為了表示內聯函式的 lambda 參數不能使用非局部返回，請使用 `crossinline` 修飾符標記 lambda 參數：

```kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

### Break 和 continue

類似於非局部 `return`，您可以在作為引數傳遞給包圍著迴圈的內聯函式之 lambda 中應用 `break` 和 `continue` [跳轉運算式](returns.md)：

```kotlin
fun processList(elements: List<Int>): Boolean {
    for (element in elements) {
        val variable = element.nullableMethod() ?: run {
            log.warning("元素為空或無效，繼續...")
            continue
        }
        if (variable == 0) return true
    }
    return false
}
```

## 具體化型別參數

有時您需要存取作為參數傳遞的型別：

```kotlin
fun <T> TreeNode.findParentOfType(clazz: Class<T>): T? {
    var p = parent
    while (p != null && !clazz.isInstance(p)) {
        p = p.parent
    }
    @Suppress("UNCHECKED_CAST")
    return p as T?
}
```

在這裡，您沿著樹向上遍歷並使用反射來檢查節點是否具有特定型別。這一切都很好，但呼叫點不是很優雅：

```kotlin
treeNode.findParentOfType(MyTreeNode::class.java)
```

一個更好的解決方案是簡單地將型別傳遞給此函式。您可以如下呼叫它：

```kotlin
treeNode.findParentOfType<MyTreeNode>()
```

為了啟用此功能，內聯函式支援*具體化型別參數*，因此您可以這樣寫：

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

上面的程式碼使用 `reified` 修飾符限定型別參數，使其在函式內部可存取，幾乎就像它是一個普通的類別一樣。由於函式已內聯，因此不需要反射，並且像 `!is` 和 `as` 這樣的普通運算符現在可用於您使用。此外，您可以如上所示呼叫函式：`myTree.findParentOfType<MyTreeNodeType>()`。

儘管在許多情況下可能不需要反射，但您仍然可以將其與具體化型別參數一起使用：

```kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("
"))
}
```

普通函式（未標記為 inline）不能有具體化參數。沒有執行時期表示的型別（例如，非具體化型別參數或像 `Nothing` 這樣的虛擬型別）不能用作具體化型別參數的引數。

## 內聯屬性

`inline` 修飾符可以用於沒有 [後備欄位](properties.md#backing-fields) 的屬性的存取器。您可以註解個別的屬性存取器：

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }
```

您也可以註解整個屬性，這會將其兩個存取器都標記為 `inline`：

```kotlin
inline var bar: Bar
    get() = ...
    set(v) { ... }
```

在呼叫點，內聯存取器會作為常規內聯函式被內聯。

## 公開 API 內聯函式的限制

當一個內聯函式是 `public` 或 `protected` 但不是 `private` 或 `internal` 宣告的一部分時，它被視為 [模組](visibility-modifiers.md#modules) 的公開 API。它可以在其他模組中被呼叫，並且在這些呼叫點也會被內聯。

這會帶來某些二進位不相容的風險，這是由宣告內聯函式的模組中的變更引起的，以防呼叫模組在變更後未重新編譯。

為了消除由模組的*非*公開 API 中的變更引入此類不相容的風險，公開 API 內聯函式不允許在其主體中使用非公開 API 宣告，即 `private` 和 `internal` 宣告及其部分。

一個 `internal` 宣告可以用 `@PublishedApi` 註解，這允許其在公開 API 內聯函式中使用。當一個 `internal` 內聯函式被標記為 `@PublishedApi` 時，它的主體也會被檢查，就好像它是公開的一樣。