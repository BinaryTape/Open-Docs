[//]: # (title: 類型別名)

類型別名提供現有類型的替代名稱。
如果類型名稱過長，您可以引入一個不同的簡短名稱並改用新名稱。
 
這對於縮短冗長的泛型類型很有用。
例如，經常會想要縮短集合類型：

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

您可以為函數類型提供不同的別名：

```kotlin
typealias MyHandler = (Int, String, Any) -> Unit

typealias Predicate<T> = (T) -> Boolean
```

您可以為內部類和巢狀類提供新名稱：

```kotlin
class A {
    inner class Inner
}
class B {
    inner class Inner
}

typealias AInner = A.Inner
typealias BInner = B.Inner
```

類型別名不會引入新類型。
它們等同於其對應的底層類型。
當您添加 `typealias Predicate<T>` 並在程式碼中使用 `Predicate<Int>` 時，Kotlin 編譯器總是將其展開為 `(Int) -> Boolean`。
因此，只要需要通用的函數類型，您就可以傳遞您類型的變數，反之亦然：

```kotlin
typealias Predicate<T> = (T) -> Boolean

fun foo(p: Predicate<Int>) = p(42)

fun main() {
    val f: (Int) -> Boolean = { it > 0 }
    println(foo(f)) // 輸出 "true"

    val p: Predicate<Int> = { it > 0 }
    println(listOf(1, -2).filter(p)) // 輸出 "[1]"
}
```
{kotlin-runnable="true"}

## 巢狀類型別名

<primary-label ref="beta"/>

在 Kotlin 中，您可以在其他宣告內部定義類型別名，只要它們不捕獲其外部類別的類型參數即可：

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

捕獲意味著類型別名引用了在外部類別中定義的類型參數：

```kotlin
class Graph<Node> {
    // 錯誤，因為捕獲了 Node
    typealias Path = List<Node>
}
```

為了解決這個問題，請直接在類型別名中宣告類型參數：

```kotlin
class Graph<Node> {
    // 正確，因為 Node 是類型別名參數
    typealias Path<Node> = List<Node>
}
```

巢狀類型別名透過改善封裝、減少套件層級的混亂並簡化內部實現，從而實現更簡潔、更易於維護的程式碼。

### 巢狀類型別名的規則

巢狀類型別名遵循特定規則，以確保清晰一致的行為：

* 巢狀類型別名必須遵循所有現有的類型別名規則。
* 就可見性而言，該別名不能暴露超過其引用類型所允許的範圍。
* 它們的作用域與[巢狀類別](nested-classes.md)相同。您可以在類別內部定義它們，並且它們會隱藏任何具有相同名稱的父類型別名，因為它們不進行覆寫。
* 巢狀類型別名可以標記為 `internal` 或 `private` 來限制其可見性。
* 在 Kotlin 多平台（Multiplatform）的 [`expect/actual` 宣告](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)中不支援巢狀類型別名。

### 如何啟用巢狀類型別名

若要在專案中啟用巢狀類型別名，請在命令列中使用以下編譯器選項：

```bash
-Xnested-type-aliases
```

或者將其添加到 Gradle 建構檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnested-type-aliases")
    }
}
```