[//]: # (title: 內嵌函式)

使用[高階函數](lambdas.md)會帶來一定的執行期開銷：每個函式都是一個物件，且會擷取一個閉包。閉包是可以在函式主體中存取的變數作用域。記憶體分配（對於函式物件和類別）以及虛擬呼叫都會引入執行期開銷。

但在許多情況下，透過內嵌 Lambda 運算式可以消除這種開銷。下面顯示的函式就是這種情況的良好範例。`lock()` 函式可以很容易地在呼叫點進行內嵌。考慮以下情況：

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

為了讓編譯器做到這一點，請使用 `inline` 修飾詞標記 `lock()` 函式：

```kotlin
inline fun <T> lock(lock: Lock, body: () -> T): T { ... }
```

`inline` 修飾詞會影響函式本身以及傳遞給它的 Lambda：所有這些都將被內嵌到呼叫點。

內嵌可能會導致產生的程式碼量增加。但是，如果您以合理的方式進行（避免內嵌大型函式），它將在效能上得到回報，特別是在迴圈內部的「megamorphic」呼叫點。

## noinline

如果您不希望傳遞給內嵌函式的所有 Lambda 都被內嵌，請使用 `noinline` 修飾詞標記某些函式參數：

```kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) { ... }
```

可內嵌的 Lambda 只能在內嵌函式內部呼叫或作為可內嵌引數傳遞。然而，`noinline` Lambda 可以按您喜歡的任何方式進行操作，包括儲存在欄位中或進行傳遞。

> 如果內嵌函式沒有可內嵌的函式參數，也沒有[具體化型別參數](#reified-type-parameters)，編譯器將發出警告，因為內嵌此類函式不太可能有益（如果您確定需要內嵌，可以使用 `@Suppress("NOTHING_TO_INLINE")` 註解來抑制警告）。
>
{style="note"}

## 非區域跳轉運算式

### 回傳

在 Kotlin 中，您只能使用一般的、不帶限定符的 `return` 來退出具名函式或匿名函式。要退出 Lambda，請使用[標籤](returns.md#return-to-labels)。Lambda 內部禁止使用裸 `return`，因為 Lambda 不能使封閉函式 `return`：

```kotlin
fun ordinaryFunction(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    ordinaryFunction {
        return // 錯誤：不能在此處使 `foo` 回傳
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true" validate="false"}

但如果 Lambda 傳遞到的函式是內嵌的，則回傳也可以被內嵌。所以這是允許的：

```kotlin
inline fun inlined(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    inlined {
        return // OK：Lambda 已被內嵌
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true"}

此類回傳（位於 Lambda 中，但退出封閉函式）稱為*非區域*回傳。這種結構通常出現在迴圈中，而內嵌函式經常封裝這些迴圈：

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // 從 hasZeros 回傳
    }
    return false
}
```

請注意，某些內嵌函式可能不是直接從函式主體呼叫傳遞給它們的 Lambda 參數，而是從另一個執行上下文（例如區域物件或巢狀函式）呼叫。在這種情況下，Lambda 中也不允許非區域控制流。為了指出內嵌函式的 Lambda 參數不能使用非區域回傳，請使用 `crossinline` 修飾詞標記該 Lambda 參數：

```kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

### Break 與 continue

與非區域 `return` 類似，您可以在傳遞給封裝迴圈的內嵌函式的引數 Lambda 中套用 `break` 與 `continue` [跳轉運算式](returns.md)：

```kotlin
fun processList(elements: List<Int>): Boolean {
    for (element in elements) {
        val variable = element.nullableMethod() ?: run {
            log.warning("Element is null or invalid, continuing...")
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

在這裡，您向上遍歷樹並使用反射來檢查節點是否具有特定型別。這一切都很好，但呼叫點不太漂亮：

```kotlin
treeNode.findParentOfType(MyTreeNode::class.java)
```

更好的解決方案是簡單地將型別傳遞給此函式。您可以按如下方式呼叫它：

```kotlin
treeNode.findParentOfType<MyTreeNode>()
```

為了實現這一點，內嵌函式支援*具體化型別參數 (reified type parameters)*，因此您可以編寫如下程式碼：

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

上面的程式碼使用 `reified` 修飾詞限定型別參數，使其在函式內部可存取，幾乎就像它是一個普通的類別一樣。由於函式是內嵌的，因此不需要反射，現在可以使用 `!is` 和 `as` 等一般運算子。此外，您可以如上所示呼叫該函式：`myTree.findParentOfType<MyTreeNodeType>()`。

雖然在許多情況下可能不需要反射，但您仍然可以將其與具體化型別參數一起使用：

```kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("
"))
}
```

普通函式（未標記為 inline）不能具有具體化參數。沒有執行期表示的型別（例如，非具體化型別參數或虛構型別如 `Nothing`）不能用作具體化型別參數的引數。

## 內嵌屬性

`inline` 修飾詞可用於沒有[支援欄位](properties.md#backing-fields)的屬性存取子。您可以標記個別屬性存取子：

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }
```

您也可以標記整個屬性，這會將其兩個存取子都標記為 `inline`：

```kotlin
inline var bar: Bar
    get() = ...
    set(v) { ... }
```

在呼叫點，內嵌存取子會像一般的內嵌函式一樣被內嵌。

## 公開 API 內嵌函式的限制

當內嵌函式是 `public` 或 `protected`，但不是 `private` 或 `internal` 宣告的一部分時，它被視為[模組](visibility-modifiers.md#modules)的公開 API。它可以在其他模組中呼叫，並且在這些呼叫點也會被內嵌。

這會帶來一定的二進制不相容風險，這是由於在呼叫模組變更後未重新編譯的情況下，宣告內嵌函式的模組發生變更所導致的。

為了消除模組的*非*公開 API 變更引入此類不相容性的風險，公開 API 內嵌函式不允許在其主體中使用非公開 API 宣告，即 `private` 和 `internal` 宣告及其部分。

可以用 `@PublishedApi` 標記 `internal` 宣告，這允許在公開 API 內嵌函式中使用它。當 `internal` 內嵌函式被標記為 `@PublishedApi` 時，它的主體也會被檢查，就像它是公開的一樣。