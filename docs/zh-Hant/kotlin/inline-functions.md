[//]: # (title: 內聯函式)

使用[高階函式](lambdas.md)會產生某些執行時開銷：每個函式都是一個物件，它會捕捉一個閉包。閉包是一個變數作用域，可以在函式的主體中存取。記憶體分配（用於函式物件和類別）和虛擬呼叫會引入執行時負擔。

但在許多情況下，透過內聯 Lambda 表達式可以消除這種開銷。以下所示的函式就是這種情況的良好範例。`lock()` 函式可以很容易地在呼叫點處內聯。考慮以下情況：

```kotlin
lock(l) { foo() }
```

編譯器可以發出以下程式碼，而不是為參數建立一個函式物件並產生一個呼叫：

```kotlin
l.lock()
try {
    foo()
} finally {
    l.unlock()
}
```

要讓編譯器執行此操作，請使用 `inline` 修飾符標記 `lock()` 函式：

```kotlin
inline fun <T> lock(lock: Lock, body: () -> T): T { ... }
```

`inline` 修飾符會影響函式本身以及傳遞給它的 Lambda：所有這些都將被內聯到呼叫點。

內聯可能會導致生成的程式碼增長。但是，如果您以合理的方式進行（避免內聯大型函式），它將在效能方面有所回報，尤其是在迴圈內的「多態呼叫點 (megamorphic call-sites)」上。

## noinline

如果您不希望所有傳遞給內聯函式的 Lambda 都被內聯，請使用 `noinline` 修飾符標記您的某些函式參數：

```kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) { ... }
```

可內聯的 Lambda 只能在內聯函式內部呼叫，或作為可內聯的引數傳遞。然而，`noinline` Lambda 可以以任何您喜歡的方式進行操作，包括儲存到欄位中或傳遞。

> 如果內聯函式沒有可內聯的函式參數，也沒有
> [實化型別參數](#reified-type-parameters)，編譯器將發出警告，因為內聯此類函式
> 幾乎不可能有益處（如果您確定需要內聯，可以使用 `@Suppress("NOTHING_TO_INLINE")` 註解來抑制警告）。
>
{style="note"}

## 非局部跳轉表達式

### 返回

在 Kotlin 中，您只能使用普通的、未限定的 `return` 來退出命名函式或匿名函式。
要退出 Lambda，請使用[標籤](returns.md#return-to-labels)。不帶限定的 `return` 在
Lambda 內部是被禁止的，因為 Lambda 不能使封閉函式 `return`：

```kotlin
fun ordinaryFunction(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    ordinaryFunction {
        return // ERROR: cannot make `foo` return here
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true" validate="false"}

但如果 Lambda 所傳遞的函式是內聯的，那麼返回也可以內聯。因此這是允許的：

```kotlin
inline fun inlined(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    inlined {
        return // OK: the lambda is inlined
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true"}

這種返回（位於 Lambda 中，但退出封閉函式）稱為 *非局部返回*。這類結構通常出現在迴圈中，內聯函式通常會封裝這些迴圈：

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // returns from hasZeros
    }
    return false
}
```

請注意，某些內聯函式可能不會直接從函式主體呼叫傳遞給它們的 Lambda 參數，而是從另一個執行上下文呼叫，例如局部物件或巢狀函式。在這種情況下，Lambda 中也不允許非局部控制流程。為表示內聯函式的 Lambda 參數不能使用非局部返回，請使用 `crossinline` 修飾符標記 Lambda 參數：

```kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

### Break 和 continue

> 此功能目前處於[預覽中](kotlin-evolution-principles.md#pre-stable-features)。
> 我們計劃在未來版本中使其穩定。
> 要選擇啟用，請使用 `-Xnon-local-break-continue` 編譯器選項。
> 我們將非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-1436) 上提供關於此功能的回饋。
>
{style="warning"}

與非局部 `return` 類似，您可以將 `break` 和 `continue` [跳轉表達式](returns.md)應用於作為引數傳遞給封裝迴圈的內聯函式的 Lambda 中：

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

## 實化型別參數

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

在這裡，您遍歷一個樹並使用反射來檢查節點是否具有某種類型。
這一切都很好，但呼叫點不是很美觀：

```kotlin
treeNode.findParentOfType(MyTreeNode::class.java)
```

一個更好的解決方案是簡單地將型別傳遞給此函式。您可以按如下方式呼叫它：

```kotlin
treeNode.findParentOfType<MyTreeNode>()
```

為了實現這一點，內聯函式支援*實化型別參數 (reified type parameters)*，因此您可以編寫類似以下的程式碼：

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

上面的程式碼使用 `reified` 修飾符限定了型別參數，使其在函式內部可存取，幾乎就像它是一個普通類別一樣。由於函式是內聯的，因此不需要反射，並且現在可以為您使用 `!is` 和 `as` 等普通運算符。此外，您可以如上所示呼叫函式：`myTree.findParentOfType<MyTreeNodeType>()`。

雖然在許多情況下可能不需要反射，但您仍然可以將其與實化型別參數一起使用：

```kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("
"))
}
```

普通函式（未標記為內聯）不能有實化參數。
不具有執行時表示的型別（例如，非實化型別參數或像 `Nothing` 這樣的虛擬型別）不能用作實化型別參數的引數。

## 內聯屬性

`inline` 修飾符可用於沒有[支援欄位](properties.md#backing-fields)的屬性存取器。
您可以註解個別的屬性存取器：

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

在呼叫點，內聯存取器會像常規內聯函式一樣被內聯。

## 公開 API 內聯函式的限制

當內聯函式是 `public` 或 `protected` 但不屬於 `private` 或 `internal` 宣告的一部分時，
它被視為[模組](visibility-modifiers.md#modules)的公開 API。它可以在其他模組中呼叫，並且在這些呼叫點也會被內聯。

這帶來了由宣告內聯函式的模組中的更改引起的二進位不相容性風險，尤其是在呼叫模組未在更改後重新編譯的情況下。

為了消除模組的*非*公開 API 更改引入此類不相容性的風險，公開 API 內聯函式不允許在其函式主體中使用非公開 API 宣告，即 `private` 和 `internal` 宣告及其部分。

`internal` 宣告可以用 `@PublishedApi` 註解，這允許其在公開 API 內聯函式中使用。
當 `internal` 內聯函式被標記為 `@PublishedApi` 時，它的函式主體也會被檢查，就像它是公開的一樣。