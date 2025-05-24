---
title: "行內函式 (Inline functions)"
---
使用[高階函式](lambdas)（Higher-Order Functions）會產生一定的執行期（Runtime）效能損失：每個函式都是一個物件，並且它會捕獲閉包（Closure）。 閉包是可以從函式主體存取的變數作用域。 記憶體分配（包括函式物件和類別）和虛擬呼叫（Virtual Calls）會引入執行期額外負擔。

但似乎在許多情況下，這種額外負擔可以透過內聯（Inlining）Lambda表達式來消除。 下面顯示的函式是這種情況的良好範例。 `lock()`函式可以很容易地在呼叫點（Call-site）內聯。 考慮以下情況：

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

為了使編譯器執行此操作，請使用 `inline` 修飾符標記 `lock()` 函式：

```kotlin
inline fun <T> lock(lock: Lock, body: () `->` T): T { ... }
```

`inline` 修飾符會影響函式本身和傳遞給它的 Lambda：所有這些都將內聯到呼叫點。

內聯可能會導致產生的程式碼增長。 但是，如果您以合理的方式進行（避免內聯大型函式），它將在性能上得到回報，尤其是在迴圈內的「Megamorphic」呼叫點。

## noinline

如果您不希望所有傳遞到 Inline 函式的 Lambda 都被內聯，請使用 `noinline` 修飾符標記某些函式參數：

```kotlin
inline fun foo(inlined: () `->` Unit, noinline notInlined: () `->` Unit) { ... }
```

可內聯的 Lambda 只能在 Inline 函式中呼叫或作為可內聯的參數傳遞。 但是，`noinline` Lambda 可以以您喜歡的任何方式進行操作，包括儲存在欄位中或傳遞。

:::note
如果一個 Inline 函式沒有可內聯的函式參數，也沒有
[具體化的類型參數](#reified-type-parameters)，編譯器會發出警告，因為內聯此類函式
不太可能是有益的（如果您確定需要內聯，則可以使用 `@Suppress("NOTHING_TO_INLINE")` 註解來取消顯示警告）。

:::

## 非本地跳躍表達式（Non-local jump expressions）

### Returns

在 Kotlin 中，您只能使用普通的、非限定的 `return` 來退出具名函式或匿名函式。
要退出 Lambda，請使用[標籤](returns#return-to-labels)（Label）。 在 Lambda 內部禁止使用裸 `return`，因為 Lambda 無法使封閉函式 `return`：

```kotlin
fun ordinaryFunction(block: () `->` Unit) {
    println("hi!")
}

fun foo() {
    ordinaryFunction {
        return // ERROR: cannot make `foo` return here
    }
}

fun main() {
    foo()
}
```

但是，如果將 Lambda 傳遞到的函式是內聯的，則 Return 也可以內聯。 所以這是允許的：

```kotlin
inline fun inlined(block: () `->` Unit) {
    println("hi!")
}

fun foo() {
    inlined {
        return // OK: the lambda is inlined
    }
}

fun main() {
    foo()
}
```

這種 Returns（位於 Lambda 中，但退出封閉函式）稱為 *非本地* Returns。 這種構造通常發生在迴圈中，Inline 函式經常封閉迴圈：

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // returns from hasZeros
    }
    return false
}
```

請注意，某些 Inline 函式可能不會直接從函式主體呼叫作為參數傳遞給它們的 Lambda，而是從另一個執行環境呼叫，例如本地物件或巢狀函式。 在這種情況下，Lambda 中也不允許非本地控制流程（Non-local control flow）。 為了表明 Inline 函式的 Lambda 參數不能使用非本地 Returns，請使用 `crossinline` 修飾符標記 Lambda 參數：

```kotlin
inline fun f(crossinline body: () `->` Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

### Break and continue

:::caution
此功能目前處於 [預覽階段](kotlin-evolution-principles#pre-stable-features)。
我們計劃在未來版本中將其穩定。
要選擇加入，請使用 `-Xnon-local-break-continue` 編譯器選項。
我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-1436) 上提供有關它的回饋。

:::

與非本地 `return` 類似，您可以在作為參數傳遞給封閉迴圈的 Inline 函式的 Lambda 中應用 `break` 和 `continue` [跳躍表達式](returns)：

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

## 具體化的類型參數（Reified type parameters）

有時您需要存取作為參數傳遞的類型：

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

在這裡，您遍歷一棵樹並使用反射來檢查節點是否具有某種類型。
這一切都很好，但是呼叫點不是很漂亮：

```kotlin
treeNode.findParentOfType(MyTreeNode::class.java)
```

更好的解決方案是簡單地將類型傳遞給此函式。 您可以如下呼叫它：

```kotlin
treeNode.findParentOfType<MyTreeNode>()
```

為了實現此目的，Inline 函式支援 *具體化的類型參數*，因此您可以編寫如下內容：

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

上面的程式碼使用 `reified` 修飾符限定類型參數，使其可以在函式內部存取，幾乎就像它是一個普通類別一樣。 由於該函式是內聯的，因此不需要反射，並且現在可以使用像 `!is` 和 `as` 這樣的普通運算符。 此外，您可以如上所示呼叫該函式：`myTree.findParentOfType<MyTreeNodeType>()`。

儘管在許多情況下可能不需要反射，但您仍然可以將其與具體化的類型參數一起使用：

```kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("
"))
}
```

普通函式（未標記為 Inline）不能具有具體化的參數。
沒有執行期（Run-time）表示形式的類型（例如，非具體化的類型參數或虛構類型（Fictitious type），如 `Nothing`）不能用作具體化類型參數的參數。

## Inline 屬性（Inline properties）

`inline` 修飾符可以用於沒有[支持欄位](properties#backing-fields)（Backing fields）的屬性的訪問器（Accessor）。
您可以註解個別屬性訪問器：

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }
```

您也可以註解整個屬性，這會將其兩個訪問器都標記為 `inline`：

```kotlin
inline var bar: Bar
    get() = ...
    set(v) { ... }
```

在呼叫點，Inline 訪問器會像常規 Inline 函式一樣內聯。

## 公共 API Inline 函式的限制

當 Inline 函式是 `public` 或 `protected`，但不是 `private` 或 `internal` 聲明的一部分時，它被視為[模組](visibility-modifiers#modules)（Module）的公共 API。 它可以從其他模組中呼叫，並且也會在此類呼叫點內聯。

這會帶來由於宣告 Inline 函式的模組發生變更而導致的二進制不相容的某些風險，如果在變更後未重新編譯呼叫模組。

為了消除由模組的 *非* 公共 API 中的變更引入這種不相容的風險，不允許公共 API Inline 函式在其主體中使用非公共 API 宣告，即 `private` 和 `internal` 宣告及其各個部分。

可以使用 `@PublishedApi` 註解 `internal` 宣告，這允許在公共 API Inline 函式中使用它。 當 `internal` Inline 函式標記為 `@PublishedApi` 時，也會檢查其主體，就好像它是公開的一樣。